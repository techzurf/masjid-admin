import React from 'react';
import { 
  Bell, 
  Clock, 
  Volume2, 
  VolumeX, 
  X, 
  Calendar, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ApproachingPrayerAlert } from '../../types';
import { MosqueIcon } from './IslamicIcons';

interface ApproachingPrayerBannerProps {
  alert: ApproachingPrayerAlert;
  isPlayingAudio: boolean;
  onMuteAudio: () => void;
  onDismiss: () => void;
  onOpenTimetable: () => void;
}

export const ApproachingPrayerBanner: React.FC<ApproachingPrayerBannerProps> = ({
  alert,
  isPlayingAudio,
  onMuteAudio,
  onDismiss,
  onOpenTimetable
}) => {
  const isNow = alert.minutesLeft <= 0;

  return (
    <div className="w-full px-3 pt-2 pb-1 animate-in slide-in-from-top-4 duration-300 z-50">
      <div className="w-full bg-gradient-to-r from-emerald-950 via-[#07543F] to-[#087F5B] text-white rounded-2xl p-3.5 shadow-xl border border-emerald-400/30 backdrop-blur-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start gap-3">
          {/* Animated icon or sound wave */}
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-[#D4A72C] shrink-0 shadow-inner relative">
            <MosqueIcon className="w-5 h-5" />
            {isPlayingAudio && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4A72C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4A72C]"></span>
              </span>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D4A72C] flex items-center gap-1">
                <Bell className="w-3 h-3 fill-current" />
                {isNow ? 'Adhan Time Now' : `Adhan in ${alert.minutesLeft} Minutes`}
              </span>
              <span className="text-[10px] text-white/80 font-arabic font-bold">
                {alert.arabicName}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-white tracking-tight flex items-baseline gap-2 mt-0.5">
              <span>{alert.prayerName} Prayer</span>
              <span className="text-xs font-semibold text-emerald-200 tabular-nums">
                {alert.time}
              </span>
            </h4>

            {alert.iqamahTime && (
              <p className="text-[11px] text-emerald-100/90 leading-tight mt-0.5">
                Congregation Iqamah at <strong>{alert.iqamahTime}</strong>
              </p>
            )}

            {/* Quick Actions Bar */}
            <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between gap-2">
              <button
                onClick={onOpenTimetable}
                className="text-[11px] font-bold text-[#D4A72C] hover:text-white flex items-center gap-1 transition-colors"
              >
                <Calendar className="w-3 h-3" />
                <span>View Timetable</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1.5">
                {isPlayingAudio && (
                  <button
                    onClick={onMuteAudio}
                    className="px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                    title="Mute Sound"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Mute</span>
                  </button>
                )}

                <button
                  onClick={onDismiss}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#07543F] hover:bg-emerald-50 text-[10px] font-extrabold transition-colors shadow-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          {/* Close X */}
          <button
            onClick={onDismiss}
            className="text-white/60 hover:text-white -mr-1 -mt-1 p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
