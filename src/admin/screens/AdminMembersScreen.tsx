import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  X, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  FileText,
  UserCheck
} from 'lucide-react';
import { 
  CommunityMember, 
  fetchCommunityMembers, 
  updateCommunityMember, 
  deleteCommunityMember 
} from '../../lib/supabase';
import { PullToRefresh } from '../../components/common/PullToRefresh';

interface AdminMembersScreenProps {
  onShowToast?: (message: string) => void;
}

export const AdminMembersScreen: React.FC<AdminMembersScreenProps> = ({ onShowToast }) => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Brother' | 'Sister'>('All');
  const [search, setSearch] = useState('');
  
  // Selected Member for View / Edit Modal
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Edit Form Fields
  const [editFullName, setEditFullName] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState<'Brother' | 'Sister' | ''>('');
  const [editDob, setEditDob] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load Members directly from Supabase
  const loadMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchCommunityMembers();
      if (res.error) {
        setError(res.error);
        if (onShowToast) onShowToast(`Error: ${res.error}`);
      } else {
        setMembers(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load members:', err);
      setError(err?.message || 'Failed to connect to Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // When a member is clicked, populate details
  const handleSelectMember = (m: CommunityMember) => {
    setSelectedMember(m);
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setSaveError(null);
    setEditFullName(m.full_name || '');
    setEditMobile(m.mobile_number || '');
    setEditEmail(m.email || '');
    setEditGender((m.gender as any) || '');
    setEditDob(m.date_of_birth || '');
    setEditAddress(m.address || '');
    setEditNotes(m.notes || '');
  };

  // Save changes to Supabase
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    if (!editFullName.trim()) {
      setSaveError('Full Name is required.');
      return;
    }
    if (!editMobile.trim()) {
      setSaveError('Mobile Number is required.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const updates = {
        full_name: editFullName.trim(),
        mobile_number: editMobile.trim(),
        gender: editGender || null,
        date_of_birth: editDob || null,
        address: editAddress.trim() || null,
        notes: editNotes.trim() || null,
        email: editEmail.trim() || null,
      };

      const res = await updateCommunityMember(selectedMember.id, updates);
      if (res.error) {
        setSaveError(`Update failed: ${res.error}`);
        if (onShowToast) onShowToast(`Error: ${res.error}`);
      } else if (res.data) {
        const updated = res.data;
        setSelectedMember(updated);
        setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
        setIsEditing(false);
        if (onShowToast) onShowToast('Member record updated in Supabase');
      }
    } catch (err: any) {
      console.error('Failed to update member:', err);
      setSaveError(err?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Member from Supabase
  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    setIsDeleting(true);
    try {
      const res = await deleteCommunityMember(selectedMember.id);
      if (res.error) {
        setSaveError(`Delete failed: ${res.error}`);
        if (onShowToast) onShowToast(`Error: ${res.error}`);
      } else {
        setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
        setSelectedMember(null);
        setShowDeleteConfirm(false);
        if (onShowToast) onShowToast('Registration deleted successfully');
      }
    } catch (err: any) {
      console.error('Failed to delete member:', err);
      setSaveError(err?.message || 'Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search
  const filtered = members.filter(m => {
    const matchesFilter = filter === 'All' ? true : m.gender === filter;
    const q = search.toLowerCase();
    const matchesSearch = 
      (m.full_name && m.full_name.toLowerCase().includes(q)) || 
      (m.mobile_number && m.mobile_number.includes(q)) || 
      (m.address && m.address.toLowerCase().includes(q)) ||
      (m.notes && m.notes.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.id && m.id.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <PullToRefresh onRefresh={loadMembers} containerId="admin-main-scroll">
      <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Community Directory · Supabase Live
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Members Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Registered Muslim community members and public registrations for Madina Masjid MKB Nagar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#087F5B] bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            Total: {members.length} Registered
          </span>

          {/* Refresh / Reload Button */}
          <button
            type="button"
            onClick={loadMembers}
            disabled={isLoading}
            className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-700 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Connection & Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-700 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Supabase:</span>
            <span className="font-bold text-emerald-900">Connected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Table:</span>
            <span className="font-mono font-bold text-slate-800">community_members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Data Source:</span>
            <span className="font-bold text-emerald-800">Live Supabase</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Failed to load from Supabase</h4>
              <p className="mt-0.5 font-medium">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadMembers}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile, address, notes..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          {(['All', 'Brother', 'Sister'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid / List */}
      {isLoading ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200/90 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-[#087F5B]" />
          <span className="text-xs font-semibold">Loading community registrations from Supabase...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="w-full py-16 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200/90 text-slate-400 text-center px-4">
          <Users className="w-10 h-10 text-slate-300 stroke-[1.5]" />
          <h3 className="text-sm font-bold text-slate-700">No community registrations found</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {search || filter !== 'All' 
              ? 'No members match the current search filter.' 
              : 'Community members who register via the public registration screen will appear here dynamically.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((m) => {
            const initials = m.full_name
              ? m.full_name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
              : 'MM';
            
            const regDateFormatted = m.created_at
              ? new Date(m.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : '—';

            return (
              <div
                key={m.id}
                onClick={() => handleSelectMember(m)}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#087F5B]/50 hover:shadow-xs transition-all cursor-pointer flex flex-col gap-3 group"
              >
                {/* Top Row: Avatar, Name, Gender, Date */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-[#087F5B] font-bold text-xs flex items-center justify-center shrink-0 transition-colors">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {m.full_name}
                        </h3>
                        {m.gender && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.gender === 'Brother' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {m.gender}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {m.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Registered</span>
                    <span className="text-xs font-bold text-slate-700">{regDateFormatted}</span>
                  </div>
                </div>

                {/* Middle Row: Contact & DOB */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{m.mobile_number}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{m.date_of_birth || 'DOB: Not set'}</span>
                  </div>
                </div>

                {/* Bottom Row: Email, Address & Notes preview */}
                <div className="flex flex-col gap-1 text-xs text-slate-500">
                  {m.email && (
                    <div className="flex items-center gap-1.5 truncate text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>
                  )}
                  {m.address && (
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{m.address}</span>
                    </div>
                  )}
                  {m.notes && (
                    <div className="flex items-start gap-1.5 line-clamp-1 text-slate-400 italic">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{m.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Member Details & Edit Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-[#087F5B] font-bold text-sm flex items-center justify-center">
                  {selectedMember.full_name
                    ? selectedMember.full_name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                    : 'MM'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMember.full_name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">ID: {selectedMember.id}</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setSelectedMember(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error in modal if any */}
            {saveError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-semibold">{saveError}</span>
              </div>
            )}

            {/* Delete Confirmation Warning */}
            {showDeleteConfirm ? (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs flex flex-col gap-3">
                <div className="flex items-start gap-2 text-rose-900">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-rose-950">Confirm Deletion</h4>
                    <p className="mt-1 text-rose-900">
                      Are you sure you want to permanently delete the registration for <strong>{selectedMember.full_name}</strong>? This action cannot be undone in Supabase.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-200">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteMember}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Record'}</span>
                  </button>
                </div>
              </div>
            ) : isEditing ? (
              /* ─── EDIT FORM VIEW ─── */
              <form onSubmit={handleSaveEdit} className="flex flex-col gap-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={editMobile}
                      onChange={(e) => setEditMobile(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gender</label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 font-medium text-slate-900 bg-white"
                    >
                      <option value="">Not Specified</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-slate-300 font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Notes</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setSaveError(null); }}
                    disabled={isSaving}
                    className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 px-5 rounded-xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{isSaving ? 'Saving to Supabase...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* ─── READ-ONLY VIEW ─── */
              <>
                <div className="space-y-2.5 text-xs text-slate-700 divide-y divide-slate-100">
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Full Name:
                    </span>
                    <span className="font-bold text-slate-900">{selectedMember.full_name}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Mobile Number:
                    </span>
                    <span className="font-bold text-slate-900 font-mono">{selectedMember.mobile_number}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Gender:</span>
                    <span className="font-bold text-slate-900">{selectedMember.gender || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Date of Birth:
                    </span>
                    <span className="font-medium text-slate-900">{selectedMember.date_of_birth || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address:
                    </span>
                    <span className="font-medium text-slate-900">{selectedMember.email || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Residential Address:
                    </span>
                    <span className="font-medium text-slate-900 text-right max-w-[240px]">
                      {selectedMember.address || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-start pt-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Special Notes:
                    </span>
                    <span className="font-medium text-slate-900 text-right max-w-[240px]">
                      {selectedMember.notes || '—'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Registration Date:
                    </span>
                    <span className="font-bold text-slate-900">
                      {selectedMember.created_at ? new Date(selectedMember.created_at).toLocaleString() : '—'}
                    </span>
                  </div>

                  {selectedMember.updated_at && (
                    <div className="flex justify-between items-center pt-2 text-slate-400 text-[11px]">
                      <span>Last Updated:</span>
                      <span>{new Date(selectedMember.updated_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-11 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Delete</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedMember(null)}
                      className="h-11 px-4 rounded-xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs cursor-pointer"
                    >
                      Close Record
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      </div>
    </PullToRefresh>
  );
};
