import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Mic, 
  BookOpen, 
  BookMarked, 
  Heart, 
  CalendarDays, 
  Coins, 
  CalendarCheck 
} from 'lucide-react';
import { RubElHizbIcon } from '../common/IslamicIcons';

export const HomeServicesGrid: React.FC = () => {
  const { 
    setOverlayScreen, 
    setActiveTab, 
    triggerHapticFeedback 
  } = useApp();

  const handleDonationClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('donation');
  };

  const handleBayanClick = () => {
    triggerHapticFeedback('light');
    const el = document.getElementById('latest-videos-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setOverlayScreen('notifications');
    }
  };

  const handleQuranClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('quran');
  };

  const handleHadithClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('quran');
  };

  const handleDuaClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('duas');
  };

  const handleCalendarClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('monthly_timetable');
  };

  const handleZakatClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('donation');
  };

  const handleEventsClick = () => {
    triggerHapticFeedback('light');
    setActiveTab('events');
    setOverlayScreen(null);
  };

  // Exactly 8 services in 2-column order:
  // Row 1: Donation, Bayan
  // Row 2: Quran, Hadith
  // Row 3: Dua, Islamic Calendar
  // Row 4: Zakat, Events
  const services = [
    {
      id: 'donation',
      title: 'Donation',
      subtitle: 'Donate to Masjid',
      icon: HeartHandshake,
      onClick: handleDonationClick,
      bgGradient: 'from-[#F0FDF4] via-white to-[#F2FBF6]',
      border: 'border-emerald-200/90',
      iconBg: 'bg-emerald-50',
      iconBorder: 'border-emerald-200/70',
      iconColor: 'text-[#087F5B]',
      watermarkColor: 'text-emerald-700',
      subtitleColor: 'text-emerald-800'
    },
    {
      id: 'bayan',
      title: 'Bayan',
      subtitle: 'Listen to Bayan',
      icon: Mic,
      onClick: handleBayanClick,
      bgGradient: 'from-[#F8FAFF] via-white to-[#F6F9FF]',
      border: 'border-blue-200/90',
      iconBg: 'bg-blue-50',
      iconBorder: 'border-blue-200/70',
      iconColor: 'text-[#2563EB]',
      watermarkColor: 'text-blue-700',
      subtitleColor: 'text-blue-800'
    },
    {
      id: 'quran',
      title: 'Quran',
      subtitle: 'Read Quran',
      icon: BookOpen,
      onClick: handleQuranClick,
      bgGradient: 'from-[#F0FDFA] via-white to-[#F8FCFB]',
      border: 'border-teal-200/90',
      iconBg: 'bg-teal-50',
      iconBorder: 'border-teal-200/70',
      iconColor: 'text-[#0D9488]',
      watermarkColor: 'text-teal-700',
      subtitleColor: 'text-teal-800'
    },
    {
      id: 'hadith',
      title: 'Hadith',
      subtitle: 'Daily Hadith',
      icon: BookMarked,
      onClick: handleHadithClick,
      bgGradient: 'from-[#FFFDF7] via-white to-[#FEFDF9]',
      border: 'border-amber-200/90',
      iconBg: 'bg-amber-50',
      iconBorder: 'border-amber-200/70',
      iconColor: 'text-[#D97706]',
      watermarkColor: 'text-amber-700',
      subtitleColor: 'text-amber-800'
    },
    {
      id: 'dua',
      title: 'Dua',
      subtitle: 'Daily Duas',
      icon: Heart,
      onClick: handleDuaClick,
      bgGradient: 'from-[#FFF1F2] via-white to-[#FFF5F5]',
      border: 'border-rose-200/90',
      iconBg: 'bg-rose-50',
      iconBorder: 'border-rose-200/70',
      iconColor: 'text-[#E11D48]',
      watermarkColor: 'text-rose-700',
      subtitleColor: 'text-rose-800'
    },
    {
      id: 'calendar',
      title: 'Islamic Calendar',
      subtitle: 'Hijri Calendar',
      icon: CalendarDays,
      onClick: handleCalendarClick,
      bgGradient: 'from-[#FAF5FF] via-white to-[#F9F5FF]',
      border: 'border-purple-200/90',
      iconBg: 'bg-purple-50',
      iconBorder: 'border-purple-200/70',
      iconColor: 'text-[#7C3AED]',
      watermarkColor: 'text-purple-700',
      subtitleColor: 'text-purple-800'
    },
    {
      id: 'zakat',
      title: 'Zakat',
      subtitle: 'Zakat Assistance',
      icon: Coins,
      onClick: handleZakatClick,
      bgGradient: 'from-[#F0FDF4] via-white to-[#FEFDF0]',
      border: 'border-emerald-300/80',
      iconBg: 'bg-emerald-50',
      iconBorder: 'border-emerald-200/70',
      iconColor: 'text-[#047857]',
      watermarkColor: 'text-emerald-700',
      subtitleColor: 'text-emerald-800'
    },
    {
      id: 'events',
      title: 'Events',
      subtitle: 'Masjid Events',
      icon: CalendarCheck,
      onClick: handleEventsClick,
      bgGradient: 'from-[#F0F9FF] via-white to-[#F4FAFF]',
      border: 'border-sky-200/90',
      iconBg: 'bg-sky-50',
      iconBorder: 'border-sky-200/70',
      iconColor: 'text-[#0284C7]',
      watermarkColor: 'text-sky-700',
      subtitleColor: 'text-sky-800'
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-2.5">
        {services.map((srv) => (
          <button
            key={srv.id}
            type="button"
            onClick={srv.onClick}
            className={`rounded-2xl p-2.5 bg-gradient-to-b ${srv.bgGradient} border ${srv.border} shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-2.5 text-left relative overflow-hidden active:scale-95 transition-all group cursor-pointer min-h-[58px]`}
          >
            {/* Subtle decorative Islamic watermark */}
            <div className={`absolute -right-3 -bottom-3 w-12 h-12 pointer-events-none opacity-[0.05] ${srv.watermarkColor}`}>
              <RubElHizbIcon className="w-full h-full" />
            </div>

            {/* Icon Container */}
            <div className={`w-9 h-9 rounded-xl ${srv.iconBg} border ${srv.iconBorder} flex items-center justify-center ${srv.iconColor} shrink-0 group-hover:scale-108 transition-all`}>
              <srv.icon className="w-4.5 h-4.5" />
            </div>

            {/* Text Information */}
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                {srv.title}
              </span>
              <span className={`text-[10px] font-medium block truncate mt-0.5 ${srv.subtitleColor}`}>
                {srv.subtitle}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
