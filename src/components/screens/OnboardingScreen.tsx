import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  Calendar, 
  Users, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { MosqueIcon, KaabaIcon, TasbeehBeadsIcon, RubElHizbIcon } from '../common/IslamicIcons';

export const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      step: '01',
      title: 'Prayer & Masjid Updates',
      subtitle: 'Accurate Timings & Live Adhan Alerts',
      desc: 'Stay grounded in your daily Salah with precise Adhan and Iqamah times, live countdowns to next prayer, and Friday Jummah khutbah updates directly from the Masjid.',
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#087F5B] relative shadow-inner">
          <Clock className="w-12 h-12 stroke-[1.7]" />
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#D4A72C] flex items-center justify-center text-slate-900 font-bold text-xs shadow-xs">
            5x
          </div>
        </div>
      ),
      highlight: 'Fajr · Dhuhr · Asr · Maghrib · Isha · Jummah'
    },
    {
      step: '02',
      title: 'Events & Community Services',
      subtitle: 'Nurturing Knowledge, Youth & Welfare',
      desc: 'Discover lectures by esteemed scholars, weekend Quran academy for children, sisters circles, and confidential community services including Zakat and marital counseling.',
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D4A72C] relative shadow-inner">
          <Calendar className="w-12 h-12 stroke-[1.7]" />
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#087F5B] flex items-center justify-center text-white text-xs shadow-xs">
            ★
          </div>
        </div>
      ),
      highlight: 'Lectures · Hifdh · Zakat Assistance · Family Support'
    },
    {
      step: '03',
      title: 'Connect With Muslims',
      subtitle: 'Your Trusted Ummah Network',
      desc: 'Access verified halal jobs, discover local Muslim-owned businesses, Sunnah-aligned matrimony, and support one another through our united Masjid ecosystem.',
      icon: (
        <div className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3B6FD8] relative shadow-inner">
          <Users className="w-12 h-12 stroke-[1.7]" />
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#D4A72C] flex items-center justify-center text-slate-950 font-bold text-xs shadow-xs">
            🤝
          </div>
        </div>
      ),
      highlight: 'WorkHalal Jobs · Business Directory · Matrimony'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F9F7] text-[#17221D] flex flex-col justify-between p-6 select-none max-w-[430px] mx-auto">
      {/* Top Bar: Skip button & progress dots */}
      <div className="pt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide 
                  ? 'w-7 bg-[#087F5B]' 
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={completeOnboarding}
          className="min-h-[44px] px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slide Illustration & Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4">
        {/* Dynamic Icon Canvas */}
        <div className="mb-8 relative">
          {current.icon}
        </div>

        <span className="text-xs font-bold tracking-widest text-[#087F5B] uppercase mb-1">
          Step {current.step} of 03
        </span>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2 text-balance">
          {current.title}
        </h2>

        <p className="text-xs font-bold text-[#D4A72C] mb-4">
          {current.subtitle}
        </p>

        <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-xs">
          {current.desc}
        </p>

        <div className="inline-block py-1.5 px-3 bg-emerald-50/80 border border-emerald-100 rounded-xl text-xs font-medium text-emerald-900">
          {current.highlight}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pb-6">
        <button
          onClick={handleNext}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#07543F] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 active:scale-[0.98] transition-all"
        >
          <span>{currentSlide === slides.length - 1 ? 'Enter Madina Masjid' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
