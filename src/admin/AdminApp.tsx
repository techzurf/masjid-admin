import React, { useState } from 'react';
import { AdminNavbar } from './components/AdminNavbar';
import { AdminSidebar, AdminScreenType } from './components/AdminSidebar';
import { AdminBottomNav } from './components/AdminBottomNav';
import { Sparkles, CheckCircle2 } from 'lucide-react';

// Screens
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';
import { AdminPrayerTimesScreen } from './screens/AdminPrayerTimesScreen';
import { AdminNoticesScreen } from './screens/AdminNoticesScreen';
import { AdminEventsScreen } from './screens/AdminEventsScreen';
import { AdminBayanScreen } from './screens/AdminBayanScreen';
import { AdminDonationScreen } from './screens/AdminDonationScreen';
import { AdminServicesScreen } from './screens/AdminServicesScreen';
import { AdminQuranScreen } from './screens/AdminQuranScreen';
import { AdminHadithScreen } from './screens/AdminHadithScreen';
import { AdminDuaScreen } from './screens/AdminDuaScreen';
import { AdminMembersScreen } from './screens/AdminMembersScreen';
import { AdminNotificationsScreen } from './screens/AdminNotificationsScreen';
import { AdminReportsScreen } from './screens/AdminReportsScreen';
import { AdminProfileScreen } from './screens/AdminProfileScreen';
import { AdminSettingsScreen } from './screens/AdminSettingsScreen';

// Mock Data
import { 
  INITIAL_ADMIN_STATS, 
  INITIAL_ADMIN_PRAYERS, 
  INITIAL_NOTICES, 
  INITIAL_EVENTS, 
  INITIAL_BAYANS, 
  INITIAL_DONATION_SETTINGS, 
  INITIAL_ADMIN_SERVICES,
  AdminPrayerItem,
  AdminNotice,
  AdminEvent,
  AdminBayan,
  AdminDonationSettings,
  AdminServiceToggle
} from './mockAdminData';

