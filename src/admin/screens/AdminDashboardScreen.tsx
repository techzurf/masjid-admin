import React from 'react';
import { 
  Users, 
  Calendar, 
  Bell, 
  HeartHandshake, 
  Radio, 
  Video, 
  Clock, 
  LayoutGrid, 
  BookOpen, 
  BookMarked, 
  Heart, 
  ChevronRight, 
  Plus, 
  Send,
  TrendingUp,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { AdminStats } from '../mockAdminData';
import { AdminScreenType } from '../components/AdminSidebar';

interface AdminDashboardScreenProps {
  stats: AdminStats;
  onNavigate: (screen: AdminScreenType) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  stats,
  onNavigate
}) => {
  // Format today's date in Gregorian and approximate Hijri
  const todayGregorian = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const statCards = [
    {
      title: 'Masjid Members',
      value: stats.members.toLocaleString('en-IN'),
      change: '+18 this week',
      icon: Users,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/80',
      text: 'text-[#087F5B]',
      screen: 'members' as AdminScreenType
    },
    {
      title: 'Events',
      value: stats.events.toString(),
      change: '3 upcoming',
      icon: Calendar,
      bg: 'bg-blue-50',
      border: 'border-blue-200/80',
      text: 'text-[#2563EB]',
      screen: 'events' as AdminScreenType
    },
    {
      title: 'Notices',
      value: stats.notices.toString(),
      change: '2 active today',
      icon: Bell,
      bg: 'bg-amber-50',
      border: 'border-amber-200/80',
      text: 'text-[#D97706]',
      screen: 'notices' as AdminScreenType
    },
    {
      title: 'Donations',
      value: stats.donations,
      change: 'Direct UPI & Bank',
      icon: HeartHandshake,
      bg: 'bg-teal-50',
      border: 'border-teal-200/80',
      text: 'text-[#0D9488]',
      screen: 'donations' as AdminScreenType
    },
    {
      title: 'Prayer Notifications',
      value: stats.prayerNotifications.toString(),
      change: 'Active Athan alerts',
      icon: Clock,
      bg: 'bg-purple-50',
      border: 'border-purple-200/80',
      text: 'text-[#7C3AED]',
      screen: 'prayers' as AdminScreenType
    },
    {
      title: 'Bayan Videos',
      value: stats.bayanVideos.toString(),
      change: '4,820 total views',
      icon: Video,
      bg: 'bg-rose-50',
      border: 'border-rose-200/80',
      text: 'text-[#E11D48]',
      screen: 'bayan' as AdminScreenType
    }
  ];

  const quickManagementCards = [
    {
      title: 'Prayer Times',
      subtitle: "Manage today's prayer times",
      icon: Clock,
      screen: 'prayers' as AdminScreenType,
      color: 'text-[#087F5B]',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Notices',
      subtitle: 'Create and manage announcements',
      icon: Bell,
      screen: 'notices' as AdminScreenType,
      color: 'text-[#D97706]',
      bg: 'bg-amber-50'
    },
    {
      title: 'Events',
      subtitle: 'Manage Masjid events',
      icon: Calendar,
      screen: 'events' as AdminScreenType,
      color: 'text-[#2563EB]',
      bg: 'bg-blue-50'
    },
    {
      title: 'Bayan',
      subtitle: 'Manage Bayan videos',
      icon: Video,
      screen: 'bayan' as AdminScreenType,
      color: 'text-[#E11D48]',
      bg: 'bg-rose-50'
    },
    {
      title: 'Donations',
      subtitle: 'Manage donation information',
      icon: HeartHandshake,
      screen: 'donations' as AdminScreenType,
      color: 'text-[#0D9488]',
      bg: 'bg-teal-50'
    },
    {
      title: 'Services',
      subtitle: 'Manage Masjid services',
      icon: LayoutGrid,
      screen: 'services' as AdminScreenType,
      color: 'text-[#7C3AED]',
      bg: 'bg-purple-50'
    },
    {
      title: 'Quran',
      subtitle: 'Manage Quran content',
      icon: BookOpen,
      screen: 'quran' as AdminScreenType,
      color: 'text-[#087F5B]',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Hadith',
      subtitle: 'Manage Hadith content',
      icon: BookMarked,
      screen: 'hadith' as AdminScreenType,
      color: 'text-[#B45309]',
      bg: 'bg-amber-50'
    },
    {
      title: 'Dua & Azkar',
      subtitle: 'Manage Dua content',
      icon: Heart,
      screen: 'dua' as AdminScreenType,
      color: 'text-[#BE185D]',
      bg: 'bg-pink-50'
    },
    {
      title: 'Members',
      subtitle: 'Manage registered members',
      icon: Users,
      screen: 'members' as AdminScreenType,
      color: 'text-[#0369A1]',
      bg: 'bg-sky-50'
    }
  ];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* ─── GREETING & DATE BANNER ─── */}
      <div className="w-full bg-gradient-to-r from-[#087F5B] via-[#076E4E] to-[#054432] rounded-3xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Assalamu Alaikum 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Welcome back, Admin • Madina Masjid MKB Nagar
          </p>
          <div className="mt-2.5 inline-flex items-center gap-2 text-[11px] font-bold text-[#FDE68A] bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <span>📅 {todayGregorian}</span>
            <span>•</span>
            <span>14 Rabi' al-Awwal 1448</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('notices')}
            className="h-10 px-3.5 rounded-xl bg-white text-[#087F5B] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Notice</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="h-10 px-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#FDE68A]" />
            <span>Send Alert</span>
          </button>
        </div>
      </div>

      {/* ─── DASHBOARD STATISTICS (6 Cards) ─── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700">
            Overview Metrics
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className="text-xs font-bold text-[#087F5B] hover:underline flex items-center gap-1"
          >
            <span>Detailed Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(card.screen)}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white border ${card.border} shadow-2xs hover:shadow-sm cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">
                    {card.title}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.text} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                    {card.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── QUICK MANAGEMENT SECTION ─── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Quick Management
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Tap any module to view and update Masjid content
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-3">
          {quickManagementCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(card.screen)}
                className="w-full p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-[#087F5B]/50 hover:shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center shrink-0 group-hover:scale-108 transition-all`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight truncate group-hover:text-[#087F5B] transition-colors">
                      {card.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium block truncate mt-0.5">
                      {card.subtitle}
                    </span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 group-hover:text-[#087F5B] group-hover:bg-emerald-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
