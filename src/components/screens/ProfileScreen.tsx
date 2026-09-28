import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings as SettingsIcon, 
  Heart, 
  Calendar, 
  FileText, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  PackageSearch,
  Bell,
  HeartHandshake
} from 'lucide-react';
import { UserRegistration } from '../../types';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';

export const ProfileScreen: React.FC = () => {
  const { 
    userRegistrations, 
    duas, 
    setOverlayScreen, 
    settings,
    toggleSeniorMode
  } = useApp();

  const userProfile = {
    name: 'Brother Rayyan Mansoor',
    email: 'rayyan.m@example.com',
    memberId: 'MMM-8842',
    phone: '+91 98401 24100'
  };

  const savedDuas = duas.filter(d => d.isFavorite);
  const t = useTranslation(settings.language);

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-2 pb-8">
      {/* Profile Card Header */}
      <div className="w-full bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#087F5B] to-[#07543F] text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">
            AR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {userProfile.name}
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="text-xs text-slate-500 block">
              {userProfile.email}
            </span>
            <span className="text-[11px] font-mono font-bold text-[#087F5B] block mt-0.5">
              Member ID: {userProfile.memberId}
            </span>
          </div>
        </div>

        {/* User stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
          <div className="p-2 bg-blue-50/70 border border-blue-100/60 rounded-xl">
            <span className="text-sm font-extrabold text-[#3B6FD8] block">{userRegistrations.length}</span>
            <span className="text-[10px] text-slate-500">Registrations</span>
          </div>
          <div className="p-2 bg-rose-50/70 border border-rose-100/60 rounded-xl">
            <span className="text-sm font-extrabold text-[#E87961] block">{savedDuas.length}</span>
            <span className="text-[10px] text-slate-500">Saved Duas</span>
          </div>
          <div className="p-2 bg-emerald-50/70 border border-emerald-100/60 rounded-xl">
            <span className="text-sm font-extrabold text-[#087F5B] block">Active</span>
            <span className="text-[10px] text-slate-500">Status</span>
          </div>
        </div>
      </div>

      {/* My Registrations Section */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#087F5B]" />
            <span>My Active Registrations</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">{userRegistrations.length} Total</span>
        </div>

        <div className="space-y-2">
          {userRegistrations.map((reg: UserRegistration) => (
            <div 
              key={reg.id} 
              className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{reg.title}</span>
                <span className="text-[11px] text-slate-500">Submitted on {reg.date}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                reg.status === 'Confirmed' 
                  ? 'bg-emerald-50 text-[#087F5B] border-emerald-200' 
                  : 'bg-amber-50 text-[#B45309] border-amber-200'
              }`}>
                {reg.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Menu Links */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200/80 shadow-2xs divide-y divide-slate-100">
        <button
          onClick={() => setOverlayScreen('donation')}
          className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-xs font-semibold text-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-4 h-4 text-[#087F5B]" />
            <span>Support Your Masjid (Direct Donation)</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#087F5B]">Direct UPI</span>
        </button>

        <button
          onClick={() => setOverlayScreen('duas')}
          className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-xs font-semibold text-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-[#E87961]" />
            <span>Bookmarked Duas & Dhikr</span>
          </div>
          <span className="text-xs font-bold text-[#E87961]">{savedDuas.length}</span>
        </button>

        <button
          onClick={() => setOverlayScreen('lost_found')}
          className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-xs font-semibold text-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <PackageSearch className="w-4 h-4 text-[#E89B3C]" />
            <span>Masjid Lost & Found</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => setOverlayScreen('settings')}
          className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-xs font-semibold text-slate-800"
        >
          <div className="flex items-center gap-2.5">
            <SettingsIcon className="w-4 h-4 text-[#159A9C]" />
            <span>App Settings & Accessibility</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Senior Mode Quick Card for Elderly Care */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-amber-950">Senior Accessibility Mode</h4>
          <p className="text-[11px] text-amber-900/80 mt-0.5">Enlarges text and enhances touch target contrast.</p>
        </div>
        <button
          onClick={toggleSeniorMode}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            settings.seniorMode 
              ? 'bg-[#D4A72C] text-slate-950' 
              : 'bg-white border border-amber-300 text-amber-950'
          }`}
        >
          {settings.seniorMode ? 'Active' : 'Enable'}
        </button>
      </div>
    </div>
  );
};

