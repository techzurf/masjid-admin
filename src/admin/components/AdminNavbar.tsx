import React from 'react';
import { 
  Menu, 
  Bell, 
  ExternalLink, 
  User, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { MosqueIcon } from '../../components/common/IslamicIcons';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  onPreviewApp: () => void;
  onNavigateNotifications: () => void;
  onNavigateProfile: () => void;
  activeScreenTitle: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onToggleSidebar,
  onPreviewApp,
  onNavigateNotifications,
  onNavigateProfile,
  activeScreenTitle
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left Section: Hamburger + Brand */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:text-emerald-800 hover:bg-slate-100 active:scale-95 transition-all lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#087F5B] to-[#054432] text-white flex items-center justify-center shadow-xs">
              <MosqueIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FDE68A]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  Masjid Admin
                </span>
                <span className="hidden xs:inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#087F5B]">
                  Pro
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Madina Masjid MKB Nagar
              </span>
            </div>
          </div>

          {/* Active Screen Breadcrumb on Tablet/Desktop */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 pl-4 border-l border-slate-200">
            <span>Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-bold text-slate-800">{activeScreenTitle}</span>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Preview User Masjid App Button */}
          <button
            type="button"
            onClick={onPreviewApp}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-[#E8F7F1] hover:bg-[#d5f2e6] text-[#087F5B] font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-300/60"
            title="Preview User-Facing App"
          >
            <span className="hidden sm:inline">Preview App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onNavigateNotifications}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* Admin Avatar */}
          <button
            type="button"
            onClick={onNavigateProfile}
            className="flex items-center gap-2 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#087F5B] text-white flex items-center justify-center text-xs font-bold ring-2 ring-emerald-100">
              AD
            </div>
            <div className="hidden xl:block leading-tight">
              <span className="text-xs font-bold text-slate-900 block">Admin</span>
              <span className="text-[10px] text-slate-500 block">Super Admin</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
