export interface AdminStats {
  members: number;
  events: number;
  notices: number;
  donations: string;
  prayerNotifications: number;
  bayanVideos: number;
  activeUsers: number;
  bayanViews: number;
}

export const INITIAL_ADMIN_STATS: AdminStats = {
  members: 1248,
  events: 12,
  notices: 8,
  donations: '₹85,400',
  prayerNotifications: 24,
  bayanVideos: 36,
  activeUsers: 864,
  bayanViews: 4820
};

export interface AdminPrayerItem {
  id: string;
  name: string;
  arabicName: string;
  adhanTime: string;
  jamaahTime: string;
  enabled: boolean;
}

export const INITIAL_ADMIN_PRAYERS: AdminPrayerItem[] = [
  { id: 'fajr', name: 'Fajr', arabicName: 'الفجر', adhanTime: '05:12 AM', jamaahTime: '05:35 AM', enabled: true },
  { id: 'sunrise', name: 'Sunrise', arabicName: 'الشروق', adhanTime: '06:18 AM', jamaahTime: '-', enabled: true },
  { id: 'dhuhr', name: 'Dhuhr', arabicName: 'الظهر', adhanTime: '01:04 PM', jamaahTime: '01:25 PM', enabled: true },
  { id: 'asr', name: 'Asr', arabicName: 'العصر', adhanTime: '04:32 PM', jamaahTime: '04:50 PM', enabled: true },
  { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', adhanTime: '07:14 PM', jamaahTime: '07:20 PM', enabled: true },
  { id: 'isha', name: 'Isha', arabicName: 'العشاء', adhanTime: '08:36 PM', jamaahTime: '08:55 PM', enabled: true },
  { id: 'jumuah1', name: "1st Jumu'ah", arabicName: 'الجمعة الأولى', adhanTime: '01:00 PM', jamaahTime: '01:15 PM', enabled: true },
  { id: 'jumuah2', name: "2nd Jumu'ah", arabicName: 'الجمعة الثانية', adhanTime: '02:00 PM', jamaahTime: '02:15 PM', enabled: true }
];

export interface AdminNotice {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'High' | 'Medium' | 'Normal';
  status: 'Active' | 'Scheduled' | 'Draft';
}

export const INITIAL_NOTICES: AdminNotice[] = [
  {
    id: 'not-1',
    title: "Friday Jumu'ah Parking Advisory",
    description: "Two-wheeler parking designated on 3rd Main Road. Please avoid parking in front of emergency gates and residential driveways.",
    date: "15 mins ago",
    priority: "High",
    status: "Active"
  },
  {
    id: 'not-2',
    title: "Masjid Cleaning Schedule",
    description: "Deep carpet cleaning and water filtration disinfection taking place on Thursday post-Isha. Please cooperate with volunteer teams.",
    date: "Yesterday",
    priority: "Normal",
    status: "Active"
  },
  {
    id: 'not-3',
    title: "Ramadan Announcement",
    description: "Moon sighting committee coordination meeting scheduled for 29th Sha'ban after Maghrib at Madina Masjid Conference Hall.",
    date: "2 days ago",
    priority: "High",
    status: "Active"
  },
  {
    id: 'not-4',
    title: "Free Community Health Camp",
    description: "Annual preventive cardiology, glucose, and eye checkup camp organized in partnership with Apollo Community Clinics.",
    date: "4 days ago",
    priority: "Medium",
    status: "Scheduled"
  }
];

export interface AdminEvent {
  id: string;
  title: string;
  speaker: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Completed' | 'Draft';
  image: string;
  attendees: number;
}

export const INITIAL_EVENTS: AdminEvent[] = [
  {
    id: 'evt-1',
    title: "Weekly Bayan",
    speaker: "Sheikh Dr. Abdullah Al-Rahman",
    description: "Weekly spiritually enriching halaqa covering classical prophetic ethics and contemporary family life.",
    date: "Friday",
    time: "8:00 PM",
    location: "Main Prayer Hall",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80",
    attendees: 320
  },
  {
    id: 'evt-2',
    title: "Youth Quran Tajweed Academy",
    speaker: "Ustadh Bilal Farooq",
    description: "Weekend intensive Quran recitation, Makharij training, and memorization circle for ages 9 to 18.",
    date: "Saturday",
    time: "09:30 AM",
    location: "Madrasah Hall (1st Floor)",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80",
    attendees: 85
  },
  {
    id: 'evt-3',
    title: "Community Iftar & Taraweeh Lead",
    speaker: "Head Muadhin Tariq & Resident Imams",
    description: "Grand community iftar meals for fasting worshippers followed by Taraweeh and Khatam al-Quran.",
    date: "Daily in Ramadan",
    time: "06:30 PM",
    location: "Courtyard & Dining Hall",
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=600&q=80",
    attendees: 650
  }
];

export interface AdminBayan {
  id: string;
  title: string;
  speaker: string;
  description: string;
  youtubeUrl: string;
  thumbnail: string;
  date: string;
  duration: string;
  views: number;
}

export const INITIAL_BAYANS: AdminBayan[] = [
  {
    id: 'byn-1',
    title: "Purification of the Heart & Spiritual Focus in Salah",
    speaker: "Sheikh Dr. Abdullah Al-Rahman",
    description: "Deep dive into attaining Khushu and removing worldly distractions in daily prayers.",
    youtubeUrl: "https://www.youtube.com/watch?v=gT2U_R0hZJ8",
    thumbnail: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80",
    date: "Sep 22, 2026",
    duration: "42:15",
    views: 1840
  },
  {
    id: 'byn-2',
    title: "Rights of Neighbors & Community Kindness in Islam",
    speaker: "Ustadh Bilal Farooq",
    description: "Practical guide to prophetic neighborly relations and building cohesive communities.",
    youtubeUrl: "https://www.youtube.com/watch?v=F1gE8cQ5nXY",
    thumbnail: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=600&q=80",
    date: "Sep 15, 2026",
    duration: "35:40",
    views: 1420
  },
  {
    id: 'byn-3',
    title: "Preparation for Blessed Ramadan 1448",
    speaker: "Sheikh Dr. Abdullah Al-Rahman",
    description: "Maximizing the spiritual fruits of fasting, repentance, and charitable giving.",
    youtubeUrl: "https://www.youtube.com/watch?v=kY3B9V6X810",
    thumbnail: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80",
    date: "Sep 08, 2026",
    duration: "51:10",
    views: 2240
  }
];

export interface AdminDonationSettings {
  upiId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  purposes: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }[];
}

