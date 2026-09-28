import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Bell, ChevronRight, ShieldCheck, Calendar } from 'lucide-react';
import { INITIAL_PRAYERS, JUMMAH_INFO, RAMADAN_TIMINGS } from '../../data/mockData';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';

interface PrayerCardProps {
  className?: string;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ className }) => {
  const { setActiveTab, setOverlayScreen, settings, computedPrayers } = useApp();
  const t = useTranslation(settings.language);

  const { nextPrayer, prayersList, jummahInfo } = computedPrayers;

  // Live countdown to next prayer computed dynamically from Supabase schedule
  const [countdown, setCountdown] = useState<string>('00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const nowMs = Date.now();
      const targetMs = nextPrayer.rawTime.getTime();
      let diffSec = Math.max(0, Math.floor((targetMs - nowMs) / 1000));

      const h = Math.floor(diffSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
      const s = (diffSec % 60).toString().padStart(2, '0');
      setCountdown(`${h}:${m}:${s}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer.rawTime]);

  return (
    <div className={`w-full bg-white p-4 relative overflow-hidden ${className ?? 'rounded-3xl shadow-sm border border-emerald-950/5'}`}>
      {/* Background Islamic Subtle Motifs */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-50 rounded-full blur-2xl pointer-events-none"></div>

      {/* Ramadan Special Header if enabled */}
      {settings.ramadanMode && (
        <div className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <span>🌙</span>
            <span>Ramadan Mubarak</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-700">
            Suhoor: <strong className="text-emerald-900">{RAMADAN_TIMINGS.suhoorEnds}</strong> · Iftar: <strong className="text-amber-800">{RAMADAN_TIMINGS.iftarTime}</strong>
          </div>
        </div>
      )}

      {/* Prominent Next Prayer Hero Header */}
      <div className="bg-gradient-to-br from-[#087F5B] to-[#07543F] rounded-2xl p-4 text-white relative shadow-sm">
        {/* Subtle decorative star */}
        <div className="absolute top-3 right-3 opacity-20">
          <RubElHizbIcon className="w-10 h-10 text-white" />
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D4A72C] animate-pulse"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              Next Prayer
            </span>
          </div>
          <span className="text-xs font-arabic text-amber-300 font-bold">
            {nextPrayer.arabicName}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              {nextPrayer.name} · {nextPrayer.adhanTime}
            </h3>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              Iqamah at <strong>{nextPrayer.iqamahTime}</strong> (Jama'ah)
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-200 font-medium block">
              {t('startsIn')}
            </span>
            <span className="font-mono text-base font-bold text-[#D4A72C] tracking-tight tabular-nums">
              {countdown}
            </span>
          </div>
        </div>

        {/* Reminder setting sub-bar */}
        <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100/90">
          <div className="flex items-center gap-1">
            <Bell className="w-3 h-3 text-amber-300" />
            <span>Alert: <strong>{settings.athanSound}</strong> ({settings.reminderMinutesBefore === 0 ? 'At Adhan' : `${settings.reminderMinutesBefore}m before`})</span>
          </div>
          <button
            onClick={() => setOverlayScreen('settings')}
            className="text-amber-300 hover:text-white font-bold text-[10px] underline underline-offset-2"
          >
            Sound Settings
          </button>
        </div>
      </div>

      {/* All 5 Daily Prayers Grid */}
      <div className="mt-3.5 grid grid-cols-5 gap-1.5 text-center">
        {prayersList.map(p => {
          const isNext = p.isNext;
          return (
            <div 
              key={p.id}
              className={`py-2 px-1 rounded-xl transition-all relative ${
                isNext 
                  ? 'bg-[#E8F7F1] border-2 border-[#087F5B] shadow-xs' 
                  : 'bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300'
              }`}
            >
              {isNext && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#D4A72C] animate-pulse"></span>
              )}
              {!isNext && (
                <span className={`absolute top-1.5 right-1.5 w-1 h-1 rounded-full ${
                  p.passed ? 'bg-slate-300' : 'bg-[#D4A72C]/70'
                }`}></span>
              )}
              <span className={`text-[11px] font-bold block ${
                isNext ? 'text-[#087F5B]' : 'text-slate-700'
              }`}>
                {settings.language === 'ta' ? p.tamilName : p.name}
              </span>
              <span className="text-[9px] font-arabic text-slate-400 block -mt-0.5">
                {p.arabicName}
              </span>
              <span className={`text-xs font-bold block mt-1 tabular-nums ${
                isNext ? 'text-[#07543F] font-extrabold' : 'text-slate-800'
              }`}>
                {p.adhanTime.replace(' AM', '').replace(' PM', '')}
              </span>
              <span className="text-[9px] text-slate-400 font-medium block">
                {p.iqamahTime.replace(' AM', '').replace(' PM', '')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Adhan & Iqamah legend */}
      <div className="mt-2 px-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>Top: Adhan / Bottom: Iqamah</span>
        <span className="text-[#087F5B] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4A72C]"></span>
          <span>Madina Masjid MKB Nagar</span>
        </span>
      </div>

      {/* Friday Jummah Notice Strip */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#D4A72C]" />
          <span className="font-semibold text-slate-800">
            {jummahInfo.description}
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#D4A72C] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
          {jummahInfo.shiftsCount} {jummahInfo.shiftsCount === 1 ? 'Shift' : 'Shifts'}
        </span>
      </div>

      {/* View Full Prayer Timetable CTA */}
      <button
        onClick={() => setActiveTab('prayers')}
        className="mt-3 w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-[#E8F7F1] border border-slate-200/80 hover:border-emerald-200 text-xs font-bold text-[#087F5B] flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all"
      >
        <span>{t('viewPrayerTimes')} & Timetable</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
