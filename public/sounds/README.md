# Adhan Sound Files

Place your actual MP3 audio files in this directory for the Madina Masjid MKB Nagar Community App:

- `makkah-adhan.mp3`  -> /sounds/makkah-adhan.mp3 (Traditional Makkah-inspired Adhan)
- `madinah-adhan.mp3` -> /sounds/madinah-adhan.mp3 (Traditional Madinah-inspired Adhan)
- `soft-adhan.mp3`    -> /sounds/soft-adhan.mp3 (Gentle Adhan for daily prayer alerts)
- `short-adhan.mp3`   -> /sounds/short-adhan.mp3 (Short prayer notification)

Note:
- The paths are configurable in `src/utils/audioNotification.ts` via `ADHAN_SOUND_PATHS`.
- Silent / Vibrate Only uses device haptic vibration and requires no audio file.
