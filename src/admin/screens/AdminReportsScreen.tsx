import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  HeartHandshake, 
  Video, 
  Calendar, 
  Download, 
  Smartphone,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { AdminStats } from '../mockAdminData';

interface AdminReportsScreenProps {
  stats: AdminStats;
  onShowToast: (msg: string) => void;
}

export const AdminReportsScreen: React.FC<AdminReportsScreenProps> = ({
  stats,
  onShowToast
}) => {
  const downloadReport = () => {
    onShowToast('Monthly administrative summary report downloaded (PDF)');
  };

  const dayActivity = [
    { day: 'Mon', active: 620, height: '60%' },
    { day: 'Tue', active: 680, height: '65%' },
    { day: 'Wed', active: 740, height: '72%' },
    { day: 'Thu', active: 810, height: '80%' },
    { day: 'Fri', active: 1190, height: '100%' }, // Jumu'ah peak
    { day: 'Sat', active: 940, height: '88%' },
    { day: 'Sun', active: 864, height: '82%' }
  ];

  const donationCategories = [
    { name: 'Masjid Development', amount: '₹34,500', pct: '40%' },
    { name: 'Zakat Contributions', amount: '₹22,000', pct: '26%' },
    { name: 'Masjid Maintenance', amount: '₹14,200', pct: '17%' },
    { name: 'Sadaqah & Iftar', amount: '₹14,700', pct: '17%' }
  ];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Monthly Analytics & Insights
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Reports & Statistics
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Overview of community engagement, prayer alert adherence, and direct donation tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadReport}
          className="h-11 px-4 rounded-2xl bg-[#E8F7F1] hover:bg-[#d5f2e6] text-[#087F5B] font-bold text-xs flex items-center gap-2 border border-emerald-300/60 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">App Users</span>
            <Users className="w-4 h-4 text-[#087F5B]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.members.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">↑ +14% this month</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Active Users</span>
            <Smartphone className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.activeUsers.toLocaleString()}</div>
          <span className="text-[10px] text-blue-700 font-bold mt-1 block">69% monthly retention</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Donations</span>
            <HeartHandshake className="w-4 h-4 text-[#0D9488]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.donations}</div>
          <span className="text-[10px] text-teal-700 font-bold mt-1 block">100% Direct to Masjid</span>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Events Held</span>
            <Calendar className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.events}</div>
          <span className="text-[10px] text-amber-700 font-bold mt-1 block">1,050 Attendees</span>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Bayan Views</span>
            <Video className="w-4 h-4 text-[#E11D48]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">{stats.bayanViews.toLocaleString()}</div>
          <span className="text-[10px] text-rose-700 font-bold mt-1 block">Across 36 Lectures</span>
        </div>
      </div>

      {/* Visual Activity & Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Weekly App Activity Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Active Worshippers</h3>
              <span className="text-[11px] text-slate-500">Noticeable peak on Friday Jumu'ah</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
              Friday: 1,190 Active
            </span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {dayActivity.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[9px] font-mono font-bold text-slate-400">
                  {d.active}
                </span>
                <div 
                  className={`w-full max-w-[34px] rounded-t-xl transition-all ${
                    d.day === 'Fri' ? 'bg-[#087F5B]' : 'bg-slate-200 hover:bg-emerald-300'
                  }`}
                  style={{ height: d.height }}
                />
                <span className={`text-[10px] font-bold ${d.day === 'Fri' ? 'text-[#087F5B]' : 'text-slate-500'}`}>
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Purpose Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Donation Allocation</h3>
            <span className="text-[11px] text-slate-500">Direct contributions recorded by purpose</span>
          </div>

          <div className="space-y-3 my-4">
            {donationCategories.map((c, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{c.name}</span>
                  <span className="text-slate-900 font-bold">{c.amount} ({c.pct})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#087F5B] to-[#159A9C] rounded-full"
                    style={{ width: c.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Direct Gateway Status:</span>
            <span className="text-emerald-700 font-bold">100% Free / Zero Commission</span>
          </div>
        </div>

      </div>

    </div>
  );
};
