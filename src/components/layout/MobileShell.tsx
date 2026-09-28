import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApproachingPrayerBanner } from '../common/ApproachingPrayerBanner';

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
    <div className={`min-h-screen w-full flex justify-center transition-colors duration-300 ${
      settings.ramadanMode ? 'ramadan-night-canvas' : 'bg-[#EEF2EF]'
    } text-[#17221D]`}>
      {/* Clean Standalone Mobile App Canvas */}
      <div 
        className={`w-full max-w-[430px] min-h-screen flex flex-col relative transition-colors duration-300 ${
          settings.ramadanMode 
            ? 'bg-[#FDFBF7] sm:border-x sm:border-amber-400/40 ramadan-festive-glow' 
            : 'bg-[#F7F9F7] sm:border-x sm:border-slate-200/80 shadow-sm'
        } ${settings.seniorMode ? 'text-[17px]' : 'text-[15px]'}`}
      >
        {/* In-App Approaching Prayer Alert Toast / Banner (Triggered prior to Salah) */}
        {activePrayerAlert && (
          <div className="w-full pt-[calc(54px+env(safe-area-inset-top,0px))] z-50">
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

        {/* Scrollable Mobile Viewport Area */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col relative">
          {children}
        </div>
      </div>
    </div>
  );
};
