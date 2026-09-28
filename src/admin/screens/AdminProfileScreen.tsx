import React, { useState } from 'react';
import { Building2, Save, ExternalLink } from 'lucide-react';
import { MosqueIcon } from '../../components/common/IslamicIcons';

interface AdminProfileScreenProps {
  onPreviewApp: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminProfileScreen: React.FC<AdminProfileScreenProps> = ({
  onPreviewApp,
  onShowToast
}) => {
  const [name, setName] = useState('Madina Masjid MKB Nagar');
  const [address, setAddress] = useState('No. P.P. 8, 3rd Main Road, M.K.B. Nagar, Chennai - 600 039.');
  const [area, setArea] = useState('M.K.B. Nagar');
  const [city, setCity] = useState('Chennai');
  const [phone, setPhone] = useState('+91 44 2551 2410');
  const [email, setEmail] = useState('contact@madinamasjid.org');
  const [website, setWebsite] = useState('www.madinamasjid.org');
  const [about, setAbout] = useState('Madina Masjid MKB Nagar serves as a spiritual home rooted in Quran and authentic Sunnah. We are committed to fostering sincere worship, classical Islamic education, inter-generational unity, and charitable relief for all people.');
  const [imam, setImam] = useState('Sheikh Dr. Abdullah Al-Rahman');
  const [jamaah, setJamaah] = useState('Fajr: 250 • Dhuhr: 400 • Asr: 350 • Maghrib: 600 • Isha: 800 • Jumu\'ah: 1,500+');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Masjid profile changes saved successfully!');
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Official Institution Identity
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Masjid Profile Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Update official Masjid directory details, resident imams, address, and office contact channels.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onPreviewApp}
            className="h-11 px-4 rounded-2xl bg-[#E8F7F1] hover:bg-[#d5f2e6] text-[#087F5B] font-bold text-xs flex items-center gap-1.5 transition-all border border-emerald-300/60 cursor-pointer"
          >
            <span>Preview Masjid App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4">
        
        {/* Masjid Branding / Logo preview */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#087F5B] to-[#043d2d] text-white flex items-center justify-center shadow-sm">
            <Building2 className="w-8 h-8 text-[#FDE68A]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{name}</h3>
            <span className="text-xs text-slate-500">{area}, {city}</span>
            <div className="mt-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#087F5B]">
                Registered Trust #2004
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Masjid Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Head Imam Name *
            </label>
            <input
              type="text"
              required
              value={imam}
              onChange={(e) => setImam(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Full Physical Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Area *
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Office Contact Number *
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Official Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              About Masjid & Sacred Mission
            </label>
            <textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Jama'ah & Congregation Information
            </label>
            <input
              type="text"
              value={jamaah}
              onChange={(e) => setJamaah(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="h-11 px-6 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};
