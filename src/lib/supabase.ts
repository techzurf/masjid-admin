import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface PrayerTimeRecord {
  id: string;
  prayer_date: string; // 'YYYY-MM-DD'
  date?: string; // alias for compatibility
  fajr: string; // 'HH:MM' or 'HH:MM:SS'
  sunrise: string | null;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah_1: string | null;
  jummah_2: string | null;
  jummah_3: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreatePrayerTimeInput = Omit<PrayerTimeRecord, 'id' | 'created_at' | 'updated_at'>;

const STORAGE_KEYS = {
  URL: 'mm_supabase_url',
  PUBLISHABLE_KEY: 'mm_supabase_publishable_key',
  ANON_KEY: 'mm_supabase_anon_key',
  LOCAL_CACHE: 'mm_local_prayer_times',
};

// Initial default seed for Madina Masjid MKB Nagar
export function getInitialSeedRecord(dateStr?: string): PrayerTimeRecord {
  const d = dateStr || getTodayDateString();
  return {
    id: 'seed-record-' + d,
    prayer_date: d,
    date: d,
    fajr: '05:12:00',
    sunrise: '06:28:00',
    dhuhr: '13:04:00',
    asr: '16:32:00',
    maghrib: '19:14:00',
    isha: '20:36:00',
    jummah_1: '13:15:00',
    jummah_2: '14:15:00',
    jummah_3: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================================================
// Shared Supabase Client Initialization (Vite + React)
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Safe Diagnostics (Step 4 - DO NOT expose the actual key)
const isUrlConfigured = Boolean(
  supabaseUrl && 
  typeof supabaseUrl === 'string' && 
  supabaseUrl.trim().length > 0 && 
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('your-project')
);
const isKeyConfigured = Boolean(
  typeof supabasePublishableKey === 'string' && 
  supabasePublishableKey.trim().length > 0 && 
  !supabasePublishableKey.includes('your-supabase') &&
  !supabasePublishableKey.includes('your-anon')
);

console.log('Supabase URL configured:', isUrlConfigured);
console.log('Supabase publishable key configured:', isKeyConfigured);

let initError: string | null = null;
let clientInstance: SupabaseClient | null = null;

if (!isUrlConfigured || !isKeyConfigured) {
  initError = `Supabase configuration missing: ${
    !isUrlConfigured ? 'VITE_SUPABASE_URL is not set or invalid. ' : ''
  }${
    !isKeyConfigured ? 'VITE_SUPABASE_PUBLISHABLE_KEY is not set or invalid. ' : ''
  }Check environment variables.`;
  console.warn('[Supabase]', initError);
} else {
  try {
    clientInstance = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('Supabase client initialized: true');
  } catch (err: any) {
    initError = `createClient error: ${err?.message || String(err)}`;
    console.error('Supabase client initialized: false -', initError);
  }
}

// Single shared Supabase client instance (Step 5)
export const supabase: SupabaseClient | null = clientInstance;

export function getSupabaseInitError(): string {
  if (initError) return initError;
  if (!supabase) return 'Supabase client is not connected. Missing or invalid VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.';
  return '';
}

// Config retrieval (supports UI-configured overrides in Admin settings)
export function getSupabaseConfig(): { url: string; key: string } {
  let url = (supabaseUrl || '').trim();
  let key = (supabasePublishableKey || '').trim();

  if (!url || !key) {
    if (typeof window !== 'undefined') {
      const storedUrl = (localStorage.getItem(STORAGE_KEYS.URL) || '').trim();
      const storedKey = (
        localStorage.getItem(STORAGE_KEYS.PUBLISHABLE_KEY) || 
        localStorage.getItem(STORAGE_KEYS.ANON_KEY) || 
        ''
      ).trim();
      if (!url) url = storedUrl;
      if (!key) key = storedKey;
    }
  }

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  if (supabase) return true;
  const { url, key } = getSupabaseConfig();
  return Boolean(url && key && url.startsWith('http') && !url.includes('your-project'));
}

export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.PUBLISHABLE_KEY, key.trim());
    localStorage.setItem(STORAGE_KEYS.ANON_KEY, key.trim());
    // Invalidate client singleton
    cachedClient = null;
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const { url, key } = getSupabaseConfig();
  if (!url || !key || !url.startsWith('http') || url.includes('your-project')) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return cachedClient;
  } catch (err: any) {
    console.error('[Supabase] Failed to initialize Supabase client:', err);
    return null;
  }
}

