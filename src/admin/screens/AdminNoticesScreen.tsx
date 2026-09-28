import React, { useState } from 'react';
import { Bell, Plus, Edit2, Trash2, X, Check, AlertCircle, Clock, Send } from 'lucide-react';
import { AdminNotice } from '../mockAdminData';

interface AdminNoticesScreenProps {
  notices: AdminNotice[];
  onUpdateNotices: (updated: AdminNotice[]) => void;
  onShowToast: (msg: string) => void;
}

export const AdminNoticesScreen: React.FC<AdminNoticesScreenProps> = ({
  notices,
  onUpdateNotices,
  onShowToast
}) => {
  const [list, setList] = useState<AdminNotice[]>(notices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<AdminNotice | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState<'High' | 'Medium' | 'Normal'>('Normal');
  const [formStatus, setFormStatus] = useState<'Active' | 'Scheduled' | 'Draft'>('Active');

  const openAddModal = () => {
    setEditingNotice(null);
    setFormTitle('');
    setFormDesc('');
    setFormPriority('Normal');
    setFormStatus('Active');
    setModalOpen(true);
  };

  const openEditModal = (notice: AdminNotice) => {
    setEditingNotice(notice);
    setFormTitle(notice.title);
    setFormDesc(notice.description);
    setFormPriority(notice.priority);
    setFormStatus(notice.status);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = list.filter(n => n.id !== id);
    setList(updated);
    onUpdateNotices(updated);
    onShowToast('Notice removed successfully.');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingNotice) {
      const updated = list.map(n => n.id === editingNotice.id ? {
        ...n,
        title: formTitle,
        description: formDesc,
        priority: formPriority,
        status: formStatus
      } : n);
      setList(updated);
      onUpdateNotices(updated);
      onShowToast('Notice updated successfully!');
    } else {
      const newNotice: AdminNotice = {
        id: `not-${Date.now()}`,
        title: formTitle,
        description: formDesc,
        date: 'Just now',
        priority: formPriority,
        status: formStatus
      };
      const updated = [newNotice, ...list];
      setList(updated);
      onUpdateNotices(updated);
      onShowToast('New notice published to Masjid App!');
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header with Title & Add Notice Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Announcements & Alerts
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Notices Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Create urgent announcements and parking or prayer advisories displayed in the app notice ticker.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Notice</span>
        </button>
      </div>

      {/* Notices Cards List */}
      <div className="grid grid-cols-1 gap-3">
        {list.map((notice) => (
          <div
            key={notice.id}
            className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                notice.priority === 'High' 
                  ? 'bg-rose-50 text-rose-600' 
                  : notice.priority === 'Medium' 
                  ? 'bg-amber-50 text-amber-600' 
                  : 'bg-emerald-50 text-[#087F5B]'
              }`}>
                <Bell className="w-5 h-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {notice.title}
                  </h3>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    notice.priority === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : notice.priority === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {notice.priority} Priority
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    notice.status === 'Active'
                      ? 'bg-emerald-100 text-[#087F5B]'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {notice.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {notice.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Posted {notice.date}</span>
                </div>
              </div>
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => openEditModal(notice)}
                className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(notice.id)}
                className="h-9 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Publish to the user-facing Masjid App bulletin
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

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Friday Jumu'ah Parking Advisory"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description / Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Provide complete guidelines or details for worshippers..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Draft">Draft</option>
                  </select>
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
                  className="py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#066347] text-white text-xs font-bold shadow-sm"
                >
                  {editingNotice ? 'Save Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
