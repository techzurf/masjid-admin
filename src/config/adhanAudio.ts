/**
 * Centralized Adhan Audio Configuration
 * 
 * Provides direct Cloudinary audio streaming URLs for the two Adhan options:
 * 1. Makkah Adhan
 * 2. Madina Adhan
 * 
 * Audio URLs are streamed directly without local file dependencies.
 */

export type AdhanSoundId = 'Makkah' | 'Madina';

export interface AdhanSoundOption {
  id: AdhanSoundId;
  name: string;
  description: string;
  icon: string;
  audioUrl: string;
}

export const DEFAULT_ADHAN_SOUND_ID: AdhanSoundId = 'Makkah';

export const ADHAN_SOUND_OPTIONS: Record<AdhanSoundId, AdhanSoundOption> = {
  Makkah: {
    id: 'Makkah',
    name: 'Makkah Adhan',
    description: 'Majestic resonant Adhan from Masjid al-Haram',
    icon: '🕋',
    audioUrl: 'https://res.cloudinary.com/dv16a8l1l/video/upload/v1790662371/azan8_iiyfqx.mp3'
  },
  Madina: {
    id: 'Madina',
    name: 'Madina Adhan',
    description: 'Melodic, serene Adhan from Al-Masjid an-Nabawi',
    icon: '🕌',
    audioUrl: 'https://res.cloudinary.com/dv16a8l1l/video/upload/v1790662378/azan1_ltzblh.mp3'
  }
};

export const ADHAN_SOUND_LIST: AdhanSoundOption[] = [
  ADHAN_SOUND_OPTIONS.Makkah,
  ADHAN_SOUND_OPTIONS.Madina
];

export const ADHAN_AUDIO_URLS: Record<AdhanSoundId, string> = {
  Makkah: ADHAN_SOUND_OPTIONS.Makkah.audioUrl,
  Madina: ADHAN_SOUND_OPTIONS.Madina.audioUrl
};

/**
 * Returns the Cloudinary MP3 streaming URL for the requested sound ID.
 * Defaults to Makkah Adhan if not specified or unrecognized.
 */
export function getAdhanAudioUrl(soundId?: string | null): string {
  if (soundId === 'Madina' || soundId === 'Madinah') {
    return ADHAN_AUDIO_URLS.Madina;
  }
  return ADHAN_AUDIO_URLS.Makkah;
}

/**
 * Normalizes any stored sound identifier to a valid AdhanSoundId ('Makkah' | 'Madina')
 */
export function normalizeAdhanSoundId(val?: string | null): AdhanSoundId {
  if (val === 'Madina' || val === 'Madinah') {
    return 'Madina';
  }
  return 'Makkah';
}
