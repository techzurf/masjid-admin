import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Share2, 
  Bookmark, 
  Check, 
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MOCK_SURAHS, TODAY_REMINDER, RECORDED_BAYANS } from '../../data/mockData';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';

export const QuranContentScreen: React.FC = () => {
  const { settings } = useApp();
  const t = useTranslation(settings.language);

  const [activeTab, setActiveTab] = useState<'surahs' | 'hadith' | 'bayans'>('surahs');
  const [playingBayanId, setPlayingBayanId] = useState<string | null>(null);
  const [searchSurah, setSearchSurah] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredSurahs = MOCK_SURAHS.filter(s => 
    s.englishName.toLowerCase().includes(searchSurah.toLowerCase()) ||
    s.meaning.toLowerCase().includes(searchSurah.toLowerCase())
  );

  const handleCopyAyah = () => {
    navigator.clipboard.writeText(`${TODAY_REMINDER.ayah.arabic}\n\n"${TODAY_REMINDER.ayah.english}" — ${TODAY_REMINDER.ayah.surah}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlayBayan = (id: string) => {
    if (playingBayanId === id) {
      setPlayingBayanId(null);
    } else {
      setPlayingBayanId(id);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Daily Ayah Hero Card */}
      <div className="w-full bg-gradient-to-br from-[#087F5B] via-[#07543F] to-[#162722] rounded-3xl p-5 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-15">
          <RubElHizbIcon className="w-24 h-24 text-white" />
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A72C]">
            Ayah of the Day
          </span>
          <button 
            onClick={handleCopyAyah}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-200 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        <p className="text-right text-lg font-arabic font-bold text-[#FAF7EE] leading-loose mb-3 dir-rtl" dir="rtl">
          {TODAY_REMINDER.ayah.arabic}
        </p>

        <p className="text-xs text-white/95 leading-relaxed italic mb-2">
          "{TODAY_REMINDER.ayah.english}"
        </p>

        {settings.language === 'ta' && (
          <p className="text-[11px] text-[#FAF7EE]/90 leading-relaxed bg-black/20 p-2.5 rounded-xl mb-2">
            {TODAY_REMINDER.ayah.tamil}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/15 text-[11px] text-slate-300">
          <span className="font-semibold text-[#D4A72C]">{TODAY_REMINDER.ayah.surah}</span>
          <span>Revelation: Madani</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => setActiveTab('surahs')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'surahs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Noble Quran
        </button>
        <button
          onClick={() => setActiveTab('hadith')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'hadith' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Daily Hadith
        </button>
        <button
          onClick={() => setActiveTab('bayans')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'bayans' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Audio Bayans
        </button>
      </div>

      {/* Content depending on activeTab */}
      {activeTab === 'surahs' && (
        <div className="flex flex-col gap-3">
          {/* Search Surah */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchSurah}
              onChange={e => setSearchSurah(e.target.value)}
              placeholder="Search Surah by name or meaning..."
              className="w-full h-11 pl-10 pr-4 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div className="flex flex-col gap-2">
            {filteredSurahs.map((surah, idx) => {
              const accentColors = ['#087F5B', '#3B6FD8', '#7657C8', '#159A9C', '#D4A72C', '#4DA3E8'];
              const color = accentColors[idx % accentColors.length];

              return (
                <div
                  key={surah.number}
                  className="w-full bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold font-mono"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color
                      }}
                    >
                      {surah.number}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {surah.englishName}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        {surah.meaning} · {surah.ayahCount} Verses
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span 
                      className="text-base font-arabic font-bold block"
                      style={{ color: color }}
                    >
                      {surah.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {surah.revelation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'hadith' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#D4A72C] tracking-wider block mb-1">
              Riyad as-Salihin
            </span>
            <p className="text-xs text-slate-500 mb-2">
              Narrated by {TODAY_REMINDER.hadith.narrator}:
            </p>
            <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
              "{TODAY_REMINDER.hadith.text}"
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[#087F5B]">{TODAY_REMINDER.hadith.source}</span>
              <span className="text-xs text-slate-400">Authentic (Sahih)</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-[#7657C8] tracking-wider block mb-1">
              Sunan an-Nasa'i
            </span>
            <p className="text-xs text-slate-500 mb-2">
              Narrated by Abu Hurairah (RA):
            </p>
            <p className="text-sm text-slate-800 font-medium leading-relaxed mb-3">
              "Whoever attends the funeral until the prayer is offered will have a Qirat of reward, and whoever remains until the burial is completed will have two Qirats — like two immense mountains."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-[#7657C8]">Sahih al-Bukhari 1325</span>
              <span className="text-xs text-slate-400">Authentic (Sahih)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bayans' && (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs text-slate-500 px-1">
            Recorded Jummah Khutbahs & Weekly Halaqahs:
          </span>
          {RECORDED_BAYANS.map(bayan => {
            const isPlaying = playingBayanId === bayan.id;
            return (
              <div
                key={bayan.id}
                className={`w-full bg-white rounded-2xl p-4 border transition-all ${
                  isPlaying ? 'border-[#3B6FD8] bg-blue-50/40 shadow-xs' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {bayan.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {bayan.speaker} · {bayan.duration}
                    </span>
                  </div>

                  <button
                    onClick={() => togglePlayBayan(bayan.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isPlaying 
                        ? 'bg-[#3B6FD8] text-white shadow-xs' 
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                </div>

                {isPlaying && (
                  <div className="mt-3 pt-2.5 border-t border-blue-200/60 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3B6FD8] animate-pulse"></span>
                    <span className="text-[11px] text-slate-900 font-bold">Now Playing Audio</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden ml-2">
                      <div className="h-full bg-[#3B6FD8] w-1/3 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
