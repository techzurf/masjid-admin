import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Save, 
  Trash2, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  ExternalLink, 
  Copy, 
  Check, 
  Sun, 
  Sunrise as SunriseIcon, 
  Moon, 
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
  RotateCcw
} from 'lucide-react';
import { 
  PrayerTimeRecord, 
  fetchPrayerTimesForDate, 
  fetchAllPrayerTimes, 
  savePrayerTimes, 
  deletePrayerTimes, 
  testSupabaseConnection, 
  getTodayDateString, 
  formatTo12h, 
  formatToInputTime,
  isSupabaseConfigured,
  getSupabaseConfig,
  saveSupabaseConfig,
  getInitialSeedRecord
} from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

interface AdminPrayerTimesScreenProps {
  prayers?: any;
  onSavePrayers?: (updated: any) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPrayerTimesScreen: React.FC<AdminPrayerTimesScreenProps> = ({ onShowToast }) => {
  const { refreshPrayerTimes } = useApp();

  // Selected date for editing/viewing (default: today)
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Today's record for quick overview
  const [todayRecord, setTodayRecord] = useState<PrayerTimeRecord | null>(null);

  // Form input state
  const [fajr, setFajr] = useState<string>('05:12');
  const [sunrise, setSunrise] = useState<string>('06:28');
  const [dhuhr, setDhuhr] = useState<string>('13:04');
  const [asr, setAsr] = useState<string>('16:32');
  const [maghrib, setMaghrib] = useState<string>('19:14');
  const [isha, setIsha] = useState<string>('20:36');
  const [jummah1, setJummah1] = useState<string>('13:15');
  const [jummah2, setJummah2] = useState<string>('14:15');
  const [jummah3, setJummah3] = useState<string>('');

  // Loaded record metadata for current date
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isExistingRecord, setIsExistingRecord] = useState<boolean>(false);
  const [currentUpdatedAt, setCurrentUpdatedAt] = useState<string | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<'Supabase' | 'New Schedule' | 'Error'>('Supabase');

  // Loading & Feedback states
  const [isLoadingDate, setIsLoadingDate] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // All configured records
  const [recordsList, setRecordsList] = useState<PrayerTimeRecord[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);

