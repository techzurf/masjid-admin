import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Share2, Heart, Copy, Check, ChevronRight } from 'lucide-react';
import { TODAY_REMINDER } from '../../data/mockData';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';

export const DailyReminderCard: React.FC = () => {
  const { setOverlayScreen, settings } = useApp();
  const t = useTranslation(settings.language);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ayah' | 'hadith'>('ayah');

  const handleCopy = () => {
    const textToCopy = activeTab === 'ayah' 
      ? `${TODAY_REMINDER.ayah.arabic}\n\n"${TODAY_REMINDER.ayah.english}" — ${TODAY_REMINDER.ayah.surah}`
      : `"${TODAY_REMINDER.hadith.text}" — ${TODAY_REMINDER.hadith.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#FDFBF7] rounded-3xl p-4 border border-amber-200/50 shadow-2xs relative overflow-hidden">
      {/* Top Segmented Tabs: Ayah vs Hadith */}
      <div className="flex items-center justify-between mb-3 border-b border-amber-200/40 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-amber-100/40 rounded-xl">
          <button
            onClick={() => setActiveTab('ayah')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'ayah' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Today's Ayah
          </button>
          <button
            onClick={() => setActiveTab('hadith')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'hadith' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Daily Hadith
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-700 transition-colors"
            title="Copy Reminder"
          >
            {copied ? <Check className="w-4 h-4 text-[#087F5B]" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setOverlayScreen('quran')}
            className="text-xs font-bold text-[#D4A72C] hover:text-[#B45309] flex items-center gap-0.5 ml-1"
          >
            <span>Quran</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {activeTab === 'ayah' ? (
        <div>
          {/* Arabic Ayah */}
          <p className="text-right text-base leading-relaxed font-arabic text-slate-900 font-bold mb-2.5 px-1 dir-rtl" dir="rtl">
            {TODAY_REMINDER.ayah.arabic}
          </p>

          {/* Translation */}
          <p className="text-xs text-slate-700 leading-relaxed italic mb-2">
            "{TODAY_REMINDER.ayah.english}"
          </p>

          {/* Tamil translation if in Tamil mode or requested */}
          {settings.language === 'ta' && (
            <p className="text-[11px] text-slate-800 leading-relaxed mb-2 font-medium bg-amber-50/70 p-2 rounded-xl border border-amber-200/40">
              {TODAY_REMINDER.ayah.tamil}
            </p>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-amber-200/40">
            <span className="font-bold text-[#087F5B]">{TODAY_REMINDER.ayah.surah}</span>
            <span className="text-slate-400">Reflect & Share</span>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-slate-500 mb-1">
            Narrated by {TODAY_REMINDER.hadith.narrator}:
          </p>
          <p className="text-xs text-slate-800 font-medium leading-relaxed mb-2">
            "{TODAY_REMINDER.hadith.text}"
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-amber-200/40">
            <span className="font-bold text-[#D4A72C]">{TODAY_REMINDER.hadith.source}</span>
            <span className="text-slate-400">Sunnah Guidance</span>
          </div>
        </div>
      )}
    </div>
  );
};
