import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, QrCode, Building, Save, ExternalLink, Info, Check, Sparkles } from 'lucide-react';
import { AdminDonationSettings } from '../mockAdminData';

interface AdminDonationScreenProps {
  settings: AdminDonationSettings;
  onSaveSettings: (updated: AdminDonationSettings) => void;
  onPreviewDonationPage: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminDonationScreen: React.FC<AdminDonationScreenProps> = ({
  settings,
  onSaveSettings,
  onPreviewDonationPage,
  onShowToast
}) => {
  const [form, setForm] = useState<AdminDonationSettings>({ ...settings });

  const handlePurposeToggle = (id: string) => {
    setForm(prev => ({
      ...prev,
      purposes: prev.purposes.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onShowToast('Donation details and purposes saved successfully!');
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Zero-Gateway Direct Transfer
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Donation Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure official UPI ID, QR Code parameters, and Bank account details shown to donors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onPreviewDonationPage}
            className="h-11 px-4 rounded-2xl bg-[#E8F7F1] hover:bg-[#d5f2e6] text-[#087F5B] font-bold text-xs flex items-center gap-1.5 transition-all border border-emerald-300/60 cursor-pointer"
          >
            <span>Preview Donation Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Critical Zero-Gateway Direct Message Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-[#E8F7F1] to-teal-50 border border-emerald-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#087F5B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-[#FDE68A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-emerald-950">
                Direct Masjid Donation
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                100% Direct
              </span>
            </div>
            <p className="text-xs text-emerald-900/90 font-medium mt-0.5 leading-relaxed">
              No payment gateway required. Donations are made directly to the Masjid’s official UPI or Bank Account. The app never processes or holds any funds.
            </p>
          </div>
        </div>
      </div>

      {/* Form Grid: UPI + Bank Details */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* UPI Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">UPI & QR Configuration</h3>
              <span className="text-[11px] text-slate-500">Instant direct payments via UPI apps</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Official Masjid UPI ID *
            </label>
            <input
              type="text"
              required
              value={form.upiId}
              onChange={(e) => setForm({ ...form, upiId: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Example: masjidmkbnagar@upi (Verified VPA)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Dynamic QR Code Engine</span>
              <span className="text-[11px] text-slate-500">Encodes donation amounts automatically</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>
        </div>

        {/* Bank Account Details Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col gap-3.5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bank Transfer Details</h3>
              <span className="text-[11px] text-slate-500">For direct NEFT, RTGS & IMPS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Account Name
              </label>
              <input
                type="text"
                required
                value={form.accountName}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Bank Name
              </label>
              <input
                type="text"
                required
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Account Number
              </label>
              <input
                type="text"
                required
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                required
                value={form.ifsc}
                onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Branch Name
            </label>
            <input
              type="text"
              required
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>
        </div>

        {/* Donation Purposes Management (Full Width) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Donation Purposes</h3>
              <p className="text-[11px] text-slate-500">Enable or disable cause categories shown on the user donation screen</p>
            </div>
            <span className="text-[10px] font-bold text-[#087F5B] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {form.purposes.filter(p => p.enabled).length} Active Causes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {form.purposes.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {p.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    {p.description}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={() => handlePurposeToggle(p.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#087F5B]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

      </form>

    </div>
  );
};
