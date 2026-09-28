import { 
  PrayerTimeItem, 
  EventItem, 
  ServiceItem, 
  ConnectMuslimItem, 
  MasjidItem, 
  DuaItem, 
  NotificationItem,
  UserRegistration 
} from '../types';

export const MASJID_INFO = {
  name: "Madina Masjid MKB Nagar",
  tamilName: "மதீனா மஸ்ஜித் எம்.கே.பி. நகர்",
  arabicName: "مسجد المدينة إم كي بي نجر",
  shortName: "Madina Masjid MKB Nagar",
  tagline: "A peaceful sanctuary for prayer, knowledge, and community care",
  establishedYear: 2004,
  address: "No. P.P. 8, 3rd Main Road, M.K.B. Nagar, Chennai - 600 039.",
  city: "M.K.B. Nagar, Chennai",
  capacity: "1,500 worshippers",
  phone: "+91 44 2551 2410",
  email: "contact@madinamasjid.org",
  website: "www.madinamasjid.org",
  imams: [
    {
      name: "Sheikh Dr. Abdullah Al-Rahman",
      role: "Head Imam & Religious Director",
      qualification: "Ph.D in Usul al-Fiqh, Al-Azhar University",
      bio: "Serving the Madina Masjid community for 14 years with emphasis on youth mentorship, marital counseling, and interfaith understanding.",
      languages: ["Arabic", "English", "Tamil", "Urdu"]
    },
    {
      name: "Ustadh Bilal Farooq",
      role: "Resident Scholar & Youth Director",
      qualification: "Graduate of Madinah Islamic University",
      bio: "Leads weekly youth Halaqahs, Quran memorization academy, and coordinates community welfare drives.",
      languages: ["English", "Tamil", "Arabic"]
    }
  ],
  muadhin: "Hafiz Muhammad Tariq",
  facilities: [
    "Spacious Main Prayer Hall (1,000 capacity)",
    "Dedicated Sisters' Prayer Area with separate entrance",
    "Clean Wudu & Ablution stations (24/7 water supply & accessible)",
    "Wheelchair accessible entrances & ramps",
    "On-site two-wheeler & car parking facility",
    "Islamic Library & Children's Reading Corner",
    "Community Welfare & Zakat Distribution Desk",
    "Janazah preparation & hearse coordination"
  ]
};

export const INITIAL_PRAYERS: PrayerTimeItem[] = [
  {
    id: 'fajr',
    name: 'Fajr',
    arabicName: 'الفجر',
    tamilName: 'ஃபஜ்ர்',
    adhanTime: '05:12 AM',
    iqamahTime: '05:35 AM',
    passed: true
  },
  {
    id: 'dhuhr',
    name: 'Dhuhr',
    arabicName: 'الظهر',
    tamilName: 'ளுஹர்',
    adhanTime: '01:04 PM',
    iqamahTime: '01:25 PM',
    passed: true
  },
  {
    id: 'asr',
    name: 'Asr',
    arabicName: 'العصر',
    tamilName: 'அஸர்',
    adhanTime: '04:32 PM',
    iqamahTime: '04:50 PM',
    current: true
  },
  {
    id: 'maghrib',
    name: 'Maghrib',
    arabicName: 'المغرب',
    tamilName: 'மஃரிப்',
    adhanTime: '07:14 PM',
    iqamahTime: '07:22 PM',
    passed: false
  },
  {
    id: 'isha',
    name: 'Isha',
    arabicName: 'العشاء',
    tamilName: 'இஷா',
    adhanTime: '08:36 PM',
    iqamahTime: '08:55 PM',
    passed: false
  }
];

export const JUMMAH_INFO = {
  firstShift: {
    khutbah: '01:15 PM',
    salah: '01:40 PM',
    khatib: 'Sheikh Dr. Abdullah Al-Rahman',
    topic: 'Purifying the Soul in Times of Distraction'
  },
  secondShift: {
    khutbah: '02:15 PM',
    salah: '02:40 PM',
    khatib: 'Ustadh Bilal Farooq',
    topic: 'Kindness to Parents & Elderly in Islam'
  }
};

