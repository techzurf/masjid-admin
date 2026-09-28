import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  ChevronLeft, 
  Menu, 
  X 
} from 'lucide-react';

interface MobileTopBarProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  onBack,
  showBack = false,
  rightAction
}) => {
  const { 
    overlayScreen, 
    setOverlayScreen, 
    settings
  } = useApp();

  const [gifError, setGifError] = useState(false);

  const isOverlay = Boolean(overlayScreen && overlayScreen !== 'splash' && overlayScreen !== 'onboarding');

  const getScreenTitle = () => {
    switch (overlayScreen) {
      case 'qibla': return 'Qibla Compass';
      case 'tasbeeh': return 'Digital Tasbeeh';
      case 'locator': return 'Masjid Locator';
      case 'connect_muslim': return 'Connect Muslim Services';
      case 'notifications': return 'Notifications';
      case 'donation': return 'Support Your Masjid';
      case 'registration': return 'Masjid Registration';
      case 'quran': return 'Quran & Reminders';
      case 'duas': return 'Daily Supplications';
      case 'settings': return 'App Settings';
      case 'about_masjid': return 'About Madina Masjid';
      case 'lost_found': return 'Lost & Found';
      case 'event_detail': return 'Event Details';
      case 'service_detail': return 'Service Details';
      case 'monthly_timetable': return 'Monthly Prayer Timetable';
      default: return title || 'Madina Masjid MKB Nagar';
    }
  };

  const handleBackOrClose = () => {
    if (onBack) {
      onBack();
    } else {
      setOverlayScreen(null);
    }
  };

  const currentDisplayTitle = isOverlay ? (title || getScreenTitle()) : 'Madina Masjid MKB Nagar';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] w-full max-w-[430px] mx-auto select-none transition-colors duration-200 pt-[env(safe-area-inset-top,0px)] ${
        settings.ramadanMode 
          ? 'bg-[#091A30] border-b border-amber-500/20 shadow-xs' 
          : 'bg-[#087F5B] bg-gradient-to-b from-[#076E4E] to-[#087F5B] shadow-xs'
      }`}
    >
      {/* Sleek Standalone Mobile App Header Navigation Bar */}
      <div className="w-full h-13 sm:h-14 px-3 flex items-center justify-between">
        {/* Left: Menu / Back Icon */}
        <div className="w-10 flex items-center justify-start">
          {isOverlay || showBack ? (
            <button
              onClick={handleBackOrClose}
              className="w-10 h-10 flex items-center justify-center text-white active:opacity-70 transition-opacity -ml-1"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
          ) : (
            <button
              onClick={() => setOverlayScreen('about_masjid')}
              className="w-10 h-10 flex items-center justify-center text-white active:opacity-70 transition-opacity -ml-1"
              aria-label="Open Masjid Menu"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* Center: Title (Single line, 15-17px, Semibold, White, Centered, Ellipsis only if narrow) */}
        <h1 className="text-[16px] font-semibold text-white tracking-tight leading-none text-center truncate flex-1 px-1">
          {currentDisplayTitle}
        </h1>

        {/* Right: Notification / Profile or Close Action */}
        <div className="w-10 flex items-center justify-end">
          {rightAction ? (
            rightAction
          ) : isOverlay ? (
            <button
              onClick={handleBackOrClose}
              className="w-10 h-10 flex items-center justify-center text-white active:opacity-70 transition-opacity -mr-1"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          ) : (
            <button
              onClick={() => setOverlayScreen('notifications')}
              className="relative w-10 h-10 flex items-center justify-center text-white active:opacity-75 transition-opacity -mr-1"
              aria-label="Masjid Notifications"
            >
              {!gifError ? (
                <img
                  src="https://res.cloudinary.com/dv16a8l1l/image/upload/e_make_transparent/v1790251428/notification_p1haa9.gif"
                  alt="Notifications"
                  className="w-[30px] h-[30px] object-contain select-none pointer-events-none"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('cloudinary')) {
                      target.src = '/notification_transparent.gif';
                    } else {
                      setGifError(true);
                    }
                  }}
                />
              ) : (
                <Bell className="w-5 h-5 stroke-[2.2]" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
