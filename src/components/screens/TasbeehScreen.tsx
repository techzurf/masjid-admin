import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Check, 
  Sliders, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { TasbeehBeadsIcon } from '../common/IslamicIcons';

export const TasbeehScreen: React.FC = () => {
  const { 
    tasbeehCount, 
    incrementTasbeeh, 
    resetTasbeeh, 
    tasbeehTarget, 
    setTasbeehTarget, 
    tasbeehDhikr, 
    tasbeehMeaning,
    setTasbeehDhikrPreset,
    settings,
    updateSettings,
    triggerHapticFeedback
  } = useApp();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tapEffect, setTapEffect] = useState(false);

  const presets = [
    { dhikr: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah', target: 33 },
    { dhikr: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'All praise is for Allah', target: 33 },
    { dhikr: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest', target: 34 },
    { dhikr: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'I seek forgiveness from Allah', target: 100 },
    { dhikr: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', meaning: 'None has the right to be worshipped but Allah', target: 100 },
    { dhikr: 'Salawat on Prophet ﷺ', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', meaning: 'Blessings upon Prophet Muhammad', target: 100 }
  ];

  const currentPreset = presets.find(p => p.dhikr === tasbeehDhikr) || presets[0];

  const handleTap = () => {
    setTapEffect(true);
    setTimeout(() => setTapEffect(false), 120);
    incrementTasbeeh(soundEnabled);
  };

  const progressPercent = Math.min(100, Math.round((tasbeehCount / tasbeehTarget) * 100));
  const isTargetCompleted = tasbeehCount >= tasbeehTarget;

  return (
    <div className="w-full min-h-[82vh] flex flex-col items-center justify-between px-4 pt-2 pb-8 text-center select-none">
      {/* Top Presets Selector */}
      <div className="w-full flex flex-col items-center">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-2 px-2">
          {presets.map(p => {
            const isSelected = p.dhikr === tasbeehDhikr;
            return (
              <button
                key={p.dhikr}
                onClick={() => setTasbeehDhikrPreset(p.dhikr, p.meaning, p.target)}
                className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-[#7657C8] text-white shadow-2xs' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {p.dhikr}
              </button>
            );
          })}
        </div>

        {/* Selected Dhikr Display Card */}
        <div className="w-full max-w-xs mt-2 bg-white rounded-2xl p-3 border border-purple-100 shadow-2xs">
          <p className="text-xl font-arabic text-[#7657C8] font-bold mb-1">
            {currentPreset.arabic}
          </p>
          <p className="text-xs text-slate-800 font-bold">
            {currentPreset.dhikr}
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            "{currentPreset.meaning}"
          </p>
        </div>
      </div>

      {/* Main Tactile Tap Counter Button with Circular Ring */}
      <div className="relative my-4 flex flex-col items-center justify-center">
        {/* Progress SVG Ring around button */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="115"
              stroke="#E9D5FF"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="115"
              stroke="#7657C8"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 115}
              strokeDashoffset={2 * Math.PI * 115 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-150"
            />
          </svg>

          {/* Huge Touch Counter Button */}
          <button
            onClick={handleTap}
            className={`absolute w-52 h-52 rounded-full bg-gradient-to-br from-[#7657C8] via-[#6344B5] to-[#452B87] text-white shadow-xl flex flex-col items-center justify-center transition-all duration-100 active:scale-95 cursor-pointer ${
              tapEffect ? 'ring-8 ring-purple-400/40 scale-95' : 'hover:shadow-2xl'
            }`}
            aria-label="Tap to Count Dhikr"
          >
            <span className="text-[11px] font-bold text-[#D4A72C] uppercase tracking-widest mb-1">
              Tap Anywhere
            </span>
            <span className="text-5xl font-extrabold font-mono tracking-tight tabular-nums text-white">
              {tasbeehCount}
            </span>
            <span className="text-xs text-[#E8F7F1] mt-1 font-semibold">
              Goal: {tasbeehTarget}
            </span>
          </button>
        </div>

        {/* Lap Target Achieved Banner */}
        {isTargetCompleted && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#7657C8]" />
            <span>Target Reached! SubhanAllah</span>
          </div>
        )}
      </div>

      {/* Target Selector & Controls */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        {/* Quick Goal Selector */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-600">Target Count:</span>
          <div className="flex items-center gap-1.5">
            {[33, 99, 100, 500].map(tgt => (
              <button
                key={tgt}
                onClick={() => {
                  triggerHapticFeedback('selection');
                  setTasbeehTarget(tgt);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  tasbeehTarget === tgt 
                    ? 'bg-[#7657C8] text-white' 
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {tgt}
              </button>
            ))}
          </div>
        </div>

        {/* Reset, Sound & Haptic Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={resetTasbeeh}
            className="py-2.5 px-2 rounded-2xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all"
            title="Reset counter"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => {
              const next = !settings.hapticFeedback;
              updateSettings({ hapticFeedback: next });
              if (next) triggerHapticFeedback('medium');
            }}
            className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all ${
              settings.hapticFeedback 
                ? 'bg-purple-50 border-purple-200 text-[#7657C8]' 
                : 'bg-white border-slate-200 text-slate-400'
            }`}
            title="Toggle tactile haptic vibration"
          >
            <span>{settings.hapticFeedback ? '📳 Haptic' : '📴 Silent'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`py-2.5 px-2 rounded-2xl border text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-all ${
              soundEnabled
                ? 'bg-purple-50 border-purple-200 text-[#7657C8]'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
            title="Toggle micro-click sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#7657C8]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{soundEnabled ? 'Click' : 'Mute'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
