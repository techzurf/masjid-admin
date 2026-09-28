import React, { useState } from 'react';
import { Calendar, Plus, Edit2, Trash2, X, MapPin, Clock, User, Check, Sparkles } from 'lucide-react';
import { AdminEvent } from '../mockAdminData';

interface AdminEventsScreenProps {
  events: AdminEvent[];
  onUpdateEvents: (updated: AdminEvent[]) => void;
  onShowToast: (msg: string) => void;
}

export const AdminEventsScreen: React.FC<AdminEventsScreenProps> = ({
  events,
  onUpdateEvents,
  onShowToast
}) => {
  const [list, setList] = useState<AdminEvent[]>(events);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');

  const openAddModal = () => {
    setEditingEvent(null);
    setName('');
    setSpeaker('Sheikh Dr. Abdullah Al-Rahman');
    setDesc('');
    setDate('Every Friday');
    setTime('08:00 PM');
    setLocation('Main Prayer Hall');
    setImage('https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80');
    setModalOpen(true);
  };

  const openEditModal = (evt: AdminEvent) => {
    setEditingEvent(evt);
    setName(evt.title);
    setSpeaker(evt.speaker);
    setDesc(evt.description);
    setDate(evt.date);
    setTime(evt.time);
    setLocation(evt.location);
    setImage(evt.image);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = list.filter(e => e.id !== id);
    setList(updated);
    onUpdateEvents(updated);
    onShowToast('Event removed successfully.');
  };

  const handleSubmit = (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingEvent) {
      const updated = list.map(evt => evt.id === editingEvent.id ? {
        ...evt,
        title: name,
        speaker,
        description: desc,
        date,
        time,
        location,
        image: image || evt.image,
        status: publish ? ('Upcoming' as const) : ('Draft' as const)
      } : evt);
      setList(updated);
      onUpdateEvents(updated);
      onShowToast(`Event "${name}" updated!`);
    } else {
      const newEvt: AdminEvent = {
        id: `evt-${Date.now()}`,
        title: name,
        speaker,
        description: desc,
        date,
        time,
        location,
        image: image || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80',
        status: publish ? 'Upcoming' : 'Draft',
        attendees: 0
      };
      const updated = [newEvt, ...list];
      setList(updated);
      onUpdateEvents(updated);
      onShowToast(`Event "${name}" published!`);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F5B]">
            Halaqahs & Community Programs
          </span>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Event Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage weekly lectures, youth academies, and seasonal gatherings featured on the Home and Events screens.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="h-11 px-5 rounded-2xl bg-[#087F5B] hover:bg-[#066347] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all"
          >
            <div>
              {/* Event Image Banner */}
              <div className="w-full h-36 relative overflow-hidden bg-slate-100">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                    evt.status === 'Upcoming' ? 'bg-[#087F5B] text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {evt.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#087F5B] font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate">{evt.speaker}</span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">
                {evt.attendees > 0 ? `${evt.attendees} Registered` : 'Open Entry'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(evt)}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#087F5B] transition-colors"
                  title="Edit event"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(evt.id)}
                  className="p-1.5 rounded-xl bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete event"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Fill in schedule and speaker details for the community
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Weekly Bayan & Tafseer"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Speaker / Lead Scholar *
                </label>
                <input
                  type="text"
                  required
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  placeholder="e.g. Sheikh Dr. Abdullah Al-Rahman"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Friday / 28 Sep"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 8:00 PM"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Location / Venue *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Prayer Hall / Madrasah Hall"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Brief synopsis of the program..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-hidden focus:border-[#087F5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#066347] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
