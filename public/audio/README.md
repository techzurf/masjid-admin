# Madina Masjid MKB Nagar - Audio Files Directory

Place your MP3 audio files in this directory (`/public/audio/`).
The application automatically routes to these exact filenames:

| Sound Option in App | Required Filename | Full Path |
| :--- | :--- | :--- |
| **1. Makkah Adhan** | `makkah.mp3` | `/public/audio/makkah.mp3` |
| **2. Madinah Adhan** | `madinah.mp3` | `/public/audio/madinah.mp3` |
| **3. Al-Aqsa Adhan** | `al-aqsa.mp3` | `/public/audio/al-aqsa.mp3` |
| **4. Modern Soft Chime** | `soft-chime.mp3` | `/public/audio/soft-chime.mp3` |
| **5. Bismillah Serenity** | `bismillah.mp3` | `/public/audio/bismillah.mp3` |
| **6. Custom Audio File** | `custom.mp3` *(optional static fallback)* | `/public/audio/custom.mp3` |
| **7. Silent / Vibrate Only** | *(No file needed - triggers haptics only)* | `N/A` |

### Notes:
- Standard format: `.mp3` (128kbps or 192kbps recommended).
- When a file is placed here, the application plays the real MP3 file directly via HTML5 Audio.
- Users can also upload their personal custom MP3 file directly in App Settings using the "Upload Audio File" button.
