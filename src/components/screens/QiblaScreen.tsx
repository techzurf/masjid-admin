import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  MapPin, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Loader2,
  Navigation,
  Smartphone
} from 'lucide-react';
import { KaabaIcon } from '../common/IslamicIcons';
import { 
  KAABA_COORDINATES, 
  calculateQiblaBearing, 
  calculateDistanceToKaaba, 
  calculateVisualQiblaAngle, 
  isQiblaAligned,
  getCompassHeadingFromEvent,
  normalizeAngle
} from '../../utils/qibla';

export const QiblaScreen: React.FC = () => {
  const { triggerHapticFeedback } = useApp();

  // Location State
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unavailable'>('loading');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Compass State
  const [compassStatus, setCompassStatus] = useState<'waiting' | 'active' | 'needs_permission' | 'unavailable'>('waiting');
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  const [isAbsoluteHeading, setIsAbsoluteHeading] = useState<boolean>(true);
  const [sensorDetected, setSensorDetected] = useState<boolean>(false);

  // Watchers & event listeners refs
  const geoWatchIdRef = useRef<number | null>(null);
  const lastAlignedRef = useRef<boolean>(false);

  // 1. Request & Watch Geolocation
  const requestLocation = useCallback(() => {
    setLocationStatus('loading');
    setLocationError(null);

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationStatus('unavailable');
      setLocationError('Geolocation is not supported by your browser or device.');
      return;
    }

    // Clear existing watch if any
    if (geoWatchIdRef.current !== null) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setUserCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setLocationStatus('granted');
      setLocationError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      if (error.code === error.PERMISSION_DENIED) {
        setLocationStatus('denied');
        setLocationError('Location permission is required to determine the Qibla.');
      } else {
        setLocationStatus('unavailable');
        setLocationError(error.message || 'Unable to retrieve your current location.');
      }
    };

    // Obtain initial position with high accuracy
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    });

    // Also watch position for dynamic updates if device moves
    geoWatchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 5000
    });
  }, []);

  // 2. Setup Device Orientation Listener (Compass)
  const setupOrientationListeners = useCallback(() => {
    let receivedOrientationEvent = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const result = getCompassHeadingFromEvent(e);
      if (result !== null) {
        receivedOrientationEvent = true;
        setSensorDetected(true);
        setCompassStatus('active');
        setCurrentHeading(result.heading);
        setIsAbsoluteHeading(result.isAbsolute);
      }
    };

    // Android Chrome & modern WebViews support deviceorientationabsolute for calibrated true north
    const win = window as any;
    if ('ondeviceorientationabsolute' in win) {
      win.addEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    } else if ('ondeviceorientation' in win) {
      win.addEventListener('deviceorientation', handleOrientation as EventListener, true);
    } else {
      setCompassStatus('unavailable');
    }

    // Timeout check: if no orientation sensor event fired after 2 seconds, mark sensor unavailable
    const timer = setTimeout(() => {
      if (!receivedOrientationEvent) {
        setCompassStatus((prev) => (prev === 'active' ? 'active' : 'unavailable'));
      }
    }, 2200);

    return () => {
      clearTimeout(timer);
      if ('ondeviceorientationabsolute' in win) {
        win.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
      }
      win.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    };
  }, []);

  // 3. iOS 13+ Orientation Permission Flow
  const requestIOSCompassPermission = async () => {
    triggerHapticFeedback('light');
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setupOrientationListeners();
        } else {
          setCompassStatus('needs_permission');
        }
      } catch (err) {
        console.warn('iOS orientation permission error:', err);
        setCompassStatus('needs_permission');
      }
    } else {
      setupOrientationListeners();
    }
  };

  // Mount effect: request location and compass
  useEffect(() => {
    requestLocation();

    // Check if iOS requires explicit permission tap
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      setCompassStatus('needs_permission');
    } else {
      const cleanupListeners = setupOrientationListeners();
      return () => {
        cleanupListeners();
      };
    }

    return () => {
      if (geoWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
      }
    };
  }, [requestLocation, setupOrientationListeners]);

  // Derived Calculations from Real GPS
  const qiblaBearing = userCoords ? calculateQiblaBearing(userCoords.latitude, userCoords.longitude) : 0;
  const distanceToKaaba = userCoords ? calculateDistanceToKaaba(userCoords.latitude, userCoords.longitude) : 0;
  const visualAngle = calculateVisualQiblaAngle(qiblaBearing, currentHeading);
  const isFacingQibla = userCoords ? isQiblaAligned(qiblaBearing, currentHeading, 5) : false;

  // Haptic pulse when user points at the Kaaba
  useEffect(() => {
    if (isFacingQibla && !lastAlignedRef.current) {
      triggerHapticFeedback('medium');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([120, 60, 120]);
        } catch {
          // ignore
        }
      }
    }
    lastAlignedRef.current = isFacingQibla;
  }, [isFacingQibla, triggerHapticFeedback]);

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-between px-4 pt-2 pb-8 text-center select-none">
      
      {/* 1. Top Location Status & Permission Bar */}
      <div className="w-full flex flex-col items-center">
        {locationStatus === 'loading' && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#087F5B]" />
            <span>Acquiring GPS location...</span>
          </div>
        )}

        {locationStatus === 'granted' && userCoords && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#087F5B] shrink-0" />
            <span className="font-mono text-[11px] text-slate-800">
              {userCoords.latitude.toFixed(4)}° N, {userCoords.longitude.toFixed(4)}° E
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          </div>
        )}

        {(locationStatus === 'denied' || locationStatus === 'unavailable') && (
          <div className="flex flex-col items-center gap-1.5 max-w-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Location permission is required to determine the Qibla.</span>
            </div>
            <button
              onClick={requestLocation}
              className="mt-1 px-3 py-1 rounded-xl bg-[#087F5B] text-white text-xs font-bold hover:bg-[#07543F] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Permission</span>
            </button>
          </div>
        )}

        {/* Qibla Alignment Status Banner */}
        <div className="mt-3">
          {locationStatus === 'granted' ? (
            isFacingQibla ? (
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-50 text-[#087F5B] text-xs font-extrabold border border-teal-300 shadow-sm animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-[#087F5B]" />
                <span>Qibla Aligned! You are facing the Kaaba</span>
              </div>
            ) : (
              <span className="text-xs font-medium text-slate-500">
                Rotate your phone until the needle points straight up
              </span>
            )
          ) : (
            <span className="text-xs font-medium text-slate-400">
              Waiting for GPS coordinates to determine precise Qibla bearing
            </span>
          )}
        </div>
      </div>

      {/* 2. Main Circular Compass Dial */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer Halo with Glow when Aligned */}
        <div 
          className={`w-72 h-72 rounded-full transition-all duration-500 flex items-center justify-center p-3 relative ${
            isFacingQibla 
              ? 'bg-teal-500/10 shadow-[0_0_50px_rgba(21,154,156,0.35)] border-2 border-[#087F5B]' 
              : 'bg-white shadow-lg border border-slate-200'
          }`}
        >
          {/* Compass Degree Tick Marks */}
          <div className="absolute inset-2 rounded-full border border-dashed border-teal-200/60 pointer-events-none" />

          {/* Cardinal Directions */}
          <span className="absolute top-4 text-xs font-extrabold text-[#3B6FD8]">N</span>
          <span className="absolute right-4 text-xs font-bold text-slate-400">E</span>
          <span className="absolute bottom-4 text-xs font-bold text-slate-400">S</span>
          <span className="absolute left-4 text-xs font-bold text-slate-400">W</span>

          {/* Rotating Qibla Indicator Dial */}
          <div 
            className="w-56 h-56 rounded-full flex flex-col items-center justify-center transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${visualAngle}deg)` }}
          >
            {/* Kaaba Target Icon at the top of the rotating dial */}
            <div className="absolute top-1 flex flex-col items-center">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isFacingQibla 
                    ? 'bg-[#D4A72C] text-slate-950 scale-110 shadow-md ring-2 ring-emerald-500/40' 
                    : 'bg-slate-900 text-[#D4A72C]'
                }`}
              >
                <KaabaIcon className="w-6 h-6" />
              </div>
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#3B6FD8] to-[#087F5B] rounded-full mt-1" />
            </div>

            {/* Center Degree Hub */}
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shadow-inner mt-4">
              <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {Math.round(currentHeading)}°
              </span>
              <span className="text-[10px] font-bold text-[#087F5B] uppercase">
                {Math.round(qiblaBearing)}° Qibla
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. iOS Compass Permission Tap if Needed */}
      {compassStatus === 'needs_permission' && (
        <div className="w-full max-w-xs mb-3">
          <button
            onClick={requestIOSCompassPermission}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#087F5B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#07543F] transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>Enable iPhone Compass Sensor</span>
          </button>
        </div>
      )}

      {/* 4. Display Information Cards (Requirement 8) */}
      <div className="w-full max-w-xs space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Qibla Direction */}
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-left shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Qibla Direction
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {userCoords ? `${qiblaBearing.toFixed(1)}°` : '—'}
            </span>
          </div>

          {/* Distance to Kaaba */}
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-left shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Distance to Kaaba
            </span>
            <span className="text-sm font-extrabold text-slate-900 font-mono">
              {userCoords ? `${distanceToKaaba.toLocaleString()} km` : '—'}
            </span>
          </div>
        </div>

        {/* Current Location Details & Compass Status */}
        <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-left shadow-2xs space-y-1 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Compass Status:</span>
            {compassStatus === 'active' ? (
              <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Compass Active {isAbsoluteHeading ? '(True North)' : '(Magnetic)'}
              </span>
            ) : compassStatus === 'unavailable' ? (
              <span className="font-bold text-amber-700">
                Compass sensor is unavailable on this device.
              </span>
            ) : (
              <span className="font-semibold text-slate-500">
                Detecting orientation...
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Current Location:</span>
            <span className="font-mono text-[10px] text-slate-800">
              {userCoords 
                ? `Lat: ${userCoords.latitude.toFixed(4)}, Lng: ${userCoords.longitude.toFixed(4)}`
                : 'Acquiring GPS...'}
            </span>
          </div>
        </div>

        {/* Desktop Browser Simulation Heading Slider (Only shown if compass sensor is unavailable) */}
        {!sensorDetected && compassStatus === 'unavailable' && (
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-bold">Manual Heading Test (Desktop Simulator):</span>
              <button 
                onClick={() => setCurrentHeading(qiblaBearing)}
                className="text-xs font-bold text-[#087F5B] hover:underline cursor-pointer"
              >
                Snap to Qibla
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={currentHeading}
              onChange={(e) => setCurrentHeading(Number(e.target.value))}
              className="w-full accent-[#087F5B] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>0° (N)</span>
              <span>90° (E)</span>
              <span>180° (S)</span>
              <span>270° (W)</span>
              <span>360° (N)</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sensor Calibration Guidance Card (Requirement 7) */}
      <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-left flex items-start gap-2.5 mt-2">
        <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#087F5B] border border-teal-100 flex items-center justify-center shrink-0 mt-0.5">
          <RotateCw className="w-4 h-4" />
        </div>
        <div className="text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-800 block">Sensor Calibration:</strong>
          Move your phone in a figure-8 motion to calibrate the compass. Keep device flat and away from magnets or metal surfaces.
        </div>
      </div>

    </div>
  );
};
