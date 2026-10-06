import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  RotateCw, 
  Sparkles, 
  Star, 
  MapPin, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { RubElHizbIcon } from '../common/IslamicIcons';
import { 
  fetchTodayHijriDate, 
  fetchHijriMonthCalendar, 
  HijriDayData, 
  TodayHijriInfo,
  getTodayKolkataDateFormatted,
  HIJRI_MONTHS_LIST,
  CALENDAR_METHOD
} from '../../services/aladhanCalendarService';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export const IslamicCalendarScreen: React.FC = () => {
  const { triggerHapticFeedback } = useApp();

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Today Hijri info from API
  const [todayInfo, setTodayInfo] = useState<TodayHijriInfo | null>(null);

  // Active viewed Hijri month & year
  const [activeMonth, setActiveMonth] = useState<number>(4); // default 4 (Rabīʿ al-Thānī)
  const [activeYear, setActiveYear] = useState<number>(1448);

  // Calendar days array from AlAdhan API
  const [calendarDays, setCalendarDays] = useState<HijriDayData[]>([]);

  // Selected Day in the month view
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  // Today's Gregorian date in Asia/Kolkata (DD-MM-YYYY)
  const { formattedDDMMYYYY: todayKolkataGregorian } = useMemo(() => getTodayKolkataDateFormatted(), []);

  // Fetch initial today's date from API
  const loadInitialToday = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const today = await fetchTodayHijriDate();
      setTodayInfo(today);
      setActiveMonth(today.hijriMonth);
      setActiveYear(today.hijriYear);

      // Load month calendar
      const days = await fetchHijriMonthCalendar(today.hijriMonth, today.hijriYear);
      setCalendarDays(days);

      // Select today's index
      const todayIdx = days.findIndex(d => d.gregorian.date === todayKolkataGregorian);
      setSelectedDayIndex(todayIdx >= 0 ? todayIdx : 0);
    } catch (err) {
      console.error('Error loading Islamic calendar:', err);
      setError('Unable to fetch live Islamic calendar data from AlAdhan API. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [todayKolkataGregorian]);

  useEffect(() => {
    loadInitialToday();
  }, [loadInitialToday]);

  // Fetch calendar when month or year changes
  const loadMonthData = useCallback(async (month: number, year: number) => {
    try {
      setLoading(true);
      setError(null);
      const days = await fetchHijriMonthCalendar(month, year);
      setCalendarDays(days);

      // If today is in this month, select today; otherwise select day 1
      const todayIdx = days.findIndex(d => d.gregorian.date === todayKolkataGregorian);
      setSelectedDayIndex(todayIdx >= 0 ? todayIdx : 0);
    } catch (err) {
      console.error(`Error loading month ${month}/${year}:`, err);
      setError('Failed to load this month from the calendar API. Tap retry to try again.');
    } finally {
      setLoading(false);
    }
  }, [todayKolkataGregorian]);

  // Navigate to previous Hijri month
  const handlePrevMonth = () => {
    triggerHapticFeedback('light');
    let newMonth = activeMonth - 1;
    let newYear = activeYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setActiveMonth(newMonth);
    setActiveYear(newYear);
    loadMonthData(newMonth, newYear);
  };

  // Navigate to next Hijri month
  const handleNextMonth = () => {
    triggerHapticFeedback('light');
    let newMonth = activeMonth + 1;
    let newYear = activeYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setActiveMonth(newMonth);
    setActiveYear(newYear);
    loadMonthData(newMonth, newYear);
  };

  // Jump to Current Month / Today
  const handleJumpToToday = () => {
    triggerHapticFeedback('selection');
    if (!todayInfo) {
      loadInitialToday();
      return;
    }
    setActiveMonth(todayInfo.hijriMonth);
    setActiveYear(todayInfo.hijriYear);
    loadMonthData(todayInfo.hijriMonth, todayInfo.hijriYear);
  };

  // Month metadata
  const currentMonthMeta = useMemo(() => {
    const found = HIJRI_MONTHS_LIST.find(m => m.number === activeMonth);
    return found || { number: activeMonth, en: `Month ${activeMonth}`, ar: '' };
  }, [activeMonth]);

  // Calculate day-of-week offset for day 1
  const leadingBlankDays = useMemo(() => {
    if (calendarDays.length === 0) return 0;
    const firstDay = calendarDays[0];
    const weekdayName = firstDay.gregorian.weekday.en.toLowerCase();
    const map: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };
    return map[weekdayName] ?? 0;
  }, [calendarDays]);

  // Currently selected day object
  const selectedDay = useMemo(() => {
    if (selectedDayIndex === null || !calendarDays[selectedDayIndex]) return null;
    return calendarDays[selectedDayIndex];
  }, [calendarDays, selectedDayIndex]);

  // Important Islamic Holidays in this month
  const monthHolidays = useMemo(() => {
    return calendarDays.filter(d => d.hijri.holidays && d.hijri.holidays.length > 0);
  }, [calendarDays]);

  // Gregorian date range for the month
  const gregorianSpan = useMemo(() => {
    if (calendarDays.length === 0) return '';
    const first = calendarDays[0];
    const last = calendarDays[calendarDays.length - 1];
    return `${first.gregorian.day} ${first.gregorian.month.en} ${first.gregorian.year} – ${last.gregorian.day} ${last.gregorian.month.en} ${last.gregorian.year}`;
  }, [calendarDays]);

  return (
    <div className="w-full flex flex-col gap-3.5 px-3.5 pt-2 pb-8">

      {/* 1. Header Banner & Month Navigator */}
      <div className="w-full rounded-3xl bg-gradient-to-br from-[#087F5B] via-[#076E4E] to-[#054432] p-4 text-white relative overflow-hidden shadow-sm">
        {/* Decorative Motif */}
        <div className="absolute top-1 right-1 opacity-10 pointer-events-none text-white">
          <RubElHizbIcon className="w-28 h-28" />
        </div>

        {/* Top bar with location and live status badge */}
        <div className="flex items-center justify-between text-xs text-emerald-100 mb-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span className="font-semibold text-emerald-50">Madina Masjid MKB Nagar</span>
            <span className="text-[10px] opacity-75">(Chennai)</span>
          </div>
          <button
            onClick={handleJumpToToday}
            className="px-2.5 py-1 rounded-xl bg-white/15 border border-white/20 text-[11px] font-bold text-white flex items-center gap-1 hover:bg-white/25 active:scale-95 transition-all cursor-pointer"
          >
            <CalendarIcon className="w-3 h-3 text-[#D4A72C]" />
            <span>Today</span>
          </button>
        </div>

        {/* Main Month / Year Navigation */}
        <div className="flex items-center justify-between relative z-10 my-1">
          <button
            onClick={handlePrevMonth}
            disabled={loading}
            aria-label="Previous Month"
            className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all cursor-pointer disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
              {currentMonthMeta.en}
            </h1>
            <p className="text-sm font-arabic text-[#D4A72C] font-bold mt-0.5">
              {currentMonthMeta.ar} {activeYear} هـ
            </p>
            <span className="text-[10px] text-emerald-100/80 block mt-0.5">
              {gregorianSpan || 'Loading dates...'}
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            disabled={loading}
            aria-label="Next Month"
            className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all cursor-pointer disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Error state banner if API request fails */}
      {error && (
        <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => loadMonthData(activeMonth, activeYear)}
            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold shrink-0 hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* 2. Main Calendar Grid Card */}
      <div className="w-full bg-white rounded-3xl p-3 border border-slate-200/90 shadow-2xs">
        
        {/* Weekday Column Headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {WEEKDAYS.map((day) => {
            const isFriday = day === 'Fri';
            return (
              <div 
                key={day} 
                className={`py-1 text-[11px] font-bold uppercase tracking-wider ${
                  isFriday ? 'text-[#087F5B] bg-emerald-50/80 rounded-lg' : 'text-slate-400'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Days Grid */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-7 h-7 text-[#087F5B] animate-spin" />
            <span className="text-xs font-semibold">Fetching AlAdhan Calendar...</span>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {/* Leading blank slots */}
            {Array.from({ length: leadingBlankDays }).map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square opacity-0 pointer-events-none" />
            ))}

            {/* Days of the Hijri Month */}
            {calendarDays.map((dayData, idx) => {
              const hijriDayNum = parseInt(dayData.hijri.day, 10);
              const isToday = dayData.gregorian.date === todayKolkataGregorian;
              const isSelected = selectedDayIndex === idx;
              const hasHoliday = dayData.hijri.holidays && dayData.hijri.holidays.length > 0;
              const isFriday = dayData.gregorian.weekday.en === 'Friday';
              const isWhiteDay = hijriDayNum === 13 || hijriDayNum === 14 || hijriDayNum === 15;

              return (
                <button
                  key={dayData.hijri.date}
                  type="button"
                  onClick={() => {
                    triggerHapticFeedback('light');
                    setSelectedDayIndex(idx);
                  }}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative p-0.5 transition-all cursor-pointer active:scale-95 ${
                    isToday
                      ? 'bg-gradient-to-br from-[#087F5B] to-[#06543F] text-white shadow-md ring-2 ring-emerald-400/40'
                      : isSelected
                      ? 'bg-emerald-50 border-2 border-[#087F5B] text-slate-900 shadow-2xs'
                      : hasHoliday
                      ? 'bg-amber-50/70 border border-amber-200/80 text-slate-800'
                      : isFriday
                      ? 'bg-emerald-50/40 text-slate-800 hover:bg-emerald-50/80'
                      : 'bg-slate-50/60 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {/* Islamic Holiday Indicator Star */}
                  {hasHoliday && !isToday && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}

                  {/* Sunnah Fasting Dot (Ayyam al-Beed: 13, 14, 15) */}
                  {isWhiteDay && !isToday && (
                    <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
                  )}

                  {/* Hijri Day Number (Prominent) */}
                  <span className={`text-sm font-extrabold leading-none ${
                    isToday ? 'text-white' : 'text-slate-900'
                  }`}>
                    {hijriDayNum}
                  </span>

                  {/* Gregorian Day & Short Month */}
                  <span className={`text-[9px] font-medium leading-tight mt-0.5 truncate ${
                    isToday ? 'text-emerald-100' : 'text-slate-500'
                  }`}>
                    {parseInt(dayData.gregorian.day, 10)} {dayData.gregorian.month.en.slice(0, 3)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-md bg-[#087F5B]" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-md bg-amber-100 border border-amber-300" />
            <span>Holiday / Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-md bg-teal-100 border border-teal-300" />
            <span>White Days</span>
          </div>
        </div>
      </div>

      {/* 3. Selected Day Detailed Information Card */}
      {selectedDay && (
        <div className="w-full bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#087F5B] tracking-wider block">
                Selected Date
              </span>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {parseInt(selectedDay.hijri.day, 10)} {selectedDay.hijri.month.en} {selectedDay.hijri.year} AH
              </h2>
              <span className="text-xs font-arabic text-amber-800 font-bold block mt-0.5">
                {selectedDay.hijri.weekday.ar}، {selectedDay.hijri.day} {selectedDay.hijri.month.ar} {selectedDay.hijri.year}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-800 block">
                {selectedDay.gregorian.weekday.en}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedDay.gregorian.day} {selectedDay.gregorian.month.en} {selectedDay.gregorian.year}
              </span>
            </div>
          </div>

          {/* Holiday / Important Islamic Occasions (From AlAdhan API) */}
          {selectedDay.hijri.holidays && selectedDay.hijri.holidays.length > 0 && (
            <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Islamic Occasion / Holiday:</span>
              </div>
              <ul className="space-y-0.5 pl-4 list-disc text-[11px]">
                {selectedDay.hijri.holidays.map((h, i) => (
                  <li key={i} className="font-semibold">{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Sunnah Fasting Advice if White Days (13, 14, 15) or Monday / Thursday */}
          {(parseInt(selectedDay.hijri.day, 10) === 13 || 
            parseInt(selectedDay.hijri.day, 10) === 14 || 
            parseInt(selectedDay.hijri.day, 10) === 15 || 
            selectedDay.gregorian.weekday.en === 'Monday' || 
            selectedDay.gregorian.weekday.en === 'Thursday') && (
            <div className="p-2 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center gap-2 text-[11px] text-teal-800">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>
                {parseInt(selectedDay.hijri.day, 10) >= 13 && parseInt(selectedDay.hijri.day, 10) <= 15
                  ? 'Ayyam al-Beed (White Days): Recommended Sunnah Fast.'
                  : `${selectedDay.gregorian.weekday.en} Sunnah Fasting day.`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. Month's Important Islamic Dates List */}
      {monthHolidays.length > 0 && (
        <div className="w-full bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Important Dates in {currentMonthMeta.en}
            </h3>
          </div>

          <div className="space-y-2">
            {monthHolidays.map((item) => (
              <div 
                key={item.hijri.date}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">
                    {item.hijri.holidays.join(' · ')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {item.gregorian.weekday.en}, {item.gregorian.day} {item.gregorian.month.en} {item.gregorian.year}
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold shrink-0">
                  {parseInt(item.hijri.day, 10)} {currentMonthMeta.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AlAdhan API Attribution & Calculation Method Note */}
      <div className="p-3 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          Calculated via <strong>AlAdhan API</strong> using the <strong>Umm al-Qura ({CALENDAR_METHOD})</strong> astronomical method. Synchronized with Asia/Kolkata timezone for Madina Masjid MKB Nagar, Chennai.
        </div>
      </div>

    </div>
  );
};
