import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Check, 
  ExternalLink, 
  ChevronRight, 
  X,
  Compass,
  Car,
  ShieldCheck
} from 'lucide-react';
import { NEARBY_MASJIDS } from '../../data/mockData';
import { MasjidItem } from '../../types';
import { MosqueIcon, RubElHizbIcon } from '../common/IslamicIcons';

export const MasjidLocatorScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedMasjid, setSelectedMasjid] = useState<MasjidItem | null>(null);
  const [directionsStarted, setDirectionsStarted] = useState(false);

  const filtered = NEARBY_MASJIDS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#4DA3E8]">
          M.K.B. Nagar, Chennai
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Nearby Masjid Locator
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Find mosques, prayer facilities, sisters areas, and Jummah timings near you.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by mosque name, area, or road..."
          className="w-full h-11 pl-10 pr-4 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#4DA3E8]"
        />
      </div>

      {/* Stylized Visual Map Preview */}
      <div className="w-full h-44 rounded-3xl bg-[#EBF5FB] border border-sky-200/60 overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-4">
        {/* Subtle grid map lines */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4DA3E8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Animated Map Pins */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <span className="w-12 h-12 rounded-full bg-sky-400/20 animate-ping absolute"></span>
            <div className="w-10 h-10 rounded-full bg-[#087F5B] text-white flex items-center justify-center shadow-lg border-2 border-white">
              <MosqueIcon className="w-5 h-5 text-[#D4A72C]" />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-800 mt-2 px-3 py-1 bg-white/90 backdrop-blur-xs rounded-full shadow-xs">
            Madina Masjid MKB Nagar (0.0 km)
          </span>
        </div>

        {/* Nearby mini pin indicators */}
        <div className="absolute top-6 left-8 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700 shadow-xs border border-sky-100">
          <MapPin className="w-3 h-3 text-[#3B6FD8]" />
          <span>Dar-us-Salam (1.2 km)</span>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700 shadow-xs border border-sky-100">
          <MapPin className="w-3 h-3 text-[#3B6FD8]" />
          <span>Al-Taqwa (2.8 km)</span>
        </div>
      </div>

      {/* Masjids List */}
      <div className="flex flex-col gap-3">
        {filtered.map(masjid => (
          <div
            key={masjid.id}
            onClick={() => setSelectedMasjid(masjid)}
            className="w-full bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-xs cursor-pointer transition-all active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#4DA3E8] shrink-0">
                  <MosqueIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">
                    {masjid.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[180px]">{masjid.address}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#4DA3E8] block">
                  {masjid.distance}
                </span>
                <span className="text-[10px] text-slate-400">
                  {masjid.travelTime}
                </span>
              </div>
            </div>

            {/* Facility Chips */}
            <div className="flex flex-wrap gap-1.5 my-2">
              {masjid.facilities.map((fac, idx) => (
                <span key={idx} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {fac}
                </span>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-600 font-medium">
                Next: <strong className="text-slate-800">{masjid.nextPrayer}</strong>
              </span>

              <button className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#3B6FD8] text-xs font-bold flex items-center gap-1 transition-colors">
                <Navigation className="w-3 h-3" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Masjid Detail Modal */}
      {selectedMasjid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center max-w-[430px] mx-auto animate-in fade-in">
          <div className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl flex flex-col">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
                  {selectedMasjid.distance} · {selectedMasjid.travelTime}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight mt-0.5">
                  {selectedMasjid.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedMasjid.address}
                </p>
              </div>

              <button
                onClick={() => setSelectedMasjid(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 -mr-2 -mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Facilities Checklist */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Available Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedMasjid.facilities.map((fac, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-[#087F5B] shrink-0" />
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 mb-5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#087F5B]" />
                <span className="font-semibold text-slate-800">{selectedMasjid.phone}</span>
              </div>
              <a href={`tel:${selectedMasjid.phone}`} className="font-bold text-[#087F5B]">
                Call Masjid
              </a>
            </div>

            {/* Directions Action */}
            <button
              onClick={() => {
                alert(`Opening directions to ${selectedMasjid.name}`);
              }}
              className="w-full py-3.5 rounded-2xl bg-[#087F5B] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Turn-by-Turn Directions ({selectedMasjid.distance})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