export const RAMADAN_TIMINGS = {
  suhoorEnds: '05:08 AM',
  fajrAdhan: '05:12 AM',
  iftarTime: '07:14 PM',
  taraweehTime: '09:00 PM',
  dailyIftarSponsorNeed: '$350 per evening'
};

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Purification of the Heart: A Weekend Intensive',
    tamilTitle: 'உள்ளத்தின் தூய்மை: வார இறுதி மாநாடு',
    category: 'Lectures',
    date: 'Saturday, Sep 26, 2026',
    time: '10:00 AM - 01:30 PM',
    location: 'Main Prayer Hall & Live Stream',
    speaker: 'Sheikh Dr. Abdullah Al-Rahman',
    speakerRole: 'Head Imam, Madina Masjid MKB Nagar',
    imageFallbackGradient: 'from-[#D4A72C] to-[#B45309]',
    description: 'An insightful spiritual deep-dive into Imam Al-Ghazali\'s teachings on overcoming envy, pride, and spiritual numbness in modern times. Free childcare provided in the Youth Center.',
    registrationRequired: true,
    registeredCount: 142,
    capacity: 250,
    price: 'Free Admission'
  },
  {
    id: 'evt-2',
    title: 'Brothers & Youth Soccer League & Halaqah',
    tamilTitle: 'இளைஞர் கால்பந்து போட்டி & கலந்துரையாடல்',
    category: 'Youth',
    date: 'Sunday, Sep 27, 2026',
    time: '04:45 PM - 07:15 PM',
    location: 'Masjid Community Sports Turf',
    speaker: 'Ustadh Bilal Farooq',
    speakerRole: 'Youth Director',
    imageFallbackGradient: 'from-[#3B6FD8] to-[#1D4ED8]',
    description: 'Friendly 7-a-side community tournament followed by Maghrib prayer in congregation and an open Q&A circle over refreshments.',
    registrationRequired: true,
    registeredCount: 56,
    capacity: 64,
    price: 'Free'
  },
  {
    id: 'evt-3',
    title: 'Sisters Monthly Tea & Tajweed Mastery Circle',
    tamilTitle: 'பெண்கள் மாதாந்திர தஜ்வீத் பயிலரங்கம்',
    category: 'Sisters',
    date: 'Tuesday, Sep 29, 2026',
    time: '11:00 AM - 01:00 PM',
    location: 'Sisters Mezzanine Suite',
    speaker: 'Ustadha Maryam Al-Khatib',
    speakerRole: 'Ijazah Holder in Hafs & Warsh',
    imageFallbackGradient: 'from-[#7657C8] to-[#5B21B6]',
    description: 'Practical recitation corrections focusing on Surah Al-Kahf, followed by a warm discussion on balancing modern career and Islamic home life.',
    registrationRequired: true,
    registeredCount: 48,
    capacity: 60,
    price: 'Free'
  },
  {
    id: 'evt-4',
    title: 'Children\'s Weekend Quran & Character Academy',
    tamilTitle: 'சிறுவர் குர்ஆன் & நற்பண்பு வகுப்பு',
    category: 'Children',
    date: 'Every Saturday & Sunday',
    time: '09:30 AM - 12:30 PM',
    location: 'Education Wing Classrooms 1-4',
    speaker: 'Hafiz Muhammad Tariq & Faculty',
    speakerRole: 'Quran Academy Director',
    imageFallbackGradient: 'from-[#E89B3C] to-[#C2410C]',
    description: 'Structured Tajweed, Arabic reading, Prophet stories, and daily Adab for ages 5-14. Term 2 registrations now open.',
    registrationRequired: true,
    registeredCount: 88,
    capacity: 100,
    price: '$45/month (Financial aid available)'
  },
  {
    id: 'evt-5',
    title: 'Community Food Drive & Neighbors Day',
    tamilTitle: 'சமூக உணவு விநியோகம் & நல்லிணக்க தினம்',
    category: 'Community',
    date: 'Saturday, Oct 03, 2026',
    time: '11:00 AM - 02:00 PM',
    location: 'Community Hall Courtyard',
    speaker: 'Masjid Volunteer Board',
    speakerRole: 'Outreach Coordinators',
    imageFallbackGradient: 'from-[#159A9C] to-[#0F766E]',
    description: 'Packaging fresh produce and non-perishables for local families and vulnerable seniors. Open to all volunteers.',
    registrationRequired: false,
    registeredCount: 74,
    capacity: 120,
    price: 'Free Community Event'
  },
  {
    id: 'evt-6',
    title: 'Quranic Sciences & Tadabbur Intensive',
    tamilTitle: 'குர்ஆன் ததப்பூர் சிந்தனைப் பயிலரங்கம்',
    category: 'Quran',
    date: 'Friday, Oct 09, 2026',
    time: '07:30 PM - 09:30 PM',
    location: 'Main Prayer Hall & Library',
    speaker: 'Sheikh Dr. Abdullah Al-Rahman',
    speakerRole: 'Head Imam',
    imageFallbackGradient: 'from-[#087F5B] to-[#07543F]',
    description: 'Reflective recitation analysis of Juz Amma with root-word linguistic nuances and contemporary applications.',
    registrationRequired: true,
    registeredCount: 165,
    capacity: 220,
    price: 'Free Admission'
  }
];

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Zakat Assistance Fund',
    category: 'Welfare & Aid',
    iconName: 'Coins',
    badge: 'Confidential',
    shortDesc: 'Financial support for qualifying families for food, rent, and medical needs.',
    fullDesc: 'Our Zakat committee reviews applications strictly according to Islamic jurisprudence. All cases are kept 100% private and confidential to honor the dignity of recipients.',
    requirements: [
      'Proof of residency in the local district',
      'Recent 2-month bank statements or income proof',
      'Rent agreement or utility notice if requesting housing aid'
    ],
    contactPerson: 'Zakat Committee Lead: Brother Farooq',
    contactPhone: '+91 44 2551 2412',
    contactEmail: 'zakat@madinamasjid.org'
  },
  {
    id: 'srv-2',
    title: 'Funeral & Janazah Services',
    category: 'Essential',
    iconName: 'HeartHandshake',
    badge: '24/7 Hotline',
    shortDesc: 'End-to-end Islamic burial support, Ghusl facilities, and transport.',
    fullDesc: 'We assist bereaved families during their most painful moments with washing (Ghusl), shrouding (Kafan), Janazah prayer in the Masjid, and coordination with local Muslim cemeteries.',
    requirements: [
      'Hospital/Medical Examiner death certificate',
      'Immediate contact of our 24/7 emergency dispatch'
    ],
    contactPerson: 'Funeral Coordinator: Hajji Yusuf',
    contactPhone: '+91 44 2551 9911',
    contactEmail: 'janazah@madinamasjid.org'
  },
  {
    id: 'srv-3',
    title: 'Islamic Marriage / Nikah',
    category: 'Family',
    iconName: 'Sparkles',
    shortDesc: 'Official Nikah solemnization, pre-marital counseling, and certificates.',
    fullDesc: 'Conduct your sacred marriage ceremony in the blessed ambiance of the Masjid with Sheikh Abdullah Al-Rahman. Includes guidance on Mahr and rights in Islam.',
    requirements: [
      'Valid state marriage license from registrar office',
      'Two adult Muslim male witnesses with valid IDs',
      'Presence or written authorization of the bride\'s Wali'
    ],
    contactPerson: 'Administration Office',
    contactPhone: '+91 44 2551 2410',
    contactEmail: 'nikah@madinamasjid.org'
  },
  {
    id: 'srv-4',
    title: 'Pastoral & Family Counseling',
    category: 'Wellness',
    iconName: 'UserCheck',
    badge: 'Private',
    shortDesc: 'Confidential spiritual and family guidance with certified Imams.',
    fullDesc: 'Compassionate Islamic counseling for couples, parents dealing with youth challenges, and individuals experiencing grief or crisis of faith.',
    requirements: [
      'Advance appointment booking via mobile app or office',
      'Initial intake questionnaire completion'
    ],
    contactPerson: 'Sheikh Dr. Abdullah Al-Rahman',
    contactPhone: '+91 44 2551 2415',
    contactEmail: 'counseling@madinamasjid.org'
  },
  {
    id: 'srv-5',
    title: 'Quran & Tajweed Classes',
    category: 'Education',
    iconName: 'BookOpen',
    shortDesc: 'Recitation and Hifdh programs for kids, youth, and adults.',
    fullDesc: 'Programs tailored to your level, from Noorani Qaida for beginners to full Quran memorization with verified Ijazah teachers.',
    requirements: [
      'Brief 10-minute placement assessment for level matching',
      'Commitment to regular weekly attendance'
    ],
    contactPerson: 'Ustadh Tariq',
    contactPhone: '+91 44 2551 2416',
    contactEmail: 'quran@madinamasjid.org'
  },
  {
    id: 'srv-6',
    title: 'Volunteer Services',
    category: 'Community',
    iconName: 'Users',
    shortDesc: 'Join Jummah parking teams, security, meal prep, and event crews.',
    fullDesc: 'Earn continuous Sadaqah Jariyah by serving the guests of Allah. We welcome brothers and sisters across all skill sets.',
    requirements: [
      'Must be 16 years or older (or accompanied by parent)',
      'Attendance at 30-minute orientation session'
    ],
    contactPerson: 'Volunteer Lead: Sister Amina',
    contactPhone: '+91 44 2551 2418',
    contactEmail: 'volunteer@madinamasjid.org'
  },
  {
    id: 'srv-7',
    title: 'Community Food Pantry',
    category: 'Welfare & Aid',
    iconName: 'Package',
    shortDesc: 'Bi-weekly distribution of halal groceries and fresh produce.',
    fullDesc: 'Open every 1st and 3rd Sunday from 11:00 AM to 2:00 PM behind the community hall. Open to all neighbours regardless of faith.',
    requirements: [
      'Walk-in service, first-come first-served',
      'Bring reusable grocery bags if possible'
    ],
    contactPerson: 'Food Bank Director: Br. Kareem',
    contactPhone: '+91 44 2551 2420',
    contactEmail: 'foodpantry@madinamasjid.org'
  },
  {
    id: 'srv-8',
    title: 'Job & Career Assistance',
    category: 'Livelihood',
    iconName: 'Briefcase',
    shortDesc: 'Resume reviews, interview coaching, and local job connections.',
    fullDesc: 'Connected with Muslim professionals across tech, healthcare, trades, and education to mentor job-seekers and new immigrants.',
    requirements: [
      'Submit current resume/CV',
      'Brief description of desired career field'
    ],
    contactPerson: 'Br. Salman (HR Director)',
    contactPhone: '+91 44 2551 2422',
    contactEmail: 'careers@madinamasjid.org'
  }
];

