import React, { useState } from 'react';
import { BookMarked, Plus, Edit2, Trash2, X, Check, Bookmark } from 'lucide-react';
import { AdminHadithItem, INITIAL_HADITHS } from '../mockAdminData';

export const AdminHadithScreen: React.FC = () => {
  const [list, setList] = useState<AdminHadithItem[]>(INITIAL_HADITHS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminHadithItem | null>(null);

  const [text, setText] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState('Knowledge');

  const openAdd = () => {
    setEditingItem(null);
    setText('');
    setReference('Sahih al-Bukhari');
    setCategory('Knowledge');
    setModalOpen(true);
  };

  const openEdit = (h: AdminHadithItem) => {
    setEditingItem(h);
    setText(h.text);
    setReference(h.reference);
    setCategory(h.category);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(h => h.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingItem) {
      setList(prev => prev.map(h => h.id === editingItem.id ? { ...h, text, reference, category } : h));
    } else {
      const newH: AdminHadithItem = {
        id: `had-${Date.now()}`,
        text,
        reference,
        category,
        status: 'Active'
      };
      setList(prev => [newH, ...prev]);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Daily Prophetic Wisdom
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Hadith Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage authentic prophetic sayings featured on the daily spiritual reminder banner.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Hadith</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3">
        {list.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                <BookMarked className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {item.reference}
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed max-w-2xl">
                  "{item.text}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => openEdit(item)}
                className="h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="h-8 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Hadith' : 'Add Hadith'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Hadith English Translation *
                </label>
                <textarea
                  rows={3}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g. The best among you are those who learn the Qur'an..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Book & Number Reference *
                  </label>
                  <input
                    type="text"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Sahih al-Bukhari 5027"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Theme / Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Knowledge, Charity, Salah"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
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
                  Save Hadith
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
