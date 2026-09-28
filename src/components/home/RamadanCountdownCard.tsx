import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Clock, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Heart,
  Share2,
  Volume2
} from 'lucide-react';
import { CrescentStarIcon, RamadanLanternIcon, RubElHizbIcon } from '../common/IslamicIcons';
import { RAMADAN_TIMINGS } from '../../data/mockData';

interface RamadanCountdownCardProps {
  onOpenTimetable?: () => void;
}

export const RamadanCountdownCard: React.FC<RamadanCountdownCardProps> = ({ onOpenTimetable }) => {
  const { setOverlayScreen } = useApp();

  // Mode: 'iftar' or 'suhoor'
  const [selectedTarget, setSelectedTarget] = useState<'iftar' | 'suhoor'>('iftar');
  const [showDuas, setShowDuas] = useState<boolean>(false);
  const [activeDuaTab, setActiveDuaTab] = useState<'iftar' | 'suhoor'>('iftar');
  const [copiedDua, setCopiedDua] = useState<boolean>(false);
  
  // Fasting tracker state saved in localStorage
  const [fastTracked, setFastTracked] = useState<boolean>(() => {
    return localStorage.getItem('ramadan_fast_day_14') === 'true';
  });

  // Countdown timer calculations
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 41,
    seconds: 45
  });

  useEffect(() => {
    // Real ticking countdown simulation
    // Suhoor: 05:08 AM | Iftar: 07:14 PM (19:14)
    const updateCountdown = () => {
      const now = new Date();
      let targetDate = new Date();

      if (selectedTarget === 'iftar') {
        // Target: 07:14 PM today
        targetDate.setHours(19, 14, 0, 0);
        if (now > targetDate) {
          // If after 7:14 PM, target tomorrow's Iftar
          targetDate.setDate(targetDate.getDate() + 1);
        }
      } else {
        // Target: 05:08 AM
        targetDate.setHours(5, 8, 0, 0);
        if (now > targetDate) {
          // If after 5:08 AM today, target tomorrow's Suhoor
          targetDate.setDate(targetDate.getDate() + 1);
        }
      }

      const diffMs = targetDate.getTime() - now.getTime();
      if (diffMs > 0) {
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedTarget]);

  const toggleFastTracked = () => {
    const next = !fastTracked;
    setFastTracked(next);
    try {
      localStorage.setItem('ramadan_fast_day_14', String(next));
    } catch {
      // quota handling
    }
  };

  const handleCopyDua = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedDua(true);
      setTimeout(() => setCopiedDua(false), 2000);
    }
  };

  const iftarDuaArabic = "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ";
  const iftarDuaTransliteration = "Dhahaba adh-dhama'u wabtallat al-'urooq wa thabata al-ajru in sha Allah";
  const iftarDuaTranslation = "The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills. (Sunan Abi Dawud)";

  const suhoorDuaArabic = "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ";
  const suhoorDuaTransliteration = "Wa bi-sawmi ghadin nawaytu min shahri Ramadan";
  const suhoorDuaTranslation = "I intend to fast tomorrow for the sake of Allah in the blessed month of Ramadan.";

  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-md border border-amber-400/40 relative bg-gradient-to-b from-[#091A30] via-[#0D2444] to-[#071424] text-white">
      {/* Decorative Golden Arabesque Background Elements */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Festive Header Bar */}
      <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-amber-500/20 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-xs">
            <RamadanLanternIcon className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-amber-300 tracking-wide uppercase">
                Ramadan Mubarak
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-amber-100/70 font-medium">
              1448 AH · Day 14 of 30 · Madina Masjid
            </p>
          </div>
        </div>

        {/* View Calendar Button */}
        <button
          onClick={() => {
            if (onOpenTimetable) {
              onOpenTimetable();
            } else {
              setOverlayScreen('monthly_timetable');
            }
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-[10px] font-bold text-amber-200 transition-colors"
        >
          <Calendar className="w-3 h-3 text-amber-300" />
          <span>Timetable</span>
        </button>
      </div>

      {/* Main Countdown Display */}
      <div className="p-4">
        {/* Toggle between Iftar and Suhoor */}
        <div className="flex items-center justify-center mb-3">
          <div className="p-0.5 rounded-xl bg-black/40 border border-amber-500/20 flex gap-1">
            <button
              onClick={() => setSelectedTarget('iftar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTarget === 'iftar'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-sm'
                  : 'text-amber-100/70 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Iftar (Sunset)</span>
            </button>

            <button
              onClick={() => setSelectedTarget('suhoor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedTarget === 'suhoor'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-sm'
                  : 'text-amber-100/70 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Suhoor (Imsak)</span>
            </button>
          </div>
        </div>

        {/* Big Countdown Timer Card */}
        <div className="relative rounded-2xl p-4 bg-gradient-to-b from-white/10 to-white/5 border border-amber-400/30 text-center backdrop-blur-md shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-200 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '10s' }} />
            <span>
              {selectedTarget === 'iftar' 
                ? 'Time Remaining Until Iftar' 
                : 'Time Remaining Until Suhoor Ends'}
            </span>
          </div>

          {/* Digits Display */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
            <div className="flex flex-col items-center">
              <span className="w-16 sm:w-18 py-2 rounded-xl bg-black/60 border border-amber-400/30 font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-amber-200/80 uppercase tracking-widest mt-1">
                Hours
              </span>
            </div>

            <span className="font-mono text-xl sm:text-2xl font-bold text-amber-400/80 -mt-4">:</span>

            <div className="flex flex-col items-center">
              <span className="w-16 sm:w-18 py-2 rounded-xl bg-black/60 border border-amber-400/30 font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums shadow-sm">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-amber-200/80 uppercase tracking-widest mt-1">
                Minutes
              </span>
            </div>

            <span className="font-mono text-xl sm:text-2xl font-bold text-amber-400/80 -mt-4">:</span>

            <div className="flex flex-col items-center">
              <span className="w-16 sm:w-18 py-2 rounded-xl bg-black/60 border border-amber-400/30 font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums shadow-sm">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-amber-200/80 uppercase tracking-widest mt-1">
                Seconds
              </span>
            </div>
          </div>

          {/* Subtext info */}
          <div className="mt-2 text-[11px] text-amber-100/90 font-medium">
            {selectedTarget === 'iftar' ? (
              <span>Today's Iftar at <strong className="text-amber-300">{RAMADAN_TIMINGS.iftarTime}</strong> (Maghrib Adhan)</span>
            ) : (
              <span>Suhoor ends at <strong className="text-amber-300">{RAMADAN_TIMINGS.suhoorEnds}</strong> (Fajr at {RAMADAN_TIMINGS.fajrAdhan})</span>
            )}
          </div>
        </div>

        {/* 4 Timings Quick Grid */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 text-center">
          <div className="p-2 rounded-xl bg-black/30 border border-amber-500/20">
            <span className="text-[9px] uppercase tracking-wider text-amber-200/80 block">Suhoor End</span>
            <span className="text-xs font-bold text-amber-300 block mt-0.5">{RAMADAN_TIMINGS.suhoorEnds}</span>
            <span className="text-[8px] text-slate-400 block">Imsak</span>
          </div>

          <div className="p-2 rounded-xl bg-black/30 border border-amber-500/20">
            <span className="text-[9px] uppercase tracking-wider text-amber-200/80 block">Fajr Adhan</span>
            <span className="text-xs font-bold text-white block mt-0.5">{RAMADAN_TIMINGS.fajrAdhan}</span>
            <span className="text-[8px] text-slate-400 block">05:35 Iqamah</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40">
            <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-bold">Iftar Time</span>
            <span className="text-xs font-extrabold text-amber-300 block mt-0.5">{RAMADAN_TIMINGS.iftarTime}</span>
            <span className="text-[8px] text-amber-200/90 block">Sunset</span>
          </div>

          <div className="p-2 rounded-xl bg-black/30 border border-amber-500/20">
            <span className="text-[9px] uppercase tracking-wider text-amber-200/80 block">Taraweeh</span>
            <span className="text-xs font-bold text-white block mt-0.5">{RAMADAN_TIMINGS.taraweehTime}</span>
            <span className="text-[8px] text-slate-400 block">20 Raka'at</span>
          </div>
        </div>

        {/* Interactive Fasting Tracker & Duas Drawer */}
        <div className="mt-3 pt-3 border-t border-amber-500/20 flex flex-col gap-2.5">
          {/* Tracker Toggle */}
          <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-2xl border border-amber-500/20">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFastTracked}
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                  fastTracked 
                    ? 'bg-amber-400 text-slate-950 font-bold' 
                    : 'border-2 border-amber-400/50 hover:border-amber-400'
                }`}
                aria-label="Track today fast"
              >
                {fastTracked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div>
                <div className="text-xs font-bold text-amber-100">
                  {fastTracked ? 'Fasting Completed Today! ✓' : 'Track Today\'s Fast (Day 14)'}
                </div>
                <div className="text-[10px] text-amber-200/70">
                  {fastTracked ? 'Alhamdulillah, may Allah accept your fast' : 'Tap checkbox when you break your fast'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDuas(!showDuas)}
              className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-[11px] font-bold text-amber-200 flex items-center gap-1 transition-colors"
            >
              <span>Fasting Duas</span>
              {showDuas ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expandable Fasting Duas Section */}
          {showDuas && (
            <div className="p-3 bg-black/50 rounded-2xl border border-amber-400/30 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveDuaTab('iftar')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      activeDuaTab === 'iftar'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-amber-100/70 hover:text-white'
                    }`}
                  >
                    Iftar Dua (நோன்பு திறக்கும் துஆ)
                  </button>
                  <button
                    onClick={() => setActiveDuaTab('suhoor')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      activeDuaTab === 'suhoor'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-amber-100/70 hover:text-white'
                    }`}
                  >
                    Suhoor Niyyah (நோன்பு வைக்கும் நிய்யத்)
                  </button>
                </div>

                <button
                  onClick={() => handleCopyDua(activeDuaTab === 'iftar' ? iftarDuaArabic : suhoorDuaArabic)}
                  className="p-1 text-amber-200 hover:text-white"
                  title="Copy Dua"
                >
                  {copiedDua ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {activeDuaTab === 'iftar' ? (
                <div>
                  <div className="text-sm font-arabic font-bold text-amber-200 text-right leading-loose mb-1">
                    {iftarDuaArabic}
                  </div>
                  <div className="text-[11px] text-amber-100/80 italic mb-1">
                    "{iftarDuaTransliteration}"
                  </div>
                  <div className="text-[10px] text-slate-300 leading-snug">
                    {iftarDuaTranslation}
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-1 font-tamil">
                    "தாகம் தீர்ந்தது, நரம்புகள் நனைந்தன, இன்ஷா அல்லாஹ் கூலியும் உறுதியாகிவிட்டது."
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-arabic font-bold text-amber-200 text-right leading-loose mb-1">
                    {suhoorDuaArabic}
                  </div>
                  <div className="text-[11px] text-amber-100/80 italic mb-1">
                    "{suhoorDuaTransliteration}"
                  </div>
                  <div className="text-[10px] text-slate-300 leading-snug">
                    {suhoorDuaTranslation}
                  </div>
                  <div className="text-[10px] text-amber-300/80 mt-1 font-tamil">
                    "ரமலான் மாதத்தின் நாளைய நோன்பை நோற்க நிய்யத் செய்கிறேன்."
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Community Iftar Hospitality Notice */}
          <div className="px-3 py-2 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent rounded-xl border border-amber-500/20 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-200">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Free Community Iftar served daily at Madina Masjid</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold shrink-0">Open to All</span>
          </div>
        </div>
      </div>
    </div>
  );
};
