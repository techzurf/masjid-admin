import React, { useState } from 'react';
import { Heart, Plus, Edit2, Trash2, X, Check, Bookmark } from 'lucide-react';
import { AdminDuaItem, INITIAL_DUAS } from '../mockAdminData';

const CATEGORIES = ['All', 'Morning', 'Evening', 'After Salah', 'Travel', 'Protection', 'Daily Duas'];

export const AdminDuaScreen: React.FC = () => {
  const [list, setList] = useState<AdminDuaItem[]>(INITIAL_DUAS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminDuaItem | null>(null);

  const [title, setTitle] = useState('');
  const [arabic, setArabic] = useState('');
  const [translation, setTranslation] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState('Daily Duas');

  const filtered = activeCategory === 'All' 
    ? list 
    : list.filter(d => d.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const openAdd = () => {
    setEditingItem(null);
    setTitle('');
    setArabic('');
    setTranslation('');
    setReference('Sahih Muslim');
    setCategory('Daily Duas');
    setModalOpen(true);
  };

  const openEdit = (d: AdminDuaItem) => {
    setEditingItem(d);
    setTitle(d.title);
    setArabic(d.arabic);
    setTranslation(d.translation);
    setReference(d.reference);
    setCategory(d.category);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      setList(prev => prev.map(d => d.id === editingItem.id ? { ...d, title, arabic, translation, reference, category } : d));
    } else {
      const newD: AdminDuaItem = {
        id: `dua-${Date.now()}`,
        title,
        arabic,
        translation,
        reference,
        category,
        status: 'Active'
      };
      setList(prev => [newD, ...prev]);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Daily Supplications & Dhikr
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Dua & Azkar Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage Masnoon supplications with Arabic text, translations, and authentic references.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Dua</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#087F5B] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Duas List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-900">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Arabic */}
            {item.arabic && (
              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/70 text-right text-base sm:text-lg font-serif text-slate-900 leading-loose">
                {item.arabic}
              </div>
            )}

            {/* Translation & Reference */}
            <div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                "{item.translation}"
              </p>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                Reference: {item.reference}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Dua' : 'Add New Dua'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dua Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dua for Entering the Masjid"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Arabic Text
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={arabic}
                  onChange={(e) => setArabic(e.target.value)}
                  placeholder="اللَّهُمَّ..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-serif text-sm text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  English Translation *
                </label>
                <textarea
                  rows={2}
                  required
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                  placeholder="O Allah, open the doors of Your mercy..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Reference
                  </label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Sahih Muslim 713"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#087F5B] bg-white"
                  >
                    <option value="Daily Duas">Daily Duas</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="After Salah">After Salah</option>
                    <option value="Travel">Travel</option>
                    <option value="Protection">Protection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#087F5B] text-white text-xs font-bold shadow-sm"
                >
                  Save Dua
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
