import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  HeartHandshake, 
  Bell, 
  Clock, 
  Palette, 
  User, 
  Info, 
  ChevronRight, 
  Save, 
  ShieldCheck, 
  LogOut,
  Moon,
  Smartphone
} from 'lucide-react';
import { AdminScreenType } from '../components/AdminSidebar';

interface AdminSettingsScreenProps {
  onNavigate: (screen: AdminScreenType) => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminSettingsScreen: React.FC<AdminSettingsScreenProps> = ({
  onNavigate,
  onLogout,
  onShowToast
}) => {
  const [adminName, setAdminName] = useState('Imam Council & Board');
  const [adminEmail, setAdminEmail] = useState('admin@madinamasjid.org');
  const [autoNotifyAdhan, setAutoNotifyAdhan] = useState(true);
  const [darkModeBanner, setDarkModeBanner] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Admin credentials and preferences updated!');
  };

  const sections = [
    {
      title: 'Masjid Profile',
      desc: 'Name, address, contact numbers & imams',
      icon: Building2,
      color: 'text-[#087F5B]',
      bg: 'bg-emerald-50',
      action: () => onNavigate('profile')
    },
    {
      title: 'Donation Settings',
      desc: 'UPI ID, QR code and direct bank transfer details',
      icon: HeartHandshake,
      color: 'text-[#0D9488]',
      bg: 'bg-teal-50',
      action: () => onNavigate('donations')
    },
    {
      title: 'Prayer Settings',
      desc: 'Daily prayer times, Athan offsets & Jama\'ah schedules',
      icon: Clock,
      color: 'text-[#2563EB]',
      bg: 'bg-blue-50',
      action: () => onNavigate('prayers')
    },
    {
      title: 'Notification Settings',
      desc: 'Push notification sound triggers and audience groups',
      icon: Bell,
      color: 'text-[#D97706]',
      bg: 'bg-amber-50',
      action: () => onNavigate('notifications')
    }
  ];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            System Configuration
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure administrative credentials, direct payment settings, and system-wide app behaviors.
          </p>
        </div>
      </div>

      {/* Quick Navigation Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={sec.action}
              className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#087F5B]/50 hover:shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-2xl ${sec.bg} ${sec.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate">
                    {sec.title}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
                    {sec.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Admin Profile Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Administrator Account</h3>
            <span className="text-[11px] text-slate-500">Security credentials for the Masjid board</span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Admin Name
            </label>
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Admin Login Email
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div className="sm:col-span-2 pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Role: <strong>Super Administrator</strong> (Full Access)
            </span>
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-[#087F5B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* App Appearance & About Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">About Masjid Admin</h3>
            <span className="text-[11px] text-slate-500">Version 2.4.0 • Build 2026.09</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          The Masjid Admin portal enables local mosque committees to manage prayer schedules, emergency parking broadcasts, Islamic lectures, and direct UPI donations without relying on third-party commercial payment gateways.
        </p>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onLogout}
            className="h-10 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from Admin</span>
          </button>
        </div>
      </div>

    </div>
  );
};
