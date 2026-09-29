/**
 * Audio Notification & Adhan Streaming Management System
 * Madina Masjid MKB Nagar App
 * 
 * Directly streams the two official Adhan audio options from Cloudinary:
 * 1. Makkah Adhan -> https://res.cloudinary.com/dv16a8l1l/video/upload/v1790662371/azan8_iiyfqx.mp3
 * 2. Madina Adhan -> https://res.cloudinary.com/dv16a8l1l/video/upload/v1790662378/azan1_ltzblh.mp3
 * 
 * No local files or synthetic fallbacks required.
 */

import { AthanSoundType } from '../types';
import { 
  ADHAN_AUDIO_URLS, 
  ADHAN_SOUND_OPTIONS, 
  ADHAN_SOUND_LIST,
  DEFAULT_ADHAN_SOUND_ID, 
  getAdhanAudioUrl, 
  normalizeAdhanSoundId,
  AdhanSoundId,
  AdhanSoundOption
} from '../config/adhanAudio';

export {
  ADHAN_AUDIO_URLS,
  ADHAN_SOUND_OPTIONS,
  ADHAN_SOUND_LIST,
  DEFAULT_ADHAN_SOUND_ID,
  getAdhanAudioUrl,
  normalizeAdhanSoundId
};
export type { AdhanSoundId, AdhanSoundOption };

/**
 * Display labels for each Adhan sound
 */
export const SOUND_LABELS: Record<AthanSoundType, string> = {
  'Makkah': 'Makkah Adhan',
  'Madina': 'Madina Adhan',
};

// Global audio playback state - guarantees ONLY ONE audio instance can play at a time
let currentActiveAudio: HTMLAudioElement | null = null;
let currentPlayingTone: AthanSoundType | null = null;
let isPlaying = false;

/**
 * Check if audio is currently playing
 */
export const isAudioPlaying = (): boolean => isPlaying;

/**
 * Get the currently playing sound ID
 */
export const getCurrentPlayingTone = (): AthanSoundType | null => currentPlayingTone;

/**
 * Stop any currently playing audio immediately
 */
export const stopNotificationSound = () => {
  if (currentActiveAudio) {
    try {
      currentActiveAudio.pause();
      currentActiveAudio.currentTime = 0;
      currentActiveAudio.removeAttribute('src');
      currentActiveAudio.load();
    } catch {
      // Ignore abort errors
    }
    currentActiveAudio = null;
  }

  isPlaying = false;
  currentPlayingTone = null;
};

export interface PlaySoundOptions {
  volume?: number;
  vibrate?: boolean;
  onEnded?: () => void;
}

/**
 * Main audio dispatcher:
 * - Stops any existing playing audio immediately.
 * - Streams selected Cloudinary MP3 directly over HTTPS.
 * - Triggers device vibration if enabled.
 * - Respects the user-selected volume.
 */
export const playNotificationSound = (
  sound: AthanSoundType,
  options?: PlaySoundOptions
) => {
  // 1. Stop any currently playing audio immediately
  stopNotificationSound();

  const normalizedSound: AthanSoundType = sound === 'Madina' ? 'Madina' : 'Makkah';
  const targetUrl = ADHAN_AUDIO_URLS[normalizedSound] || ADHAN_AUDIO_URLS.Makkah;
  const volume = typeof options?.volume === 'number' ? Math.max(0, Math.min(1, options.volume)) : 0.8;
  const shouldVibrate = options?.vibrate !== false;

  // 2. Trigger Haptic Vibration if enabled
  if (shouldVibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([300, 150, 300]);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  // 3. Stream direct from Cloudinary via HTML5 Audio
  try {
    const audio = new Audio(targetUrl);
    audio.preload = 'auto';
    audio.volume = volume;

    currentActiveAudio = audio;
    currentPlayingTone = normalizedSound;
    isPlaying = true;

    audio.onended = () => {
      stopNotificationSound();
      options?.onEnded?.();
    };

    audio.onerror = (e) => {
      console.warn(`[Madina Masjid Adhan Audio] Playback failed for ${normalizedSound} (${targetUrl}):`, e);
      stopNotificationSound();
      options?.onEnded?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay policy or user gesture interruption
        console.warn(`[Madina Masjid Adhan Audio] Play was prevented or aborted:`, err);
        stopNotificationSound();
        options?.onEnded?.();
      });
    }
  } catch (err) {
    console.error(`[Madina Masjid Adhan Audio] Failed to create audio element:`, err);
    stopNotificationSound();
    options?.onEnded?.();
  }
};
