import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  BellOff, 
  Calendar, 
  Download, 
  Share2, 
  Sliders,
  Volume2,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { JUMMAH_INFO, MASJID_INFO, RAMADAN_TIMINGS } from '../../data/mockData';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';
import { 
  fetchPrayerTimesForDate, 
  formatTo12h, 
  computePrayersFromRecord, 
  PrayerTimeRecord, 
  getInitialSeedRecord 
} from '../../lib/supabase';

export const PrayerTimesScreen: React.FC = () => {
  const { 
    setOverlayScreen, 
    settings, 
    updateSettings, 
    triggerTestPrayerAlert,
    isPlayingNotificationSound,
    previewSound,
    stopSoundPreview,
    triggerHapticFeedback,
    todayPrayerRecord,
    computedPrayers
  } = useApp();
  const t = useTranslation(settings.language);

  // Day offset for previous / next day navigation
  const [dayOffset, setDayOffset] = useState(0);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [currentDateRecord, setCurrentDateRecord] = useState<PrayerTimeRecord | null>(todayPrayerRecord);
  const [countdown, setCountdown] = useState<string>('00:00:00');

  // Date calculation
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + dayOffset);
  const formattedGregorian = baseDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const yearStr = baseDate.getFullYear();
  const monthStr = String(baseDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(baseDate.getDate()).padStart(2, '0');
  const currentDateKey = `${yearStr}-${monthStr}-${dayStr}`;

  // Fetch record when date changes
  useEffect(() => {
    if (dayOffset === 0 && todayPrayerRecord) {
      setCurrentDateRecord(todayPrayerRecord);
      return;
    }

    let isMounted = true;
    fetchPrayerTimesForDate(currentDateKey).then(res => {
      if (isMounted) {
        if (res.data) {
          setCurrentDateRecord(res.data);
        } else {
          setCurrentDateRecord(getInitialSeedRecord(currentDateKey));
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [dayOffset, currentDateKey, todayPrayerRecord]);

  // Compute active prayers for this date
  const activeRecord = currentDateRecord || todayPrayerRecord || getInitialSeedRecord(currentDateKey);
  const activeComputed = computePrayersFromRecord(activeRecord, new Date());
  const { nextPrayer } = activeComputed;

  // Countdown timer
  useEffect(() => {
    const updateCd = () => {
      const nowMs = Date.now();
      const targetMs = nextPrayer.rawTime.getTime();
      let diffSec = Math.max(0, Math.floor((targetMs - nowMs) / 1000));

      const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
      const s = (diffSec % 60).toString().padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    };

    updateCd();
    const interval = setInterval(updateCd, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer.rawTime]);

  const toggleNotif = (key: string) => {
    triggerHapticFeedback('selection');
    const prayerKey = key as keyof typeof settings.prayerNotifications;
    updateSettings({
      prayerNotifications: {
        ...settings.prayerNotifications,
        [prayerKey]: !settings.prayerNotifications[prayerKey]
      }
    });
  };

  // Calculate day difference text
  const getDayLabel = () => {
    if (dayOffset === 0) return 'Today';
    if (dayOffset === 1) return 'Tomorrow';
    if (dayOffset === -1) return 'Yesterday';
    return `${dayOffset > 0 ? '+' : ''}${dayOffset} Days`;
  };

  const prayersWithSunrise = [
    { 
      id: 'fajr', 
      name: 'Fajr', 
      arabic: 'الفجر', 
      adhan: formatTo12h(activeRecord.fajr), 
      iqamah: activeComputed.prayersList[0]?.iqamahTime || '05:35 AM', 
      isNext: nextPrayer.id === 'fajr' 
    },
    { 
      id: 'sunrise', 
      name: 'Sunrise', 
      arabic: 'الشروق', 
      adhan: activeRecord.sunrise ? formatTo12h(activeRecord.sunrise) : '—', 
      iqamah: '—', 
      isNext: false, 
      isSunrise: true 
    },
    { 
      id: 'dhuhr', 
      name: 'Dhuhr', 
      arabic: 'الظهر', 
      adhan: formatTo12h(activeRecord.dhuhr), 
      iqamah: activeComputed.prayersList[1]?.iqamahTime || '01:25 PM', 
      isNext: nextPrayer.id === 'dhuhr' 
    },
    { 
      id: 'asr', 
      name: 'Asr', 
      arabic: 'العصر', 
      adhan: formatTo12h(activeRecord.asr), 
      iqamah: activeComputed.prayersList[2]?.iqamahTime || '04:50 PM', 
      isNext: nextPrayer.id === 'asr' 
    },
    { 
      id: 'maghrib', 
      name: 'Maghrib', 
      arabic: 'المغرب', 
      adhan: formatTo12h(activeRecord.maghrib), 
      iqamah: activeComputed.prayersList[3]?.iqamahTime || '07:22 PM', 
      isNext: nextPrayer.id === 'maghrib' 
    },
    { 
      id: 'isha', 
      name: 'Isha', 
      arabic: 'العشاء', 
      adhan: formatTo12h(activeRecord.isha), 
      iqamah: activeComputed.prayersList[4]?.iqamahTime || '08:55 PM', 
      isNext: nextPrayer.id === 'isha' 
    }
  ];

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Top Header Location & Timetable Actions */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
            Official Timetable
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('prayerTimes')}
          </h1>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            <span>{MASJID_INFO.name} ({MASJID_INFO.city})</span>
          </div>
        </div>

        <button
          onClick={() => setShowMonthlyModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-700" />
          <span>Monthly</span>
        </button>
      </div>

      {/* Date Navigation Bar (Previous Day / Today / Next Day) */}
      <div className="w-full bg-white rounded-2xl p-2.5 border border-slate-200/80 flex items-center justify-between shadow-xs">
        <button
          onClick={() => {
            triggerHapticFeedback('selection');
            setDayOffset(prev => prev - 1);
          }}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
          aria-label="Previous Day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              {formattedGregorian}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100/60 text-[10px] font-bold text-emerald-900">
              {getDayLabel()}
            </span>
          </div>
          <span className="text-[11px] font-arabic text-amber-800 font-bold block mt-0.5">
            {11 + dayOffset} ربيع الأول 1448 هـ
          </span>
        </div>

        <button
          onClick={() => {
            triggerHapticFeedback('selection');
            setDayOffset(prev => prev + 1);
          }}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 hover:text-emerald-800 hover:bg-slate-50 rounded-xl transition-colors active:scale-95"
          aria-label="Next Day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Large Next Prayer Countdown Card */}
      <div className="w-full bg-gradient-to-br from-[#087F5B] to-[#054432] rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-15">
          <RubElHizbIcon className="w-24 h-24 text-white" />
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
            Current / Next Prayer
          </span>
          <span className="text-sm font-arabic text-amber-300 font-bold">
            {nextPrayer.arabicName}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {nextPrayer.name} · {nextPrayer.adhanTime}
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium mt-1">
              Jama'ah Iqamah at <strong>{nextPrayer.iqamahTime}</strong>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-200 font-medium block">Starts in</span>
            <span className="text-xl font-bold font-mono text-[#D4A72C] tabular-nums">
              {countdown}
            </span>
          </div>
        </div>

        {/* Quick notification state button */}
        <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-100/90 text-[11px]">
            <span>Tone: <strong>{settings.athanSound === 'Madina' ? 'Madina Adhan' : 'Makkah Adhan'}</strong></span>
            <span>·</span>
            <span>Remind: <strong>{settings.reminderMinutesBefore === 0 ? 'At Adhan' : `${settings.reminderMinutesBefore}m before`}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerTestPrayerAlert('Asr', settings.reminderMinutesBefore)}
              className="text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
              title="Test approaching prayer audio & banner now"
            >
              <Bell className="w-2.5 h-2.5 text-amber-300" />
              <span>Test Alert</span>
            </button>
            <button 
              onClick={() => setOverlayScreen('settings')}
              className="text-amber-300 text-xs font-bold hover:underline"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Complete 6-row Timetable (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha) */}
      <div className="w-full bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
          <span>Prayer</span>
          <span>Adhan</span>
          <span>Iqamah</span>
          <span>Alert</span>
        </div>

        <div className="divide-y divide-slate-100">
          {prayersWithSunrise.map(p => {
            const isAlertActive = settings.prayerNotifications[p.id as keyof typeof settings.prayerNotifications];
            return (
              <div 
                key={p.id}
                className={`py-3 px-2 flex items-center justify-between transition-colors rounded-xl ${
                  p.isNext 
                    ? 'bg-[#E8F7F1]/80 border-l-4 border-[#087F5B] font-semibold' 
                    : p.isSunrise 
                    ? 'bg-amber-50/40 border-l-4 border-amber-300' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-24">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold ${
                      p.isNext ? 'text-[#087F5B]' : p.isSunrise ? 'text-amber-800' : 'text-slate-900'
                    }`}>
                      {p.name}
                    </span>
                    {p.isNext && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#087F5B] animate-pulse"></span>
                    )}
                    {p.isSunrise && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    )}
                  </div>
                  <span className="text-[11px] font-arabic text-slate-400 block -mt-0.5">
                    {p.arabic}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-800 tabular-nums">
                  {p.adhan}
                </div>

                <div className="text-xs font-semibold text-slate-600 tabular-nums">
                  {p.iqamah}
                </div>

                <div className="w-8 flex justify-end">
                  {!p.isSunrise ? (
                    <button
                      onClick={() => toggleNotif(p.id)}
                      className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors ${
                        isAlertActive 
                          ? 'text-[#087F5B] bg-emerald-50' 
                          : 'text-slate-300 hover:text-slate-500'
                      }`}
                      aria-label={`Toggle alert for ${p.name}`}
                    >
                      {isAlertActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-300">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Friday Jummah Timetable Card */}
      <div className="w-full bg-emerald-900 text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-emerald-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕌</span>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Friday Jummah Service
              </h3>
              <span className="text-[10px] text-emerald-200 font-medium">
                2 Congregated Shifts Every Friday
              </span>
            </div>
          </div>
          <span className="text-xs font-arabic text-amber-300 font-bold">
            صلاة الجمعة
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Shift 1 */}
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-300 font-bold text-[11px]">1st Shift</span>
              <span className="text-emerald-200 text-[10px]">Doors 12:45 PM</span>
            </div>
            <div className="text-sm font-extrabold text-white mb-0.5">
              Khutbah: {JUMMAH_INFO.firstShift.khutbah}
            </div>
            <div className="text-[11px] text-emerald-100 font-medium">
              Salah: {JUMMAH_INFO.firstShift.salah}
            </div>
            <div className="mt-2 text-[10px] text-emerald-200/80 truncate">
              Khatib: {JUMMAH_INFO.firstShift.khatib}
            </div>
          </div>

          {/* Shift 2 */}
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-300 font-bold text-[11px]">2nd Shift</span>
              <span className="text-emerald-200 text-[10px]">Doors 01:50 PM</span>
            </div>
            <div className="text-sm font-extrabold text-white mb-0.5">
              Khutbah: {JUMMAH_INFO.secondShift.khutbah}
            </div>
            <div className="text-[11px] text-emerald-100 font-medium">
              Salah: {JUMMAH_INFO.secondShift.salah}
            </div>
            <div className="mt-2 text-[10px] text-emerald-200/80 truncate">
              Khatib: {JUMMAH_INFO.secondShift.khatib}
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-emerald-200 leading-tight">
          Please carpool. Sisters mezzanine and overflow banquet hall open for both shifts.
        </p>
      </div>

      {/* Timetable Calculation Method & Accuracy info */}
      <div className="p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          Calculated using <strong>{settings.calculationMethod}</strong> with Fajr angle 15.0° and Isha angle 15.0°. Verified monthly by the Masjid Astronomical Committee.
        </div>
      </div>

      {/* Monthly Timetable Sheet / Dialog Modal */}
      {showMonthlyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 max-w-[430px] mx-auto animate-in fade-in">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4"></div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  September 2026 Timetable
                </h3>
                <span className="text-xs text-slate-500">
                  Rabi' al-Awwal 1448 AH · Madina Masjid MKB Nagar
                </span>
              </div>
              <button
                onClick={() => setShowMonthlyModal(false)}
                className="min-h-[44px] px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            {/* Monthly Sample Table */}
            <div className="text-xs border border-slate-200 rounded-2xl overflow-hidden mb-4">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Fajr</th>
                    <th className="p-2">Dhuhr</th>
                    <th className="p-2">Asr</th>
                    <th className="p-2">Maghrib</th>
                    <th className="p-2">Isha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {[21, 22, 23, 24, 25, 26, 27].map(day => (
                    <tr key={day} className={day === 23 ? 'bg-emerald-50/80 font-bold' : ''}>
                      <td className="p-2">Sep {day}</td>
                      <td className="p-2">5:12</td>
                      <td className="p-2">1:04</td>
                      <td className="p-2">4:32</td>
                      <td className="p-2">7:14</td>
                      <td className="p-2">8:36</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => {
                alert('Monthly PDF Timetable downloaded to your device!');
                setShowMonthlyModal(false);
              }}
              className="w-full py-3 bg-[#087F5B] text-white font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Printable PDF Timetable</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