// Local storage fallback store for resilience
const inMemoryStore: Record<string, PrayerTimeRecord> = {};

function getLocalStore(): Record<string, PrayerTimeRecord> {
  if (typeof window === 'undefined') {
    const today = getTodayDateString();
    if (!inMemoryStore[today]) {
      inMemoryStore[today] = getInitialSeedRecord(today);
    }
    return inMemoryStore;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_CACHE);
    if (!raw) {
      const today = getTodayDateString();
      const initial: Record<string, PrayerTimeRecord> = {
        [today]: getInitialSeedRecord(today),
      };
      localStorage.setItem(STORAGE_KEYS.LOCAL_CACHE, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    for (const key of Object.keys(parsed)) {
      const rec = parsed[key];
      const pDate = rec.prayer_date || rec.date || key;
      rec.prayer_date = pDate;
      rec.date = pDate;
    }
    return parsed;
  } catch {
    return inMemoryStore;
  }
}

function saveLocalStore(store: Record<string, PrayerTimeRecord>) {
  Object.assign(inMemoryStore, store);
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LOCAL_CACHE, JSON.stringify(store));
  } catch (err) {
    console.warn('Failed to save to local cache:', err);
  }
}

// Helper to normalize Supabase row to PrayerTimeRecord
function normalizeDbRow(row: any): PrayerTimeRecord {
  const pDate = row.prayer_date || row.date;
  return {
    ...row,
    prayer_date: pDate,
    date: pDate,
  };
}

// ============================================================================
// Database Operations (Single Masjid: Madina Masjid MKB Nagar)
// ============================================================================

/**
 * Fetch prayer times for a specific date (YYYY-MM-DD).
 */
export async function fetchPrayerTimesForDate(dateStr: string, allowFallback: boolean = true): Promise<{
  data: PrayerTimeRecord | null;
  error: string | null;
  isDemo?: boolean;
}> {
  const client = getSupabaseClient();

  if (!client) {
    if (!allowFallback) {
      return { data: null, error: getSupabaseInitError(), isDemo: false };
    }
    const store = getLocalStore();
    const existing = store[dateStr] || (dateStr === getTodayDateString() ? getInitialSeedRecord(dateStr) : null);
    return { data: existing, error: null, isDemo: true };
  }

  try {
    // Attempt query by prayer_date
    let { data, error } = await client
      .from('prayer_times')
      .select('*')
      .eq('prayer_date', dateStr)
      .maybeSingle();

    // Fallback if column is named date in older schema
    if (error && error.message && error.message.includes('prayer_date')) {
      const fallbackRes = await client
        .from('prayer_times')
        .select('*')
        .eq('date', dateStr)
        .maybeSingle();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      if (!allowFallback) {
        return { data: null, error: error.message, isDemo: false };
      }
      console.warn('Supabase fetch error, checking local fallback:', error);
      const store = getLocalStore();
      const fallback = store[dateStr] || Object.values(store)[0] || (dateStr === getTodayDateString() ? getInitialSeedRecord(dateStr) : null);
      return { data: fallback, error: error.message, isDemo: false };
    }

    if (!data) {
      // Single Current Schedule Support: fetch the latest active schedule from prayer_times
      try {
        const { data: latestRow } = await client
          .from('prayer_times')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (latestRow) {
          data = latestRow;
        }
      } catch (err) {
        console.warn('Error fetching latest prayer schedule:', err);
      }
    }

    if (data) {
      const record = normalizeDbRow(data);
      // Sync to local store
      const store = getLocalStore();
      store[dateStr] = record;
      saveLocalStore(store);
      return { data: record, error: null, isDemo: false };
    }

    return { data: null, error: null, isDemo: false };
  } catch (err: any) {
    if (!allowFallback) {
      return { data: null, error: err?.message || 'Connection error', isDemo: false };
    }
    console.error('Network error fetching prayer times from Supabase:', err);
    const store = getLocalStore();
    const fallback = store[dateStr] || (dateStr === getTodayDateString() ? getInitialSeedRecord(dateStr) : null);
    return { data: fallback, error: err?.message || 'Connection error', isDemo: false };
  }
}

/**
 * Fetch all prayer times sorted by prayer_date descending.
 */