export const CONNECT_MUSLIM_ITEMS: ConnectMuslimItem[] = [
  {
    id: 'cm-1',
    title: 'WorkHalal Jobs',
    subtitle: 'Halal Employment & Ethical Careers',
    category: 'Careers',
    icon: 'Briefcase',
    accentColor: '#3B6FD8',
    tag: '42 Local Openings',
    description: 'Browse verified job listings in ethical companies that accommodate Friday Jummah, daily prayer breaks, and family-friendly environments.',
    features: ['Verified halal-compliant workplaces', 'Direct messaging with Muslim recruiters', 'Internships for university youth'],
    stats: '180+ Placements'
  },
  {
    id: 'cm-2',
    title: 'Muslim Business Directory',
    subtitle: 'Support Local Muslim Entrepreneurs',
    category: 'Commerce',
    icon: 'Store',
    accentColor: '#D4A72C',
    tag: '120+ Businesses',
    description: 'Find halal restaurants, contractors, accountants, doctors, auto mechanics, and clothing boutiques owned by fellow community members.',
    features: ['Masjid member discounts', 'Community verified reviews', 'Location-based distance search'],
    stats: '4.9 ★ Community Trust'
  },
  {
    id: 'cm-3',
    title: 'Nikah Matrimony Network',
    subtitle: 'Sunnah-Aligned Blessed Matchmaking',
    category: 'Family',
    icon: 'Heart',
    accentColor: '#7657C8',
    tag: 'Wali-Guided',
    description: 'A dignified, private, and Islamic approach to finding a righteous spouse, with guardian involvement and verified background references.',
    features: ['Strict privacy & no public photos', 'Imam-moderated meetings', 'Pre-marital character verification'],
    stats: '64 Blessed Marriages'
  },
  {
    id: 'cm-4',
    title: 'Islamic Education Hub',
    subtitle: 'From Pre-K to Advanced Alimiyyah',
    category: 'Education',
    icon: 'GraduationCap',
    accentColor: '#087F5B',
    tag: 'Accredited',
    description: 'Explore full-time Islamic schools, homeschool cooperatives, weekend madrasahs, and online Arabic academies within our regional network.',
    features: ['Directory of 8 Islamic schools', 'Parent reviews & tuition guides', 'Homeschool curriculum swap'],
    stats: '1,200+ Students'
  },
  {
    id: 'cm-5',
    title: 'Muslim Healthcare Guild',
    subtitle: 'Culturally Sensitive Doctors & Clinics',
    category: 'Healthcare',
    icon: 'Activity',
    accentColor: '#159A9C',
    tag: 'Confidential Care',
    description: 'Find Muslim pediatricians, female OB-GYNs, mental health therapists, and dentists who understand your faith values and privacy needs.',
    features: ['Female doctors for sisters', 'Faith-based psychological counselors', 'Free health screening clinic days'],
    stats: '35 Registered Doctors'
  },
  {
    id: 'cm-6',
    title: 'Halal Community Marketplace',
    subtitle: 'Buy, Sell & Trade Locally',
    category: 'Marketplace',
    icon: 'ShoppingBag',
    accentColor: '#E89B3C',
    tag: 'Zero Interest',
    description: 'Safely sell Islamic books, modest apparel, children\'s toys, and household goods within a trusted, verified community circle.',
    features: ['Peer-to-peer neighborhood pickup', 'No transaction fees', 'Donation option for unsold goods'],
    stats: '300+ Active Listings'
  }
];

