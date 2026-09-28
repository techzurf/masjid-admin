import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  MapPin, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  Info,
  ShieldCheck 
} from 'lucide-react';
import { KaabaIcon, RubElHizbIcon } from '../common/IslamicIcons';

export const QiblaScreen: React.FC = () => {
  // Default compass heading and Qibla angle for M.K.B. Nagar, Chennai towards Makkah
  const [selectedCity, setSelectedCity] = useState('M.K.B. Nagar, Chennai');
  const [currentHeading, setCurrentHeading] = useState(288);
  const [isCalibrated, setIsCalibrated] = useState(true);

  const cities = [
    { name: 'M.K.B. Nagar, Chennai', angle: 293, dist: '4,310 km' },
    { name: 'Madurai, Tamil Nadu', angle: 295, dist: '4,420 km' },
    { name: 'Bengaluru, India', angle: 291, dist: '4,040 km' },
    { name: 'Hyderabad, India', angle: 288, dist: '4,150 km' },
    { name: 'Mumbai, India', angle: 279, dist: '3,520 km' },
    { name: 'Delhi / NCR, India', angle: 263, dist: '3,830 km' },
    { name: 'Dubai, UAE', angle: 257, dist: '1,690 km' },
    { name: 'London, United Kingdom', angle: 119, dist: '4,800 km' }
  ];

  const currentCityObj = cities.find(c => c.name === selectedCity) || cities[0];
  const qiblaAngle = currentCityObj.angle;

  const angleDiff = Math.abs(currentHeading - qiblaAngle);
  const isFacingQibla = angleDiff <= 3; // within 3 degrees accuracy

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const found = cities.find(c => c.name === cityName);
    if (found) {
      setCurrentHeading(found.angle - 5); // position slightly off so user can rotate
    }
  };

  const handleAlign = () => {
    setCurrentHeading(qiblaAngle);
  };

  return (
    <div className="w-full min-h-[82vh] flex flex-col items-center justify-between px-4 pt-2 pb-8 text-center select-none">
      {/* Top Location Selector */}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-[#3B6FD8]" />
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="bg-transparent text-slate-800 text-xs font-bold focus:outline-hidden cursor-pointer"
          >
            {cities.map(c => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.angle}°)
              </option>
            ))}
          </select>
        </div>

        {/* Qibla Alignment Status Banner */}
        <div className="mt-3">
          {isFacingQibla ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 text-[#159A9C] text-xs font-bold border border-teal-300 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-[#159A9C]" />
              <span>You're facing the Kaaba!</span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-500">
              Rotate your phone until the needle points straight up
            </span>
          )}
        </div>
      </div>

      {/* Main Circular Compass Dial */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer Halo with Glow when Aligned */}
        <div className={`w-72 h-72 rounded-full transition-all duration-500 flex items-center justify-center p-3 relative ${
          isFacingQibla 
            ? 'bg-teal-500/10 shadow-[0_0_50px_rgba(21,154,156,0.3)] border-2 border-[#159A9C]' 
            : 'bg-white shadow-lg border border-slate-200'
        }`}>
          {/* Compass Degree Tick Marks */}
          <div className="absolute inset-2 rounded-full border border-dashed border-teal-200/60"></div>

          {/* Cardinal Directions */}
          <span className="absolute top-4 text-xs font-extrabold text-[#3B6FD8]">N</span>
          <span className="absolute right-4 text-xs font-bold text-slate-400">E</span>
          <span className="absolute bottom-4 text-xs font-bold text-slate-400">S</span>
          <span className="absolute left-4 text-xs font-bold text-slate-400">W</span>

          {/* Center Degree & Kaaba indicator */}
          <div 
            className="w-56 h-56 rounded-full flex flex-col items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${qiblaAngle - currentHeading}deg)` }}
          >
            {/* Kaaba Target Icon at the top of the rotating dial */}
            <div className="absolute top-1 flex flex-col items-center">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isFacingQibla ? 'bg-[#D4A72C] text-slate-950 scale-110 shadow-md' : 'bg-slate-900 text-[#D4A72C]'
              }`}>
                <KaabaIcon className="w-6 h-6" />
              </div>
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#3B6FD8] to-[#159A9C] rounded-full mt-1"></div>
            </div>

            {/* Center Hub */}
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shadow-inner mt-4">
              <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {currentHeading}°
              </span>
              <span className="text-[10px] font-bold text-[#159A9C] uppercase">
                {qiblaAngle}° Qibla
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Compass Heading slider for interactive testing */}
      <div className="w-full max-w-xs px-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
          <span>Simulate Phone Rotation:</span>
          <button 
            onClick={handleAlign}
            className="text-xs font-bold text-[#3B6FD8] hover:underline"
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
          className="w-full accent-[#3B6FD8] cursor-pointer"
        />
      </div>

      {/* Calibration Guidance Card */}
      <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-left flex items-start gap-2.5 mt-2">
        <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#159A9C] border border-teal-100 flex items-center justify-center shrink-0 mt-0.5">
          <RotateCw className="w-4 h-4" />
        </div>
        <div className="text-[11px] text-slate-600 leading-relaxed">
          <strong className="text-slate-800 block">Sensor Calibration:</strong>
          Keep your phone away from magnetic cases or metal tables. Move device in a smooth figure-8 motion for optimal precision.
        </div>
      </div>
    </div>
  );
};