export async function fetchAllPrayerTimes(limit = 40, allowFallback: boolean = true): Promise<{
  data: PrayerTimeRecord[];
  error: string | null;
  isDemo?: boolean;
}> {
  const client = getSupabaseClient();

  if (!client) {
    if (!allowFallback) {
      return { data: [], error: getSupabaseInitError(), isDemo: false };
    }
    const store = getLocalStore();
    let records = Object.values(store);
    if (records.length === 0) {
      const today = getInitialSeedRecord();
      records = [today];
    }
    records.sort((a, b) => b.prayer_date.localeCompare(a.prayer_date));
    return { data: records.slice(0, limit), error: null, isDemo: true };
  }

  try {
    let { data, error } = await client
      .from('prayer_times')
      .select('*')
      .order('prayer_date', { ascending: false })
      .limit(limit);

    // Fallback if ordered by date
    if (error && error.message && error.message.includes('prayer_date')) {
      const fallbackRes = await client
        .from('prayer_times')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      if (!allowFallback) {
        return { data: [], error: error.message, isDemo: false };
      }
      const store = getLocalStore();
      let records = Object.values(store);
      records.sort((a, b) => b.prayer_date.localeCompare(a.prayer_date));
      return { data: records.slice(0, limit), error: error.message, isDemo: false };
    }

    const records = (data || []).map(normalizeDbRow);
    return { data: records, error: null, isDemo: false };
  } catch (err: any) {
    if (!allowFallback) {
      return { data: [], error: err?.message || 'Connection error', isDemo: false };
    }
    const store = getLocalStore();
    let records = Object.values(store);
    records.sort((a, b) => b.prayer_date.localeCompare(a.prayer_date));
    return { data: records.slice(0, limit), error: err?.message || 'Connection error', isDemo: false };
  }
}

/**
 * Save (insert or update) prayer times in Supabase.
 * Validates:
 * - prayer_date is required
 * - fajr, dhuhr, asr, maghrib, isha are required
 * - jummah fields are optional
 * - prevents duplicate records for the same prayer_date via upsert or conflict constraint
 */
