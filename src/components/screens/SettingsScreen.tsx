import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { AppSettings, AthanSoundType } from '../../types';
import { 
  Globe, 
  Volume2, 
  VolumeX,
  Volume1,
  Moon, 
  Sun, 
  Eye, 
  Sliders, 
  MessageSquare, 
  Send, 
  Check, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Bell,
  BellRing,
  Play,
  Square,
  Upload,
  Music,
  CheckCircle2,
  Clock,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../../utils/translations';
import { readAudioFileAsDataUrl } from '../../utils/audioNotification';
import { RamadanLanternIcon } from '../common/IslamicIcons';

export const SettingsScreen: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    toggleSeniorMode, 
    toggleRamadanMode, 
    setLanguage,
    activePrayerAlert,
    isPlayingNotificationSound,
    currentlyPlayingTone,
    previewSound,
    stopSoundPreview,
    triggerTestPrayerAlert,
    notificationPermission,
    requestNotificationPermission,
    triggerHapticFeedback,
    setActiveTab,
    setOverlayScreen
  } = useApp();

  const t = useTranslation(settings.language);

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [testAlertSent, setTestAlertSent] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages: Array<{ code: 'en' | 'ta' | 'ar'; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'ar', label: 'Arabic', native: 'العربية' }
  ];

  const athanTones: Array<{
    id: AthanSoundType;
    label: string;
    description: string;
    icon: string;
  }> = [
    { id: 'Makkah', label: 'Makkah Adhan', description: 'Majestic resonant Adhan (Sheikh Ali Mulla style)', icon: '🕋' },
    { id: 'Madinah', label: 'Madinah Adhan', description: 'Melodic, warm cadence (Sheikh Surayhi style)', icon: '🕌' },
    { id: 'Al-Aqsa', label: 'Al-Aqsa Adhan', description: 'Historic, deep solemn tone (Baitul Maqdis)', icon: '🌿' },
    { id: 'Soft Beep', label: 'Modern Soft Chime', description: 'Gentle 3-tone acoustic bell for office/study', icon: '🔔' },
    { id: 'Bismillah', label: 'Bismillah Serenity', description: 'Peaceful 5-note harmonic progression', icon: '✨' },
    { id: 'Custom', label: 'Custom Audio File', description: 'Upload your personal MP3 or WAV Adhan recording', icon: '🎵' },
    { id: 'Silent', label: 'Silent / Vibrate Only', description: 'Haptic vibration without audio melody', icon: '🔕' }
  ];

  const reminderIntervals = [
    { minutes: 0, label: 'At Adhan (0m)' },
    { minutes: 5, label: '5m Before' },
    { minutes: 10, label: '10m Before' },
    { minutes: 15, label: '15m Before' },
    { minutes: 20, label: '20m Before' },
    { minutes: 30, label: '30m Before' }
  ];

  const calcMethods = [
    'Islamic Society of North America (ISNA)',
    'Muslim World League (MWL)',
    'Umm Al-Qura (Makkah)',
    'Egyptian General Authority'
  ];

  const handleCustomFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    try {
      const dataUrl = await readAudioFileAsDataUrl(file);
      updateSettings({
        athanSound: 'Custom',
        customAudioName: file.name,
        customAudioDataUrl: dataUrl
      });
      setUploadSuccess(`Uploaded "${file.name}" successfully!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Failed to read audio file.');
      setTimeout(() => setUploadError(null), 4000);
    }
  };

  const handleToggleSoundPreview = (soundId: AthanSoundType) => {
    if (isPlayingNotificationSound && currentlyPlayingTone === soundId) {
      stopSoundPreview();
    } else {
      previewSound(soundId);
    }
  };

  const handleTestNotification = () => {
    triggerTestPrayerAlert('Asr', settings.reminderMinutesBefore);
    setTestAlertSent(true);
    setTimeout(() => setTestAlertSent(false), 3500);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 3000);
  };

  const togglePrayerNotif = (key: keyof typeof settings.prayerNotifications) => {
    updateSettings({
      prayerNotifications: {
        ...settings.prayerNotifications,
        [key]: !settings.prayerNotifications[key]
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-2 pb-10">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
          Preferences & Alerts
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure prayer time approaching reminders, custom audio tones, and accessibility.
        </p>
      </div>

      {/* 1. Approaching Prayer Reminders & Notification System */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3B6FD8] flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Approaching Prayer Reminders
              </h3>
              <p className="text-[11px] text-slate-500">
                Receive local audio & banner reminders before Salah
              </p>
            </div>
          </div>

          {/* Browser Permission Pill */}
          {notificationPermission === 'granted' ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Alerts Enabled</span>
            </span>
          ) : (
            <button
              onClick={requestNotificationPermission}
              className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <Bell className="w-3 h-3 text-[#D4A72C]" />
              <span>Allow Notifications</span>
            </button>
          )}
        </div>

        {/* Lead time selector (When to remind) */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#3B6FD8]" />
            <span>Remind Me Before Prayer Begins</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {reminderIntervals.map(item => {
              const isSelected = settings.reminderMinutesBefore === item.minutes;
              return (
                <button
                  key={item.minutes}
                  type="button"
                  onClick={() => updateSettings({ reminderMinutesBefore: item.minutes })}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-2xs font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {settings.reminderMinutesBefore === 0 
              ? 'Alert will trigger at the exact scheduled Adhan minute.' 
              : `App will sound and notify ${settings.reminderMinutesBefore} minutes ahead so you have time for Wudu.`}
          </span>
        </div>

        {/* Per-Prayer Active Switches */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Active Prayer Notification Toggles
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { key: 'fajr', label: 'Fajr (ஃபஜ்ர்)', time: '05:12 AM' },
              { key: 'sunrise', label: 'Sunrise (இஷ்ராக்)', time: '06:28 AM' },
              { key: 'dhuhr', label: 'Dhuhr (ளுஹர்)', time: '01:04 PM' },
              { key: 'asr', label: 'Asr (அஸர்)', time: '04:32 PM' },
              { key: 'maghrib', label: 'Maghrib (மஃரிப்)', time: '07:14 PM' },
              { key: 'isha', label: 'Isha (இஷா)', time: '08:36 PM' },
            ].map(p => {
              const isActive = settings.prayerNotifications[p.key as keyof typeof settings.prayerNotifications];
              return (
                <div 
                  key={p.key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">{p.label}</span>
                    <span className="text-[10px] text-slate-400">{p.time}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePrayerNotif(p.key as keyof typeof settings.prayerNotifications)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                      isActive ? 'bg-[#087F5B] justify-end' : 'bg-slate-300 justify-start'
                    }`}
                    aria-label={`Toggle reminder for ${p.label}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Friday Jummah Toggle */}
          <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div>
              <span className="font-bold text-emerald-950 block text-[11px]">
                Friday Jummah Service Reminder (2 Hours Prior)
              </span>
              <span className="text-[10px] text-emerald-700">
                1st Shift 12:45 PM · 2nd Shift 01:50 PM
              </span>
            </div>
            <button
              type="button"
              onClick={() => togglePrayerNotif('jummahReminder')}
              className={`w-9 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                settings.prayerNotifications.jummahReminder ? 'bg-[#087F5B] justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
            </button>
          </div>
        </div>

        {/* Instant Test Alert Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestNotification}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-[#07543F] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all shadow-xs"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-300" />
            <span>Test Approaching Prayer Alert & Sound Now</span>
          </button>
          {testAlertSent && (
            <p className="text-[10px] text-center font-bold text-emerald-700 mt-1.5 animate-in fade-in">
              ✓ Test alert triggered! Check the top banner and sound playback.
            </p>
          )}
        </div>
      </div>

      {/* 2. Custom Sound & Audio Settings */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#7657C8] flex items-center justify-center">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Custom Sound & Tone Settings
              </h3>
              <p className="text-[11px] text-slate-500">
                Choose or upload your custom reminder audio tone
              </p>
            </div>
          </div>

          {isPlayingNotificationSound && (
            <button
              onClick={stopSoundPreview}
              className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1 hover:bg-rose-100 transition-colors"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Sound</span>
            </button>
          )}
        </div>

        {/* Tone Selection List with Individual Play/Preview Buttons */}
        <div className="space-y-2">
          {athanTones.map(tone => {
            const isSelected = settings.athanSound === tone.id;
            const isPlayingThis = isPlayingNotificationSound && currentlyPlayingTone === tone.id;

            return (
              <div
                key={tone.id}
                onClick={() => updateSettings({ athanSound: tone.id })}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50/80 border-[#087F5B] shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="text-xl shrink-0 mt-0.5">{tone.icon}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${
                        isSelected ? 'text-[#087F5B]' : 'text-slate-800'
                      }`}>
                        {tone.label}
                      </span>
                      {isSelected && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-[#087F5B] text-white text-[9px] font-extrabold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {tone.id === 'Custom' && settings.customAudioName 
                        ? `File: ${settings.customAudioName}` 
                        : tone.description}
                    </p>
                  </div>
                </div>

                {/* Tone Preview Button */}
                {tone.id !== 'Silent' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSoundPreview(tone.id);
                    }}
                    className={`min-w-[36px] min-h-[36px] px-2 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold shrink-0 transition-colors ${
                      isPlayingThis
                        ? 'bg-[#087F5B] text-white shadow-xs animate-pulse'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    title={isPlayingThis ? 'Stop Preview' : 'Listen to Tone'}
                  >
                    {isPlayingThis ? (
                      <>
                        <Square className="w-3 h-3 fill-current" />
                        <span className="text-[10px]">Playing</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current ml-0.5 text-[#087F5B]" />
                        <span className="text-[10px]">Preview</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Audio File Upload Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-[#087F5B]" />
              <span className="text-xs font-bold text-slate-800">
                Custom Sound File (MP3 / WAV)
              </span>
            </div>
            {settings.customAudioName && (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                {settings.customAudioName}
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mb-2.5">
            You can upload your favorite Muadhin Adhan or a recorded personal chime from your device storage.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleCustomFileUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>{settings.customAudioDataUrl ? 'Change Audio File' : 'Upload Audio File'}</span>
            </button>

            {settings.customAudioDataUrl && (
              <button
                type="button"
                onClick={() => updateSettings({ athanSound: 'Custom' })}
                className="px-3 py-2 rounded-xl bg-[#087F5B] text-white text-xs font-bold hover:bg-[#07543F] transition-colors"
              >
                Use as Active Sound
              </button>
            )}
          </div>

          {uploadSuccess && (
            <p className="text-[11px] text-emerald-700 font-bold mt-2 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{uploadSuccess}</span>
            </p>
          )}

          {uploadError && (
            <p className="text-[11px] text-rose-600 font-medium mt-2 flex items-center gap-1 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>

        {/* Volume & Haptics Control */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>Alert Volume</span>
              </span>
              <span className="font-mono text-emerald-800 font-bold">
                {Math.round(settings.alertVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.alertVolume}
              onChange={e => updateSettings({ alertVolume: parseFloat(e.target.value) })}
              className="w-full accent-[#087F5B] cursor-pointer"
            />
          </div>

          {/* Device Vibration Toggle */}
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#087F5B]" />
                <span>Device Haptic Vibration (Alerts)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Vibrate phone during approaching alerts and Adhan
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !settings.vibrateOnAlert;
                updateSettings({ vibrateOnAlert: next });
                if (next) triggerHapticFeedback('medium');
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                settings.vibrateOnAlert ? 'bg-[#087F5B] justify-end' : 'bg-slate-200 justify-start'
              }`}
              aria-label="Toggle alert vibration"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
            </button>
          </div>

          {/* Interactive Tactile Haptics (Tasbeeh, navigation, buttons) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="text-sm">📳</span>
                <span>Tactile Interaction Haptics</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Subtle haptic pulses on Tasbeeh bead clicks, tab switches & controls
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !settings.hapticFeedback;
                updateSettings({ hapticFeedback: next });
                if (next) triggerHapticFeedback('tasbeeh', true);
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                settings.hapticFeedback ? 'bg-[#087F5B] justify-end' : 'bg-slate-200 justify-start'
              }`}
              aria-label="Toggle interaction haptics"
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
            </button>
          </div>

          {/* Interactive Haptic Test Strip */}
          {settings.hapticFeedback && (
            <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-emerald-900">
                Test Tactile Feel:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerHapticFeedback('tasbeeh', true)}
                  className="px-2 py-1 rounded-lg bg-white border border-emerald-300 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100/50 active:scale-95 transition-all shadow-2xs"
                >
                  Tasbeeh Tap
                </button>
                <button
                  type="button"
                  onClick={() => triggerHapticFeedback('nav', true)}
                  className="px-2 py-1 rounded-lg bg-white border border-emerald-300 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100/50 active:scale-95 transition-all shadow-2xs"
                >
                  Screen Nav
                </button>
                <button
                  type="button"
                  onClick={() => triggerHapticFeedback('success', true)}
                  className="px-2 py-1 rounded-lg bg-[#087F5B] text-white text-[10px] font-bold hover:bg-[#07543F] active:scale-95 transition-all shadow-2xs"
                >
                  Target Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Language Switcher */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#159A9C]" />
          <span>Language (மொழி / اللغة)</span>
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                settings.language === l.code 
                  ? 'bg-emerald-50 border-[#087F5B] text-[#087F5B] font-bold shadow-2xs' 
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-xs block font-bold">{l.native}</span>
              <span className="text-[10px] text-slate-400 block">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Accessibility & Modes */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#E89B3C]" />
          <span>Accessibility & Community Modes</span>
        </h3>

        {/* Senior Mode Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-xs font-bold text-slate-900">
              Senior / Elderly Mode (பெரியவர்கள் முறை)
            </div>
            <p className="text-[11px] text-slate-500 max-w-[240px]">
              Enlarges buttons and prayer text for effortless reading.
            </p>
          </div>
          <button
            onClick={toggleSeniorMode}
            className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
              settings.seniorMode ? 'bg-[#087F5B] justify-end' : 'bg-slate-200 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
          </button>
        </div>

        <div className="border-t border-slate-100"></div>

        {/* Ramadan Mode Toggle */}
        <div className="py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                settings.ramadanMode 
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' 
                  : 'bg-amber-50 text-amber-700'
              }`}>
                <RamadanLanternIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Ramadan Mode (ரம்ஜான் முறை)</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border transition-colors ${
                    settings.ramadanMode
                      ? 'bg-amber-400 text-slate-950 border-amber-500'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}>
                    {settings.ramadanMode ? 'Active' : 'Special'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-[240px] mt-0.5">
                  Festive color theme, Home Screen Iftar & Suhoor countdown, and fasting duas.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerHapticFeedback('selection', true);
                toggleRamadanMode();
              }}
              aria-label="Toggle Ramadan Mode"
              className={`w-12 h-7 rounded-full transition-all duration-200 p-1 flex items-center shrink-0 ${
                settings.ramadanMode 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)] justify-end' 
                  : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
            </button>
          </div>

          {/* Expanded Festive Features Info when Ramadan Mode is Active */}
          {settings.ramadanMode && (
            <div className="mt-3 p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 space-y-2 animate-in fade-in duration-200">
              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Ramadan Mode Active Features:</span>
              </div>
              
              <ul className="text-[11px] text-slate-600 space-y-1 pl-1">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span><strong>Festive Theme:</strong> Midnight sapphire & radiant gold palette across app</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span><strong>Countdown Card:</strong> Live Iftar & Suhoor clock directly on Home Screen</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span><strong>Fasting Duas:</strong> Authenticated supplications in Arabic, English & Tamil</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                  <span><strong>Taraweeh Schedule:</strong> Daily 20 Raka'at timings and community Iftar updates</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-[10px] text-amber-800 font-medium">Ready on Home Screen</span>
                <button
                  onClick={() => {
                    setOverlayScreen(null);
                    setActiveTab('home');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors flex items-center gap-1"
                >
                  <span>View Countdown Card</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Calculation Method */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-[#3B6FD8]" />
          <span>Astronomical Calculation Method</span>
        </h3>

        <div>
          <select
            value={settings.calculationMethod}
            onChange={e => updateSettings({ calculationMethod: e.target.value })}
            className="w-full h-11 px-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden"
          >
            {calcMethods.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Feedback & Suggestions */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-[#087F5B]" />
          <span>Suggestions to Masjid Board</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Share your ideas for halaqahs, parking improvements, or community services.
        </p>

        <form onSubmit={handleSendFeedback} className="space-y-2">
          <textarea
            rows={3}
            required
            value={feedbackText}
            onChange={e => setFeedbackText(e.target.value)}
            placeholder="Write your constructive message to the committee..."
            className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
          />

          {feedbackSent ? (
            <div className="p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-center text-xs font-bold">
              ✓ JazakAllah Khair! Your message has been sent to the board.
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-2.5 bg-[#087F5B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#07543F] transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Suggestion</span>
            </button>
          )}
        </form>
      </div>

      {/* App Version Info */}
      <div className="text-center text-[11px] text-slate-400 py-2">
        Madina Masjid MKB Nagar Mobile App · Version 2.5.0 (Community Build)
        <br />Designed with love & ihsan for the Ummah
      </div>
    </div>
  );
};
