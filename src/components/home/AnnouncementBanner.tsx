import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, ChevronRight, Bell, ArrowRight } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export const AnnouncementBanner: React.FC = () => {
  const { setOverlayScreen } = useApp();
  const urgentNotice = MOCK_NOTIFICATIONS[0]; // "Friday Jummah Parking Advisory"

  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 flex items-start gap-3 relative overflow-hidden">
      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
        <AlertCircle className="w-4 h-4 text-amber-700" />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
            Important Notice
          </span>
          <span className="text-[10px] text-amber-800/80 font-medium">
            {urgentNotice.timeAgo}
          </span>
        </div>

        <h3 className="text-xs font-bold text-slate-900 leading-snug mb-1">
          {urgentNotice.title}
        </h3>

        <p className="text-[12px] text-slate-700 line-clamp-2 leading-relaxed mb-2">
          {urgentNotice.message}
        </p>

        <button
          onClick={() => setOverlayScreen('notifications')}
          className="text-xs font-bold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 active:translate-x-0.5 transition-transform"
        >
          <span>Read Full Advisory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