export async function savePrayerTimes(record: {
  id?: string;
  prayer_date: string;
  date?: string;
  fajr: string;
  sunrise?: string | null;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah_1?: string | null;
  jummah_2?: string | null;
  jummah_3?: string | null;
}, allowFallback: boolean = true): Promise<{
  data: PrayerTimeRecord | null;
  error: string | null;
  isDemo?: boolean;
}> {
  const pDate = (record.prayer_date || record.date || '').trim();

  // Strict Validation
  if (!pDate) {
    return { data: null, error: 'Prayer date is required.', isDemo: false };
  }
  if (!record.fajr?.trim()) {
    return { data: null, error: 'Fajr time is required.', isDemo: false };
  }
  if (!record.dhuhr?.trim()) {
    return { data: null, error: 'Dhuhr time is required.', isDemo: false };
  }
  if (!record.asr?.trim()) {
    return { data: null, error: 'Asr time is required.', isDemo: false };
  }
  if (!record.maghrib?.trim()) {
    return { data: null, error: 'Maghrib time is required.', isDemo: false };
  }
  if (!record.isha?.trim()) {
    return { data: null, error: 'Isha time is required.', isDemo: false };
  }

  const client = getSupabaseClient();

  // Normalize times
  const payload = {
    prayer_date: pDate,
    fajr: normalizeTimeTo24h(record.fajr),
    sunrise: record.sunrise && record.sunrise.trim() ? normalizeTimeTo24h(record.sunrise) : null,
    dhuhr: normalizeTimeTo24h(record.dhuhr),
    asr: normalizeTimeTo24h(record.asr),
    maghrib: normalizeTimeTo24h(record.maghrib),
    isha: normalizeTimeTo24h(record.isha),
    jummah_1: record.jummah_1 && record.jummah_1.trim() ? normalizeTimeTo24h(record.jummah_1) : null,
    jummah_2: record.jummah_2 && record.jummah_2.trim() ? normalizeTimeTo24h(record.jummah_2) : null,
    jummah_3: record.jummah_3 && record.jummah_3.trim() ? normalizeTimeTo24h(record.jummah_3) : null,
  };

  if (!client) {
    if (!allowFallback) {
      return { data: null, error: getSupabaseInitError(), isDemo: false };
    }
    // Save to local cache
    const store = getLocalStore();
    const existing = store[pDate];
    const savedRecord: PrayerTimeRecord = {
      id: record.id || existing?.id || 'local-' + Date.now(),
      ...payload,
      date: pDate,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store[pDate] = savedRecord;
    saveLocalStore(store);
    return { data: savedRecord, error: null, isDemo: true };
  }

  try {
    // Check if record exists for this prayer_date to determine INSERT vs UPDATE
    const { data: existingRow, error: checkError } = await client
      .from('prayer_times')
      .select('id, prayer_date')
      .eq('prayer_date', pDate)
      .maybeSingle();

    if (checkError) {
      console.warn('Error checking existing row before save:', checkError);
    }

    let data: any = null;
    let error: any = null;

    if (existingRow) {
      // 1. Existing date: Use UPDATE
      const updateRes = await client
        .from('prayer_times')
        .update({
          ...payload,
          updated_at: new Date().toISOString(),
        })
        .eq('prayer_date', pDate)
        .select()
        .single();
      data = updateRes.data;
      error = updateRes.error;
    } else {
      // 2. New date: Use INSERT
      const insertRes = await client
        .from('prayer_times')
        .insert([
          {
            ...(record.id ? { id: record.id } : {}),
            ...payload,
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();
      data = insertRes.data;
      error = insertRes.error;

      // In case of unique collision on prayer_date, update the existing record
      if (error && (error.code === '23505' || error.message?.includes('duplicate key'))) {
        const conflictUpdate = await client
          .from('prayer_times')
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq('prayer_date', pDate)
          .select()
          .single();
        data = conflictUpdate.data;
        error = conflictUpdate.error;
      }
    }

    // Fallback if table still uses 'date' column name instead of 'prayer_date'
    if (error && error.message && error.message.includes('prayer_date')) {
      const fallbackPayload: any = { ...payload };
      delete fallbackPayload.prayer_date;
      fallbackPayload.date = pDate;

      const fallbackRes = await client
        .from('prayer_times')
        .upsert(
          {
            ...(record.id ? { id: record.id } : {}),
            ...fallbackPayload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'date' }
        )
        .select()
        .single();
      data = fallbackRes.data;
      error = fallbackRes.error;
    }

    if (error) {
      if (!allowFallback) {
        return { data: null, error: error.message, isDemo: false };
      }
      // If network failure (e.g. host unreachable), ensure record is preserved in local buffer
      if (error.message?.includes('fetch failed') || error.message?.includes('network') || error.message?.includes('ENOTFOUND')) {
        const store = getLocalStore();
        const existing = store[pDate];
        const savedRecord: PrayerTimeRecord = {
          id: record.id || existing?.id || 'buffered-' + Date.now(),
          ...payload,
          date: pDate,
          created_at: existing?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        store[pDate] = savedRecord;
        saveLocalStore(store);
        return { 
          data: savedRecord, 
          error: `Saved to local buffer (Supabase host ${getSupabaseConfig().url} is unreachable: ${error.message}). Check URL/keys in Settings if needed.`, 
          isDemo: true 
        };
      }
      return { data: null, error: error.message, isDemo: false };
    }

    if (data) {
      const normRecord = normalizeDbRow(data);
      const store = getLocalStore();
      store[normRecord.prayer_date] = normRecord;
      saveLocalStore(store);
      return { data: normRecord, error: null, isDemo: false };
    }

    return { data: null, error: 'No data returned from save operation', isDemo: false };
  } catch (err: any) {
    if (!allowFallback) {
      return { data: null, error: err?.message || 'Failed to save to Supabase', isDemo: false };
    }
    const isNetwork = err?.message?.includes('fetch failed') || err?.message?.includes('network') || err?.message?.includes('ENOTFOUND');
    if (isNetwork) {
      const store = getLocalStore();
      const existing = store[pDate];
      const savedRecord: PrayerTimeRecord = {
        id: record.id || existing?.id || 'buffered-' + Date.now(),
        ...payload,
        date: pDate,
        created_at: existing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      store[pDate] = savedRecord;
      saveLocalStore(store);
      return { 
        data: savedRecord, 
        error: `Saved to local buffer (Supabase host is unreachable: ${err.message}). Check URL/keys in Settings.`, 
        isDemo: true 
      };
    }
    return { data: null, error: err?.message || 'Failed to save to Supabase', isDemo: false };
  }
}

/**
 * Delete prayer times for an ID or Prayer Date.
 */
export async function deletePrayerTimes(idOrDate: string): Promise<{
  success: boolean;
  error: string | null;
  isDemo?: boolean;
}> {
  const client = getSupabaseClient();

  // Remove from local cache
  const store = getLocalStore();
  let deletedFromLocal = false;
  for (const [key, val] of Object.entries(store)) {
    if (val.id === idOrDate || val.prayer_date === idOrDate || val.date === idOrDate) {
      delete store[key];
      deletedFromLocal = true;
    }
  }
  if (deletedFromLocal) {
    saveLocalStore(store);
  }

  if (!client) {
    return { success: true, error: null, isDemo: true };
  }

  try {
    const isUuid = idOrDate.includes('-') && idOrDate.length > 20;
    
    if (isUuid) {
      const { error } = await client.from('prayer_times').delete().eq('id', idOrDate);
      if (error) return { success: false, error: error.message, isDemo: false };
      return { success: true, error: null, isDemo: false };
    }

    // Try deleting by prayer_date
    let { error } = await client.from('prayer_times').delete().eq('prayer_date', idOrDate);
    if (error && error.message && error.message.includes('prayer_date')) {
      const fallback = await client.from('prayer_times').delete().eq('date', idOrDate);
      error = fallback.error;
    }

    if (error) {
      return { success: false, error: error.message, isDemo: false };
    }
    return { success: true, error: null, isDemo: false };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete from Supabase', isDemo: false };
  }
}

/**
 * Test Supabase connection and check if table 'prayer_times' exists.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  tableExists: boolean;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      tableExists: false,
      message: getSupabaseInitError() || 'Supabase URL or Publishable Key is missing or invalid.',
    };
  }

  try {
    const { count, error } = await client
      .from('prayer_times')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "prayer_times" does not exist')) {
        return {
          connected: true,
          tableExists: false,
          message: 'Connected to Supabase, but the "prayer_times" table has not been created yet. Run the provided SQL migration in Supabase SQL Editor.',
        };
      }
      if (error.message?.includes('fetch failed') || error.message?.includes('ENOTFOUND')) {
        return {
          connected: false,
          tableExists: false,
          message: `Unable to reach Supabase endpoint (${getSupabaseConfig().url}). Host could not be resolved or is still propagating. You can update the URL anytime in Supabase Keys modal.`,
        };
      }
      return {
        connected: false,
        tableExists: false,
        message: `Supabase query error: ${error.message}`,
      };
    }

    return {
      connected: true,
      tableExists: true,
      message: `Successfully connected to Supabase! Found ${count ?? 0} prayer time records in table prayer_times.`,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      message: `Connection error: ${err?.message || 'Unable to connect to Supabase.'}`,
    };
  }
}

// ============================================================================
// Formatting & Calculation Helpers
// ============================================================================

export function normalizeTimeTo24h(timeStr: string): string {
  if (!timeStr) return '00:00:00';
  const clean = timeStr.trim();

  if (/am|pm/i.test(clean)) {
    const isPM = /pm/i.test(clean);
    const parts = clean.replace(/am|pm/i, '').trim().split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] ? parseInt(parts[1], 10) : 0;
    const s = parts[2] ? parseInt(parts[2], 10) : 0;

    if (isPM && h < 12) h += 12;
    if (!isPM && h === 12) h = 0;

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  const parts = clean.split(':');
  const h = parts[0] ? String(parseInt(parts[0], 10)).padStart(2, '0') : '00';
  const m = parts[1] ? String(parseInt(parts[1], 10)).padStart(2, '0') : '00';
  const s = parts[2] ? String(parseInt(parts[2], 10)).padStart(2, '0') : '00';
  return `${h}:${m}:${s}`;
}

export function formatTo12h(timeStr: string | null | undefined): string {
  if (!timeStr) return '—';
  const clean = timeStr.trim();
  if (/am|pm/i.test(clean)) return clean;

  const parts = clean.split(':');
  if (parts.length < 2) return timeStr;

  let h = parseInt(parts[0], 10);
  const m = String(parseInt(parts[1], 10)).padStart(2, '0');
  if (isNaN(h)) return timeStr;

  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;

  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
}

export function formatToInputTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  if (/am|pm/i.test(clean)) {
    return normalizeTimeTo24h(clean).slice(0, 5);
  }
  return clean.slice(0, 5);
}

export function calculateDefaultIqamahTime(adhan24h: string, prayerId: string): string {
  const norm = normalizeTimeTo24h(adhan24h);
  const [hStr, mStr] = norm.split(':');
  let h = parseInt(hStr, 10);
  let m = parseInt(mStr, 10);

  let offsetMinutes = 20;
  if (prayerId === 'fajr') offsetMinutes = 23;
  else if (prayerId === 'dhuhr') offsetMinutes = 21;
  else if (prayerId === 'asr') offsetMinutes = 18;
  else if (prayerId === 'maghrib') offsetMinutes = 8;
  else if (prayerId === 'isha') offsetMinutes = 19;
  else if (prayerId === 'sunrise') return '—';

  m += offsetMinutes;
  while (m >= 60) {
    m -= 60;
    h = (h + 1) % 24;
  }

  const ampm = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;

  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export interface ComputedPrayerInfo {
  prayersList: Array<{
    id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    name: string;
    arabicName: string;
    tamilName: string;
    adhanTime: string;
    iqamahTime: string;
    passed: boolean;
    current: boolean;
    isNext: boolean;
    rawDate: Date;
  }>;
  currentPrayer: {
    id: string;
    name: string;
    arabicName: string;
    adhanTime: string;
    iqamahTime: string;
  };
  nextPrayer: {
    id: string;
    name: string;
    arabicName: string;
    adhanTime: string;
    iqamahTime: string;
    secondsRemaining: number;
    rawTime: Date;
  };
  jummahInfo: {
    shiftsCount: number;
    description: string;
    shift1: string | null;
    shift2: string | null;
    shift3: string | null;
  };
}

export function computePrayersFromRecord(record: PrayerTimeRecord, now = new Date()): ComputedPrayerInfo {
  const pDate = record.prayer_date || record.date || getTodayDateString();
  const [year, month, day] = pDate.split('-').map(Number);

  const parseTime = (timeStr: string, isNextDay = false): Date => {
    const norm = normalizeTimeTo24h(timeStr);
    const [h, m, s] = norm.split(':').map(Number);
    const d = new Date(year, month - 1, day, h, m, s || 0);
    if (isNextDay) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  };

  const fajrDate = parseTime(record.fajr);
  const dhuhrDate = parseTime(record.dhuhr);
  const asrDate = parseTime(record.asr);
  const maghribDate = parseTime(record.maghrib);
  const ishaDate = parseTime(record.isha);
  const tomorrowFajrDate = parseTime(record.fajr, true);

  const prayers = [
    {
      id: 'fajr' as const,
      name: 'Fajr',
      arabicName: 'الفجر',
      tamilName: 'ஃபஜ்ர்',
      adhanTime: formatTo12h(record.fajr),
      iqamahTime: calculateDefaultIqamahTime(record.fajr, 'fajr'),
      rawDate: fajrDate,
    },
    {
      id: 'dhuhr' as const,
      name: 'Dhuhr',
      arabicName: 'الظهر',
      tamilName: 'ளுஹர்',
      adhanTime: formatTo12h(record.dhuhr),
      iqamahTime: calculateDefaultIqamahTime(record.dhuhr, 'dhuhr'),
      rawDate: dhuhrDate,
    },
    {
      id: 'asr' as const,
      name: 'Asr',
      arabicName: 'العصر',
      tamilName: 'அஸர்',
      adhanTime: formatTo12h(record.asr),
      iqamahTime: calculateDefaultIqamahTime(record.asr, 'asr'),
      rawDate: asrDate,
    },
    {
      id: 'maghrib' as const,
      name: 'Maghrib',
      arabicName: 'المغرب',
      tamilName: 'மஃரிப்',
      adhanTime: formatTo12h(record.maghrib),
      iqamahTime: calculateDefaultIqamahTime(record.maghrib, 'maghrib'),
      rawDate: maghribDate,
    },
    {
      id: 'isha' as const,
      name: 'Isha',
      arabicName: 'العشاء',
      tamilName: 'இஷா',
      adhanTime: formatTo12h(record.isha),
      iqamahTime: calculateDefaultIqamahTime(record.isha, 'isha'),
      rawDate: ishaDate,
    },
  ];

  const nowMs = now.getTime();

  let nextIdx = prayers.findIndex(p => p.rawDate.getTime() > nowMs);
  let nextPrayerData;

  if (nextIdx !== -1) {
    const p = prayers[nextIdx];
    const diffSec = Math.max(0, Math.floor((p.rawDate.getTime() - nowMs) / 1000));
    nextPrayerData = {
      id: p.id,
      name: p.name,
      arabicName: p.arabicName,
      adhanTime: p.adhanTime,
      iqamahTime: p.iqamahTime,
      secondsRemaining: diffSec,
      rawTime: p.rawDate,
    };
  } else {
    nextIdx = 0;
    const diffSec = Math.max(0, Math.floor((tomorrowFajrDate.getTime() - nowMs) / 1000));
    nextPrayerData = {
      id: 'fajr',
      name: 'Fajr',
      arabicName: 'الفجر',
      adhanTime: formatTo12h(record.fajr),
      iqamahTime: calculateDefaultIqamahTime(record.fajr, 'fajr'),
      secondsRemaining: diffSec,
      rawTime: tomorrowFajrDate,
    };
  }

  let currentIdx = -1;
  for (let i = prayers.length - 1; i >= 0; i--) {
    if (prayers[i].rawDate.getTime() <= nowMs) {
      currentIdx = i;
      break;
    }
  }
  const currentPrayerData = currentIdx !== -1 ? prayers[currentIdx] : prayers[prayers.length - 1];

  const prayersList = prayers.map((p, idx) => ({
    ...p,
    passed: p.rawDate.getTime() < nowMs,
    current: idx === currentIdx,
    isNext: idx === nextIdx,
  }));

  const shifts: string[] = [];
  if (record.jummah_1) shifts.push(`1st ${formatTo12h(record.jummah_1)}`);
  if (record.jummah_2) shifts.push(`2nd ${formatTo12h(record.jummah_2)}`);
  if (record.jummah_3) shifts.push(`3rd ${formatTo12h(record.jummah_3)}`);

  const jummahDesc = shifts.length > 0 
    ? `Jummah: ${shifts.join(' · ')}` 
    : 'Jummah: 1st 1:15 PM · 2nd 2:15 PM';

  return {
    prayersList,
    currentPrayer: {
      id: currentPrayerData.id,
      name: currentPrayerData.name,
      arabicName: currentPrayerData.arabicName,
      adhanTime: currentPrayerData.adhanTime,
      iqamahTime: currentPrayerData.iqamahTime,
    },
    nextPrayer: nextPrayerData,
    jummahInfo: {
      shiftsCount: shifts.length > 0 ? shifts.length : 2,
      description: jummahDesc,
      shift1: record.jummah_1 ? formatTo12h(record.jummah_1) : '01:15 PM',
      shift2: record.jummah_2 ? formatTo12h(record.jummah_2) : '02:15 PM',
      shift3: record.jummah_3 ? formatTo12h(record.jummah_3) : null,
    },
  };
}

// ============================================================================
// Community Members Module (Supabase table: public.community_members)
// ============================================================================

export interface CommunityMember {
  id: string;
  full_name: string;
  mobile_number: string;
  gender: string | null;
  date_of_birth: string | null;
  address: string | null;
  notes: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCommunityMemberInput {
  full_name: string;
  mobile_number: string;
  gender?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  notes?: string | null;
  email?: string | null;
}

/**
 * Insert a new community registration into Supabase.
 */
export async function createCommunityMember(input: CreateCommunityMemberInput): Promise<{
  data: CommunityMember | null;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: null, error: getSupabaseInitError() };
  }

  try {
    const payload: any = {
      full_name: input.full_name.trim(),
      mobile_number: input.mobile_number.trim(),
      gender: input.gender || null,
      date_of_birth: input.date_of_birth || null,
      address: input.address?.trim() || null,
      notes: input.notes?.trim() || null,
    };
    if (input.email && input.email.trim()) {
      payload.email = input.email.trim();
    }

    let { data, error } = await client
      .from('community_members')
      .insert([payload])
      .select()
      .single();

    // If table in Supabase doesn't have email column, gracefully retry without it
    if (error && error.message?.includes('email')) {
      delete payload.email;
      const retry = await client
        .from('community_members')
        .insert([payload])
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('Supabase error inserting community_member:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Exception inserting community_member:', err);
    return { data: null, error: err?.message || 'Failed to submit registration to Supabase' };
  }
}

/**
 * Fetch all community registrations from Supabase sorted by creation date descending.
 */
export async function fetchCommunityMembers(): Promise<{
  data: CommunityMember[];
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [], error: getSupabaseInitError() };
  }

  try {
    const { data, error } = await client
      .from('community_members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching community_members:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: any) {
    console.error('Exception fetching community_members:', err);
    return { data: [], error: err?.message || 'Failed to load community registrations from Supabase' };
  }
}

/**
 * Update an existing community member in Supabase by ID.
 */
export async function updateCommunityMember(
  id: string,
  updates: Partial<CreateCommunityMemberInput>
): Promise<{
  data: CommunityMember | null;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: null, error: getSupabaseInitError() };
  }

  try {
    const payload: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await client
      .from('community_members')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error && error.message?.includes('email')) {
      delete payload.email;
      const retry = await client
        .from('community_members')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('Supabase error updating community_member:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error('Exception updating community_member:', err);
    return { data: null, error: err?.message || 'Failed to update community member' };
  }
}

/**
 * Delete a community registration from Supabase by ID.
 */
export async function deleteCommunityMember(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: getSupabaseInitError() };
  }

  try {
    const { error } = await client
      .from('community_members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error deleting community_member:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    console.error('Exception deleting community_member:', err);
    return { success: false, error: err?.message || 'Failed to delete community member' };
  }
}

// ============================================================================
// Masjid Notices Module (Supabase table: public.masjid_notices)
// ============================================================================

export interface MasjidNotice {
  id: string;
  title: string;
  message: string;
  category: string;
  image_url?: string | null;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMasjidNoticeInput {
  title: string;
  message: string;
  category?: string;
  image_url?: string | null;
  is_active?: boolean;
  priority?: number;
}

/**
 * Calculates human-readable time ago from ISO date string
 * Examples: "Just now", "15 mins ago", "2 hours ago", "Yesterday"
 */
export function getNoticeTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) {
      return 'Just now';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      return diffMin === 1 ? '1 min ago' : `${diffMin} mins ago`;
    }
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

/**
 * Fetch the highest-priority active notice for the home screen directly from Supabase
 * is_active = true, ordered by priority DESC, created_at DESC
 */
export async function fetchHighestPriorityActiveNotice(): Promise<{
  data: MasjidNotice | null;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: null, error: getSupabaseInitError() };
  }

  try {
    const { data, error } = await client
      .from('masjid_notices')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.warn('Supabase notice fetch error:', error.message);
      return { data: null, error: error.message };
    }

    return { data: data || null, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to fetch notice' };
  }
}

