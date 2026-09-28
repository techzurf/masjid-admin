import React, { useState } from 'react';
import { Video, Plus, Edit2, Trash2, Eye, X, Play, Clock, User, ExternalLink } from 'lucide-react';
import { AdminBayan } from '../mockAdminData';

interface AdminBayanScreenProps {
  bayans: AdminBayan[];
  onUpdateBayans: (updated: AdminBayan[]) => void;
  onShowToast: (msg: string) => void;
}

export const AdminBayanScreen: React.FC<AdminBayanScreenProps> = ({
  bayans,
  onUpdateBayans,
  onShowToast
}) => {
  const [list, setList] = useState<AdminBayan[]>(bayans);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<AdminBayan | null>(null);
  const [editingBayan, setEditingBayan] = useState<AdminBayan | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [desc, setDesc] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const openAddModal = () => {
    setEditingBayan(null);
    setTitle('');
    setSpeaker('Sheikh Dr. Abdullah Al-Rahman');
    setDesc('');
    setYoutubeUrl('https://www.youtube.com/watch?v=example');
    setThumbnail('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80');
    setModalOpen(true);
  };

  const openEditModal = (b: AdminBayan) => {
    setEditingBayan(b);
    setTitle(b.title);
    setSpeaker(b.speaker);
    setDesc(b.description);
    setYoutubeUrl(b.youtubeUrl);
    setThumbnail(b.thumbnail);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = list.filter(b => b.id !== id);
    setList(updated);
    onUpdateBayans(updated);
    onShowToast('Bayan removed.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBayan) {
      const updated = list.map(b => b.id === editingBayan.id ? {
        ...b,
        title,
        speaker,
        description: desc,
        youtubeUrl,
        thumbnail: thumbnail || b.thumbnail
      } : b);
      setList(updated);
      onUpdateBayans(updated);
      onShowToast(`Bayan "${title}" updated!`);
    } else {
      const newB: AdminBayan = {
        id: `byn-${Date.now()}`,
        title,
        speaker,
        description: desc,
        youtubeUrl,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80',
        date: 'Today',
        duration: '45:00',
        views: 0
      };
      const updated = [newB, ...list];
      setList(updated);
      onUpdateBayans(updated);
      onShowToast(`New Bayan published!`);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Islamic Lectures & Tafseer Media
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Bayan Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage audio/video Bayans and YouTube Friday sermons streamed inside the app.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Publish Bayan</span>
        </button>
      </div>

      {/* Bayans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((bayan) => (
          <div
            key={bayan.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all"
          >
            <div>
              {/* Thumbnail with duration badge */}
              <div className="w-full h-36 relative overflow-hidden bg-slate-900 group">
                <img
                  src={bayan.thumbnail}
                  alt={bayan.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setPreviewVideo(bayan)}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 text-[#087F5B] fill-[#087F5B]" />
                  </div>
                </button>
                <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                  {bayan.duration}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {bayan.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#087F5B] font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{bayan.speaker}</span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {bayan.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{bayan.date}</span>
                  <span className="text-emerald-700 font-bold">{bayan.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Actions: Edit, Delete, Preview */}
            <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewVideo(bayan)}
                className="text-xs font-bold text-[#087F5B] hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(bayan)}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#087F5B] transition-colors"
                  title="Edit bayan"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(bayan.id)}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete bayan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Bayan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingBayan ? 'Edit Bayan' : 'Add New Bayan'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Connect YouTube video to Masjid lecture catalog
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bayan Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Purification of the Heart in Salah"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Speaker *
                </label>
                <input
                  type="text"
                  required
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Sheikh Dr. Abdullah Al-Rahman"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  YouTube Video URL *
                </label>
                <input
                  type="url"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Summary of topics covered..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
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
                  Publish Bayan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[280px]">
                {previewVideo.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-video rounded-2xl bg-black overflow-hidden relative flex items-center justify-center">
              <img
                src={previewVideo.thumbnail}
                alt={previewVideo.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 ml-0.5 fill-white" />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 font-medium leading-relaxed">
              {previewVideo.description}
            </div>

            <button
              type="button"
              onClick={() => setPreviewVideo(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-700"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