export const NEARBY_MASJIDS: MasjidItem[] = [
  {
    id: 'masjid-1',
    name: 'Madina Masjid MKB Nagar (Current)',
    address: 'No. P.P. 8, 3rd Main Road, M.K.B. Nagar, Chennai - 600 039.',
    distance: '0.0 km',
    travelTime: 'You are here',
    rating: 4.9,
    facilities: ["Women's Area", 'Parking', 'Jummah', 'Wheelchair', 'Wudu Hot Water'],
    hasWomenArea: true,
    hasParking: true,
    hasJummah: true,
    hasWheelchair: true,
    nextPrayer: 'Asr at 04:32 PM',
    phone: '+91 44 2551 2410',
    coordinates: { lat: 13.1167, lng: 80.2500 }
  },
  {
    id: 'masjid-2',
    name: 'Masjid Dar-us-Salam',
    address: 'M.K.B. Nagar Central, Chennai',
    distance: '1.2 km',
    travelTime: '4 min drive',
    rating: 4.8,
    facilities: ["Women's Area", 'Parking', 'Jummah', 'Wheelchair'],
    hasWomenArea: true,
    hasParking: true,
    hasJummah: true,
    hasWheelchair: true,
    nextPrayer: 'Asr at 04:35 PM',
    phone: '+91 44 2551 8890',
    coordinates: { lat: 13.1180, lng: 80.2520 }
  },
  {
    id: 'masjid-3',
    name: 'Masjid Al-Taqwa & Youth Academy',
    address: 'Vyasarpadi High Road, Chennai',
    distance: '2.8 km',
    travelTime: '8 min drive',
    rating: 4.7,
    facilities: ["Women's Area", 'Parking', 'Jummah', 'Youth Wing'],
    hasWomenArea: true,
    hasParking: true,
    hasJummah: true,
    hasWheelchair: true,
    nextPrayer: 'Asr at 04:30 PM',
    phone: '+91 44 2551 7766',
    coordinates: { lat: 13.1120, lng: 80.2600 }
  },
  {
    id: 'masjid-4',
    name: 'Baitul Mukarram Community Center',
    address: 'Perambur Market Road, Chennai',
    distance: '3.5 km',
    travelTime: '12 min drive',
    rating: 4.9,
    facilities: ["Women's Area", 'Parking', 'Jummah', 'Community Hall'],
    hasWomenArea: true,
    hasParking: true,
    hasJummah: true,
    hasWheelchair: false,
    nextPrayer: 'Asr at 04:34 PM',
    phone: '+91 44 2551 1122',
    coordinates: { lat: 13.1090, lng: 80.2450 }
  }
];

