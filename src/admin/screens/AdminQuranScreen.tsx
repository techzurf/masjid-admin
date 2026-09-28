import React, { useState } from 'react';
import { BookOpen, Eye, X, Check, Search } from 'lucide-react';
import { AdminSurahItem, INITIAL_SURAHS } from '../mockAdminData';

export const AdminQuranScreen: React.FC = () => {
  const [surahs, setSurahs] = useState<AdminSurahItem[]>(INITIAL_SURAHS);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewSurah, setPreviewSurah] = useState<AdminSurahItem | null>(null);

  const handleToggle = (num: number) => {
    setSurahs(prev => prev.map(s => s.number === num ? { ...s, enabled: !s.enabled } : s));
  };

  const filtered = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.name.includes(searchTerm) ||
    s.number.toString().includes(searchTerm)
  );

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Scriptural Content
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Quran Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure featured Surahs, recitation audio, and translations available in the Quran module.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Surah name or number..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
          />
        </div>
      </div>

      {/* Surahs Table / List */}
      <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-2xs divide-y divide-slate-100">
        {filtered.map((surah) => (
          <div
            key={surah.number}
            className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#087F5B] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {surah.number}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {surah.englishName}
                  </span>
                  <span className="text-sm font-serif font-bold text-slate-600">
                    {surah.name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {surah.ayahCount} Verses • {surah.revelation}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewSurah(surah)}
                className="h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview</span>
              </button>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={surah.enabled}
                  onChange={() => handleToggle(surah.number)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#087F5B]"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewSurah && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400">Surah Preview</span>
              <button onClick={() => setPreviewSurah(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3">
              <span className="text-xs font-mono font-bold text-[#087F5B]">Surah #{previewSurah.number}</span>
              <h2 className="text-2xl font-serif font-black text-slate-900 my-1">{previewSurah.name}</h2>
              <h3 className="text-sm font-bold text-slate-700">{previewSurah.englishName}</h3>
              <p className="text-xs text-slate-500 mt-1">{previewSurah.ayahCount} Ayahs • {previewSurah.revelation} Revelation</p>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs text-emerald-950 font-serif leading-loose">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>

            <button
              onClick={() => setPreviewSurah(null)}
              className="w-full py-2.5 rounded-xl bg-[#087F5B] text-white font-bold text-xs"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
