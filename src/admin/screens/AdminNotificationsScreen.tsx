import React, { useState } from 'react';
import { Send, Bell, Clock, Users, CheckCircle2, Sparkles, History } from 'lucide-react';
import { AdminNotificationHistory, INITIAL_NOTIFICATIONS } from '../mockAdminData';

interface AdminNotificationsScreenProps {
  onShowToast: (msg: string) => void;
}

export const AdminNotificationsScreen: React.FC<AdminNotificationsScreenProps> = ({
  onShowToast
}) => {
  const [history, setHistory] = useState<AdminNotificationHistory[]>(INITIAL_NOTIFICATIONS);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'All Users' | 'Masjid Members' | 'Specific Group'>('All Users');
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newLog: AdminNotificationHistory = {
      id: `notif-${Date.now()}`,
      title,
      message,
      audience,
      sentAt: scheduleType === 'now' ? 'Just now' : `Scheduled (${scheduledTime || 'Tomorrow'})`,
      recipientsCount: audience === 'All Users' ? 1248 : audience === 'Masjid Members' ? 864 : 240
    };

    setHistory([newLog, ...history]);
    setTitle('');
    setMessage('');
    onShowToast(scheduleType === 'now' ? 'Push Notification broadcasted to users!' : 'Notification scheduled!');
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Instant Community Alerts
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Push Notification Broadcast
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Broadcast prayer reminders, emergency weather advisories, or event announcements to installed app users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Notification Composer (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#087F5B] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Compose Push Alert</h3>
              <span className="text-[11px] text-slate-500">Delivered directly to user mobile lockscreens</span>
            </div>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-3.5">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Friday Jumu'ah Parking Notice"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Message Body *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message clearly (concise within 140 characters is best)..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['All Users', 'Masjid Members', 'Specific Group'] as const).map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudience(aud)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                      audience === aud
                        ? 'bg-[#087F5B] text-white border-[#087F5B] shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Delivery Schedule
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleType('now')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    scheduleType === 'now'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Send Now
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('later')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    scheduleType === 'later'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Schedule Later
                </button>
              </div>

              {scheduleType === 'later' && (
                <div className="mt-2 animate-in fade-in">
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full h-12 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/15 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{scheduleType === 'now' ? 'Send Notification Now' : 'Schedule Notification'}</span>
            </button>
          </form>
        </div>

        {/* Recent Broadcast History (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-3.5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Broadcast History</h3>
              <span className="text-[11px] text-slate-500">Previously delivered push alerts</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {history.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col gap-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#087F5B]">
                    {log.audience}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2 text-[11px]">
                  {log.message}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>{log.sentAt}</span>
                  <span>{log.recipientsCount} Devices</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