export const DAILY_DUAS: DuaItem[] = [
  {
    id: 'dua-1',
    title: 'Morning Remembrance for Well-being',
    tamilTitle: 'காலை நேரப் பாதுகாப்பு துஆ',
    category: 'Morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Asbahna wa-asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku wa lahul hamdu wa huwa \'ala kulli shay\'in qadeer.',
    englishMeaning: 'We have entered upon the morning and the whole kingdom belongs to Allah; all praise is due to Allah. None has the right to be worshipped but Allah alone, having no partner. His is the kingdom, and to Him belongs all praise, and He is over all things able.',
    tamilMeaning: 'நாங்களும் காலைப் பொழுதை அடைந்தோம்; அரசாட்சியும் அல்லாஹ்வுக்கே உரித்தாயிற்று. புகழனைத்தும் அல்லாஹ்வுக்கே. அல்லாஹ்வைத் தவிர வணக்கத்திற்குரியவன் யாருமில்லை. அவன் தனித்தவன், அவனுக்கு இணை துணை இல்லை.',
    reference: 'Sahih Muslim 2723',
    benefit: 'Recite once every morning for full spiritual serenity and gratitude.',
    isFavorite: true
  },
  {
    id: 'dua-2',
    title: 'Dua Before Travelling',
    tamilTitle: 'பயணத்திற்கான துஆ',
    category: 'Travel',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhana-lladhi sakh-khara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.',
    englishMeaning: 'Glory unto Him Who has subjected this to our use, though for it we had not the power ourselves. And surely, to our Lord must we return.',
    tamilMeaning: 'இதனை எங்களுக்கு வசப்படுத்தித் தந்தவன் மகா பரிசுத்தமானவன். (இல்லையெனில்) இதனை வசப்படுத்த நம்மால் இயன்றிருக்காது. நிச்சயமாக நாம் நம் இறைவனிடமே திரும்பிச் செல்பவர்கள்.',
    reference: 'Surah Az-Zukhruf (43:13-14)',
    benefit: 'Recite when boarding your vehicle, bus, train, or flight for divine protection.'
  },
  {
    id: 'dua-3',
    title: 'Dua for Divine Protection from Harm',
    tamilTitle: 'தீங்குகளிலிருந்து பாதுகாப்பு தேடும் துஆ',
    category: 'Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-Sami\'ul-\'Aleem.',
    englishMeaning: 'In the name of Allah, with whose name nothing can cause harm in the earth or in the heavens, and He is the All-Hearing, the All-Knowing.',
    tamilMeaning: 'அல்லாஹ்வின் திருநாமத்தால் (பாதுகாப்புத் தேடுகிறேன்); அவனது பெயரைக் கொண்டு பூமியிலோ வானத்திலோ எந்த ஒரு பொருளும் தீங்கிழைக்க முடியாது. அவன் அனைத்தையும் செவியேற்பவன், நன்கறிபவன்.',
    reference: 'Sunan Abi Dawud 5088',
    benefit: 'Recite 3 times morning and evening. The Prophet ﷺ said nothing will harm whoever says it.'
  },
  {
    id: 'dua-4',
    title: 'Dua for Righteous Family & Offspring',
    tamilTitle: 'குடும்பம் மற்றும் பிள்ளைகளுக்கான துஆ',
    category: 'Family',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yunin waj\'alna lil-muttaqina imama.',
    englishMeaning: 'Our Lord! Bestow on us from our wives and our offspring the comfort of our eyes, and make us leaders of the righteous.',
    tamilMeaning: 'எங்கள் இறைவா! எங்கள் துணைவியரிடமிருந்தும் எங்கள் பிள்ளைகளிடமிருந்தும் எங்கள் கண்களுக்குக் குளிர்ச்சியை எங்களுக்கு வழங்குவாயாக! பயபக்தியுடையவர்களுக்கு எங்களை முன்னோடிகளாக ஆக்குவாயாக!',
    reference: 'Surah Al-Furqan (25:74)',
    benefit: 'Bring peace, loyalty, and Islamic virtue to your home.'
  },
  {
    id: 'dua-5',
    title: 'Dua for Increase in Halal Rizq & Knowledge',
    tamilTitle: 'ஹலால் வாழ்வாதாரம் & கல்விக்கான துஆ',
    category: 'Rizq',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
    transliteration: 'Allahumma inni as\'aluka \'ilman nafi\'an, wa rizqan tayyiban, wa \'amalan mutaqabbala.',
    englishMeaning: 'O Allah, I ask You for beneficial knowledge, wholesome sustenance, and accepted deeds.',
    tamilMeaning: 'யா அல்லாஹ்! நிச்சயமாக நான் உன்னிடம் பயனளிக்கும் கல்வியையும், தூய்மையான வாழ்வாதாரத்தையும், ஏற்றுக்கொள்ளப்படக்கூடிய நற்செயல்களையும் வேண்டுகிறேன்.',
    reference: 'Sunan Ibn Majah 925',
    benefit: 'Recite after Fajr prayer for barakah in your work and business.'
  },
  {
    id: 'dua-6',
    title: 'Master Supplication for Forgiveness (Sayyidul Istighfar)',
    tamilTitle: 'பாவமன்னிப்பின் முதன்மையான துஆ (சையிதுல் இஸ்திஃபார்)',
    category: 'Forgiveness',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma Anta Rabbi la ilaha illa Anta, khalaqtani wa ana \'abduka, wa ana \'ala \'ahdika wa wa\'dika mastata\'tu, a\'udhu bika min sharri ma sana\'tu, abu\'u laka bini\'matika \'alayya, wa abu\'u laka bidhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Anta.',
    englishMeaning: 'O Allah, You are my Lord, none has the right to be worshipped but You. You created me and I am Your slave. I abide by Your covenant as best as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your blessing upon me, and I confess my sins to You, so forgive me, for none forgives sins except You.',
    tamilMeaning: 'யா அல்லாஹ்! நீயே என் இறைவன். உன்னைத் தவிர வணக்கத்திற்குரியவன் வேறு யாருமில்லை. நீயே என்னை படைத்தாய், நான் உனது அடிமை. உனது உடன்படிக்கையின் மீதும் வாக்குறுதியின் மீதும் என்னால் முடிந்தவரை நிலைத்து நிற்கிறேன்...',
    reference: 'Sahih al-Bukhari 6306',
    benefit: 'The Prophet ﷺ said whoever recites this with firm faith in the evening and dies that night will enter Paradise.'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Friday Jummah Parking Advisory',
    message: 'Due to road maintenance on 3rd Main Road, please utilize the M.K.B. Nagar side entrance and carpool where possible.',
    timeAgo: '15 mins ago',
    category: 'Important Notices',
    isRead: false,
    urgent: true
  },
  {
    id: 'notif-2',
    title: 'Maghrib Prayer Adhan in 2 Hours',
    message: 'Maghrib Adhan today is at 07:14 PM followed by Iqamah at 07:22 PM. Join us for Quran reading prior to sunset.',
    timeAgo: '1 hour ago',
    category: 'Prayer Alerts',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Zakat al-Fitr & Assistance Applications Open',
    message: 'Families seeking seasonal assistance or wishing to calculate and disburse their annual Zakat can consult the office team daily after Asr.',
    timeAgo: '5 hours ago',
    category: 'Community Services',
    isRead: true
  },
  {
    id: 'notif-4',
    title: 'Youth Soccer & Halaqah Registration Live',
    message: 'Only 8 spots remain for Sunday afternoon friendly matches with Ustadh Bilal Farooq. Reserve your spot today.',
    timeAgo: 'Yesterday',
    category: 'Events',
    isRead: true
  }
];