export const INITIAL_DONATION_SETTINGS: AdminDonationSettings = {
  upiId: "masjidmkbnagar@upi",
  bankName: "HDFC Bank",
  accountName: "Masjid MKB Nagar",
  accountNumber: "5020 0089 4123 76",
  ifsc: "HDFC0001234",
  branch: "MKB Nagar Branch, Chennai",
  purposes: [
    { id: 'p1', name: 'Masjid Development', description: 'Support construction and improvements', enabled: true },
    { id: 'p2', name: 'Masjid Maintenance', description: 'Electricity, cleaning & daily maintenance', enabled: true },
    { id: 'p3', name: 'Islamic Education', description: 'Support Quran & Islamic learning', enabled: true },
    { id: 'p4', name: 'Ramadan & Iftar', description: 'Support Ramadan programs and Iftar', enabled: true },
    { id: 'p5', name: 'Zakat', description: 'Zakat contributions', enabled: true },
    { id: 'p6', name: 'Sadaqah', description: 'General Sadaqah', enabled: true },
    { id: 'p7', name: 'General Donation', description: 'Support Masjid activities', enabled: true }
  ]
};

export interface AdminMember {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  familyMembers: number;
  registrationDate: string;
  status: 'Active' | 'Inactive';
}

export const INITIAL_MEMBERS: AdminMember[] = [
  { id: 'MEM-101', name: 'Mohammed Farooq', mobile: '+91 98401 23456', email: 'farooq.m@example.com', address: 'Plot 14, 2nd Main Rd, MKB Nagar', familyMembers: 5, registrationDate: '12 Jan 2026', status: 'Active' },
  { id: 'MEM-102', name: 'Abdul Rahman Syed', mobile: '+91 97902 34567', email: 'abdul.syed@example.com', address: 'No 45, 4th Cross St, MKB Nagar', familyMembers: 4, registrationDate: '18 Jan 2026', status: 'Active' },
  { id: 'MEM-103', name: 'Fatima Zohra', mobile: '+91 94440 87654', email: 'fatima.z@example.com', address: 'Flat B3, Crescent Apts, MKB Nagar', familyMembers: 3, registrationDate: '02 Feb 2026', status: 'Active' },
  { id: 'MEM-104', name: 'Haji Ibrahim Basha', mobile: '+91 98845 67890', email: 'ibrahim.b@example.com', address: 'No 88, 3rd Main Rd, MKB Nagar', familyMembers: 6, registrationDate: '14 Feb 2026', status: 'Active' },
  { id: 'MEM-105', name: 'Sadiq Ali Khan', mobile: '+91 91763 45123', email: 'sadiq.k@example.com', address: 'No 12, 1st Cross, MKB Nagar', familyMembers: 2, registrationDate: '01 Mar 2026', status: 'Inactive' },
  { id: 'MEM-106', name: 'Dr. Tariq Jameel', mobile: '+91 96001 22334', email: 'dr.tariq@example.com', address: 'Plot 29, Central Avenue, Chennai 39', familyMembers: 4, registrationDate: '15 Mar 2026', status: 'Active' }
];

