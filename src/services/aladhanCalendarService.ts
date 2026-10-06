/**
 * AlAdhan Islamic Calendar API Service
 * Base URL: https://api.aladhan.com/v1
 * Calculation Method: UAQ (Umm al-Qura)
 */

export interface HijriDayData {
  hijri: {
    date: string; // DD-MM-YYYY
    day: string;
    weekday: { en: string; ar: string };
    month: { number: number; en: string; ar: string; days: number };
    year: string;
    designation: { abbreviated: string; expanded: string };
    holidays: string[];
  };
  gregorian: {
    date: string; // DD-MM-YYYY
    day: string;
    weekday: { en: string };
    month: { number: number; en: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
  };
}

export interface TodayHijriInfo {
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  hijriMonthNameEn: string;
  hijriMonthNameAr: string;
  weekdayEn: string;
  weekdayAr: string;
  gregorianDateStr: string;
  holidays: string[];
}

export const HIJRI_MONTHS_LIST = [
  { number: 1, en: "Muharram", ar: "مُحَرَّم" },
  { number: 2, en: "Safar", ar: "صَفَر" },
  { number: 3, en: "Rabi' al-Awwal", ar: "رَبيع الأوّل" },
  { number: 4, en: "Rabi' al-Thani", ar: "رَبيع الثاني" },
  { number: 5, en: "Jumada al-Awwal", ar: "جُمادى الأولى" },
  { number: 6, en: "Jumada al-Thani", ar: "جُمادى الثانية" },
  { number: 7, en: "Rajab", ar: "رَجَب" },
  { number: 8, en: "Sha'ban", ar: "شَعْبان" },
  { number: 9, en: "Ramadan", ar: "رَمَضان" },
  { number: 10, en: "Shawwal", ar: "شَوّال" },
  { number: 11, en: "Dhu al-Qi'dah", ar: "ذو القَعْدة" },
  { number: 12, en: "Dhu al-Hijjah", ar: "ذو الحِجّة" }
] as const;

export const CALENDAR_METHOD = 'UAQ'; // Umm al-Qura calendar calculation method

// In-memory cache to prevent repeated requests
const calendarCache = new Map<string, HijriDayData[]>();
let cachedTodayInfo: { timestamp: number; data: TodayHijriInfo } | null = null;

/**
 * Returns today's date formatted as DD-MM-YYYY using Asia/Kolkata timezone (Chennai, India)
 */
export function getTodayKolkataDateFormatted(): {
  formattedDDMMYYYY: string;
  day: number;
  month: number;
  year: number;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(new Date());
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '2026', 10);
    const formattedDDMMYYYY = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    return { formattedDDMMYYYY, day, month, year };
  } catch {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const formattedDDMMYYYY = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    return { formattedDDMMYYYY, day, month, year };
  }
}

/**
 * Fetches today's Hijri date from AlAdhan API: /gToH/{DD-MM-YYYY}?calendarMethod=UAQ
 */
export async function fetchTodayHijriDate(): Promise<TodayHijriInfo> {
  const { formattedDDMMYYYY } = getTodayKolkataDateFormatted();

  // Return cached result if fetched within the last 15 minutes
  if (cachedTodayInfo && Date.now() - cachedTodayInfo.timestamp < 15 * 60 * 1000) {
    return cachedTodayInfo.data;
  }

  // Check localStorage for offline availability
  const storageKey = `aladhan-today-${formattedDDMMYYYY}`;
  try {
    const local = localStorage.getItem(storageKey);
    if (local) {
      const parsed = JSON.parse(local);
      cachedTodayInfo = { timestamp: Date.now(), data: parsed };
    }
  } catch {
    // Ignore storage parse error
  }

  const url = `https://api.aladhan.com/v1/gToH/${formattedDDMMYYYY}?calendarMethod=${CALENDAR_METHOD}`;
  const response = await fetch(url);
  if (!response.ok) {
    if (cachedTodayInfo) return cachedTodayInfo.data;
    throw new Error(`Failed to fetch Hijri date: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.code !== 200 || !json.data) {
    if (cachedTodayInfo) return cachedTodayInfo.data;
    throw new Error(json.data || 'Invalid response from AlAdhan API');
  }

  const h = json.data.hijri;
  const g = json.data.gregorian;

  const result: TodayHijriInfo = {
    hijriDay: parseInt(h.day, 10),
    hijriMonth: h.month.number,
    hijriYear: parseInt(h.year, 10),
    hijriMonthNameEn: h.month.en,
    hijriMonthNameAr: h.month.ar,
    weekdayEn: g.weekday.en,
    weekdayAr: h.weekday.ar,
    gregorianDateStr: `${g.day} ${g.month.en} ${g.year}`,
    holidays: h.holidays || []
  };

  cachedTodayInfo = { timestamp: Date.now(), data: result };
  try {
    localStorage.setItem(storageKey, JSON.stringify(result));
  } catch {
    // Ignore storage quota
  }

  return result;
}

/**
 * Fetches full Hijri calendar month from AlAdhan API: /hToGCalendar/{month}/{year}?calendarMethod=UAQ
 */
export async function fetchHijriMonthCalendar(month: number, year: number): Promise<HijriDayData[]> {
  const cacheKey = `${year}-${String(month).padStart(2, '0')}`;

  // Check memory cache
  if (calendarCache.has(cacheKey)) {
    return calendarCache.get(cacheKey)!;
  }

  // Check localStorage
  const storageKey = `aladhan-month-${cacheKey}-${CALENDAR_METHOD}`;
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: HijriDayData[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        calendarCache.set(cacheKey, parsed);
        // Continue to fetch in background or return cached
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse error
  }

  const paddedMonth = String(month).padStart(2, '0');
  const url = `https://api.aladhan.com/v1/hToGCalendar/${paddedMonth}/${year}?calendarMethod=${CALENDAR_METHOD}`;

  const response = await fetch(url);
  if (!response.ok) {
    // If network fails, check if we have any cached version
    if (calendarCache.has(cacheKey)) return calendarCache.get(cacheKey)!;
    throw new Error(`Failed to fetch Islamic Calendar month ${month}/${year}: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.code !== 200 || !Array.isArray(json.data)) {
    throw new Error(json.data || 'Invalid response from AlAdhan calendar API');
  }

  const days: HijriDayData[] = json.data;
  calendarCache.set(cacheKey, days);

  try {
    localStorage.setItem(storageKey, JSON.stringify(days));
  } catch {
    // Ignore quota errors
  }

  return days;
}

/**
 * Helper to get clean English & Arabic name for a Hijri month number (1 to 12)
 */
export function getHijriMonthNames(monthNumber: number): { en: string; ar: string } {
  const found = HIJRI_MONTHS_LIST.find(m => m.number === monthNumber);
  return found ? { en: found.en, ar: found.ar } : { en: `Month ${monthNumber}`, ar: '' };
}