/**
 * Fetch all notices for Admin Panel management directly from Supabase
 */
export async function fetchAllNoticesAdmin(): Promise<{
  data: MasjidNotice[];
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [], error: getSupabaseInitError() };
  }

  try {
    const { data, error } = await client
      .from('masjid_notices')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Admin notices fetch warning:', error.message);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err?.message || 'Failed to fetch notices' };
  }
}

/**
 * Create a new notice in Supabase
 */
export async function createMasjidNotice(input: CreateMasjidNoticeInput): Promise<{
  data: MasjidNotice | null;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: null, error: getSupabaseInitError() };
  }

  try {
    const payload = {
      title: input.title.trim(),
      message: input.message.trim(),
      category: (input.category && input.category.trim()) || 'Important Notice',
      image_url: (input.image_url && input.image_url.trim()) || null,
      is_active: input.is_active !== undefined ? input.is_active : true,
      priority: typeof input.priority === 'number' ? input.priority : 0,
    };

    const { data, error } = await client
      .from('masjid_notices')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Error creating notice in Supabase:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to create notice' };
  }
}

/**
 * Update an existing notice in Supabase
 */
export async function updateMasjidNotice(
  id: string,
  updates: Partial<CreateMasjidNoticeInput>
): Promise<{
  data: MasjidNotice | null;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: null, error: getSupabaseInitError() };
  }

  try {
    const payload: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (payload.title) payload.title = payload.title.trim();
    if (payload.message) payload.message = payload.message.trim();
    if (payload.category) payload.category = payload.category.trim();
    if (payload.image_url !== undefined) {
      payload.image_url = payload.image_url ? payload.image_url.trim() : null;
    }

    const { data, error } = await client
      .from('masjid_notices')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn('Error updating notice in Supabase:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to update notice' };
  }
}

/**
 * Delete a notice from Supabase by ID
 */
export async function deleteMasjidNotice(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: getSupabaseInitError() };
  }

  try {
    const { error } = await client
      .from('masjid_notices')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Error deleting notice from Supabase:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete notice' };
  }
}

/**
 * Subscribe to real-time changes on public.masjid_notices
 */
export function subscribeToMasjidNotices(onChange: () => void): () => void {
  const client = getSupabaseClient();
  if (!client) {
    return () => {};
  }

  try {
    const channel = client
      .channel('realtime:masjid_notices')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'masjid_notices' },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      try {
        client.removeChannel(channel);
      } catch {}
    };
  } catch {
    return () => {};
  }
}