export interface AdminServiceToggle {
  id: string;
  name: string;
  description: string;
  iconName: string;
  enabled: boolean;
  order: number;
}

export const INITIAL_ADMIN_SERVICES: AdminServiceToggle[] = [
  { id: 'locator', name: 'Masjid Locator', description: 'Nearby Masjids & directions', iconName: 'MapPin', enabled: true, order: 1 },
  { id: 'register', name: 'Register', description: 'New member registration', iconName: 'UserPlus', enabled: true, order: 2 },
  { id: 'qibla', name: 'Qibla', description: 'Accurate compass direction', iconName: 'Compass', enabled: true, order: 3 },
  { id: 'tasbeeh', name: 'Tasbeeh', description: 'Digital dhikr counter', iconName: 'Sparkles', enabled: true, order: 4 },
  { id: 'services', name: 'Services', description: 'All community services', iconName: 'LayoutGrid', enabled: true, order: 5 },
  { id: 'donation', name: 'Donation', description: 'Direct UPI & Bank transfer', iconName: 'HeartHandshake', enabled: true, order: 6 },
  { id: 'bayan', name: 'Bayan', description: 'Watch and listen to bayans', iconName: 'Mic', enabled: true, order: 7 },
  { id: 'quran', name: 'Quran', description: 'Read holy Quran surahs', iconName: 'BookOpen', enabled: true, order: 8 },
  { id: 'hadith', name: 'Hadith', description: 'Daily authentic hadiths', iconName: 'BookMarked', enabled: true, order: 9 },
  { id: 'dua', name: 'Dua', description: 'Daily supplications & Azkar', iconName: 'Heart', enabled: true, order: 10 },
  { id: 'calendar', name: 'Islamic Calendar', description: 'Hijri dates & events', iconName: 'CalendarDays', enabled: true, order: 11 },
  { id: 'zakat', name: 'Zakat', description: 'Zakat calculation & aid', iconName: 'Coins', enabled: true, order: 12 },
  { id: 'events', name: 'Events', description: 'Upcoming community programs', iconName: 'CalendarCheck', enabled: true, order: 13 }
];

export interface AdminHadithItem {
  id: string;
  text: string;
  reference: string;
  category: string;
  status: 'Active' | 'Scheduled' | 'Draft';
}

