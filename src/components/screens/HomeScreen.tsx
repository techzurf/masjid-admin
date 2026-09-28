import React from 'react';
import { useApp } from '../../context/AppContext';
import { PromoVideoBanner } from '../home/PromoVideoBanner';
import { PrayerCard } from '../home/PrayerCard';
import { RamadanCountdownCard } from '../home/RamadanCountdownCard';
import { QuickActions } from '../home/QuickActions';
import { AnnouncementBanner } from '../home/AnnouncementBanner';
import { ConnectMuslimPreview } from '../home/ConnectMuslimPreview';
import { UpcomingEventsPreview } from '../home/UpcomingEventsPreview';
import { LatestVideosSection } from '../home/LatestVideosSection';
import { DailyReminderCard } from '../home/DailyReminderCard';
import { PhoneCall } from 'lucide-react';
import { useTranslation } from '../../utils/translations';

export const HomeScreen: React.FC = () => {
  const { setOverlayScreen, settings } = useApp();
  const t = useTranslation(settings.language);

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-6">
      {/* 0. Ramadan Mode Dedicated Countdown Card (Iftar & Suhoor live timers) */}
      {settings.ramadanMode && <RamadanCountdownCard />}

      {/* 1. Promotional Video & Main Prayer Time Hero Card Stack (Exact same left & right boundaries, zero gap) */}
      <div className="w-full flex flex-col rounded-3xl overflow-hidden shadow-sm border border-emerald-950/10 bg-white">
        <PromoVideoBanner />
        <PrayerCard className="w-full bg-white p-4 relative overflow-hidden" />
      </div>

      {/* 2. Quick Services (5-Service Asymmetric Quick-Commerce Grid) */}
      <QuickActions />

        {/* 3. Important Masjid Announcement / Urgent Notice */}
        <AnnouncementBanner />

        {/* 4. Upcoming Events Carousel */}
        <UpcomingEventsPreview />

        {/* 5. Latest Videos Horizontal YouTube Scroller */}
        <LatestVideosSection />

        {/* 6. Connect Muslim Services Ecosystem Card */}
        <ConnectMuslimPreview />

        {/* 7. Today's Spiritual Reminder (Ayah & Hadith) */}
        <DailyReminderCard />

        {/* 8. Community Emergency & Help Assistance Strip */}
        <div className="w-full p-3.5 bg-slate-100 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
              <PhoneCall className="w-4 h-4 text-emerald-800" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Masjid Helplines</div>
              <div className="text-[11px] text-slate-500">Janazah 24/7 & Imams</div>
            </div>
          </div>

          <button
            onClick={() => setOverlayScreen('about_masjid')}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:text-emerald-800 transition-colors"
          >
            View Contacts
          </button>
        </div>
      </div>
    );
  };