export const TODAY_REMINDER = {
  ayah: {
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    english: 'Those who have believed and whose hearts find rest in the remembrance of Allah. Verily, in the remembrance of Allah do hearts find rest.',
    tamil: 'அவர்கள் எத்தகையோரென்றால் நம்பிக்கை கொண்டவர்கள்; மேலும் அல்லாஹ்வின் நினைவால் அவர்களுடைய உள்ளங்கள் அமைதி பெறுகின்றன. அறிந்துகொள்ளுங்கள்: அல்லாஹ்வின் நினைவால் மட்டுமே உள்ளங்கள் அமைதி பெறுகின்றன.',
    surah: 'Surah Ar-Ra\'d (13:28)'
  },
  hadith: {
    narrator: 'Abu Hurairah (may Allah be pleased with him)',
    text: 'The Messenger of Allah ﷺ said: "The best of days upon which the sun has risen is Friday: on it Adam was created, on it he was admitted into Paradise, and on it he was expelled from it."',
    source: 'Sahih Muslim 854'
  }
};

export const MOCK_REGISTRATIONS: UserRegistration[] = [
  {
    id: 'reg-101',
    type: 'New Member',
    title: 'Masjid Membership Card #MMM-8842',
    date: 'Aug 14, 2026',
    status: 'Active'
  },
  {
    id: 'reg-102',
    type: 'Event',
    title: 'Purification of the Heart Intensive',
    date: 'Sep 26, 2026',
    status: 'Confirmed'
  },
  {
    id: 'reg-103',
    type: 'Volunteer',
    title: 'Friday Jummah Hospitality & Logistics Team',
    date: 'Sep 01, 2026',
    status: 'Active'
  }
];

