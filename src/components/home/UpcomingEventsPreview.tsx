import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, ChevronRight, ArrowRight } from 'lucide-react';
import { MOCK_EVENTS } from '../../data/mockData';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';

export const UpcomingEventsPreview: React.FC = () => {
  const { setActiveTab, openEventDetail, settings } = useApp();
  const t = useTranslation(settings.language);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
            {t('upcomingEvents')}
          </h2>
          <span className="text-[11px] text-slate-500">Lectures & Gatherings</span>
        </div>

        <button
          onClick={() => setActiveTab('events')}
          className="text-xs font-bold text-[#087F5B] hover:text-[#07543F] flex items-center gap-0.5 min-h-[44px]"
        >
          <span>See Calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 snap-x snap-mandatory">
        {MOCK_EVENTS.slice(0, 3).map(event => (
          <div
            key={event.id}
            onClick={() => openEventDetail(event)}
            className="w-[280px] shrink-0 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer snap-start flex flex-col justify-between"
          >
            {/* Event Header Banner with styled Islamic gradient container */}
            <div className={`h-24 bg-gradient-to-r ${event.imageFallbackGradient} p-3 flex flex-col justify-between text-white relative`}>
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/30 backdrop-blur-md rounded-md">
                  {event.category}
                </span>
                <span className="text-[10px] font-semibold text-amber-300">
                  {event.price}
                </span>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-15">
                <RubElHizbIcon className="w-24 h-24 text-white" />
              </div>
              <div className="z-10 text-[11px] text-white/90 font-medium">
                {event.date}
              </div>
            </div>

            {/* Event Body */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                  {settings.language === 'ta' && event.tamilTitle ? event.tamilTitle : event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mb-1">
                  <User className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{event.speaker}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{event.time}</span>
                </div>
              </div>

              {/* Action Bottom Row */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {event.registeredCount} attending
                </span>
                <span className="text-xs font-bold text-[#087F5B] group-hover:underline flex items-center gap-1">
                  Register <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
