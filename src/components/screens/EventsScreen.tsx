import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search, 
  Share2, 
  Bookmark, 
  ChevronRight, 
  Check, 
  X,
  ExternalLink,
  Users
} from 'lucide-react';
import { MOCK_EVENTS } from '../../data/mockData';
import { EventItem } from '../../types';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { useTranslation } from '../../utils/translations';

export const EventsScreen: React.FC = () => {
  const { 
    selectedEvent, 
    setSelectedEvent, 
    overlayScreen, 
    setOverlayScreen, 
    startRegistration, 
    settings 
  } = useApp();

  const t = useTranslation(settings.language);

  const categories = [
    'All',
    'Lectures',
    'Quran',
    'Youth',
    'Sisters',
    'Children',
    'Community'
  ];

  const categoryThemeMap: Record<string, { color: string; border: string; text: string; lightBg: string }> = {
    'Quran': { color: '#087F5B', border: 'border-emerald-200', text: 'text-[#087F5B]', lightBg: 'bg-[#E8F7F1]' },
    'Youth': { color: '#3B6FD8', border: 'border-blue-200', text: 'text-[#3B6FD8]', lightBg: 'bg-blue-50' },
    'Sisters': { color: '#7657C8', border: 'border-purple-200', text: 'text-[#7657C8]', lightBg: 'bg-purple-50' },
    'Children': { color: '#E89B3C', border: 'border-orange-200', text: 'text-[#E89B3C]', lightBg: 'bg-orange-50' },
    'Community': { color: '#159A9C', border: 'border-teal-200', text: 'text-[#159A9C]', lightBg: 'bg-teal-50' },
    'Lectures': { color: '#D4A72C', border: 'border-amber-200', text: 'text-[#B45309]', lightBg: 'bg-amber-50' },
    'All': { color: '#087F5B', border: 'border-emerald-200', text: 'text-[#087F5B]', lightBg: 'bg-[#E8F7F1]' }
  };

  const getTheme = (cat: string) => categoryThemeMap[cat] || categoryThemeMap['All'];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalEvent, setDetailModalEvent] = useState<EventItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const filteredEvents = MOCK_EVENTS.filter(evt => {
    const matchesCat = activeCategory === 'All' || evt.category === activeCategory;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenDetail = (event: EventItem) => {
    setDetailModalEvent(event);
    setCalendarAdded(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Join us at Madina Masjid MKB Nagar: ${detailModalEvent?.title} on ${detailModalEvent?.date}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCalendar = () => {
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-3 pb-8">
      {/* Screen Title & Subtitle */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
          Gatherings & Education
        </span>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Masjid Events & Halaqahs
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Join programs for spiritual growth, youth fellowship, and community service.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by lecture, topic, or speaker..."
          className="w-full h-11 pl-10 pr-4 bg-white rounded-2xl border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-[#087F5B] focus:ring-1 focus:ring-[#087F5B] shadow-2xs"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Horizontal Filter Bar */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          const theme = getTheme(cat);
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'text-white shadow-2xs' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
              style={{
                backgroundColor: isActive ? theme.color : undefined
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Event Cards List */}
      <div className="flex flex-col gap-3">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl p-6 border border-slate-200/80">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No events found</h3>
            <p className="text-xs text-slate-400 mt-1">Try another category or clear your search.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const eventTheme = getTheme(event.category);
            return (
              <div
                key={event.id}
                onClick={() => handleOpenDetail(event)}
                className="w-full bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col active:scale-[0.99]"
              >
                {/* Card Banner */}
                <div className={`h-28 bg-gradient-to-r ${event.imageFallbackGradient} p-4 flex flex-col justify-between text-white relative`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black/40 backdrop-blur-md rounded-md">
                      {event.category}
                    </span>
                    <span className="text-xs font-bold text-amber-300 px-2 py-0.5 bg-black/25 rounded-md">
                      {event.price}
                    </span>
                  </div>

                  <div className="absolute -bottom-6 -right-6 opacity-15">
                    <RubElHizbIcon className="w-28 h-28 text-white" />
                  </div>

                  <div className="z-10 flex items-center gap-2 text-xs font-semibold text-white/90">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{event.date}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">
                      {settings.language === 'ta' && event.tamilTitle ? event.tamilTitle : event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mb-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium truncate">{event.speaker}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.registeredCount} / {event.capacity} registered</span>
                    </div>

                    <button 
                      className={`px-3 py-1.5 rounded-xl ${eventTheme.lightBg} ${eventTheme.text} text-xs font-bold flex items-center gap-1 transition-colors`}
                    >
                      <span>View & Register</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Event Modal / Sheet */}
      {detailModalEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center max-w-[430px] mx-auto animate-in fade-in">
          <div className="w-full bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto p-5 shadow-2xl flex flex-col">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3 shrink-0"></div>

            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F5B]">
                  {detailModalEvent.category} · {detailModalEvent.price}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 leading-snug mt-0.5">
                  {detailModalEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setDetailModalEvent(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-800 -mr-2 -mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Banner */}
            <div className={`w-full h-32 rounded-2xl bg-gradient-to-r ${detailModalEvent.imageFallbackGradient} p-4 flex flex-col justify-end text-white relative mb-4`}>
              <div className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 bg-black/30 backdrop-blur-md rounded-lg">
                Capacity: {detailModalEvent.capacity} Attendees
              </div>
              <div className="text-xs font-bold text-amber-300">
                Madina Masjid MKB Nagar
              </div>
            </div>

            {/* Event Time & Venue Details */}
            <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-[#087F5B]" />
                <span className="font-semibold">{detailModalEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-[#087F5B]" />
                <span>{detailModalEvent.time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-[#087F5B]" />
                <span>{detailModalEvent.location}</span>
              </div>
            </div>

            {/* Speaker Bio */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Featured Speaker
              </h4>
              <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-[#087F5B] text-white flex items-center justify-center font-bold text-xs">
                  {detailModalEvent.speaker.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {detailModalEvent.speaker}
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    {detailModalEvent.speakerRole}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                About this Program
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {detailModalEvent.description}
              </p>
            </div>

            {/* Actions: Add to Calendar & Share */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={handleAddToCalendar}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                {calendarAdded ? <Check className="w-4 h-4 text-emerald-600" /> : <Calendar className="w-4 h-4" />}
                <span>{calendarAdded ? 'Saved to Calendar!' : 'Add to Calendar'}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Event'}</span>
              </button>
            </div>

            {/* Bottom Register Button */}
            <button
              onClick={() => {
                setDetailModalEvent(null);
                startRegistration('Event');
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#087F5B] to-[#07543F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/15 active:scale-[0.98] transition-all"
            >
              <span>Register Now ({detailModalEvent.price})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
