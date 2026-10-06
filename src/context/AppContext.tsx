import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActiveTab, 
  OverlayScreen, 
  AppLanguage, 
  EventItem, 
  ServiceItem, 
  MasjidItem, 
  DuaItem, 
  NotificationItem, 
  UserRegistration,
  AppSettings,
  AthanSoundType,
  ApproachingPrayerAlert
} from '../types';
import { 
  MOCK_EVENTS, 
  MOCK_SERVICES, 
  NEARBY_MASJIDS, 
  DAILY_DUAS, 
  MOCK_NOTIFICATIONS, 
  MOCK_REGISTRATIONS,
  INITIAL_PRAYERS
} from '../data/mockData';
import { playNotificationSound, stopNotificationSound } from '../utils/audioNotification';
import { triggerHaptic, HapticStyle } from '../utils/haptics';
import { 
  PrayerTimeRecord, 
  ComputedPrayerInfo, 
  fetchPrayerTimesForDate, 
  getTodayDateString, 
  getInitialSeedRecord, 
  computePrayersFromRecord 
} from '../lib/supabase';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  overlayScreen: OverlayScreen;
  setOverlayScreen: (screen: OverlayScreen) => void;
  triggerHapticFeedback: (style?: HapticStyle, withSound?: boolean) => void;
  
  // Supabase Prayer Times State
  todayPrayerRecord: PrayerTimeRecord | null;
  computedPrayers: ComputedPrayerInfo;
  isLoadingPrayerTimes: boolean;
  refreshPrayerTimes: () => Promise<void>;

  // Selected detail items
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;
  selectedService: ServiceItem | null;
  setSelectedService: (service: ServiceItem | null) => void;
  selectedMasjid: MasjidItem | null;
  setSelectedMasjid: (masjid: MasjidItem | null) => void;
  
  // Registration flow
  activeRegistrationType: 'New Member' | 'Volunteer' | 'Event' | 'Service';
  setActiveRegistrationType: (type: 'New Member' | 'Volunteer' | 'Event' | 'Service') => void;
  
  // Duas & Favorites
  duas: DuaItem[];
  toggleFavoriteDua: (id: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timeAgo' | 'isRead'>) => void;
  
  // User Registrations
  userRegistrations: UserRegistration[];
  addRegistration: (reg: Omit<UserRegistration, 'id' | 'date'>) => void;
  
  // Tasbeeh state
  tasbeehCount: number;
  tasbeehTarget: number;
  tasbeehDhikr: string;
  tasbeehMeaning: string;
  incrementTasbeeh: (soundEnabled?: boolean) => void;
  resetTasbeeh: () => void;
  setTasbeehDhikrPreset: (dhikr: string, meaning: string, target?: number) => void;
  setTasbeehTarget: (target: number) => void;
  
  // App Settings & Preferences
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleSeniorMode: () => void;
  toggleRamadanMode: () => void;
  setLanguage: (lang: AppLanguage) => void;
  
  // Prayer Approaching Notifications & Audio
  activePrayerAlert: ApproachingPrayerAlert | null;
  dismissPrayerAlert: () => void;
  mutePrayerSound: () => void;
  isPlayingNotificationSound: boolean;
  currentlyPlayingTone: string | null;
  previewSound: (sound: AthanSoundType) => void;
  stopSoundPreview: () => void;
  triggerTestPrayerAlert: (prayerName?: string, minutesLeft?: number) => void;
  notificationPermission: NotificationPermission | 'unsupported';
  requestNotificationPermission: () => Promise<void>;

  // Onboarding
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  
  // Mobile device shell simulation toggle (for desktop viewers to toggle preview mode)
  showDeviceShell: boolean;
  setShowDeviceShell: (val: boolean) => void;
  
  // Helper quick actions
  openEventDetail: (event: EventItem) => void;
  openServiceDetail: (service: ServiceItem) => void;
  openMasjidDetail: (masjid: MasjidItem) => void;
  startRegistration: (type: 'New Member' | 'Volunteer' | 'Event' | 'Service') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [overlayScreen, setOverlayScreen] = useState<OverlayScreen>('splash');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('alnoor_onboarding_done') === 'true';
  });
  
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedMasjid, setSelectedMasjid] = useState<MasjidItem | null>(null);
  const [activeRegistrationType, setActiveRegistrationType] = useState<'New Member' | 'Volunteer' | 'Event' | 'Service'>('New Member');
  
  const [duas, setDuas] = useState<DuaItem[]>(DAILY_DUAS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [userRegistrations, setUserRegistrations] = useState<UserRegistration[]>(MOCK_REGISTRATIONS);
  
  // Tasbeeh counter state
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const [tasbeehTarget, setTasbeehTarget] = useState<number>(33);
  const [tasbeehDhikr, setTasbeehDhikr] = useState<string>('SubhanAllah');
  const [tasbeehMeaning, setTasbeehMeaning] = useState<string>('Glory be to Allah');
  
  // Device frame toggle
  const [showDeviceShell, setShowDeviceShell] = useState<boolean>(true);

  // Supabase Prayer Times State
  const [todayPrayerRecord, setTodayPrayerRecord] = useState<PrayerTimeRecord | null>(null);
  const [isLoadingPrayerTimes, setIsLoadingPrayerTimes] = useState<boolean>(true);

  const refreshPrayerTimes = React.useCallback(async () => {
    setIsLoadingPrayerTimes(true);
    try {
      const today = getTodayDateString();
      const res = await fetchPrayerTimesForDate(today);
      if (res.data) {
        setTodayPrayerRecord(res.data);
      } else {
        setTodayPrayerRecord(getInitialSeedRecord(today));
      }
    } catch (err) {
      console.error('Error fetching today prayer times:', err);
      setTodayPrayerRecord(getInitialSeedRecord());
    } finally {
      setIsLoadingPrayerTimes(false);
    }
  }, []);

  useEffect(() => {
    refreshPrayerTimes();
  }, [refreshPrayerTimes]);

  const activeRecord = todayPrayerRecord || getInitialSeedRecord();
  const computedPrayers = React.useMemo(() => {
    return computePrayersFromRecord(activeRecord);
  }, [activeRecord]);

  // Settings with local persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('alnoor_masjid_settings');
    const defaultSettings: AppSettings = {
      language: 'en',
      seniorMode: false,
      ramadanMode: false,
      prayerNotifications: {
        fajr: true,
        sunrise: false,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        jummahReminder: true,
      },
      athanSound: 'Makkah',
      reminderMinutesBefore: 10,
      alertVolume: 0.8,
      vibrateOnAlert: true,
      hapticFeedback: true,
      calculationMethod: 'Islamic Society of North America (ISNA)'
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validAthanSound: AthanSoundType = (parsed.athanSound === 'Madina' || parsed.athanSound === 'Madinah')
          ? 'Madina'
          : 'Makkah';
        return {
          ...defaultSettings,
          ...parsed,
          athanSound: validAthanSound,
          prayerNotifications: {
            ...defaultSettings.prayerNotifications,
            ...(parsed.prayerNotifications || {})
          }
        };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Approaching Prayer Alert & Audio Playback State
  const [activePrayerAlert, setActivePrayerAlert] = useState<ApproachingPrayerAlert | null>(null);
  const [isPlayingNotificationSound, setIsPlayingNotificationSound] = useState<boolean>(false);
  const [currentlyPlayingTone, setCurrentlyPlayingTone] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Check initial browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    } else {
      setNotificationPermission('unsupported');
    }
  }, []);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
          try {
            new Notification('Madina Masjid Notifications Active', {
              body: 'You will now receive prayer approaching reminders according to your schedule.',
              icon: '/favicon.ico'
            });
          } catch {
            // Ignore notification constructor error on unsupported mobile webviews
          }
        }
      } catch {
        setNotificationPermission('default');
      }
    }
  };

  // Sound Preview & Playback Controls
  const previewSound = (sound: AthanSoundType) => {
    // If the same sound is already playing, toggle it off (Play/Pause behavior)
    if (isPlayingNotificationSound && currentlyPlayingTone === sound) {
      stopSoundPreview();
      return;
    }

    // Stop any previously playing audio immediately
    stopSoundPreview();
    setIsPlayingNotificationSound(true);
    setCurrentlyPlayingTone(sound);

    playNotificationSound(sound, {
      volume: settings.alertVolume,
      vibrate: settings.vibrateOnAlert,
      onEnded: () => {
        setIsPlayingNotificationSound(false);
        setCurrentlyPlayingTone(null);
      }
    });
  };

  const stopSoundPreview = () => {
    stopNotificationSound();
    setIsPlayingNotificationSound(false);
    setCurrentlyPlayingTone(null);
  };

  const mutePrayerSound = () => {
    stopNotificationSound();
    setIsPlayingNotificationSound(false);
  };

  const dismissPrayerAlert = () => {
    setActivePrayerAlert(null);
    mutePrayerSound();
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timeAgo' | 'isRead'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timeAgo: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  // Trigger prayer alert (in-app banner + system notification + audio)
  const triggerPrayerApproachingAlert = (
    prayerName: string,
    arabicName: string,
    time: string,
    minutesLeft: number,
    iqamahTime?: string
  ) => {
    const alertData: ApproachingPrayerAlert = {
      id: `alert-${Date.now()}`,
      prayerName,
      arabicName,
      time,
      minutesLeft,
      type: minutesLeft <= 0 ? 'adhan' : 'approaching',
      iqamahTime
    };

    setActivePrayerAlert(alertData);

    // Play user-selected Adhan sound (Makkah or Madina) for all 5 daily prayers
    setIsPlayingNotificationSound(true);
    setCurrentlyPlayingTone(settings.athanSound);
    playNotificationSound(settings.athanSound, {
      volume: settings.alertVolume,
      vibrate: settings.vibrateOnAlert,
      onEnded: () => {
        setIsPlayingNotificationSound(false);
        setCurrentlyPlayingTone(null);
      }
    });

    // Trigger Browser Web Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const title = minutesLeft <= 0 
          ? `🕌 Adhan Time for ${prayerName} Prayer (${time})` 
          : `⏳ ${prayerName} Prayer in ${minutesLeft} Minutes (${time})`;
        const body = iqamahTime 
          ? `Madina Masjid congregation Iqamah at ${iqamahTime}. Prepare for Salah.`
          : `Madina Masjid Adhan time is approaching.`;

        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: `prayer-${prayerName.toLowerCase()}`
        });
      } catch {
        // Fallback gracefully
      }
    }

    // Add to in-app notification inbox
    addNotification({
      title: minutesLeft <= 0 
        ? `Adhan Time: ${prayerName} Prayer (${time})`
        : `Approaching: ${prayerName} Prayer in ${minutesLeft} mins`,
      message: `The adhan for ${prayerName} is at ${time}.${iqamahTime ? ` Congregation Iqamah will follow at ${iqamahTime}.` : ''} Tap to check the timetable.`,
      category: 'Prayer Alerts',
      urgent: true
    });
  };

  // Test Prayer Alert Trigger (for instant user verification in Settings or Timetable)
  const triggerTestPrayerAlert = (prayerName = 'Asr', minutesLeft?: number) => {
    const leadTime = typeof minutesLeft === 'number' ? minutesLeft : (settings.reminderMinutesBefore || 10);
    const prayerInfo = computedPrayers.prayersList.find(p => p.name.toLowerCase() === prayerName.toLowerCase()) || computedPrayers.prayersList[2] || INITIAL_PRAYERS[2];
    triggerPrayerApproachingAlert(
      prayerInfo.name,
      prayerInfo.arabicName,
      prayerInfo.adhanTime,
      leadTime,
      prayerInfo.iqamahTime
    );
  };

  // Helper to parse time string like "04:32 PM" into today's minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return -1;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Track alerts fired today so we don't trigger repeatedly in the same approaching window
  const firedAlertsRef = React.useRef<Set<string>>(new Set());

  // Background ticker checking if any enabled prayer is approaching
  useEffect(() => {
    const checkApproachingPrayers = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const reminderLead = settings.reminderMinutesBefore;

      computedPrayers.prayersList.forEach(prayer => {
        const prayerKey = prayer.id.toLowerCase() as keyof typeof settings.prayerNotifications;
        const isEnabled = settings.prayerNotifications[prayerKey];
        if (!isEnabled) return;

        const adhanMinutes = parseTimeToMinutes(prayer.adhanTime);
        if (adhanMinutes < 0) return;

        const minutesDiff = adhanMinutes - currentMinutes;

        // If diff matches the reminder window (e.g. exactly reminderLead or between 0 and reminderLead)
        // and hasn't fired in the current calendar hour
        const alertKey = `${prayer.id}-${now.toDateString()}-${reminderLead}`;
        if (minutesDiff >= 0 && minutesDiff <= reminderLead && !firedAlertsRef.current.has(alertKey)) {
          firedAlertsRef.current.add(alertKey);
          triggerPrayerApproachingAlert(
            prayer.name,
            prayer.arabicName,
            prayer.adhanTime,
            minutesDiff,
            prayer.iqamahTime
          );
        }
      });
    };

    // Run check every 30 seconds
    const interval = setInterval(checkApproachingPrayers, 30000);
    return () => clearInterval(interval);
  }, [computedPrayers, settings.prayerNotifications, settings.reminderMinutesBefore, settings.athanSound, settings.customAudioDataUrl, settings.alertVolume, settings.vibrateOnAlert]);

  // Save settings on change
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('alnoor_masjid_settings', JSON.stringify(updated));
      } catch {
        // LocalStorage quota handling
      }
      return updated;
    });
  };

  const completeOnboarding = () => {
    setHasSeenOnboarding(true);
    localStorage.setItem('alnoor_onboarding_done', 'true');
    setOverlayScreen(null);
  };

  const restartOnboarding = () => {
    setOverlayScreen('onboarding');
  };

  const toggleFavoriteDua = (id: string) => {
    setDuas(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addRegistration = (reg: Omit<UserRegistration, 'id' | 'date'>) => {
    const newReg: UserRegistration = {
      ...reg,
      id: `reg-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setUserRegistrations(prev => [newReg, ...prev]);
  };

  const handleSetActiveTab = (tab: ActiveTab) => {
    if (tab !== activeTab) {
      triggerHaptic('nav', settings.hapticFeedback);
    }
    setActiveTab(tab);
  };

  const handleSetOverlayScreen = (screen: OverlayScreen) => {
    if (screen !== overlayScreen) {
      triggerHaptic('nav', settings.hapticFeedback);
    }
    setOverlayScreen(screen);
  };

  const triggerHapticFeedback = (style: HapticStyle = 'light', withSound = false) => {
    triggerHaptic(style, settings.hapticFeedback, withSound);
  };

  const incrementTasbeeh = (soundEnabled = true) => {
    setTasbeehCount(prev => {
      const next = prev + 1;
      const isGoal = next === tasbeehTarget;
      triggerHaptic(isGoal ? 'success' : 'tasbeeh', settings.hapticFeedback, soundEnabled);
      return next;
    });
  };

  const resetTasbeeh = () => {
    triggerHaptic('medium', settings.hapticFeedback);
    setTasbeehCount(0);
  };

  const setTasbeehDhikrPreset = (dhikr: string, meaning: string, target = 33) => {
    triggerHaptic('selection', settings.hapticFeedback);
    setTasbeehDhikr(dhikr);
    setTasbeehMeaning(meaning);
    setTasbeehTarget(target);
    setTasbeehCount(0);
  };

  const toggleSeniorMode = () => {
    updateSettings({ seniorMode: !settings.seniorMode });
  };

  const toggleRamadanMode = () => {
    updateSettings({ ramadanMode: !settings.ramadanMode });
  };

  const setLanguage = (lang: AppLanguage) => {
    updateSettings({ language: lang });
  };

  const openEventDetail = (event: EventItem) => {
    setSelectedEvent(event);
    setOverlayScreen('event_detail');
  };

  const openServiceDetail = (service: ServiceItem) => {
    setSelectedService(service);
    setOverlayScreen('service_detail');
  };

  const openMasjidDetail = (masjid: MasjidItem) => {
    setSelectedMasjid(masjid);
    setOverlayScreen('locator');
  };

  const startRegistration = (type: 'New Member' | 'Volunteer' | 'Event' | 'Service') => {
    setActiveRegistrationType(type);
    setOverlayScreen('registration');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        overlayScreen,
        setOverlayScreen: handleSetOverlayScreen,
        triggerHapticFeedback,
        todayPrayerRecord,
        computedPrayers,
        isLoadingPrayerTimes,
        refreshPrayerTimes,
        selectedEvent,
        setSelectedEvent,
        selectedService,
        setSelectedService,
        selectedMasjid,
        setSelectedMasjid,
        activeRegistrationType,
        setActiveRegistrationType,
        duas,
        toggleFavoriteDua,
        notifications,
        unreadNotifCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        userRegistrations,
        addRegistration,
        tasbeehCount,
        tasbeehTarget,
        tasbeehDhikr,
        tasbeehMeaning,
        incrementTasbeeh,
        resetTasbeeh,
        setTasbeehDhikrPreset,
        setTasbeehTarget,
        settings,
        updateSettings,
        toggleSeniorMode,
        toggleRamadanMode,
        setLanguage,
        activePrayerAlert,
        dismissPrayerAlert,
        mutePrayerSound,
        isPlayingNotificationSound,
        currentlyPlayingTone,
        previewSound,
        stopSoundPreview,
        triggerTestPrayerAlert,
        notificationPermission,
        requestNotificationPermission,
        hasSeenOnboarding,
        completeOnboarding,
        restartOnboarding,
        showDeviceShell,
        setShowDeviceShell,
        openEventDetail,
        openServiceDetail,
        openMasjidDetail,
        startRegistration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
