/**
 * Audio Notification & Synthesis Engine for Madina Masjid MKB Nagar App
 * Supports synthesized Adhans (Makkah, Madinah, Al-Aqsa), melodic chimes,
 * soft beeps, and custom user-uploaded audio files via HTML5 Audio and Web Audio API.
 */

import { AthanSoundType } from '../types';

let audioCtx: AudioContext | null = null;
let currentCustomAudio: HTMLAudioElement | null = null;
let activeTimeouts: number[] = [];
let isPlaying = false;

// Audio Context Singleton
const getAudioContext = (): AudioContext => {
  if (!audioCtx || audioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Clear active scheduled notes
export const stopNotificationSound = () => {
  activeTimeouts.forEach(t => clearTimeout(t));
  activeTimeouts = [];

  if (currentCustomAudio) {
    try {
      currentCustomAudio.pause();
      currentCustomAudio.currentTime = 0;
    } catch {
      // Ignore abort errors
    }
    currentCustomAudio = null;
  }

  if (audioCtx && audioCtx.state === 'running') {
    try {
      audioCtx.close().catch(() => {});
      audioCtx = null;
    } catch {
      audioCtx = null;
    }
  }

  isPlaying = false;
};

// Play a resonant tone with harmonic warmth
const playHarmonicTone = (
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.5,
  type: OscillatorType = 'sine'
) => {
  // Master gain for this note
  const noteGain = ctx.createGain();
  noteGain.gain.setValueAtTime(0.001, startTime);
  noteGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), startTime + 0.08);
  noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  // Fundamental oscillator
  const osc1 = ctx.createOscillator();
  osc1.type = type;
  osc1.frequency.setValueAtTime(freq, startTime);

  // Second harmonic for acoustic body
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, startTime);
  const gain2 = ctx.createGain();
  gain2.gain.value = 0.25;

  // Gentle low-pass filter for soothing warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, startTime);

  osc1.connect(noteGain);
  osc2.connect(gain2);
  gain2.connect(noteGain);
  noteGain.connect(filter);
  filter.connect(ctx.destination);

  osc1.start(startTime);
  osc2.start(startTime);
  osc1.stop(startTime + duration + 0.1);
  osc2.stop(startTime + duration + 0.1);
};

// Makkah Adhan Melody Fragment (Maqam Hijaz / Rast - Majestic, bold)
const playMakkahMelody = (ctx: AudioContext, masterVolume: number, onEnd?: () => void) => {
  // Frequencies in Hz: D4, F4, G4, A4, G4, F4, E4, D4
  const notes = [
    { freq: 293.66, dur: 0.9, delay: 0 },    // Allahu
    { freq: 349.23, dur: 0.8, delay: 0.8 },  // Ak-
    { freq: 392.00, dur: 1.4, delay: 1.5 },  // bar...
    { freq: 440.00, dur: 0.7, delay: 3.0 },  // Al-
    { freq: 392.00, dur: 0.6, delay: 3.6 },  // lahu
    { freq: 349.23, dur: 0.8, delay: 4.1 },  // Ak-
    { freq: 293.66, dur: 1.8, delay: 4.8 }   // bar...
  ];

  const now = ctx.currentTime;
  notes.forEach(note => {
    playHarmonicTone(ctx, note.freq, now + note.delay, note.dur, masterVolume * 0.7, 'sine');
  });

  const totalDuration = 6800;
  const timeoutId = window.setTimeout(() => {
    isPlaying = false;
    onEnd?.();
  }, totalDuration);
  activeTimeouts.push(timeoutId);
};

// Madinah Adhan Melody Fragment (Maqam Bayati - Gentle, melodic, comforting)
const playMadinahMelody = (ctx: AudioContext, masterVolume: number, onEnd?: () => void) => {
  const notes = [
    { freq: 293.66, dur: 0.7, delay: 0 },    // D4
    { freq: 311.13, dur: 0.6, delay: 0.6 },  // Eb4
    { freq: 349.23, dur: 1.1, delay: 1.1 },  // F4
    { freq: 392.00, dur: 1.3, delay: 2.1 },  // G4
    { freq: 349.23, dur: 0.7, delay: 3.3 },  // F4
    { freq: 311.13, dur: 0.8, delay: 3.9 },  // Eb4
    { freq: 293.66, dur: 1.8, delay: 4.6 }   // D4
  ];

  const now = ctx.currentTime;
  notes.forEach(note => {
    playHarmonicTone(ctx, note.freq, now + note.delay, note.dur, masterVolume * 0.65, 'sine');
  });

  const totalDuration = 6500;
  const timeoutId = window.setTimeout(() => {
    isPlaying = false;
    onEnd?.();
  }, totalDuration);
  activeTimeouts.push(timeoutId);
};

// Al-Aqsa Adhan Melody (Maqam Sikah - Deep, historic, reverent)
const playAlAqsaMelody = (ctx: AudioContext, masterVolume: number, onEnd?: () => void) => {
  const notes = [
    { freq: 261.63, dur: 0.9, delay: 0 },    // C4
    { freq: 311.13, dur: 0.8, delay: 0.8 },  // Eb4
    { freq: 392.00, dur: 1.3, delay: 1.5 },  // G4
    { freq: 369.99, dur: 0.7, delay: 2.7 },  // F#4
    { freq: 392.00, dur: 1.1, delay: 3.3 },  // G4
    { freq: 311.13, dur: 0.8, delay: 4.3 },  // Eb4
    { freq: 261.63, dur: 2.0, delay: 5.0 }   // C4
  ];

  const now = ctx.currentTime;
  notes.forEach(note => {
    playHarmonicTone(ctx, note.freq, now + note.delay, note.dur, masterVolume * 0.7, 'triangle');
  });

  const totalDuration = 7100;
  const timeoutId = window.setTimeout(() => {
    isPlaying = false;
    onEnd?.();
  }, totalDuration);
  activeTimeouts.push(timeoutId);
};

