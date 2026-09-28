import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Compass, 
  LayoutGrid, 
  MapPin, 
  UserPlus, 
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Mic,
  BookOpen,
  BookMarked,
  Heart,
  CalendarDays,
  Coins,
  CalendarCheck
} from 'lucide-react';
import { KaabaIcon, TasbeehBeadsIcon, MosqueIcon, RubElHizbIcon } from '../common/IslamicIcons';

export const QuickActions: React.FC = () => {
  const { 
    setOverlayScreen, 
    setActiveTab, 
    startRegistration, 
    triggerHapticFeedback 
  } = useApp();

  const [isExpanded, setIsExpanded] = React.useState(false);

  const locatorVideoRef = React.useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = React.useState(false);

  React.useEffect(() => {
    if (locatorVideoRef.current) {
      locatorVideoRef.current.defaultMuted = true;
      locatorVideoRef.current.muted = true;
      const playPromise = locatorVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (locatorVideoRef.current) {
            locatorVideoRef.current.muted = true;
            locatorVideoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, []);

  const handleRegisterClick = () => {
    triggerHapticFeedback('light');
    startRegistration('New Member');
  };

  const handleQiblaClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('qibla');
  };

  const handleTasbeehClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('tasbeeh');
  };

  const handleServicesClick = () => {
    triggerHapticFeedback('light');
    setActiveTab('services');
    setOverlayScreen(null);
  };

  const handleLocatorClick = () => {
    triggerHapticFeedback('light');
    setOverlayScreen('locator');
  };

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

  const additionalServices = [
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
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-3.5 bg-teal-600 rounded-full" />
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase">
            Quick Services
          </h2>
        </div>
        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback('light');
            setIsExpanded(!isExpanded);
          }}
          className="text-[11px] font-bold text-teal-700 hover:text-teal-900 active:scale-95 transition-all cursor-pointer py-0.5 px-2 rounded-lg hover:bg-teal-50 flex items-center gap-1"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Less ↑' : 'More →'}</span>
        </button>
      </div>

      {/* Asymmetric 5-Service Grid inspired by quick-commerce reference */}
      <div className="grid grid-cols-5 gap-2.5 items-stretch">
        
        {/* 1. Large Featured Tile (Left): Masjid Locator with Full Video Visual Content (No Text Overlays) */}
        <button
          onClick={handleLocatorClick}
          className="col-span-2 h-full min-h-[200px] rounded-2xl p-3 border border-teal-500/30 shadow-[0_4px_16px_rgba(21,154,156,0.12)] flex flex-col justify-end text-left relative overflow-hidden active:scale-[0.98] transition-all group cursor-pointer bg-slate-950"
        >
          {/* Entire Tile Visual Area: Full-Bleed Cloudinary MP4 Video */}
          {!videoError ? (
            <>
              <video
                ref={locatorVideoRef}
                src="https://res.cloudinary.com/dv16a8l1l/video/upload/v1790315339/Find_qudead.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                onError={() => setVideoError(true)}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
              />
              {/* Subtle bottom gradient to ensure the View Map button remains crisp */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-0" />
            </>
          ) : (
            <>
              {/* Fallback to original geometric illustration if video fails to load */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#F0FDFA] via-[#F8FCFB] to-white pointer-events-none" />
              <div className="absolute -right-6 -top-6 w-28 h-28 pointer-events-none opacity-[0.06] text-teal-800">
                <RubElHizbIcon className="w-full h-full" />
              </div>
              <div className="absolute -left-6 -bottom-6 w-24 h-24 pointer-events-none opacity-[0.04] text-emerald-800">
                <MosqueIcon className="w-full h-full" />
              </div>
              <div className="relative z-10 my-auto py-2 flex items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-teal-200/35 blur-md transform scale-90" />
                  <svg viewBox="0 0 80 80" className="w-full h-full relative z-10" fill="none">
                    <circle cx="40" cy="40" r="34" stroke="#159A9C" strokeWidth="1" strokeDasharray="3 4" opacity="0.35" />
                    <circle cx="40" cy="40" r="28" fill="#E6FFFA" opacity="0.7" />
                    <path d="M40 18 C33 24 31 33 31 43 L49 43 C49 33 47 24 40 18 Z" fill="#087F5B" opacity="0.85" />
                    <circle cx="40" cy="15" r="2" fill="#D4A72C" />
                    <path d="M40 13 L40 17" stroke="#D4A72C" strokeWidth="1.2" strokeLinecap="round" />
                    <rect x="23" y="27" width="5" height="23" rx="1.5" fill="#159A9C" />
                    <polygon points="25.5,21 22,27 29,27" fill="#07543F" />
                    <circle cx="25.5" cy="20" r="1" fill="#D4A72C" />
                    <rect x="52" y="27" width="5" height="23" rx="1.5" fill="#159A9C" />
                    <polygon points="54.5,21 51,27 58,27" fill="#07543F" />
                    <circle cx="54.5" cy="20" r="1" fill="#D4A72C" />
                    <rect x="20" y="43" width="40" height="9" fill="#087F5B" rx="1" />
                    <path d="M37 52 L37 45 C37 43.5 38.5 42.5 40 42.5 C41.5 42.5 43 43.5 43 45 L43 52 Z" fill="#FDFBF7" />
                    <g filter="drop-shadow(0 2px 4px rgba(21, 154, 156, 0.4))">
                      <path d="M40 48 C36.6 48 34 50.6 34 54 C34 58.5 40 65 40 65 C40 65 46 58.5 46 54 C46 50.6 43.4 48 40 48 Z" fill="#159A9C" />
                      <circle cx="40" cy="54" r="2.5" fill="#FFFFFF" />
                    </g>
                  </svg>
                </div>
              </div>
            </>
          )}

          {/* Bottom Action Pill Overlay */}
          <div className="relative z-10 w-full pt-1">
            <div className={`w-full py-1.5 px-2.5 rounded-xl text-white text-[10px] font-bold flex items-center justify-between shadow-xs transition-all ${
              !videoError
                ? 'bg-teal-600/90 hover:bg-teal-600 backdrop-blur-xs border border-white/20'
                : 'bg-gradient-to-r from-teal-700 to-emerald-700 group-hover:from-teal-800 group-hover:to-emerald-800'
            }`}>
              <span>View Map</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>

        {/* Right 2x2 Grid: 4 Smaller Tiles */}
        <div className="col-span-3 grid grid-cols-2 gap-2.5">

          {/* 1. Register Tile (Warm Gold Accent) */}
          <button
            onClick={handleRegisterClick}
            className="rounded-2xl p-2.5 bg-gradient-to-b from-[#FFFDF7] via-white to-[#FEFDF9] border border-amber-200/90 shadow-[0_2px_10px_rgba(212,167,44,0.06)] flex flex-col justify-between items-center text-center relative overflow-hidden active:scale-95 transition-all group cursor-pointer"
          >
            {/* Subtle decorative watermark */}
            <div className="absolute -right-3 -bottom-3 w-14 h-14 pointer-events-none opacity-[0.05] text-amber-700">
              <RubElHizbIcon className="w-full h-full" />
            </div>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-[#D4A72C] group-hover:scale-108 group-hover:bg-amber-100/60 transition-all mt-0.5">
              <UserPlus className="w-5 h-5 text-[#D4A72C]" />
            </div>

            {/* Label */}
            <div className="my-1">
              <span className="text-xs font-bold text-slate-900 block leading-tight tracking-tight">
                Register
              </span>
            </div>

            {/* Bottom Accent Badge */}
            <span className="text-[9px] font-bold text-amber-900 bg-amber-100/80 border border-amber-200/80 px-2 py-0.5 rounded-full block w-full truncate">
              Join Us
            </span>
          </button>

          {/* 2. Qibla Tile (Deep Navy & Sky Blue Accent) */}
          <button
            onClick={handleQiblaClick}
            className="rounded-2xl p-2.5 bg-gradient-to-b from-[#F8FAFF] via-white to-[#F6F9FF] border border-sky-200/90 shadow-[0_2px_10px_rgba(59,111,216,0.06)] flex flex-col justify-between items-center text-center relative overflow-hidden active:scale-95 transition-all group cursor-pointer"
          >
            {/* Subtle decorative watermark */}
            <div className="absolute -right-3 -top-3 w-14 h-14 pointer-events-none opacity-[0.05] text-sky-700">
              <Compass className="w-full h-full" />
            </div>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/70 flex items-center justify-center text-[#3B6FD8] group-hover:scale-108 group-hover:bg-sky-100/60 transition-all mt-0.5">
              <Compass className="w-5 h-5 text-[#3B6FD8]" />
            </div>

            {/* Label */}
            <div className="my-1">
              <span className="text-xs font-bold text-slate-900 block leading-tight tracking-tight">
                Qibla
              </span>
            </div>

            {/* Bottom Accent Badge */}
            <span className="text-[9px] font-bold text-sky-900 bg-sky-100/80 border border-sky-200/80 px-2 py-0.5 rounded-full block w-full truncate">
              Compass
            </span>
          </button>

          {/* 3. Tasbeeh Tile (Purple & Amethyst Accent) */}
          <button
            onClick={handleTasbeehClick}
            className="rounded-2xl p-2.5 bg-gradient-to-b from-[#FAF8FF] via-white to-[#F8F6FF] border border-purple-200/90 shadow-[0_2px_10px_rgba(118,87,200,0.06)] flex flex-col justify-between items-center text-center relative overflow-hidden active:scale-95 transition-all group cursor-pointer"
          >
            {/* Subtle decorative watermark */}
            <div className="absolute -left-3 -bottom-3 w-14 h-14 pointer-events-none opacity-[0.05] text-purple-700">
              <TasbeehBeadsIcon className="w-full h-full" />
            </div>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/70 flex items-center justify-center text-[#7657C8] group-hover:scale-108 group-hover:bg-purple-100/60 transition-all mt-0.5">
              <TasbeehBeadsIcon className="w-5 h-5 text-[#7657C8]" />
            </div>

            {/* Label */}
            <div className="my-1">
              <span className="text-xs font-bold text-slate-900 block leading-tight tracking-tight">
                Tasbeeh
              </span>
            </div>

            {/* Bottom Accent Badge */}
            <span className="text-[9px] font-bold text-purple-900 bg-purple-100/80 border border-purple-200/80 px-2 py-0.5 rounded-full block w-full truncate">
              Dhikr
            </span>
          </button>

          {/* 4. Services Tile (Emerald Green & Mint Accent) */}
          <button
            onClick={handleServicesClick}
            className="rounded-2xl p-2.5 bg-gradient-to-b from-[#F0FDF4] via-white to-[#F2FBF6] border border-emerald-200/90 shadow-[0_2px_10px_rgba(8,127,91,0.06)] flex flex-col justify-between items-center text-center relative overflow-hidden active:scale-95 transition-all group cursor-pointer"
          >
            {/* Subtle decorative watermark */}
            <div className="absolute -right-3 -top-3 w-14 h-14 pointer-events-none opacity-[0.05] text-emerald-700">
              <LayoutGrid className="w-full h-full" />
            </div>

            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-[#087F5B] group-hover:scale-108 group-hover:bg-emerald-100/60 transition-all mt-0.5">
              <LayoutGrid className="w-5 h-5 text-[#087F5B]" />
            </div>

            {/* Label */}
            <div className="my-1">
              <span className="text-xs font-bold text-slate-900 block leading-tight tracking-tight">
                Services
              </span>
            </div>

            {/* Bottom Accent Badge */}
            <span className="text-[9px] font-bold text-emerald-900 bg-emerald-100/80 border border-emerald-200/80 px-2 py-0.5 rounded-full block w-full truncate">
              All 8+
            </span>
          </button>

        </div>

      </div>

      {/* Expandable Additional Services (Revealed on 'More →') */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded 
            ? 'max-h-[600px] opacity-100 mt-2.5' 
            : 'max-h-0 opacity-0 mt-0 pointer-events-none'
        }`}
      >
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          {additionalServices.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => {
                triggerHapticFeedback('light');
                srv.onClick();
              }}
              className={`rounded-2xl p-2.5 bg-gradient-to-b ${srv.bgGradient} border ${srv.border} shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-2.5 text-left relative overflow-hidden active:scale-95 transition-all group cursor-pointer min-h-[58px]`}
            >
              {/* Subtle decorative watermark */}
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
    </div>
  );
};
