import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Coins, 
  Sparkles, 
  UserCheck, 
  BookOpen, 
  Users, 
  Package, 
  Briefcase, 
  Phone, 
  Mail, 
  ChevronRight, 
  X,
  FileCheck2,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { MOCK_SERVICES } from '../../data/mockData';
import { ServiceItem } from '../../types';
import { useTranslation } from '../../utils/translations';

export const ServicesScreen: React.FC = () => {
  const { 
    selectedService, 
    setSelectedService, 
    startRegistration, 
    setOverlayScreen, 
    settings 
  } = useApp();

  const t = useTranslation(settings.language);

  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Service theme mapping
  const serviceThemes: Record<string, { iconBg: string; iconColor: string; badgeBg: string; badgeText: string; accentColor: string; tintBorder: string }> = {
    'srv-1': { // Zakat Assistance Fund -> Teal
      iconBg: 'bg-[#F0FDFA]',
      iconColor: 'text-[#159A9C]',
      badgeBg: 'bg-[#F0FDFA]',
      badgeText: 'text-[#159A9C]',
      accentColor: '#159A9C',
      tintBorder: 'hover:border-[#159A9C]/40'
    },
    'srv-2': { // Funeral & Janazah -> Royal Blue
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#3B6FD8]',
      badgeBg: 'bg-[#EFF6FF]',
      badgeText: 'text-[#3B6FD8]',
      accentColor: '#3B6FD8',
      tintBorder: 'hover:border-[#3B6FD8]/40'
    },
    'srv-3': { // Islamic Marriage / Nikah -> Warm Gold
      iconBg: 'bg-[#FEFCE8]',
      iconColor: 'text-[#D4A72C]',
      badgeBg: 'bg-[#FEFCE8]',
      badgeText: 'text-[#B45309]',
      accentColor: '#D4A72C',
      tintBorder: 'hover:border-[#D4A72C]/40'
    },
    'srv-4': { // Pastoral Counseling -> Purple
      iconBg: 'bg-[#F5F3FF]',
      iconColor: 'text-[#7657C8]',
      badgeBg: 'bg-[#F5F3FF]',
      badgeText: 'text-[#7657C8]',
      accentColor: '#7657C8',
      tintBorder: 'hover:border-[#7657C8]/40'
    },
    'srv-5': { // Quran & Tajweed -> Emerald Green
      iconBg: 'bg-[#E8F7F1]',
      iconColor: 'text-[#087F5B]',
      badgeBg: 'bg-[#E8F7F1]',
      badgeText: 'text-[#087F5B]',
      accentColor: '#087F5B',
      tintBorder: 'hover:border-[#087F5B]/40'
    },
    'srv-6': { // Volunteer Services -> Orange
      iconBg: 'bg-[#FFF7ED]',
      iconColor: 'text-[#E89B3C]',
      badgeBg: 'bg-[#FFF7ED]',
      badgeText: 'text-[#C2410C]',
      accentColor: '#E89B3C',
      tintBorder: 'hover:border-[#E89B3C]/40'
    },
    'srv-7': { // Community Food Pantry -> Coral
      iconBg: 'bg-[#FFF1F2]',
      iconColor: 'text-[#E87961]',
      badgeBg: 'bg-[#FFF1F2]',
      badgeText: 'text-[#E87961]',
      accentColor: '#E87961',
      tintBorder: 'hover:border-[#E87961]/40'
    },
    'srv-8': { // Job & Career Assistance -> Sky Blue
      iconBg: 'bg-[#F0F9FF]',
      iconColor: 'text-[#4DA3E8]',
      badgeBg: 'bg-[#F0F9FF]',
      badgeText: 'text-[#0284C7]',
      accentColor: '#4DA3E8',
      tintBorder: 'hover:border-[#4DA3E8]/40'
    }
  };

  const getServiceTheme = (id: string) => serviceThemes[id] || serviceThemes['srv-5'];

  // Helper icon getter
  const getIcon = (name: string, colorClass = 'text-[#087F5B]') => {
    switch (name) {
      case 'Coins': return <Coins className={`w-5 h-5 ${colorClass}`} />;
      case 'HeartHandshake': return <HeartHandshake className={`w-5 h-5 ${colorClass}`} />;
      case 'Sparkles': return <Sparkles className={`w-5 h-5 ${colorClass}`} />;
      case 'UserCheck': return <UserCheck className={`w-5 h-5 ${colorClass}`} />;
      case 'BookOpen': return <BookOpen className={`w-5 h-5 ${colorClass}`} />;
      case 'Users': return <Users className={`w-5 h-5 ${colorClass}`} />;
      case 'Package': return <Package className={`w-5 h-5 ${colorClass}`} />;
      case 'Briefcase': return <Briefcase className={`w-5 h-5 ${colorClass}`} />;
      default: return <Sparkles className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  const handleOpen = (srv: ServiceItem) => {
    setActiveModalService(srv);
    setHasApplied(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Title */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
          Care & Welfare
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Masjid Community Services
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dedicated religious, social, and humanitarian aid provided by Madina Masjid MKB Nagar.
        </p>
      </div>

      {/* Direct Masjid Donation Strip */}
      <div 
        onClick={() => setOverlayScreen('donation')}
        className="w-full p-3 rounded-2xl bg-[#E8F7F1] border border-emerald-600/25 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all hover:bg-emerald-100/70"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#087F5B] text-white flex items-center justify-center shrink-0">
            <Coins className="w-4 h-4 text-[#FDE68A]" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Support Masjid MKB Nagar & Welfare
            </div>
            <div className="text-[11px] text-emerald-800 font-medium">
              100% Direct UPI & Bank Donation • No Gateway
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-[#087F5B] shrink-0" />
      </div>

      {/* Services Grid (Clean 2-column or list rows with visually diverse cards) */}
      <div className="grid grid-cols-1 gap-2.5">
        {MOCK_SERVICES.map(srv => {
          const theme = getServiceTheme(srv.id);
          return (
            <div
              key={srv.id}
              onClick={() => handleOpen(srv)}
              className={`w-full bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs ${theme.tintBorder} cursor-pointer flex items-start gap-3.5 transition-all active:scale-[0.99]`}
            >
              <div className={`w-11 h-11 rounded-2xl ${theme.iconBg} border border-slate-100 flex items-center justify-center shrink-0`}>
                {getIcon(srv.iconName, theme.iconColor)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {srv.category}
                  </span>
                  {srv.badge && (
                    <span className={`text-[10px] font-bold ${theme.badgeBg} ${theme.badgeText} px-2 py-0.5 rounded-full`}>
                      {srv.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                  {srv.title}
                </h3>

                <p className="text-[12px] text-slate-600 line-clamp-2 leading-relaxed">
                  {srv.shortDesc}
                </p>

                <div 
                  className="mt-2 text-xs font-bold flex items-center gap-1"
                  style={{ color: theme.accentColor }}
                >
                  <span>View Details & Apply</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connect Muslim Banner Bridge */}
      <div 
        onClick={() => setOverlayScreen('connect_muslim')}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#0F2942] via-[#16353C] to-[#07543F] text-white flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-xs border border-slate-700/30"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4A72C]">
            Wider Network
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Looking for Muslim Jobs or Businesses?
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Explore the Connect Muslim Services Ecosystem →
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0 ml-2">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Service Detail Modal Sheet */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center max-w-[430px] mx-auto animate-in fade-in">
          <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${getServiceTheme(activeModalService.id).iconBg} border border-slate-100 flex items-center justify-center`}>
                  {getIcon(activeModalService.iconName, getServiceTheme(activeModalService.id).iconColor)}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {activeModalService.category}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {activeModalService.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveModalService(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 -mr-2 -mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Overview
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeModalService.fullDesc}
              </p>
            </div>

            {/* Requirements Checklist */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Requirements & Documentation
              </h4>
              <div className="space-y-1.5">
                {activeModalService.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 text-xs text-slate-700">
                    <FileCheck2 className="w-4 h-4 text-[#087F5B] shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Person Card */}
            <div className="mb-5 p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-[#087F5B] block mb-1">
                Direct Contact & Support
              </span>
              <div className="text-xs font-bold text-slate-900 mb-1">
                {activeModalService.contactPerson}
              </div>
              <div className="flex flex-col gap-1 text-xs text-slate-600">
                <a href={`tel:${activeModalService.contactPhone}`} className="flex items-center gap-1.5 hover:text-[#087F5B]">
                  <Phone className="w-3.5 h-3.5 text-[#087F5B]" />
                  <span>{activeModalService.contactPhone}</span>
                </a>
                <a href={`mailto:${activeModalService.contactEmail}`} className="flex items-center gap-1.5 hover:text-[#087F5B]">
                  <Mail className="w-3.5 h-3.5 text-[#087F5B]" />
                  <span>{activeModalService.contactEmail}</span>
                </a>
              </div>
            </div>

            {/* Application action */}
            {hasApplied ? (
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-center text-xs font-bold">
                ✓ Inquiry submitted! A coordinator will contact you within 24 hours.
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveModalService(null);
                  startRegistration('Service');
                }}
                className="w-full py-3.5 rounded-2xl bg-[#087F5B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all"
              >
                <span>Apply / Register for this Service</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
