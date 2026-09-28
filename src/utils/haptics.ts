// Subtle tactile haptic feedback utility
// Combines native device vibration API with optional micro-acoustic tactile feedback for browsers

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
};

// Generates an ultra-subtle mechanical tactile click (like a real tally bead or physical button)
const playMicroTactileClick = (frequency = 180, duration = 0.015, volume = 0.08) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + duration);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio context not allowed or blocked
  }
};

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'tasbeeh' | 'nav';

/**
 * Triggers subtle tactile haptic vibration and micro-feedback
 */
export const triggerHaptic = (
  style: HapticStyle = 'light', 
  enabled = true, 
  withMicroSound = false
) => {
  if (!enabled || typeof window === 'undefined') return;

  // 1. Hardware vibration via Navigator Vibrate API (Mobile Android & supported browsers)
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      switch (style) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'nav':
          navigator.vibrate(8);
          break;
        case 'selection':
          navigator.vibrate(12);
          break;
        case 'tasbeeh':
          // Crisp tactile pulse for Tasbeeh bead count
          navigator.vibrate(18);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate(35);
          break;
        case 'success':
          // Celebratory cadence for reaching goal
          navigator.vibrate([25, 45, 30, 45, 50]);
          break;
      }
    } catch {
      // Ignored if vibration is disabled by OS
    }
  }

  // 2. Micro-acoustic tactile click (useful for Tasbeeh counter to simulate physical tally click)
  if (withMicroSound) {
    if (style === 'tasbeeh') {
      playMicroTactileClick(220, 0.016, 0.12);
    } else if (style === 'success') {
      playMicroTactileClick(440, 0.04, 0.15);
      setTimeout(() => playMicroTactileClick(660, 0.06, 0.18), 70);
    } else if (style === 'nav') {
      playMicroTactileClick(150, 0.01, 0.04);
    }
  }
};
