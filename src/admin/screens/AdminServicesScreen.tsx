import React, { useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Compass, 
  LayoutGrid, 
  MapPin, 
  UserPlus, 
  Sparkles, 
  HeartHandshake, 
  Mic, 
  BookOpen, 
  BookMarked, 
  Heart, 
  CalendarDays, 
  Coins, 
  CalendarCheck 
} from 'lucide-react';
import { AdminServiceToggle } from '../mockAdminData';

interface AdminServicesScreenProps {
  services: AdminServiceToggle[];
  onSaveServices: (updated: AdminServiceToggle[]) => void;
  onShowToast: (msg: string) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  UserPlus,
  Compass,
  Sparkles,
  LayoutGrid,
  HeartHandshake,
  Mic,
  BookOpen,
  BookMarked,
  Heart,
  CalendarDays,
  Coins,
  CalendarCheck
};

export const AdminServicesScreen: React.FC<AdminServicesScreenProps> = ({
  services,
  onSaveServices,
  onShowToast
}) => {
  const [list, setList] = useState<AdminServiceToggle[]>(services);

  const handleToggle = (id: string) => {
    setList(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setList(copy);
  };

  const handleSave = () => {
    onSaveServices(list);
    onShowToast('Quick services order and visibility updated!');
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            App Architecture & Navigation
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Masjid Services Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Enable, disable, and visually reorder all 13 core and quick services on the Home Screen.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-2xs divide-y divide-slate-100">
        {list.map((srv, idx) => {
          const Icon = ICON_MAP[srv.iconName] || LayoutGrid;

          return (
            <div
              key={srv.id}
              className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center">
                  {idx + 1}
                </span>

                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  srv.enabled ? 'bg-emerald-50 text-[#087F5B]' : 'bg-slate-100 text-slate-400'
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {srv.name}
                    </span>
                    {!srv.enabled && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600">
                        Hidden
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block truncate">
                    {srv.description}
                  </span>
                </div>
              </div>

              {/* Controls: Reorder buttons & Switch */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === list.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-1">
                  <input
                    type="checkbox"
                    checked={srv.enabled}
                    onChange={() => handleToggle(srv.id)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#087F5B]"></div>
                </label>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
