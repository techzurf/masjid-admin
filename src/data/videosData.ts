export interface MasjidVideoItem {
  id: string; // YouTube Video ID
  title: string;
  category?: string;
  duration?: string;
  date?: string;
  youtubeUrl: string;
  description?: string;
}

/**
 * Reusable list of YouTube videos displayed on the Madina Masjid MKB Nagar Home Page.
 * You can easily add, remove, or modify items here without modifying UI components.
 */
export const LATEST_MASJID_VIDEOS: MasjidVideoItem[] = [
  {
    id: 'fokaam6BMWY',
    title: 'Madina Masjid MKB Nagar - Community Gathering & Jummah Khutbah',
    category: 'Jummah & Khutbah',
    duration: 'Khutbah',
    date: 'Recent Update',
    youtubeUrl: 'https://www.youtube.com/watch?v=fokaam6BMWY',
    description: 'Weekly Jummah Khutbah and spiritual reminder at Madina Masjid MKB Nagar.'
  },
  {
    id: '9e3Fn0FOlhg',
    title: 'Madina Masjid MKB Nagar - Special Bayan & Dawah Program',
    category: 'Islamic Lecture',
    duration: 'Lecture',
    date: 'Recent Update',
    youtubeUrl: 'https://www.youtube.com/watch?v=9e3Fn0FOlhg',
    description: 'Special educational program and speech conducted at Madina Masjid MKB Nagar.'
  },
  {
    id: 'OeSpmt7AtE8',
    title: 'Madina Masjid MKB Nagar - Quran Recitation & Reflections',
    category: 'Quran & Tilawat',
    duration: 'Tilawat',
    date: 'Recent Update',
    youtubeUrl: 'https://www.youtube.com/watch?v=OeSpmt7AtE8',
    description: 'Heartfelt Quran recitation and spiritual reflections at Madina Masjid.'
  },
  {
    id: 'YgL9NOY8M6I',
    title: 'Madina Masjid MKB Nagar - Community Welfare & Masjid Updates',
    category: 'Community News',
    duration: 'Masjid Update',
    date: 'Recent Update',
    youtubeUrl: 'https://www.youtube.com/watch?v=YgL9NOY8M6I',
    description: 'Latest community development, maintenance, and facility updates from Madina Masjid.'
  }
];
