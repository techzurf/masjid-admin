import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Bell, 
  Calendar, 
  Video, 
  HeartHandshake, 
  LayoutGrid, 
  BookOpen, 
  BookMarked, 
  Heart, 
  Users, 
  Send, 
  BarChart3, 
  Building2, 
  Settings, 
  LogOut, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MosqueIcon } from '../../components/common/IslamicIcons';

export type AdminScreenType = 
  | 'dashboard'
  | 'prayers'
  | 'notices'
  | 'events'
  | 'bayan'
  | 'donations'
  | 'services'
  | 'quran'
  | 'hadith'
  | 'dua'
  | 'members'
  | 'notifications'
  | 'reports'
  | 'profile'
  | 'settings';

interface AdminSidebarProps {
  currentScreen: AdminScreenType;
  onSelectScreen: (screen: AdminScreenType) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onPreviewApp: () => void;
}

interface NavGroup {
  label: string;
  items: {
    id: AdminScreenType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    label: 'Daily & Spiritual',
    items: [
      { id: 'prayers', label: 'Prayer Times', icon: Clock },
      { id: 'notices', label: 'Notices & Alerts', icon: Bell, badge: '8' },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'bayan', label: 'Bayan Videos', icon: Video },
      { id: 'donations', label: 'Donations', icon: HeartHandshake }
    ]
  },
  {
    label: 'Content & Learning',
    items: [
      { id: 'services', label: 'Masjid Services', icon: LayoutGrid },
      { id: 'quran', label: 'Quran Content', icon: BookOpen },
      { id: 'hadith', label: 'Hadith Content', icon: BookMarked },
      { id: 'dua', label: 'Dua & Azkar', icon: Heart }
    ]
  },
  {
    label: 'Community & Admin',
    items: [
      { id: 'members', label: 'Members', icon: Users, badge: '1.2k' },
      { id: 'notifications', label: 'Push Notifications', icon: Send },
      { id: 'reports', label: 'Reports & Stats', icon: BarChart3 },
      { id: 'profile', label: 'Masjid Profile', icon: Building2 },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentScreen,
  onSelectScreen,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  onPreviewApp
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-16 z-50 lg:z-20
        h-full lg:h-[calc(100vh-4rem)]
        w-72 lg:w-64 bg-white border-r border-slate-200/90
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Header in Drawer */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087F5B] text-white flex items-center justify-center">
              <MosqueIcon className="w-4 h-4 text-[#FDE68A]" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">Masjid Admin</span>
              <span className="text-[10px] text-slate-500">Navigation Menu</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onCloseMobile}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-semibold text-slate-700">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {group.label}
              </span>
              {group.items.map((item) => {
                const isActive = currentScreen === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectScreen(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full min-h-[40px] px-3 py-2 rounded-xl flex items-center justify-between gap-2.5 transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#E8F7F1] text-[#087F5B] font-bold shadow-2xs'
                        : 'hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#087F5B]' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-[#087F5B] text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-1.5">
          <button
            type="button"
            onClick={onPreviewApp}
            className="w-full py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 text-xs font-bold flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Preview User App</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
