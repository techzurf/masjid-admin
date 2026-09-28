import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PackageSearch, 
  MapPin, 
  Calendar, 
  Phone, 
  ShieldCheck, 
  Search, 
  HelpCircle,
  Plus
} from 'lucide-react';
import { MOCK_LOST_AND_FOUND } from '../../data/mockData';

export const LostFoundScreen: React.FC = () => {
  const [reportModal, setReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-2 pb-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#159A9C]">
          Amanah & Custody
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Masjid Lost & Found
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Items found on masjid premises are held safely in the security office for 30 days.
        </p>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {MOCK_LOST_AND_FOUND.map(item => (
          <div key={item.id} className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-start justify-between mb-1">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  {item.title}
                </h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                item.status === 'Held in Office' 
                  ? 'bg-amber-50 text-[#B45309] border-amber-200' 
                  : 'bg-emerald-50 text-[#087F5B] border-emerald-200'
              }`}>
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-2.5">
              {item.description}
            </p>

            <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#159A9C]" />
                <span>Found at: <strong>{item.location}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3B6FD8]" />
                <span>Date: {item.date}</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">Contact: {item.contactPerson}</span>
              <a href="tel:+15552345678" className="font-bold text-[#159A9C] hover:underline">
                Claim Item
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Report lost item banner */}
      <div className="p-4 bg-[#E8F7F1] rounded-3xl border border-emerald-100 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Lost something at Madina Masjid?</h4>
          <p className="text-[11px] text-slate-600">Notify our facilities team directly.</p>
        </div>
        <button
          onClick={() => alert('Please contact the Masjid office desk at +91 44 2551 2410 or visit after any Salah.')}
          className="px-3 py-1.5 bg-[#087F5B] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#07543F]"
        >
          Report Lost Item
        </button>
      </div>
    </div>
  );
};
