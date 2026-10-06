import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';

// Screens
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { PrayerTimesScreen } from './components/screens/PrayerTimesScreen';
import { EventsScreen } from './components/screens/EventsScreen';
import { ServicesScreen } from './components/screens/ServicesScreen';
import { RegistrationScreen } from './components/screens/RegistrationScreen';
import { ConnectMuslimScreen } from './components/screens/ConnectMuslimScreen';
import { ConnectMuslimComingSoonScreen } from './components/screens/ConnectMuslimComingSoonScreen';
import { MasjidLocatorScreen } from './components/screens/MasjidLocatorScreen';
import { QiblaScreen } from './components/screens/QiblaScreen';
import { TasbeehScreen } from './components/screens/TasbeehScreen';
import { NotificationScreen } from './components/screens/NotificationScreen';
import { MasjidAboutScreen } from './components/screens/MasjidAboutScreen';
import { DonationScreen } from './components/screens/DonationScreen';
import { QuranContentScreen } from './components/screens/QuranContentScreen';
import { DailyDuaScreen } from './components/screens/DailyDuaScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LostFoundScreen } from './components/screens/LostFoundScreen';
import { IslamicCalendarScreen } from './components/screens/IslamicCalendarScreen';
import { AdminApp } from './admin/AdminApp';

const MainAppContent: React.FC = () => {
  const { overlayScreen, activeTab } = useApp();

  // Full screen overlays (Splash and Onboarding take over the mobile canvas)
  if (overlayScreen === 'splash') {
    return <SplashScreen />;
  }

  if (overlayScreen === 'onboarding') {
    return <OnboardingScreen />;
  }

  // Active Screen Selector
  const renderCurrentScreen = () => {
    // Check overlay screens first
    if (overlayScreen) {
      switch (overlayScreen) {
        case 'qibla':
          return <QiblaScreen />;
        case 'tasbeeh':
          return <TasbeehScreen />;
        case 'locator':
          return <MasjidLocatorScreen />;
        case 'connect_muslim':
          return <ConnectMuslimScreen />;
        case 'work_halal_jobs':
        case 'business_directory':
        case 'nikah_matrimony':
        case 'islamic_education':
          return <ConnectMuslimComingSoonScreen serviceKey={overlayScreen} />;
        case 'notifications':
          return <NotificationScreen />;
        case 'donation':
          return <DonationScreen />;
        case 'registration':
          return <RegistrationScreen />;
        case 'quran':
          return <QuranContentScreen />;
        case 'duas':
          return <DailyDuaScreen />;
        case 'settings':
          return <SettingsScreen />;
        case 'about_masjid':
          return <MasjidAboutScreen />;
        case 'lost_found':
          return <LostFoundScreen />;
        case 'islamic_calendar':
        case 'monthly_timetable':
          return <IslamicCalendarScreen />;
        default:
          break;
      }
    }

    // Main 5-destination tabs
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'prayers':
        return <PrayerTimesScreen />;
      case 'events':
        return <EventsScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'masjid':
        return <MasjidAboutScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <MobileShell>
      {renderCurrentScreen()}
    </MobileShell>
  );
};

export function App() {
  const [isAdminView, setIsAdminView] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#admin') ||
        new URLSearchParams(window.location.search).get('view') === 'admin'
      );
    }
    return false;
  });

  React.useEffect(() => {
    const handleUrlCheck = () => {
      const isNowAdmin = 
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#admin') ||
        new URLSearchParams(window.location.search).get('view') === 'admin';
      setIsAdminView(isNowAdmin);
    };

    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, []);

  const handleEnterAdmin = () => {
    setIsAdminView(true);
    window.history.pushState(null, '', '/admin');
  };

  const handleExitAdmin = () => {
    setIsAdminView(false);
    window.history.pushState(null, '', '/');
  };

  return (
    <AppProvider>
      {isAdminView ? (
        <AdminApp onExitAdmin={handleExitAdmin} />
      ) : (
        <>
          <MainAppContent />
          {/* Subtle floating toggle button for easy access during preview & admin evaluation */}
          <button
            type="button"
            onClick={handleEnterAdmin}
            className="fixed bottom-22 right-4 z-40 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-xs border border-white/20 active:scale-95 transition-all cursor-pointer"
            title="Switch to Masjid Admin Portal"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Portal</span>
          </button>
        </>
      )}
    </AppProvider>
  );
}

export default App;