// Soft Modern Triple Beep
const playSoftBeep = (ctx: AudioContext, masterVolume: number, onEnd?: () => void) => {
  const notes = [
    { freq: 784.0, dur: 0.15, delay: 0 },     // G5
    { freq: 987.77, dur: 0.15, delay: 0.18 }, // B5
    { freq: 1174.66, dur: 0.35, delay: 0.36 } // D6
  ];

  const now = ctx.currentTime;
  notes.forEach(note => {
    playHarmonicTone(ctx, note.freq, now + note.delay, note.dur, masterVolume * 0.5, 'sine');
  });

  const totalDuration = 1000;
  const timeoutId = window.setTimeout(() => {
    isPlaying = false;
    onEnd?.();
  }, totalDuration);
  activeTimeouts.push(timeoutId);
};

// Bismillah Serene Chime (F#4 -> G#4 -> A#4 -> C#5 -> D#5)
const playBismillahChime = (ctx: AudioContext, masterVolume: number, onEnd?: () => void) => {
  const notes = [
    { freq: 369.99, dur: 0.6, delay: 0 },    // F#4
    { freq: 415.30, dur: 0.6, delay: 0.35 }, // G#4
    { freq: 466.16, dur: 0.7, delay: 0.70 }, // A#4
    { freq: 554.37, dur: 0.8, delay: 1.05 }, // C#5
    { freq: 622.25, dur: 1.6, delay: 1.40 }  // D#5
  ];

  const now = ctx.currentTime;
  notes.forEach(note => {
    playHarmonicTone(ctx, note.freq, now + note.delay, note.dur, masterVolume * 0.55, 'sine');
  });

  const totalDuration = 3200;
  const timeoutId = window.setTimeout(() => {
    isPlaying = false;
    onEnd?.();
  }, totalDuration);
  activeTimeouts.push(timeoutId);
};

export interface PlaySoundOptions {
  customDataUrl?: string;
  volume?: number;
  vibrate?: boolean;
  onEnded?: () => void;
}

/**
 * Main audio dispatcher
 */
export const playNotificationSound = (
  sound: AthanSoundType,
  options?: PlaySoundOptions
) => {
  // Stop any currently playing audio
  stopNotificationSound();

  const volume = typeof options?.volume === 'number' ? Math.max(0, Math.min(1, options.volume)) : 0.8;
  const shouldVibrate = options?.vibrate !== false;

  // Haptic feedback if available and requested
  if (shouldVibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([250, 120, 250]);
    } catch {
      // Ignore vibration errors
    }
  }

  if (sound === 'Silent') {
    options?.onEnded?.();
    return;
  }

  // Handle custom audio file
  if (sound === 'Custom') {
    if (options?.customDataUrl) {
      try {
        const audio = new Audio(options.customDataUrl);
        audio.volume = volume;
        currentCustomAudio = audio;
        isPlaying = true;

        audio.onended = () => {
          isPlaying = false;
          currentCustomAudio = null;
          options?.onEnded?.();
        };

        audio.onerror = () => {
          isPlaying = false;
          currentCustomAudio = null;
          // Fallback to pleasant chime if custom audio fails
          const ctx = getAudioContext();
          playBismillahChime(ctx, volume, options?.onEnded);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If autoplay was blocked, fallback to Web Audio context
            const ctx = getAudioContext();
            playBismillahChime(ctx, volume, options?.onEnded);
          });
        }
        return;
      } catch {
        // Fallback
        const ctx = getAudioContext();
        playBismillahChime(ctx, volume, options?.onEnded);
        return;
      }
    } else {
      // No custom audio uploaded yet, play gentle chime
      const ctx = getAudioContext();
      playBismillahChime(ctx, volume, options?.onEnded);
      return;
    }
  }

  // Synthesized sounds
  const ctx = getAudioContext();
  isPlaying = true;

  switch (sound) {
    case 'Makkah':
      playMakkahMelody(ctx, volume, options?.onEnded);
      break;
    case 'Madinah':
      playMadinahMelody(ctx, volume, options?.onEnded);
      break;
    case 'Al-Aqsa':
      playAlAqsaMelody(ctx, volume, options?.onEnded);
      break;
    case 'Soft Beep':
      playSoftBeep(ctx, volume, options?.onEnded);
      break;
    case 'Bismillah':
      playBismillahChime(ctx, volume, options?.onEnded);
      break;
    default:
      playMakkahMelody(ctx, volume, options?.onEnded);
      break;
  }
};

/**
 * Helper to convert uploaded audio File to Base64 Data URL
 */
export const readAudioFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('audio/')) {
      reject(new Error('Please select a valid audio file (e.g., MP3, WAV, AAC, OGG).'));
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Audio file size must be less than 10MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read audio file.'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};