interface AdminAppProps {
  onExitAdmin: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onExitAdmin }) => {
  // Authentication State (UI prototype - logged in by default)
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Active Screen
  const [currentScreen, setCurrentScreen] = useState<AdminScreenType>('dashboard');

  // Mobile Drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Managed Mock Data States
  const [stats, setStats] = useState(INITIAL_ADMIN_STATS);
  const [prayers, setPrayers] = useState<AdminPrayerItem[]>(INITIAL_ADMIN_PRAYERS);
  const [notices, setNotices] = useState<AdminNotice[]>(INITIAL_NOTICES);
  const [events, setEvents] = useState<AdminEvent[]>(INITIAL_EVENTS);
  const [bayans, setBayans] = useState<AdminBayan[]>(INITIAL_BAYANS);
  const [donations, setDonations] = useState<AdminDonationSettings>(INITIAL_DONATION_SETTINGS);
  const [services, setServices] = useState<AdminServiceToggle[]>(INITIAL_ADMIN_SERVICES);

  // Apply admin-mode styling to body and documentElement to suppress visible scrollbars
  // while preserving smooth vertical touch, wheel, and trackpad scrolling
  React.useEffect(() => {
    document.documentElement.classList.add('admin-mode');
    document.body.classList.add('admin-mode');
    return () => {
      document.documentElement.classList.remove('admin-mode');
      document.body.classList.remove('admin-mode');
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(30);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Screen Title Mapper for Breadcrumbs
  const getScreenTitle = (screen: AdminScreenType) => {
    switch (screen) {
      case 'dashboard': return 'Dashboard';
      case 'prayers': return 'Prayer Times';
      case 'notices': return 'Notices & Alerts';
      case 'events': return 'Events';
      case 'bayan': return 'Bayan Videos';
      case 'donations': return 'Direct Donation';
      case 'services': return 'Masjid Services';
      case 'quran': return 'Quran Content';
      case 'hadith': return 'Hadith Content';
      case 'dua': return 'Dua & Azkar';
      case 'members': return 'Members';
      case 'notifications': return 'Push Notifications';
      case 'reports': return 'Reports & Stats';
      case 'profile': return 'Masjid Profile';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  // Render Login Screen if logged out
  if (!isLoggedIn) {
    return (
      <AdminLoginScreen
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          showToast('Welcome back, Admin!');
        }}
        onPreviewUserApp={onExitAdmin}
      />
    );
  }

  // Active Screen Content Selector
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <AdminDashboardScreen stats={stats} onNavigate={(s) => setCurrentScreen(s)} />;
      case 'prayers':
        return <AdminPrayerTimesScreen prayers={prayers} onSavePrayers={setPrayers} onShowToast={showToast} />;
      case 'notices':
        return <AdminNoticesScreen notices={notices} onUpdateNotices={setNotices} onShowToast={showToast} />;
      case 'events':
        return <AdminEventsScreen events={events} onUpdateEvents={setEvents} onShowToast={showToast} />;
      case 'bayan':
        return <AdminBayanScreen bayans={bayans} onUpdateBayans={setBayans} onShowToast={showToast} />;
      case 'donations':
        return (
          <AdminDonationScreen 
            settings={donations} 
            onSaveSettings={setDonations} 
            onPreviewDonationPage={onExitAdmin} 
            onShowToast={showToast} 
          />
        );
      case 'services':
        return <AdminServicesScreen services={services} onSaveServices={setServices} onShowToast={showToast} />;
      case 'quran':
        return <AdminQuranScreen />;
      case 'hadith':
        return <AdminHadithScreen />;
      case 'dua':
        return <AdminDuaScreen />;
      case 'members':
        return <AdminMembersScreen onShowToast={showToast} />;
      case 'notifications':
        return <AdminNotificationsScreen onShowToast={showToast} />;
      case 'reports':
        return <AdminReportsScreen stats={stats} onShowToast={showToast} />;
      case 'profile':
        return <AdminProfileScreen onPreviewApp={onExitAdmin} onShowToast={showToast} />;
      case 'settings':
        return (
          <AdminSettingsScreen 
            onNavigate={(s) => setCurrentScreen(s)} 
            onLogout={() => {
              setIsLoggedIn(false);
              showToast('Signed out of admin session');
            }} 
            onShowToast={showToast} 
          />
        );
      default:
        return <AdminDashboardScreen stats={stats} onNavigate={(s) => setCurrentScreen(s)} />;
    }
  };

  return (
    <div className="admin-portal-root min-h-screen w-full bg-[#F8FAFB] text-slate-900 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 max-w-[360px] w-[90%] bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-3 border border-white/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
        </div>
      )}

      {/* ─── TOP NAVBAR ─── */}
      <AdminNavbar
        onToggleSidebar={() => setMobileDrawerOpen(prev => !prev)}
        onPreviewApp={onExitAdmin}
        onNavigateNotifications={() => setCurrentScreen('notifications')}
        onNavigateProfile={() => setCurrentScreen('profile')}
        activeScreenTitle={getScreenTitle(currentScreen)}
      />

      {/* ─── MAIN LAYOUT WRAPPER (Sidebar + Content) ─── */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex items-start">
        
        {/* Desktop Sidebar & Mobile Drawer */}
        <AdminSidebar
          currentScreen={currentScreen}
          onSelectScreen={(screen) => setCurrentScreen(screen)}
          isOpenMobile={mobileDrawerOpen}
          onCloseMobile={() => setMobileDrawerOpen(false)}
          onLogout={() => {
            setIsLoggedIn(false);
            showToast('Signed out from Admin');
          }}
          onPreviewApp={onExitAdmin}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-12">
          {renderScreenContent()}
        </main>
      </div>

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <AdminBottomNav
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        onToggleDrawer={() => setMobileDrawerOpen(true)}
      />

    </div>
  );
};

export default AdminApp;
