import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApproachingPrayerBanner } from '../common/ApproachingPrayerBanner';
import { MobileTopBar } from './MobileTopBar';
import { MobileBottomNav } from './MobileBottomNav';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  const { 
    settings, 
    setOverlayScreen,
    setActiveTab,
    activePrayerAlert,
    dismissPrayerAlert,
    mutePrayerSound,
    isPlayingNotificationSound
  } = useApp();

  return (
    <div 
      className={`w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] overflow-hidden flex justify-center transition-colors duration-300 ${
        settings.ramadanMode ? 'ramadan-night-canvas' : 'bg-[#EEF2EF]'
      } text-[#17221D]`}
    >
      {/* Clean Standalone Mobile App Canvas (100dvh Viewport) */}
      <div 
        className={`w-full max-w-[430px] h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col relative overflow-hidden transition-colors duration-300 ${
          settings.ramadanMode 
            ? 'bg-[#FDFBF7] sm:border-x sm:border-amber-400/40 ramadan-festive-glow' 
            : 'bg-[#F7F9F7] sm:border-x sm:border-slate-200/80 shadow-sm'
        } ${settings.seniorMode ? 'text-[17px]' : 'text-[15px]'}`}
      >
        {/* 1. TOP APP BAR (Fixed in App Shell - Never Scrolls Away) */}
        <MobileTopBar />

        {/* Optional In-App Approaching Prayer Alert Toast Banner */}
        {activePrayerAlert && (
          <div className="w-full shrink-0 z-30 px-3 py-1 bg-transparent">
            <ApproachingPrayerBanner
              alert={activePrayerAlert}
              isPlayingAudio={isPlayingNotificationSound}
              onMuteAudio={mutePrayerSound}
              onDismiss={dismissPrayerAlert}
              onOpenTimetable={() => {
                dismissPrayerAlert();
                setOverlayScreen(null);
                setActiveTab('prayers');
              }}
            />
          </div>
        )}

        {/* 2. SCROLLABLE CONTENT AREA (Only Middle Region Scrolls Vertically) */}
        <main
          id="main-scroll-container"
          className="flex-1 w-full min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar overscroll-y-contain relative"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          {children}
        </main>

        {/* 3. FIXED BOTTOM NAVIGATION (Fixed in App Shell - Never Scrolls Away) */}
        <MobileBottomNav />
      </div>
    </div>
  );
};