export const INITIAL_HADITHS: AdminHadithItem[] = [
  {
    id: 'had-1',
    text: "The best among you are those who learn the Qur'an and teach it to others.",
    reference: "Sahih al-Bukhari 5027",
    category: "Knowledge",
    status: "Active"
  },
  {
    id: 'had-2',
    text: "Charity does not decrease wealth, and the servant who forgives, Allah increases his dignity.",
    reference: "Sahih Muslim 2588",
    category: "Charity",
    status: "Active"
  },
  {
    id: 'had-3',
    text: "Whoever builds a mosque for Allah, Allah will build for him a house like it in Paradise.",
    reference: "Sahih al-Bukhari 450",
    category: "Masjid",
    status: "Active"
  },
  {
    id: 'had-4',
    text: "Make things easy and do not make them difficult, cheer people up and do not drive them away.",
    reference: "Sahih al-Bukhari 69",
    category: "Manners",
    status: "Active"
  }
];

export interface AdminDuaItem {
  id: string;
  title: string;
  arabic: string;
  translation: string;
  reference: string;
  category: string;
  status: 'Active' | 'Draft';
}

export const INITIAL_DUAS: AdminDuaItem[] = [
  {
    id: 'dua-1',
    title: "Dua for Entering the Masjid",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    translation: "O Allah, open the doors of Your mercy for me.",
    reference: "Sahih Muslim 713",
    category: "Daily Duas",
    status: "Active"
  },
  {
    id: 'dua-2',
    title: "Morning Remembrance",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    translation: "We have reached the morning, and the dominion belongs to Allah, and all praise is for Allah.",
    reference: "Sahih Muslim 2723",
    category: "Morning",
    status: "Active"
  },
  {
    id: 'dua-3',
    title: "Dua for Travel & Protection",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ",
    translation: "Glory be to Him Who has subjected this to us, and we could never have had it by our own efforts.",
    reference: "Surah Az-Zukhruf 43:13",
    category: "Travel",
    status: "Active"
  },
  {
    id: 'dua-4',
    title: "Dua After Salah",
    arabic: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    translation: "O Allah, You are Peace, and from You comes peace. Blessed are You, O Owner of majesty and honor.",
    reference: "Sahih Muslim 591",
    category: "After Salah",
    status: "Active"
  }
];

export interface AdminSurahItem {
  number: number;
  name: string;
  englishName: string;
  ayahCount: number;
  revelation: string;
  enabled: boolean;
}

export const INITIAL_SURAHS: AdminSurahItem[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', ayahCount: 7, revelation: 'Meccan', enabled: true },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', ayahCount: 83, revelation: 'Meccan', enabled: true },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', ayahCount: 78, revelation: 'Medinan', enabled: true },
  { number: 56, name: 'الواقعة', englishName: "Al-Waqi'ah", ayahCount: 96, revelation: 'Meccan', enabled: true },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', ayahCount: 30, revelation: 'Meccan', enabled: true },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', ayahCount: 4, revelation: 'Meccan', enabled: true },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', ayahCount: 5, revelation: 'Meccan', enabled: true },
  { number: 114, name: 'الناس', englishName: 'An-Nas', ayahCount: 6, revelation: 'Meccan', enabled: true }
];

export interface AdminNotificationHistory {
  id: string;
  title: string;
  message: string;
  audience: string;
  sentAt: string;
  recipientsCount: number;
}

export const INITIAL_NOTIFICATIONS: AdminNotificationHistory[] = [
  {
    id: 'notif-1',
    title: "Friday Jumu'ah Parking Notice",
    message: "Kindly park vehicles on 3rd Main Rd side bays to avoid congestion.",
    audience: "All Users",
    sentAt: "Today, 11:30 AM",
    recipientsCount: 1180
  },
  {
    id: 'notif-2',
    title: "Maghrib Adhan Alert",
    message: "Maghrib prayer call in 15 minutes. Prepare for congregational Salah.",
    audience: "Masjid Members",
    sentAt: "Yesterday, 06:55 PM",
    recipientsCount: 864
  },
  {
    id: 'notif-3',
    title: "Youth Halaqa Tonight at 8:00 PM",
    message: "Don't miss tonight's interactive youth talk with Ustadh Bilal Farooq.",
    audience: "Specific Group (Youth)",
    sentAt: "22 Sep, 05:00 PM",
    recipientsCount: 240
  }
];
