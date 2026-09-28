import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Users, 
  Check, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Heart,
  Share2,
  ExternalLink
} from 'lucide-react';
import { MASJID_INFO } from '../../data/mockData';
import { MosqueIcon, RubElHizbIcon } from '../common/IslamicIcons';

export const MasjidAboutScreen: React.FC = () => {
  const { setOverlayScreen } = useApp();

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-2 pb-8">
      {/* Hero Masjid Profile Banner */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-[#087F5B] to-[#043d2d] p-5 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-2 right-2 opacity-15">
          <RubElHizbIcon className="w-28 h-28 text-white" />
        </div>

        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#D4A72C] shadow-inner">
            <MosqueIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
              {MASJID_INFO.name}
            </h1>
            <p className="text-xs text-[#D4A72C] font-arabic mt-0.5">
              {MASJID_INFO.arabicName}
            </p>
            <span className="text-[11px] text-white/80 block mt-0.5">
              Established {MASJID_INFO.establishedYear} · Capacity {MASJID_INFO.capacity}
            </span>
          </div>
        </div>

        <p className="text-xs text-white/90 leading-relaxed">
          {MASJID_INFO.tagline}
        </p>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/90">
            <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span className="truncate max-w-[200px]">{MASJID_INFO.city}</span>
          </div>

          <button
            onClick={() => alert('Opening navigation directions to Madina Masjid MKB Nagar...')}
            className="px-3 py-1.5 rounded-xl bg-white text-[#087F5B] font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-[#E8F7F1] active:scale-95 transition-all"
          >
            <Navigation className="w-3 h-3 text-[#D4A72C]" />
            <span>Get Directions</span>
          </button>
        </div>
      </div>

      {/* Support Your Masjid Direct Donation Banner */}
      <div 
        onClick={() => setOverlayScreen('donation')}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#087F5B] to-[#06543F] text-white flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all shadow-xs border border-emerald-600/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white shrink-0">
            <Heart className="w-5 h-5 text-[#FDE68A] fill-[#FDE68A]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white">
                Support Your Masjid
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#FDE68A] text-emerald-950">
                Direct UPI
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/90 mt-0.5">
              Donate directly via UPI QR, UPI ID or Bank Transfer →
            </p>
          </div>
        </div>
      </div>

      {/* Masjid Full Address & Location Card */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#087F5B]" />
          <span>Masjid Location & Address</span>
        </h3>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1 text-xs">
          <span className="font-extrabold text-slate-900 text-[13px]">{MASJID_INFO.name}</span>
          <span className="text-slate-700 leading-relaxed font-medium">
            No. P.P. 8, 3rd Main Road,<br />
            M.K.B. Nagar,<br />
            Chennai - 600 039.
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#087F5B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#087F5B]"></span>
            <span>Location: {MASJID_INFO.city}</span>
          </div>
        </div>
      </div>

      {/* Mission & Purpose */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#D4A72C]" />
          <span>Our Sacred Mission</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          Madina Masjid MKB Nagar serves as a spiritual home rooted in Quran and authentic Sunnah. We are committed to fostering sincere worship, classical Islamic education, inter-generational unity, and charitable relief for all people.
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 bg-[#E8F7F1] border border-emerald-100 rounded-xl">
            <span className="font-extrabold text-[#087F5B] block text-sm">20+</span>
            <span className="text-[10px] text-slate-600">Years of Service</span>
          </div>
          <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
            <span className="font-extrabold text-[#D4A72C] block text-sm">1,500</span>
            <span className="text-[10px] text-slate-600">Prayer Capacity</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-extrabold text-slate-800 block text-sm">450+</span>
            <span className="text-[10px] text-slate-600">Active Families</span>
          </div>
        </div>
      </div>

      {/* Imams & Scholars Directory */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#087F5B]" />
          <span>Imams & Resident Scholars</span>
        </h3>

        <div className="space-y-3">
          {MASJID_INFO.imams.map((imam, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {imam.name}
                  </h4>
                  <span className="text-[11px] text-[#087F5B] font-medium">
                    {imam.role}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#087F5B] flex items-center justify-center text-xs font-bold">
                  {imam.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {imam.qualification}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {imam.bio}
              </p>
            </div>
          ))}

          {/* Muadhin Card */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Head Muadhin</span>
              <div className="font-bold text-slate-900">{MASJID_INFO.muadhin}</div>
            </div>
            <span className="text-emerald-800 font-semibold text-[11px]">Daily Adhan Lead</span>
          </div>
        </div>
      </div>

      {/* Facilities Checklist */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Masjid Amenities & Accessibility
        </h3>
        <div className="space-y-2 text-xs">
          {MASJID_INFO.facilities.map((fac, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-700">
              <Check className="w-4 h-4 text-[#087F5B] shrink-0 mt-0.5" />
              <span>{fac}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Contact & Office Hours */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5 text-xs text-slate-700">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
          Contact & Office Inquiries
        </h3>

        <a href={`tel:${MASJID_INFO.phone}`} className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50">
          <Phone className="w-4 h-4 text-[#087F5B]" />
          <span>Phone: <strong>{MASJID_INFO.phone}</strong></span>
        </a>

        <a href={`mailto:${MASJID_INFO.email}`} className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50">
          <Mail className="w-4 h-4 text-[#087F5B]" />
          <span>Email: <strong>{MASJID_INFO.email}</strong></span>
        </a>

        <div className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50">
          <Globe className="w-4 h-4 text-[#087F5B]" />
          <span>Website: <strong>{MASJID_INFO.website}</strong></span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl text-slate-500">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Office Hours: Mon–Sun, 10:00 AM – 8:00 PM (Between Prayers)</span>
        </div>
      </div>
    </div>
  );
};