export const DONATION_FUNDS = [
  { id: 'masjid_dev', name: 'Masjid Expansion & Maintenance', desc: 'Roof waterproofing, carpet renewal & classroom build' },
  { id: 'zakat', name: 'Zakat al-Maal (Obligatory Charity)', desc: '100% directly given to eligible impoverished Muslim families' },
  { id: 'sadaqah', name: 'General Sadaqah & Welfare', desc: 'Daily water bottles, Quran distribution & emergency relief' },
  { id: 'education', name: 'Quran Academy & Youth Scholarships', desc: 'Subsidize madrasah tuition for needy children' },
  { id: 'food_dist', name: 'Bi-Weekly Food Pantry & Iftar Meals', desc: 'Fresh halal grocery packs for low-income seniors & refugees' }
];

export const QURAN_SURAHS = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', meaning: 'The Opening', ayahCount: 7, revelation: 'Meccan' },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', meaning: 'Ya-Sin (Heart of Quran)', ayahCount: 83, revelation: 'Meccan' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', meaning: 'The Beneficent', ayahCount: 78, revelation: 'Medinan' },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqi\'ah', meaning: 'The Inevitable Event', ayahCount: 96, revelation: 'Meccan' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', meaning: 'The Sovereignty', ayahCount: 30, revelation: 'Meccan' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', meaning: 'The Sincerity & Oneness', ayahCount: 4, revelation: 'Meccan' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', meaning: 'The Daybreak', ayahCount: 5, revelation: 'Meccan' },
  { number: 114, name: 'الناس', englishName: 'An-Nas', meaning: 'Mankind', ayahCount: 6, revelation: 'Meccan' }
];