  // Supabase connection & config modal state
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean;
    connected: boolean;
    tableExists: boolean;
    message: string;
  }>({
    checked: false,
    connected: false,
    tableExists: false,
    message: 'Checking Supabase connection...',
  });

  // Modal input state for keys
  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');

  // Load today's record and records list
  const loadRecords = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const today = getTodayDateString();
      const todayRes = await fetchPrayerTimesForDate(today, false);
      if (todayRes.data) {
        setTodayRecord(todayRes.data);
      } else {
        setTodayRecord(null);
      }

      const listRes = await fetchAllPrayerTimes(20, false);
      setRecordsList(listRes.data);
    } catch (err: any) {
      console.error('Error loading prayer times list:', err);
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // Check connection status
  const checkConnection = useCallback(async () => {
    const res = await testSupabaseConnection();
    setConnectionStatus({
      checked: true,
      connected: res.connected,
      tableExists: res.tableExists,
      message: res.message,
    });
  }, []);

  useEffect(() => {
    checkConnection();
    loadRecords();
    const cfg = getSupabaseConfig();
    setInputUrl(cfg.url);
    setInputKey(cfg.key);
  }, [checkConnection, loadRecords]);

  // Load prayer times when selected date changes
  const loadDateTimes = useCallback(async (dateStr: string) => {
    setIsLoadingDate(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
    try {
      // Query Supabase directly without silent hardcoded fallback
      const res = await fetchPrayerTimesForDate(dateStr, false);

      if (res.data) {
        // Record exists in Supabase
        setCurrentRecordId(res.data.id);
        setIsExistingRecord(true);
        setCurrentUpdatedAt(res.data.updated_at || null);
        setCurrentDataSource('Supabase');

        setFajr(formatToInputTime(res.data.fajr));
        setSunrise(res.data.sunrise ? formatToInputTime(res.data.sunrise) : '');
        setDhuhr(formatToInputTime(res.data.dhuhr));
        setAsr(formatToInputTime(res.data.asr));
        setMaghrib(formatToInputTime(res.data.maghrib));
        setIsha(formatToInputTime(res.data.isha));
        setJummah1(res.data.jummah_1 ? formatToInputTime(res.data.jummah_1) : '');
        setJummah2(res.data.jummah_2 ? formatToInputTime(res.data.jummah_2) : '');
        setJummah3(res.data.jummah_3 ? formatToInputTime(res.data.jummah_3) : '');
      } else if (res.error) {
        // Explicit error from Supabase
        setCurrentRecordId(null);
        setIsExistingRecord(false);
        setCurrentUpdatedAt(null);
        setCurrentDataSource('Error');
        setSaveErrorMsg(`Error loading record from Supabase: ${res.error}`);
        setFajr('');
        setSunrise('');
        setDhuhr('');
        setAsr('');
        setMaghrib('');
        setIsha('');
        setJummah1('');
        setJummah2('');
        setJummah3('');
      } else {
        // Date not found in DB: Show an empty form as required by Requirement 4
        setCurrentRecordId(null);
        setIsExistingRecord(false);
        setCurrentUpdatedAt(null);
        setCurrentDataSource('New Schedule');

        setFajr('');
        setSunrise('');
        setDhuhr('');
        setAsr('');
        setMaghrib('');
        setIsha('');
        setJummah1('');
        setJummah2('');
        setJummah3('');
      }
    } catch (err: any) {
      console.error('Error fetching date times:', err);
      setCurrentDataSource('Error');
      setSaveErrorMsg(`Network error loading record: ${err?.message || 'Unknown'}`);
    } finally {
      setIsLoadingDate(false);
    }
  }, []);

  useEffect(() => {
    loadDateTimes(selectedDate);
  }, [selectedDate, loadDateTimes]);

  // Handle Reset button (Requirement 4: Load, Save / Update, Reset)
  const handleReset = async () => {
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
    await loadDateTimes(selectedDate);
    onShowToast(`Reset form for ${selectedDate}`);
  };

  // Handle Save / Create
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    // Validation 1: Prayer date is required
    if (!selectedDate || !selectedDate.trim()) {
      setSaveErrorMsg('Validation Error: Prayer date is required. Please select a valid date.');
      setIsSaving(false);
      return;
    }

    // Validation 2: Fajr, Dhuhr, Asr, Maghrib and Isha are required
    const missingFields: string[] = [];
    if (!fajr || !fajr.trim()) missingFields.push('Fajr');
    if (!dhuhr || !dhuhr.trim()) missingFields.push('Dhuhr');
    if (!asr || !asr.trim()) missingFields.push('Asr');
    if (!maghrib || !maghrib.trim()) missingFields.push('Maghrib');
    if (!isha || !isha.trim()) missingFields.push('Isha');

    if (missingFields.length > 0) {
      setSaveErrorMsg(`Validation Error: Please fill in all required prayer times: ${missingFields.join(', ')}.`);
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        id: currentRecordId || undefined,
        prayer_date: selectedDate,
        date: selectedDate,
        fajr,
        sunrise: sunrise.trim() ? sunrise : null,
        dhuhr,
        asr,
        maghrib,
        isha,
        jummah_1: jummah1.trim() ? jummah1 : null,
        jummah_2: jummah2.trim() ? jummah2 : null,
        jummah_3: jummah3.trim() ? jummah3 : null,
      };

      // Save directly to Supabase with strict error reporting (no silent fallback)
      const result = await savePrayerTimes(payload, false);

      if (result.data) {
        setCurrentRecordId(result.data.id);
        setIsExistingRecord(true);
        setCurrentUpdatedAt(result.data.updated_at || new Date().toISOString());
        setCurrentDataSource('Supabase');

        const successText = 'Prayer times saved successfully.';
        setSaveSuccessMsg(successText);
        onShowToast(successText);

        // Re-fetch record from Supabase to ensure complete data consistency (Requirement 7)
        const recheck = await fetchPrayerTimesForDate(selectedDate, false);
        if (recheck.data) {
          setCurrentRecordId(recheck.data.id);
          setIsExistingRecord(true);
          setCurrentUpdatedAt(recheck.data.updated_at || null);
          setCurrentDataSource('Supabase');
          setFajr(formatToInputTime(recheck.data.fajr));
          setSunrise(recheck.data.sunrise ? formatToInputTime(recheck.data.sunrise) : '');
          setDhuhr(formatToInputTime(recheck.data.dhuhr));
          setAsr(formatToInputTime(recheck.data.asr));
          setMaghrib(formatToInputTime(recheck.data.maghrib));
          setIsha(formatToInputTime(recheck.data.isha));
          setJummah1(recheck.data.jummah_1 ? formatToInputTime(recheck.data.jummah_1) : '');
          setJummah2(recheck.data.jummah_2 ? formatToInputTime(recheck.data.jummah_2) : '');
          setJummah3(recheck.data.jummah_3 ? formatToInputTime(recheck.data.jummah_3) : '');
        }

        // Refresh app context so main prayer cards use updated Supabase values immediately
        await refreshPrayerTimes();

        // Refresh records list and today's summary card
        await loadRecords();
      } else if (result.error) {
        setCurrentDataSource('Error');
        setSaveErrorMsg(`Database Error: ${result.error}`);
        onShowToast(`Error: ${result.error}`);
      }
    } catch (err: any) {
      setCurrentDataSource('Error');
      const errText = err?.message || 'An unexpected error occurred while saving to Supabase.';
      setSaveErrorMsg(errText);
      onShowToast(`Save failed: ${errText}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!isExistingRecord && !currentRecordId) return;

    setIsDeleting(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      const target = currentRecordId || selectedDate;
      const res = await deletePrayerTimes(target);

      if (res.error) {
        setSaveErrorMsg(`Delete failed: ${res.error}`);
        onShowToast(`Delete failed: ${res.error}`);
      } else {
        setShowDeleteConfirm(false);
        setCurrentRecordId(null);
        setIsExistingRecord(false);
        setCurrentUpdatedAt(null);

        const successText = `Prayer times schedule for ${selectedDate} deleted successfully.`;
        setSaveSuccessMsg(successText);
        onShowToast(`Schedule for ${selectedDate} deleted`);

        // Refresh
        if (selectedDate === getTodayDateString()) {
          await refreshPrayerTimes();
        }
        loadRecords();
        loadDateTimes(selectedDate);
      }
    } catch (err: any) {
      setSaveErrorMsg(`Delete error: ${err?.message || 'Could not delete record.'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Date Navigation
  const handleDateOffset = (offset: number) => {
    const parts = selectedDate.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + offset);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${day}`);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(inputUrl, inputKey);
    setShowConfigModal(false);
    onShowToast('Supabase configuration updated. Reconnecting...');
    checkConnection();
    loadRecords();
    loadDateTimes(selectedDate);
  };

  const sqlMigrationContent = `-- Madina Masjid MKB Nagar: prayer_times table
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.prayer_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_date DATE NOT NULL UNIQUE,
  fajr TIME WITHOUT TIME ZONE NOT NULL,
  sunrise TIME WITHOUT TIME ZONE,
  dhuhr TIME WITHOUT TIME ZONE NOT NULL,
  asr TIME WITHOUT TIME ZONE NOT NULL,
  maghrib TIME WITHOUT TIME ZONE NOT NULL,
  isha TIME WITHOUT TIME ZONE NOT NULL,
  jummah_1 TIME WITHOUT TIME ZONE,
  jummah_2 TIME WITHOUT TIME ZONE,
  jummah_3 TIME WITHOUT TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prayer_times_prayer_date ON public.prayer_times (prayer_date);

ALTER TABLE public.prayer_times ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public read access to prayer_times"
  ON public.prayer_times FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public insert to prayer_times"
  ON public.prayer_times FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public update to prayer_times"
  ON public.prayer_times FOR UPDATE TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete to prayer_times" ON public.prayer_times;
CREATE POLICY "Allow public delete to prayer_times"
  ON public.prayer_times FOR DELETE TO public USING (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlMigrationContent);
    setCopiedSql(true);
    onShowToast('SQL migration copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200 pb-16">
      
      {/* ─── 1. TOP HEADER & DATABASE CONNECTION STATUS ─── */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Supabase Connected Table: prayer_times
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Madina Masjid MKB Nagar
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Prayer Times Management
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Configure and publish daily Adhan, Jama'ah, and Friday Jumu'ah prayer times directly to Supabase.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Supabase Keys</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSqlModal(true)}
              className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#087F5B] border border-emerald-200/80 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-[#087F5B]" />
              <span>SQL Schema</span>
            </button>

            <button
              type="button"
              onClick={() => {
                checkConnection();
                loadRecords();
                loadDateTimes(selectedDate);
                onShowToast('Synced with Supabase');
              }}
              className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh connection & records"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Connection status indicator */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
          connectionStatus.connected && connectionStatus.tableExists
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : isSupabaseConfigured()
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              connectionStatus.connected && connectionStatus.tableExists
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-amber-500 animate-pulse'
            }`} />
            <div>
              <span className="font-bold">
                {connectionStatus.connected && connectionStatus.tableExists
                  ? 'Supabase Realtime Database Active'
                  : isSupabaseConfigured()
                  ? 'Supabase Project Connected'
                  : 'Client Storage & Supabase Ready'}
              </span>
              <span className="text-[11px] opacity-80 block">
                {connectionStatus.message || (isSupabaseConfigured() ? 'Live project active.' : 'Operating with offline-resilient local cache. Add project keys to sync directly to cloud.')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={checkConnection}
            className="text-[11px] font-bold underline shrink-0 hover:opacity-80"
          >
            Test Connection
          </button>
        </div>
      </div>

      {/* ─── 2. TODAY'S PRAYER TIMES SUMMARY CARD (Requirement 1) ─── */}
      <div className="bg-gradient-to-br from-[#087F5B] to-[#054432] p-5 sm:p-6 rounded-3xl text-white shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Today's Published Times
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">
                {getTodayDateString()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Live Masjid App Schedule
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDate(getTodayDateString())}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Load Today into Editor</span>
          </button>
        </div>

        {/* 6 Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Fajr</span>
            <span className="text-lg font-extrabold font-mono text-white block mt-0.5">
              {formatTo12h(todayRecord?.fajr || '05:12:00')}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">Dawn Adhan</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-amber-200 block">Sunrise</span>
            <span className="text-lg font-extrabold font-mono text-amber-100 block mt-0.5">
              {todayRecord?.sunrise ? formatTo12h(todayRecord.sunrise) : '—'}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">Shurooq</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Dhuhr</span>
            <span className="text-lg font-extrabold font-mono text-white block mt-0.5">
              {formatTo12h(todayRecord?.dhuhr || '13:04:00')}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">Midday Salah</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Asr</span>
            <span className="text-lg font-extrabold font-mono text-white block mt-0.5">
              {formatTo12h(todayRecord?.asr || '16:32:00')}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">Afternoon Salah</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Maghrib</span>
            <span className="text-lg font-extrabold font-mono text-white block mt-0.5">
              {formatTo12h(todayRecord?.maghrib || '19:14:00')}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">Sunset Adhan</span>
          </div>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">Isha</span>
            <span className="text-lg font-extrabold font-mono text-white block mt-0.5">
              {formatTo12h(todayRecord?.isha || '20:36:00')}
            </span>
            <span className="text-[10px] text-emerald-100 font-medium">Night Salah</span>
          </div>
        </div>

        {/* Friday Jummah strip */}
        <div className="bg-black/20 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">🕌 Friday Jumu'ah:</span>
            <span>
              1st Shift: <strong>{todayRecord?.jummah_1 ? formatTo12h(todayRecord.jummah_1) : '01:15 PM'}</strong>
              {todayRecord?.jummah_2 && (
                <> · 2nd Shift: <strong>{formatTo12h(todayRecord.jummah_2)}</strong></>
              )}
              {todayRecord?.jummah_3 && (
                <> · 3rd Shift: <strong>{formatTo12h(todayRecord.jummah_3)}</strong></>
              )}
            </span>
          </div>
          <span className="text-[10px] text-emerald-200">
            Synced with Madina Masjid MKB Nagar
          </span>
        </div>
      </div>

      {/* ─── 3. DATE SELECTOR & EDITOR FORM (Requirements 1, 2, 3, 4, 5, 6, 7, 8) ─── */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col gap-5">
        
        {/* Date Selector Header (Requirement 1: Show currently selected prayer date at top, Previous/Next controls, date picker) */}
        <div className="flex flex-col gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
                Prayer Schedule Date
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <span className="text-xs font-mono text-slate-500 font-semibold mt-0.5 block">
                ISO: {selectedDate}
              </span>
            </div>

            {/* Quick Date Controls with large touch targets */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleDateOffset(-1)}
                className="h-12 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
                <span className="hidden sm:inline">Prev Day</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDateString())}
                className={`h-12 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDate === getTodayDateString()
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800'
                }`}
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => {
                  const parts = getTodayDateString().split('-').map(Number);
                  const tm = new Date(parts[0], parts[1] - 1, parts[2] + 1);
                  const y = tm.getFullYear();
                  const m = String(tm.getMonth() + 1).padStart(2, '0');
                  const d = String(tm.getDate()).padStart(2, '0');
                  setSelectedDate(`${y}-${m}-${d}`);
                }}
                className={`h-12 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  (() => {
                    const parts = getTodayDateString().split('-').map(Number);
                    const tm = new Date(parts[0], parts[1] - 1, parts[2] + 1);
                    const y = tm.getFullYear();
                    const m = String(tm.getMonth() + 1).padStart(2, '0');
                    const d = String(tm.getDate()).padStart(2, '0');
                    return selectedDate === `${y}-${m}-${d}`;
                  })()
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800'
                }`}
              >
                Tomorrow
              </button>

              <button
                type="button"
                onClick={() => handleDateOffset(1)}
                className="h-12 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Next Day"
              >
                <span className="hidden sm:inline">Next Day</span>
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>

              {/* Native Date Input with large touch target */}
              <div className="relative">
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-12 px-4 rounded-2xl border-2 border-slate-300 hover:border-[#087F5B] focus:border-[#087F5B] text-sm font-bold text-slate-900 focus:outline-hidden bg-slate-50 cursor-pointer"
                  title="Pick a specific date"
                />
              </div>
            </div>
          </div>

          {/* Record Status Banner */}
          <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full shrink-0 ${isExistingRecord ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-semibold text-slate-800">
                {isExistingRecord ? (
                  <>Existing record found in Supabase for <strong className="text-slate-900">{selectedDate}</strong> (Edit mode)</>
                ) : (
                  <>No record in Supabase for <strong className="text-slate-900">{selectedDate}</strong> (New schedule mode - form is empty)</>
                )}
              </span>
            </div>

            {currentUpdatedAt && (
              <span className="text-[11px] text-slate-500 font-medium shrink-0">
                Last updated: {new Date(currentUpdatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* ─── CONNECTION / DATA STATUS INDICATOR (Requirement 9) ─── */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-500">Supabase:</span>
                <span className="font-bold text-emerald-900">{connectionStatus.connected ? 'Connected' : 'Connecting...'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Table:</span>
                <span className="font-mono font-bold text-slate-800">prayer_times</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Selected Date:</span>
                <span className="font-mono font-bold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">Data Source:</span>
                <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-100 text-emerald-800">
                  {currentDataSource}
                </span>
              </div>
            </div>

            {/* Dedicated Load button */}
            <button
              type="button"
              onClick={() => {
                loadDateTimes(selectedDate);
                onShowToast(`Loaded prayer times for ${selectedDate} from Supabase`);
              }}
              disabled={isLoadingDate}
              className="h-9 px-3.5 rounded-xl bg-white hover:bg-emerald-100/60 active:bg-emerald-200/60 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDate ? 'animate-spin' : ''}`} />
              <span>Load</span>
            </button>
          </div>
        </div>

        {/* ─── SUCCESS MESSAGE BANNER (Requirement 3 & 5) ─── */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-start gap-3 text-xs animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-emerald-950">Success</h4>
              <p className="mt-0.5 text-emerald-900 font-semibold">{saveSuccessMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── ERROR MESSAGE BANNER (Requirement 6) ─── */}
        {saveErrorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-3 text-xs animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-rose-950">Database Notice / Error</h4>
              <p className="mt-0.5 text-rose-900 font-medium">{saveErrorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setSaveErrorMsg(null)}
              className="text-rose-700 hover:text-rose-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Inputs (Requirements 2, 4, 7: Large touch targets for elderly mosque administrators) */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* Main 5 Daily Prayers + Sunrise */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Daily Salah & Shurooq Times (24h Time Inputs)
              </h3>
              {!isExistingRecord && (
                <button
                  type="button"
                  onClick={() => {
                    const seed = getInitialSeedRecord(selectedDate);
                    setFajr(formatToInputTime(seed.fajr));
                    setSunrise(seed.sunrise ? formatToInputTime(seed.sunrise) : '');
                    setDhuhr(formatToInputTime(seed.dhuhr));
                    setAsr(formatToInputTime(seed.asr));
                    setMaghrib(formatToInputTime(seed.maghrib));
                    setIsha(formatToInputTime(seed.isha));
                    setJummah1(seed.jummah_1 ? formatToInputTime(seed.jummah_1) : '');
                    setJummah2(seed.jummah_2 ? formatToInputTime(seed.jummah_2) : '');
                    setJummah3('');
                    onShowToast('Populated standard suggested times');
                  }}
                  className="text-xs text-[#087F5B] hover:text-[#066347] font-bold flex items-center gap-1 cursor-pointer underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pre-fill Standard Times</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Fajr */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-[#087F5B] focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#087F5B]" />
                    <span>Fajr Adhan *</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <input
                  type="time"
                  required
                  value={fajr}
                  onChange={(e) => setFajr(e.target.value)}
                  className="h-12 px-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 font-semibold">12h display: {fajr ? formatTo12h(fajr) : '—'}</span>
              </div>

              {/* Sunrise */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-amber-500 focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <SunriseIcon className="w-4 h-4 text-amber-500" />
                    <span>Sunrise (Shurooq)</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Optional</span>
                </div>
                <input
                  type="time"
                  value={sunrise}
                  onChange={(e) => setSunrise(e.target.value)}
                  className="h-12 px-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 font-semibold">12h display: {sunrise ? formatTo12h(sunrise) : 'Not specified'}</span>
              </div>

              {/* Dhuhr */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-[#087F5B] focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>Dhuhr Adhan *</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <input
                  type="time"
                  required
                  value={dhuhr}
                  onChange={(e) => setDhuhr(e.target.value)}
                  className="h-12 px-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 font-semibold">12h display: {dhuhr ? formatTo12h(dhuhr) : '—'}</span>
              </div>

              {/* Asr */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-[#087F5B] focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#087F5B]" />
                    <span>Asr Adhan *</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <input
                  type="time"
                  required
                  value={asr}
                  onChange={(e) => setAsr(e.target.value)}
                  className="h-12 px-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 font-semibold">12h display: {asr ? formatTo12h(asr) : '—'}</span>
              </div>

              {/* Maghrib */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-[#087F5B] focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <SunriseIcon className="w-4 h-4 text-orange-500 rotate-180" />
                    <span>Maghrib Adhan *</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <input
                  type="time"
                  required
                  value={maghrib}
                  onChange={(e) => setMaghrib(e.target.value)}
                  className="h-12 px-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 font-semibold">12h display: {maghrib ? formatTo12h(maghrib) : '—'}</span>
              </div>

              {/* Isha */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-[#087F5B] focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Isha Adhan *</span>
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <input
                  type="time"
                  required
                  value={isha}
                  onChange={(e) => setIsha(e.target.value)}
                  className="h-12 px-3 rounded-xl border border-slate-300 text-base font-mono font-bold text-slate-900 bg-white"
                />
                <span className="text-xs text-slate-500 font-semibold">12h display: {isha ? formatTo12h(isha) : '—'}</span>
              </div>

            </div>
          </div>

          {/* Optional Friday Jumu'ah Shifts (Requirement 2: Jumu'ah 1, 2, 3) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <span>🕌 Friday Jumu'ah Congregated Shifts</span>
                </h3>
                <span className="text-[11px] text-amber-800">Optional: Configure up to 3 Jumu'ah prayer shifts</span>
              </div>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                Jumu'ah 1, 2, 3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Jumu'ah 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Jumu'ah 1 (1st Shift)
                </label>
                <input
                  type="time"
                  value={jummah1}
                  onChange={(e) => setJummah1(e.target.value)}
                  className="h-11 px-3 rounded-lg border border-slate-300 text-sm font-mono font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-500 font-medium">12h: {jummah1 ? formatTo12h(jummah1) : 'Not set'}</span>
              </div>

              {/* Jumu'ah 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Jumu'ah 2 (2nd Shift)
                </label>
                <input
                  type="time"
                  value={jummah2}
                  onChange={(e) => setJummah2(e.target.value)}
                  className="h-11 px-3 rounded-lg border border-slate-300 text-sm font-mono font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-500 font-medium">12h: {jummah2 ? formatTo12h(jummah2) : 'Not set'}</span>
              </div>

              {/* Jumu'ah 3 */}
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-800">
                  Jumu'ah 3 (3rd Shift)
                </label>
                <input
                  type="time"
                  value={jummah3}
                  onChange={(e) => setJummah3(e.target.value)}
                  placeholder="Optional"
                  className="h-11 px-3 rounded-lg border border-slate-300 text-sm font-mono font-bold text-slate-900"
                />
                <span className="text-[11px] text-slate-500 font-medium">12h: {jummah3 ? formatTo12h(jummah3) : 'Not set'}</span>
              </div>
            </div>
          </div>

          {/* Form Action Buttons (Requirement 4: Load, Save / Update, Reset) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Load Button (Requirement 4) */}
              <button
                type="button"
                onClick={() => {
                  loadDateTimes(selectedDate);
                  onShowToast(`Loaded prayer times for ${selectedDate} from Supabase`);
                }}
                disabled={isLoadingDate}
                className="h-12 px-4 rounded-2xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors cursor-pointer"
                title="Reload prayer times for selected date from Supabase"
              >
                <RefreshCw className={`w-4 h-4 text-slate-600 ${isLoadingDate ? 'animate-spin' : ''}`} />
                <span>Load</span>
              </button>

              {/* Reset Button (Requirement 4) */}
              <button
                type="button"
                onClick={handleReset}
                className="h-12 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Reset form to last saved state from Supabase"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset</span>
              </button>

              {isExistingRecord && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="h-12 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Delete Schedule</span>
                </button>
              )}
            </div>

            {/* Save / Update Button (Requirement 4) */}
            <button
              type="submit"
              disabled={isSaving}
              className="h-14 px-8 rounded-2xl bg-[#087F5B] hover:bg-[#066347] active:scale-98 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save / Update</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* ─── 4. SCHEDULED RECORDS IN SUPABASE (Table / History) ─── */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Configured Schedules in Supabase
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Recent dates saved in the <code className="text-[#087F5B] font-mono">prayer_times</code> table
            </span>
          </div>

          <button
            type="button"
            onClick={loadRecords}
            disabled={isLoadingList}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Reload records list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {recordsList.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No records found. Choose a date above and save to create your first schedule in Supabase!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-2">Fajr</th>
                  <th className="py-2.5 px-2">Sunrise</th>
                  <th className="py-2.5 px-2">Dhuhr</th>
                  <th className="py-2.5 px-2">Asr</th>
                  <th className="py-2.5 px-2">Maghrib</th>
                  <th className="py-2.5 px-2">Isha</th>
                  <th className="py-2.5 px-2">Jumu'ah</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recordsList.map((rec) => {
                  const itemDate = rec.prayer_date || rec.date;
                  const isCurrent = itemDate === selectedDate;
                  const isToday = itemDate === getTodayDateString();

                  return (
                    <tr 
                      key={rec.id || itemDate}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-emerald-50/50 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-900">{itemDate}</span>
                          {isToday && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#087F5B] text-white">
                              Today
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-700">{formatTo12h(rec.fajr)}</td>
                      <td className="py-3 px-2 font-mono text-slate-500">{rec.sunrise ? formatTo12h(rec.sunrise) : '—'}</td>
                      <td className="py-3 px-2 font-mono text-slate-700">{formatTo12h(rec.dhuhr)}</td>
                      <td className="py-3 px-2 font-mono text-slate-700">{formatTo12h(rec.asr)}</td>
                      <td className="py-3 px-2 font-mono text-slate-700">{formatTo12h(rec.maghrib)}</td>
                      <td className="py-3 px-2 font-mono text-slate-700">{formatTo12h(rec.isha)}</td>
                      <td className="py-3 px-2 text-slate-600">
                        {rec.jummah_1 ? (
                          <span className="font-mono text-[11px]">
                            {formatTo12h(rec.jummah_1)}
                            {rec.jummah_2 ? ` · ${formatTo12h(rec.jummah_2)}` : ''}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(itemDate);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── MODAL: SUPABASE CONFIGURATION ─── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Supabase Project Configuration
                </h3>
                <span className="text-[11px] text-slate-500">
                  Madina Masjid MKB Nagar Project Credentials
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="flex flex-col gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#087F5B] shrink-0 mt-0.5" />
                <p>
                  You can set these via <code className="font-mono font-bold">VITE_SUPABASE_URL</code> and <code className="font-mono font-bold">VITE_SUPABASE_ANON_KEY</code> in your <code className="font-mono">.env</code> file, or configure them directly here for instant browser connection.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Supabase Anon (Publishable) Key
                </label>
                <input
                  type="text"
                  required
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Security note: Use only your anon/public key. Never paste service_role secret keys.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded-xl bg-[#087F5B] text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: SQL SCHEMA & MIGRATION SCRIPT ─── */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Supabase SQL Migration (<code className="text-emerald-700 font-mono">prayer_times</code>)
                </h3>
                <span className="text-[11px] text-slate-500">
                  Run this in your Supabase SQL Editor if table is not yet created.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] leading-relaxed select-all">
              <pre>{sqlMigrationContent}</pre>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500">
                Migration saved at: <code className="font-mono">supabase/migrations/20250101000000_create_prayer_times.sql</code>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySqlToClipboard}
                  className="px-4 py-2 rounded-xl bg-[#087F5B] hover:bg-[#066347] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: DELETE CONFIRMATION (Requirement 4) ─── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete Prayer Times Schedule?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete the prayer times record for <strong className="text-slate-800">{selectedDate}</strong> from Supabase? This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
