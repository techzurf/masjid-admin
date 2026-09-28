import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Send, 
  BarChart3, 
  Menu 
} from 'lucide-react';
import { AdminScreenType } from './AdminSidebar';

interface AdminBottomNavProps {
  currentScreen: AdminScreenType;
  onSelectScreen: (screen: AdminScreenType) => void;
  onToggleDrawer: () => void;
}

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  onToggleDrawer
}) => {
  const navTabs = [
    {
      id: 'dashboard' as AdminScreenType,
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: currentScreen === 'dashboard'
    },
    {
      id: 'prayers' as AdminScreenType,
      label: 'Content',
      icon: Layers,
      isActive: ['prayers', 'notices', 'events', 'bayan', 'donations', 'services', 'quran', 'hadith', 'dua'].includes(currentScreen)
    },
    {
      id: 'notifications' as AdminScreenType,
      label: 'Notify',
      icon: Send,
      isActive: currentScreen === 'notifications'
    },
    {
      id: 'reports' as AdminScreenType,
      label: 'Reports',
      icon: BarChart3,
      isActive: currentScreen === 'reports'
    }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 pb-[env(safe-area-inset-bottom,4px)] pt-1">
      <div className="flex items-center justify-around h-14">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectScreen(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center h-full transition-all cursor-pointer ${
                tab.isActive ? 'text-[#087F5B]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${tab.isActive ? 'bg-[#E8F7F1]' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${tab.isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More / Menu Drawer Button */}
        <button
          type="button"
          onClick={onToggleDrawer}
          className="flex-1 flex flex-col items-center justify-center h-full text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
        >
          <div className="p-1 rounded-xl">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5">
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
