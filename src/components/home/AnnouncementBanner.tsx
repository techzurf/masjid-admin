import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, X, Calendar, Bell } from 'lucide-react';
import { 
  MasjidNotice, 
  fetchHighestPriorityActiveNotice, 
  subscribeToMasjidNotices, 
  getNoticeTimeAgo 
} from '../../lib/supabase';

export const AnnouncementBanner: React.FC = () => {
  const [notice, setNotice] = useState<MasjidNotice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the active notice from Supabase
  const loadActiveNotice = async () => {
    try {
      const res = await fetchHighestPriorityActiveNotice();
      if (res.data) {
        setNotice(res.data);
      } else {
        setNotice(null);
      }
    } catch {
      setNotice(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActiveNotice();

    // Set up Realtime subscription for public.masjid_notices
    const unsubscribe = subscribeToMasjidNotices(() => {
      loadActiveNotice();
    });

    // Refresh when screen becomes visible/focused
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadActiveNotice();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('refresh-masjid-data', loadActiveNotice);

    return () => {
      unsubscribe();
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('refresh-masjid-data', loadActiveNotice);
    };
  }, []);

  return (
    <>
      {/* Existing Important Notice Card (Layout, styling, colors, typography completely preserved) */}
      <div className="w-full bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 flex items-start gap-3 relative overflow-hidden">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 text-amber-700" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5 gap-2">
            <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider truncate">
              {notice?.category || 'Important Notice'}
            </span>
            <span className="text-[10px] text-amber-800/80 font-medium shrink-0">
              {notice ? getNoticeTimeAgo(notice.created_at) : 'Live'}
            </span>
          </div>

          <h3 className="text-xs font-bold text-slate-900 leading-snug mb-1">
            {notice ? notice.title : 'No new announcements'}
          </h3>

          <p className="text-[12px] text-slate-700 line-clamp-2 leading-relaxed mb-2">
            {notice 
              ? notice.message 
              : 'All announcements are up to date. Check back later for masjid advisories.'}
          </p>

          {notice ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-[#B45309] hover:text-[#92400E] flex items-center gap-1 active:translate-x-0.5 transition-transform cursor-pointer"
            >
              <span>Read Full Advisory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] font-semibold text-amber-800/60 flex items-center gap-1">
              <span>Masjid Administration</span>
            </span>
          )}
        </div>
      </div>

      {/* Notice Detail Modal (Opens when user taps "Read Full Advisory") */}
      {isModalOpen && notice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block mb-1">
                    {notice.category || 'Important Notice'}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {getNoticeTimeAgo(notice.created_at)}
                  </span>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Optional Image */}
            {notice.image_url && (
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200">
                <img 
                  src={notice.image_url} 
                  alt={notice.title} 
                  className="w-full max-h-52 object-cover"
                  onError={(e) => {
                    // Hide image if broken link
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {notice.title}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {notice.message}
              </p>
            </div>

            {/* Timestamp & Official Tag */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(notice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Official Masjid Record
              </span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mt-1 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-800 cursor-pointer transition-colors"
            >
              Close Advisory
            </button>
          </div>
        </div>
      )}
    </>
  );
};
