import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Store, 
  Heart, 
  GraduationCap, 
  Activity, 
  ShoppingBag, 
  ChevronRight, 
  ShieldCheck, 
  Search, 
  Sparkles,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { CONNECT_MUSLIM_ITEMS } from '../../data/mockData';
import { ConnectMuslimItem } from '../../types';
import { RubElHizbIcon } from '../common/IslamicIcons';

export const ConnectMuslimScreen: React.FC = () => {
  const { setOverlayScreen } = useApp();
  const [selectedItem, setSelectedItem] = useState<ConnectMuslimItem | null>(null);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Store': return <Store className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Ecosystem Header Card: Distinctive Premium Multi-Color Gradient */}
      <div className="w-full bg-gradient-to-br from-[#0F2942] via-[#16353C] to-[#07543F] rounded-3xl p-5 text-white relative overflow-hidden shadow-sm border border-slate-700/40">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#3B6FD8]/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7657C8]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#D4A72C]" />
            <span className="text-[11px] font-bold text-[#D4A72C] uppercase tracking-widest">
              Ummah Ecosystem
            </span>
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
            Connect Muslim Services
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            A trusted halal network bridging local jobs, businesses, matrimony, education, and healthcare through Madina Masjid MKB Nagar.
          </p>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-3 text-[11px] text-slate-300">
            <span className="text-sky-300">✓ Community Verified</span>
            <span>·</span>
            <span className="text-amber-300">✓ 100% Interest-Free</span>
            <span>·</span>
            <span className="text-emerald-300">✓ Sunnah Aligned</span>
          </div>
        </div>
      </div>

      {/* Grid of Distinctive Ecosystem Cards */}
      <div className="grid grid-cols-1 gap-3">
        {CONNECT_MUSLIM_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setInterestSubmitted(false);
            }}
            className="w-full bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xs cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: item.accentColor }}
                >
                  {getIcon(item.icon)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              <span 
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: item.accentColor,
                  backgroundColor: `${item.accentColor}18`,
                  border: `1px solid ${item.accentColor}30`
                }}
              >
                {item.tag}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {item.description}
            </p>

            {/* Micro feature pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {item.features.slice(0, 2).map((feat, i) => (
                <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  • {feat}
                </span>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {item.stats}
              </span>
              <span 
                className="font-bold flex items-center gap-0.5"
                style={{ color: item.accentColor }}
              >
                <span>Access Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center max-w-[430px] mx-auto animate-in fade-in">
          <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedItem.accentColor }}
                >
                  {getIcon(selectedItem.icon)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {selectedItem.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {selectedItem.subtitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 -mr-2 -mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              className="p-3 rounded-2xl mb-4 text-xs font-medium"
              style={{
                backgroundColor: `${selectedItem.accentColor}12`,
                border: `1px solid ${selectedItem.accentColor}25`,
                color: selectedItem.accentColor
              }}
            >
              <strong>Verified Community Network:</strong> Facilitated through the Madina Masjid community desk.
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Features & Benefits
              </h4>
              <div className="space-y-2">
                {selectedItem.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700">
                    <Check 
                      className="w-4 h-4 shrink-0" 
                      style={{ color: selectedItem.accentColor }}
                    />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5 text-xs text-slate-600 leading-relaxed">
              {selectedItem.description}
            </div>

            {interestSubmitted ? (
              <div className="p-3.5 bg-emerald-100 text-emerald-900 rounded-2xl text-center text-xs font-bold">
                ✓ Success! Your request has been directed to the {selectedItem.title} coordinator.
              </div>
            ) : (
              <button
                onClick={() => setInterestSubmitted(true)}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-[0.98] transition-all"
                style={{ backgroundColor: selectedItem.accentColor }}
              >
                <span>Connect with {selectedItem.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
