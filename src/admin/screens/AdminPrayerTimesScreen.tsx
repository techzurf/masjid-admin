import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Copy, 
  Check, 
  Sun, 
  Sunrise as SunriseIcon, 
  Moon, 
  Sparkles,
  Info,
  Settings,
  X,
  RotateCcw
} from 'lucide-react';
import { 
  PrayerTimeRecord, 
  fetchPrayerTimesForDate, 
  fetchAllPrayerTimes, 
  savePrayerTimes, 
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
import { PullToRefresh } from '../../components/common/PullToRefresh';

interface AdminPrayerTimesScreenProps {
  prayers?: any;
  onSavePrayers?: (updated: any) => void;
  onShowToast: (msg: string) => void;
}

export const AdminPrayerTimesScreen: React.FC<AdminPrayerTimesScreenProps> = ({ onShowToast }) => {
  const { refreshPrayerTimes } = useApp();

  // Active current record metadata from Supabase
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [currentRecordDate, setCurrentRecordDate] = useState<string>(getTodayDateString());
  const [currentUpdatedAt, setCurrentUpdatedAt] = useState<string | null>(null);
  const [currentDataSource, setCurrentDataSource] = useState<'Supabase' | 'Default Schedule' | 'Error'>('Supabase');

  // Form input state for single current prayer-time schedule
  const [fajr, setFajr] = useState<string>('05:12');
  const [sunrise, setSunrise] = useState<string>('06:28');
  const [dhuhr, setDhuhr] = useState<string>('13:04');
  const [asr, setAsr] = useState<string>('16:32');
  const [maghrib, setMaghrib] = useState<string>('19:14');
  const [isha, setIsha] = useState<string>('20:36');
  const [jummah1, setJummah1] = useState<string>('13:15');
  const [jummah2, setJummah2] = useState<string>('14:15');
  const [jummah3, setJummah3] = useState<string>('');

  // Loading & Feedback states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // Modals & Connection
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
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

  const [inputUrl, setInputUrl] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');

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

  // Load the current active prayer times from Supabase
  const loadCurrentTimes = useCallback(async () => {
    setIsLoading(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      // 1. Fetch latest saved record from prayer_times table
      const listRes = await fetchAllPrayerTimes(1, false);
      let record: PrayerTimeRecord | null = null;

      if (listRes.data && listRes.data.length > 0) {
        record = listRes.data[0];
      } else {
        // Fallback: check today's date
        const todayRes = await fetchPrayerTimesForDate(getTodayDateString(), false);
        if (todayRes.data) {
          record = todayRes.data;
        }
      }

      if (record) {
        setCurrentRecordId(record.id);
        setCurrentRecordDate(record.prayer_date || getTodayDateString());
        setCurrentUpdatedAt(record.updated_at || null);
        setCurrentDataSource('Supabase');

        setFajr(formatToInputTime(record.fajr));
        setSunrise(record.sunrise ? formatToInputTime(record.sunrise) : '');
        setDhuhr(formatToInputTime(record.dhuhr));
        setAsr(formatToInputTime(record.asr));
        setMaghrib(formatToInputTime(record.maghrib));
        setIsha(formatToInputTime(record.isha));
        setJummah1(record.jummah_1 ? formatToInputTime(record.jummah_1) : '');
        setJummah2(record.jummah_2 ? formatToInputTime(record.jummah_2) : '');
        setJummah3(record.jummah_3 ? formatToInputTime(record.jummah_3) : '');
      } else {
        // No record exists in Supabase yet: load standard seed defaults so admin can easily edit & save
        const seed = getInitialSeedRecord();
        setCurrentRecordId(null);
        setCurrentRecordDate(getTodayDateString());
        setCurrentUpdatedAt(null);
        setCurrentDataSource('Default Schedule');

        setFajr(formatToInputTime(seed.fajr));
        setSunrise(seed.sunrise ? formatToInputTime(seed.sunrise) : '');
        setDhuhr(formatToInputTime(seed.dhuhr));
        setAsr(formatToInputTime(seed.asr));
        setMaghrib(formatToInputTime(seed.maghrib));
        setIsha(formatToInputTime(seed.isha));
        setJummah1(seed.jummah_1 ? formatToInputTime(seed.jummah_1) : '');
        setJummah2(seed.jummah_2 ? formatToInputTime(seed.jummah_2) : '');
        setJummah3('');
      }
    } catch (err: any) {
      console.error('Error fetching current prayer times:', err);
      setCurrentDataSource('Error');
      setSaveErrorMsg(`Error loading record: ${err?.message || 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    loadCurrentTimes();
    const cfg = getSupabaseConfig();
    setInputUrl(cfg.url);
    setInputKey(cfg.key);
  }, [checkConnection, loadCurrentTimes]);

  // Handle Reset button: revert inputs to the saved values in Supabase
  const handleReset = async () => {
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
    await loadCurrentTimes();
    onShowToast('Form reset to saved prayer times');
  };

  // Pre-fill standard suggested prayer times
  const handlePrefillSuggested = () => {
    const seed = getInitialSeedRecord();
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
  };

  // Handle Save / Update Prayer Times
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    // Validation: 5 daily prayer times are required
    const missingFields: string[] = [];
    if (!fajr || !fajr.trim()) missingFields.push('Fajr Iqamah');
    if (!dhuhr || !dhuhr.trim()) missingFields.push('Dhuhr Iqamah');
    if (!asr || !asr.trim()) missingFields.push('Asr Iqamah');
    if (!maghrib || !maghrib.trim()) missingFields.push('Maghrib Iqamah');
    if (!isha || !isha.trim()) missingFields.push('Isha Iqamah');

    if (missingFields.length > 0) {
      setSaveErrorMsg(`Please fill in all required prayer times: ${missingFields.join(', ')}.`);
      setIsSaving(false);
      return;
    }

    try {
      const targetDate = currentRecordDate || getTodayDateString();
      const payload = {
        id: currentRecordId || undefined,
        prayer_date: targetDate,
        date: targetDate,
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

      // Save directly to Supabase
      const result = await savePrayerTimes(payload, false);

      if (result.data) {
        setCurrentRecordId(result.data.id);
        setCurrentRecordDate(result.data.prayer_date || targetDate);
        setCurrentUpdatedAt(result.data.updated_at || new Date().toISOString());
        setCurrentDataSource('Supabase');

        const successText = 'Prayer times updated and published live to the Masjid App!';
        setSaveSuccessMsg(successText);
        onShowToast(successText);

        // Immediately update mobile app's dynamic prayer time state
        await refreshPrayerTimes();
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

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(inputUrl, inputKey);
    setShowConfigModal(false);
    onShowToast('Supabase configuration updated. Reconnecting...');
    checkConnection();
    loadCurrentTimes();
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

  const handlePullRefresh = async () => {
    await Promise.all([
      checkConnection(),
      loadCurrentTimes()
    ]);
  };

  return (
    <PullToRefresh onRefresh={handlePullRefresh} containerId="admin-main-scroll">
      <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200 pb-16">
      
      {/* ─── 1. TOP HEADER & DATABASE CONNECTION STATUS ─── */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
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
              Configure and publish current Iqamah and Friday Jumu'ah prayer times directly to Supabase.
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
                loadCurrentTimes();
                onShowToast('Synced with Supabase');
              }}
              disabled={isLoading}
              className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh connection & records"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* ─── 2. MAIN SECTION: CURRENT PRAYER TIMES (Single Schedule Management) ─── */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col gap-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Masjid Timetable · Live
              </span>
              {currentUpdatedAt && (
                <span className="text-[10px] text-slate-400 font-medium">
                  Last updated: {new Date(currentUpdatedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              CURRENT PRAYER TIMES
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              The active prayer schedule displayed to all community members across the Masjid App.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrefillSuggested}
              className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Populate standard suggested times"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>Standard Times</span>
            </button>

            <button
              type="button"
              onClick={loadCurrentTimes}
              disabled={isLoading}
              className="h-10 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#087F5B] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Reload from Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Reload</span>
            </button>
          </div>
        </div>

        {/* Live Overview Strip of Current Schedule */}
        <div className="bg-gradient-to-br from-[#087F5B] to-[#054432] p-4 sm:p-5 rounded-2xl text-white shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Live Mobile Schedule Preview (12h Display)</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-white">
              {currentDataSource}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Fajr Iqamah</span>
              <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                {fajr ? formatTo12h(fajr) : '—'}
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">Sunrise</span>
              <span className="text-base font-extrabold font-mono text-amber-100 block mt-0.5">
                {sunrise ? formatTo12h(sunrise) : '—'}
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Dhuhr Iqamah</span>
              <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                {dhuhr ? formatTo12h(dhuhr) : '—'}
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Asr Iqamah</span>
              <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                {asr ? formatTo12h(asr) : '—'}
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Maghrib Iqamah</span>
              <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                {maghrib ? formatTo12h(maghrib) : '—'}
              </span>
            </div>

            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Isha Iqamah</span>
              <span className="text-base font-extrabold font-mono text-white block mt-0.5">
                {isha ? formatTo12h(isha) : '—'}
              </span>
            </div>
          </div>

          {(jummah1 || jummah2) && (
            <div className="bg-black/20 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
              <span className="font-bold text-amber-300">🕌 Friday Jumu'ah:</span>
              <span className="text-emerald-100 font-medium">
                1st Shift: <strong>{jummah1 ? formatTo12h(jummah1) : '—'}</strong>
                {jummah2 && <> · 2nd Shift: <strong>{formatTo12h(jummah2)}</strong></>}
                {jummah3 && <> · 3rd Shift: <strong>{formatTo12h(jummah3)}</strong></>}
              </span>
            </div>
          )}
        </div>

        {/* ─── SUCCESS MESSAGE BANNER ─── */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-start gap-3 text-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-emerald-950">Updated Successfully</h4>
              <p className="mt-0.5 text-emerald-900 font-semibold">{saveSuccessMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─── ERROR MESSAGE BANNER ─── */}
        {saveErrorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-3 text-xs animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-rose-950">Notice / Error</h4>
              <p className="mt-0.5 text-rose-900 font-medium">{saveErrorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setSaveErrorMsg(null)}
              className="text-rose-700 hover:text-rose-950 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Inputs (Direct editing of current prayer times) */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* Main 5 Daily Prayers + Sunrise */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Daily Salah & Shurooq (Iqamah Times)
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                24-Hour Time Format (e.g. 13:15 for 01:15 PM)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Fajr */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col gap-2 focus-within:border-[#087F5B] focus-within:bg-white transition-all">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Moon className="w-4 h-4 text-[#087F5B]" />
                    <span>Fajr Iqamah *</span>
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
                    <span>Dhuhr Iqamah *</span>
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
                    <span>Asr Iqamah *</span>
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
                    <span>Maghrib Iqamah *</span>
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
                    <span>Isha Iqamah *</span>
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

          {/* Friday Jumu'ah Shifts */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <span>🕌 Friday Jumu'ah Shifts</span>
                </h3>
                <span className="text-[11px] text-amber-800">Configure up to 3 Jumu'ah prayer shifts for the Masjid</span>
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

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading || isSaving}
                className="h-12 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                title="Reset form to saved values from Supabase"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Changes</span>
              </button>
            </div>

            {/* Clear "Save / Update Prayer Times" Button */}
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
                  <span>Save / Update Prayer Times</span>
                </>
              )}
            </button>
          </div>

        </form>
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
                  You can set these via <code className="font-mono font-bold">VITE_SUPABASE_URL</code> and <code className="font-mono font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</code> in your <code className="font-mono">.env</code> file, or configure them directly here for instant browser connection.
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

      </div>
    </PullToRefresh>
  );
};
