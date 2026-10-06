import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Sparkles, 
  Home
} from 'lucide-react';
import { RubElHizbIcon } from '../common/IslamicIcons';

export interface ServiceComingSoonData {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  description: string;
}

const SERVICE_DETAILS: Record<string, ServiceComingSoonData> = {
  work_halal_jobs: {
    id: 'work_halal_jobs',
    name: 'WorkHalal Jobs',
    subtitle: 'Halal Employment & Ethical Careers',
    category: 'Careers & Jobs',
    imageUrl: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791212331/work_halal_1_ideqes.png',
    description: 'A trusted employment platform connecting community members with verified halal-compliant workplaces that accommodate prayers and Islamic values.'
  },
  business_directory: {
    id: 'business_directory',
    name: 'Muslim Business Directory',
    subtitle: 'Support Local Muslim Entrepreneurs',
    category: 'Commerce & Trade',
    imageUrl: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791212620/work_halal_2_uhb3yi.png',
    description: 'A comprehensive directory to locate and support local halal-certified businesses, Muslim contractors, merchants, and professional services.'
  },
  nikah_matrimony: {
    id: 'nikah_matrimony',
    name: 'Nikah Matrimony Network',
    subtitle: 'Sunnah-Aligned Blessed Matchmaking',
    category: 'Family & Marriage',
    imageUrl: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791213608/work_halal_3_idz7uu.png',
    description: 'A dignified, confidential, wali-guided matrimonial service helping righteous brothers and sisters find pious life partners according to the Sunnah.'
  },
  islamic_education: {
    id: 'islamic_education',
    name: 'Islamic Education Hub',
    subtitle: 'From Pre-K to Advanced Alimiyyah',
    category: 'Education & Learning',
    imageUrl: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791268828/work_halal_4_heysky.png',
    description: 'Connecting families with accredited Islamic academies, weekend madrasahs, Quran Hifz programs, and authentic knowledge classes.'
  }
};

interface ConnectMuslimComingSoonScreenProps {
  serviceKey: 'work_halal_jobs' | 'business_directory' | 'nikah_matrimony' | 'islamic_education';
}

export const ConnectMuslimComingSoonScreen: React.FC<ConnectMuslimComingSoonScreenProps> = ({ serviceKey }) => {
  const { setOverlayScreen } = useApp();
  const service = SERVICE_DETAILS[serviceKey] || SERVICE_DETAILS.work_halal_jobs;

  return (
    <div className="w-full flex flex-col px-4 pt-3 pb-8 min-h-full">
      {/* Top Breadcrumb & Simple Back Action to Return to Home */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOverlayScreen(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F5B] hover:text-[#066347] active:opacity-70 transition-opacity py-1 px-2 -ml-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Connect Muslim
        </span>
      </div>

      {/* Service Header Card with Service Name at the top */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs mb-4">
        <div className="w-full rounded-2xl overflow-hidden border border-slate-200/80 mb-3.5 shadow-2xs bg-slate-50">
          <img
            src={service.imageUrl}
            alt={service.name}
            className="w-full h-auto object-cover block"
          />
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#087F5B] uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            {service.category}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            Madina Masjid MKB Nagar
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {service.name}
        </h1>

        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {service.subtitle}
        </p>
      </div>

      {/* Clean, Centered Coming Soon Section */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col items-center text-center my-auto">
        <div className="relative mb-3.5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#087F5B] shadow-2xs">
            <RubElHizbIcon className="w-8 h-8 text-[#087F5B]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D4A72C] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-bold mb-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Launching Soon in sha Allah</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Coming Soon
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mb-3">
          {service.description}
        </p>

        <p className="text-[11px] text-slate-400 font-medium mb-6 max-w-xs">
          This service is currently under active preparation for our community. We look forward to launching it soon with verified opportunities.
        </p>

        {/* Back to Home Button */}
        <button
          onClick={() => setOverlayScreen(null)}
          className="w-full max-w-xs h-12 rounded-2xl bg-[#087F5B] hover:bg-[#066347] active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home Screen</span>
        </button>
      </div>
    </div>
  );
};