export const MOCK_SURAHS = QURAN_SURAHS;

export const RECORDED_BAYANS = [
  {
    id: 'bayan-1',
    title: 'The Reality of Taqwa in Daily Life',
    speaker: 'Sheikh Dr. Abdullah Al-Rahman',
    duration: '38:15',
    date: 'Sep 19, 2026',
    category: 'Friday Khutbah'
  },
  {
    id: 'bayan-2',
    title: 'Youth in the Shade of the Divine Throne',
    speaker: 'Ustadh Bilal Farooq',
    duration: '42:10',
    date: 'Sep 12, 2026',
    category: 'Weekly Halaqah'
  },
  {
    id: 'bayan-3',
    title: 'Stories of the Sahabah: Mus\'ab ibn Umayr',
    speaker: 'Sheikh Dr. Abdullah Al-Rahman',
    duration: '51:00',
    date: 'Sep 05, 2026',
    category: 'Seerah Series'
  }
];

export const MOCK_LOST_AND_FOUND = [
  {
    id: 'lf-1',
    title: 'Black Leather Men\'s Wallet with keys',
    description: 'Black bi-fold wallet containing ID card and set of 3 keys with crescent keychain.',
    location: 'Sister\'s Entrance Mezzanine',
    date: 'Sep 22, 2026',
    status: 'Held in Office',
    category: 'Valuables',
    contactPerson: 'Masjid Admin Desk'
  },
  {
    id: 'lf-2',
    title: 'Gold-framed Reading Glasses in case',
    description: 'RayBan prescription reading glasses found in brown leather case on the library study desk.',
    location: '2nd Floor Islamic Library',
    date: 'Sep 20, 2026',
    status: 'Held in Office',
    category: 'Accessories',
    contactPerson: 'Masjid Admin Desk'
  },
  {
    id: 'lf-3',
    title: 'Boy\'s Navy Blue Winter Jacket (Age 8)',
    description: 'Gap Kids navy blue puffer jacket left after Sunday youth soccer program.',
    location: 'Youth Sports Turf Bench',
    date: 'Sep 18, 2026',
    status: 'Ready for Pickup',
    category: 'Clothing',
    contactPerson: 'Brother Tariq'
  }
];

export const LOST_AND_FOUND_ITEMS = MOCK_LOST_AND_FOUND;

// Also provide alias for DAILY_DUAS as MOCK_DUAS
export const MOCK_DUAS = DAILY_DUAS.map(d => ({
  ...d,
  english: d.englishMeaning,
  tamil: d.tamilMeaning,
  source: d.reference,
  occasion: d.benefit
}));

