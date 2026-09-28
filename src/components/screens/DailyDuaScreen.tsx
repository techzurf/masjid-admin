import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Search, 
  Bookmark, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { DuaItem } from '../../types';
import { useTranslation } from '../../utils/translations';

export const DailyDuaScreen: React.FC = () => {
  const { duas, toggleFavoriteDua, settings, triggerHapticFeedback } = useApp();
  const t = useTranslation(settings.language);

  const categories = [
    'All',
    'Morning',
    'Evening',
    'Travel',
    'Protection',
    'Family',
    'Forgiveness'
  ];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = duas.filter(dua => {
    const matchesCat = activeCategory === 'All' || dua.category === activeCategory;
    const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dua.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dua.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (dua: DuaItem) => {
    triggerHapticFeedback('selection');
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.englishMeaning}"\n\nSource: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
          Daily Remembrances (Hisn al-Muslim)
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Supplications & Duas
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Authentic prayers from the Sunnah for daily protection, morning & evening.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search duas by occasion or keyword..."
          className="w-full h-11 pl-10 pr-4 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#087F5B]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-[#087F5B] text-white shadow-2xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Duas List */}
      <div className="flex flex-col gap-3.5">
        {filteredDuas.map(dua => {
          const isFav = !!dua.isFavorite;
          const isCopied = copiedId === dua.id;

          // Category color accent
          const getCategoryAccent = (cat: string) => {
            switch (cat) {
              case 'Morning':
              case 'Evening':
                return { text: 'text-[#B45309]', bg: 'bg-amber-50', border: 'border-amber-200' };
              case 'Protection':
              case 'Family':
                return { text: 'text-[#7657C8]', bg: 'bg-purple-50', border: 'border-purple-200' };
              case 'Travel':
                return { text: 'text-[#159A9C]', bg: 'bg-teal-50', border: 'border-teal-200' };
              default:
                return { text: 'text-[#087F5B]', bg: 'bg-emerald-50', border: 'border-emerald-200' };
            }
          };
          const catStyle = getCategoryAccent(dua.category);

          return (
            <div
              key={dua.id}
              className="w-full bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs flex flex-col gap-2.5 relative"
            >
              {/* Header with Title and Favorite button */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${catStyle.text} ${catStyle.bg} ${catStyle.border}`}>
                    {dua.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mt-1.5">
                    {dua.title}
                  </h3>
                  {settings.language === 'ta' && dua.tamilTitle && (
                    <span className="text-[11px] font-semibold text-emerald-800">
                      {dua.tamilTitle}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 -mr-1">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Copy Dua"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => toggleFavoriteDua(dua.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isFav ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                    }`}
                    title="Bookmark Dua"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Arabic Script: Spiritual Soft Cream Parchment with Deep Green Script */}
              <p className="text-right text-base leading-loose font-arabic text-[#07543F] font-bold bg-[#FAF7EE] p-3.5 rounded-2xl border border-[#EADBBD] shadow-2xs dir-rtl" dir="rtl">
                {dua.arabic}
              </p>

              {/* Transliteration */}
              <p className="text-xs text-slate-600 font-mono text-[11px] italic leading-relaxed">
                {dua.transliteration}
              </p>

              {/* English Translation */}
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                "{dua.englishMeaning}"
              </p>

              {/* Tamil Translation if selected */}
              {(settings.language === 'ta' || true) && dua.tamilMeaning && (
                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-700 leading-relaxed font-normal border border-slate-100">
                  <span className="font-bold text-[#087F5B] block text-[10px] mb-0.5">தமிழ் மொழிபெயர்ப்பு:</span>
                  {dua.tamilMeaning}
                </div>
              )}

              {/* Source & Occasion */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-[#087F5B]">{dua.reference}</span>
                <span className="text-slate-500 font-medium">{dua.benefit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

