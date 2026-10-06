import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Image as ImageIcon,
  CheckCircle2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  MasjidNotice, 
  fetchAllNoticesAdmin, 
  createMasjidNotice, 
  updateMasjidNotice, 
  deleteMasjidNotice,
  getNoticeTimeAgo 
} from '../../lib/supabase';
import { PullToRefresh } from '../../components/common/PullToRefresh';

interface AdminNoticesScreenProps {
  notices?: any[];
  onUpdateNotices?: (updated: any[]) => void;
  onShowToast: (msg: string) => void;
}

const PRESET_CATEGORIES = [
  "Friday Jumu'ah",
  "Important Notice",
  "Prayer Advisory",
  "Event Announcement",
  "Community Notice",
  "Maintenance Alert",
  "Ramadan Update"
];

export const AdminNoticesScreen: React.FC<AdminNoticesScreenProps> = ({
  onShowToast
}) => {
  const [list, setList] = useState<MasjidNotice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<MasjidNotice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation
  const [deleteConfirmNotice, setDeleteConfirmNotice] = useState<MasjidNotice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formCategory, setFormCategory] = useState("Friday Jumu'ah");
  const [customCategory, setCustomCategory] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formPriority, setFormPriority] = useState<number>(0);

  // Load notices from Supabase
  const loadNotices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAllNoticesAdmin();
      if (res.error) {
        setError(res.error);
        onShowToast(`Error: ${res.error}`);
      } else {
        setList(res.data);
      }
    } catch (err: any) {
      console.warn('Notice fetch exception:', err?.message);
      setError(err?.message || 'Failed to connect');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormTitle('');
    setFormMessage('');
    setFormCategory("Friday Jumu'ah");
    setCustomCategory('');
    setFormImageUrl('');
    setFormIsActive(true);
    setFormPriority(0);
    setModalOpen(true);
  };

  const openEditModal = (notice: MasjidNotice) => {
    setEditingNotice(notice);
    setFormTitle(notice.title);
    setFormMessage(notice.message);
    if (PRESET_CATEGORIES.includes(notice.category)) {
      setFormCategory(notice.category);
      setCustomCategory('');
    } else {
      setFormCategory('Other');
      setCustomCategory(notice.category || '');
    }
    setFormImageUrl(notice.image_url || '');
    setFormIsActive(notice.is_active);
    setFormPriority(notice.priority || 0);
    setModalOpen(true);
  };

  // Quick toggle active/inactive
  const handleToggleActive = async (notice: MasjidNotice) => {
    const updatedStatus = !notice.is_active;
    const res = await updateMasjidNotice(notice.id, { is_active: updatedStatus });
    if (res.error) {
      onShowToast(`Failed to update status: ${res.error}`);
    } else if (res.data) {
      setList(prev => prev.map(n => n.id === notice.id ? res.data! : n));
      onShowToast(updatedStatus ? 'Notice activated on Home screen!' : 'Notice deactivated.');
    }
  };

  // Delete notice from Supabase
  const handleDeleteNotice = async () => {
    if (!deleteConfirmNotice) return;
    setIsDeleting(true);
    try {
      const res = await deleteMasjidNotice(deleteConfirmNotice.id);
      if (res.error) {
        onShowToast(`Delete failed: ${res.error}`);
      } else {
        setList(prev => prev.filter(n => n.id !== deleteConfirmNotice.id));
        setDeleteConfirmNotice(null);
        onShowToast('Notice removed successfully.');
      }
    } catch (err: any) {
      onShowToast(`Error: ${err?.message || 'Failed to delete'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Form Submit (Create or Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Notice title is required.');
      return;
    }
    if (!formMessage.trim()) {
      onShowToast('Notice message is required.');
      return;
    }

    const finalCategory = formCategory === 'Other' 
      ? (customCategory.trim() || 'Important Notice') 
      : formCategory;

    setIsSubmitting(true);

    try {
      if (editingNotice) {
        const res = await updateMasjidNotice(editingNotice.id, {
          title: formTitle,
          message: formMessage,
          category: finalCategory,
          image_url: formImageUrl,
          is_active: formIsActive,
          priority: formPriority
        });

        if (res.error) {
          onShowToast(`Update failed: ${res.error}`);
        } else if (res.data) {
          setList(prev => prev.map(n => n.id === editingNotice.id ? res.data! : n));
          onShowToast('Notice updated successfully in Supabase!');
          setModalOpen(false);
        }
      } else {
        const res = await createMasjidNotice({
          title: formTitle,
          message: formMessage,
          category: finalCategory,
          image_url: formImageUrl,
          is_active: formIsActive,
          priority: formPriority
        });

        if (res.error) {
          onShowToast(`Publish failed: ${res.error}`);
        } else if (res.data) {
          setList(prev => [res.data!, ...prev]);
          onShowToast('New notice published live to Masjid App!');
          setModalOpen(false);
        }
      }
    } catch (err: any) {
      onShowToast(`Error: ${err?.message || 'Submission failed'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PullToRefresh onRefresh={loadNotices} containerId="admin-main-scroll">
      <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Announcements & Alerts · Supabase Live
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Notices Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Create urgent announcements and parking or prayer advisories displayed dynamically in the app notice card.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadNotices}
            disabled={isLoading}
            className="h-11 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Add Notice Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Notice</span>
          </button>
        </div>
      </div>

      {/* Connection & Table Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-emerald-200/90 bg-emerald-50/70 text-slate-700 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Database:</span>
            <span className="font-bold text-emerald-900">Supabase Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Table:</span>
            <span className="font-mono font-bold text-slate-800">public.masjid_notices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Total:</span>
            <span className="font-bold text-slate-900">{list.length} Notices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Active on Home:</span>
            <span className="font-bold text-emerald-800">{list.filter(n => n.is_active).length} Active</span>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Failed to load notices from Supabase</h4>
              <p className="mt-0.5 font-medium">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadNotices}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Notices Cards List */}
      {isLoading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200/90 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-[#087F5B]" />
          <span className="text-xs font-semibold">Loading notices from Supabase...</span>
        </div>
      ) : list.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200/90 text-slate-400 text-center px-4">
          <Bell className="w-10 h-10 text-slate-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-slate-700">No notices in Supabase</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Click "+ Add Notice" to publish your first announcement to the home screen notice card.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {list.map((notice) => {
            const isHigh = notice.priority >= 2;
            const isMed = notice.priority === 1;

            return (
              <div
                key={notice.id}
                className={`p-4 sm:p-5 rounded-3xl bg-white border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  notice.is_active ? 'border-slate-200/90 hover:border-slate-300' : 'border-slate-200/60 opacity-70 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isHigh 
                      ? 'bg-rose-50 text-rose-600' 
                      : isMed 
                      ? 'bg-amber-50 text-amber-600' 
                      : 'bg-emerald-50 text-[#087F5B]'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {notice.category}
                      </span>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                        {notice.title}
                      </h3>

                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800'
                          : isMed
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isHigh ? 'High Priority' : isMed ? 'Medium Priority' : 'Normal Priority'}
                      </span>

                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        notice.is_active
                          ? 'bg-emerald-100 text-[#087F5B]'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {notice.is_active ? 'Active on Home' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl line-clamp-2">
                      {notice.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium mt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Posted {getNoticeTimeAgo(notice.created_at)}</span>
                      </div>

                      {notice.image_url && (
                        <div className="flex items-center gap-1 text-slate-500 font-semibold">
                          <ImageIcon className="w-3.5 h-3.5 text-[#087F5B]" />
                          <span>Image Attached</span>
                        </div>
                      )}

                      <span className="text-slate-300">•</span>
                      <span className="font-mono text-[10px] text-slate-400">ID: {notice.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Toggle Active, Edit, Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Quick Toggle Active Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(notice)}
                    className={`h-9 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      notice.is_active 
                        ? 'bg-emerald-50 text-[#087F5B] border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title={notice.is_active ? 'Click to Deactivate' : 'Click to Activate'}
                  >
                    {notice.is_active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{notice.is_active ? 'Active' : 'Deactivated'}</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => openEditModal(notice)}
                    className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmNotice(notice)}
                    className="h-9 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Notice?</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Are you sure you want to permanently delete <strong>"{deleteConfirmNotice.title}"</strong> from Supabase? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmNotice(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteNotice}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Notice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Notice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Publish to the user-facing Masjid App home screen banner
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3.5">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notice Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] bg-white cursor-pointer"
                >
                  {PRESET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Other">Custom Category...</option>
                </select>

                {formCategory === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name"
                    className="w-full h-10 px-3.5 mt-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                )}
              </div>

              {/* Notice Title */}
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

              {/* Message */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Notice Message / Advisory *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Due to road maintenance on 3rd Main Road, please use the M.K.B. Nagar side entrance..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              {/* Image URL (Optional) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://example.com/parking-map.jpg"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              {/* Priority and Active Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(parseInt(e.target.value, 10))}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] bg-white cursor-pointer"
                  >
                    <option value={0}>Normal (Priority 0)</option>
                    <option value={1}>Medium (Priority 1)</option>
                    <option value={2}>High / Urgent (Priority 2)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Display Status
                  </label>
                  <select
                    value={formIsActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormIsActive(e.target.value === 'active')}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B] bg-white cursor-pointer"
                  >
                    <option value="active">Active (Show on Home)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                  className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#066347] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingNotice ? 'Save Notice' : 'Publish Notice'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </PullToRefresh>
  );
};
