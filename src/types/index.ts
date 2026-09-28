export type ActiveTab = 'home' | 'prayers' | 'events' | 'services' | 'masjid' | 'profile';

export type OverlayScreen = 
  | null
  | 'splash'
  | 'onboarding'
  | 'qibla'
  | 'tasbeeh'
  | 'locator'
  | 'connect_muslim'
  | 'notifications'
  | 'donation'
  | 'registration'
  | 'quran'
  | 'duas'
  | 'settings'
  | 'about_masjid'
  | 'lost_found'
  | 'event_detail'
  | 'service_detail'
  | 'monthly_timetable';

export type AppLanguage = 'en' | 'ta' | 'ar';

export interface PrayerTimeItem {
  id: string;
  name: string;
  arabicName: string;
  tamilName: string;
  adhanTime: string;
  iqamahTime: string;
  passed?: boolean;
  current?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  tamilTitle?: string;
  category: 'Religious' | 'Lectures' | 'Quran' | 'Youth' | 'Sisters' | 'Children' | 'Community' | 'Fundraising';
  date: string;
  time: string;
  location: string;
  speaker: string;
  speakerRole: string;
  imageFallbackGradient: string;
  description: string;
  registrationRequired: boolean;
  registeredCount: number;
  capacity: number;
  price: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  requirements: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  badge?: string;
}

export interface ConnectMuslimItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  accentColor: string;
  tag: string;
  description: string;
  features: string[];
  stats: string;
}

export interface MasjidItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  travelTime: string;
  rating: number;
  facilities: string[];
  hasWomenArea: boolean;
  hasParking: boolean;
  hasJummah: boolean;
  hasWheelchair: boolean;
  nextPrayer: string;
  phone: string;
  coordinates: { lat: number; lng: number };
}

export interface DuaItem {
  id: string;
  title: string;
  tamilTitle: string;
  category: 'Morning' | 'Evening' | 'Travel' | 'Protection' | 'Family' | 'Rizq' | 'Forgiveness';
  arabic: string;
  transliteration: string;
  englishMeaning: string;
  tamilMeaning: string;
  reference: string;
  benefit: string;
  isFavorite?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  category: 'Prayer Alerts' | 'Masjid Announcements' | 'Events' | 'Community Services' | 'Important Notices';
  isRead: boolean;
  urgent?: boolean;
}

export interface UserRegistration {
  id: string;
  type: 'New Member' | 'Volunteer' | 'Event' | 'Service';
  title: string;
  date: string;
  status: 'Confirmed' | 'Under Review' | 'Active';
}

export type AthanSoundType = 'Makkah' | 'Madinah' | 'Al-Aqsa' | 'Soft Beep' | 'Bismillah' | 'Custom' | 'Silent';

export interface ApproachingPrayerAlert {
  id: string;
  prayerName: string;
  arabicName: string;
  time: string;
  minutesLeft: number;
  type: 'approaching' | 'adhan';
  iqamahTime?: string;
}

export interface AppSettings {
  language: AppLanguage;
  seniorMode: boolean; // Large text, high contrast
  ramadanMode: boolean;
  prayerNotifications: {
    fajr: boolean;
    sunrise: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
    jummahReminder: boolean;
  };
  athanSound: AthanSoundType;
  reminderMinutesBefore: number; // e.g. 0, 5, 10, 15, 20, 30 minutes before prayer
  customAudioName?: string;
  customAudioDataUrl?: string;
  alertVolume: number; // 0 to 1
  vibrateOnAlert: boolean;
  hapticFeedback: boolean; // Subtle tactile feedback on interactions
  calculationMethod: string;
}
