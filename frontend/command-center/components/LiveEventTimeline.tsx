import React, { useState } from 'react';
import {
  CalendarClock,
  MapPin,
  User,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Radio,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { WeddingEvent } from '../types/commandCenter.types';

interface LiveEventTimelineProps {
  events: WeddingEvent[];
  selectedEventId?: string;
  onSelectEvent?: (event: WeddingEvent) => void;
}

export const LiveEventTimeline: React.FC<LiveEventTimelineProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  const [filterType, setFilterType] = useState<string>('All');

  const filteredEvents = events.filter((evt) => {
    if (filterType === 'All') return true;
    if (filterType === 'Active') return evt.status === 'In Progress' || evt.status === 'Delayed';
    if (filterType === 'Completed') return evt.status === 'Completed';
    if (filterType === 'Upcoming') return evt.status === 'Upcoming';
    return true;
  });

  const getStatusBadge = (status: WeddingEvent['status'], delayMinutes: number) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
            <span className="live-pulse-dot w-2 h-2 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-300 shadow-xs animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Delayed (+{delayMinutes}m)
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="cc-card p-5 bg-white">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-[#E8D4B0]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] border border-[#E8D4B0] flex items-center justify-center text-[#9A7E50]">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2A1E26] flex items-center gap-2">
              Live Event Timeline
              <span className="text-[11px] font-semibold text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#E8D4B0]">
                Udaipur Royal Schedule
              </span>
            </h2>
            <p className="text-xs text-[#6B5E68]">
              Scheduled vs. actual ceremony progression with delay buffers
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#F7F4EE] p-1 rounded-xl border border-[#E8D4B0]/60">
          {['All', 'Active', 'Upcoming', 'Completed'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                filterType === tab
                  ? 'bg-white text-[#2A1E26] shadow-xs font-bold border border-[#E8D4B0]'
                  : 'text-[#6B5E68] hover:text-[#2A1E26]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline track list */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#B99A65] before:via-[#E8D4B0] before:to-gray-200">
        {filteredEvents.map((event, idx) => {
          const isSelected = selectedEventId === event.id;
          const isOngoing = event.status === 'In Progress';
          const isDelayed = event.status === 'Delayed';

          return (
            <div
              key={event.id}
              onClick={() => onSelectEvent?.(event)}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-[#FCFAF7] border-[#B99A65] shadow-md ring-1 ring-[#B99A65]'
                  : isOngoing
                  ? 'bg-[#FFFDF9] border-amber-300 shadow-sm'
                  : isDelayed
                  ? 'bg-[#FFF9F9] border-red-200'
                  : 'bg-white border-[#E8D4B0]/70 hover:border-[#B99A65]/70 hover:shadow-xs'
              }`}
            >
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[31px] top-4.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                  isOngoing
                    ? 'bg-amber-500 border-white shadow-sm ring-2 ring-amber-400'
                    : isDelayed
                    ? 'bg-red-500 border-white shadow-sm ring-2 ring-red-300'
                    : event.status === 'Completed'
                    ? 'bg-emerald-600 border-white'
                    : 'bg-white border-[#B99A65]'
                }`}
              >
                {event.status === 'Completed' ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                ) : isOngoing ? (
                  <Radio className="w-2.5 h-2.5 text-white animate-pulse" />
                ) : null}
              </div>

              {/* Event Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#E8D4B0]/60">
                      {event.ceremonyType}
                    </span>
                    <h3 className="text-sm font-bold text-[#2A1E26] group-hover:text-[#9A7E50] transition">
                      {event.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[#6B5E68]">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#9A7E50]" />
                      {event.venueLocation}
                    </span>
                    <span className="hidden sm:inline text-gray-300">•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#9A7E50]" />
                      {event.guestCount} guests
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  {getStatusBadge(event.status, event.delayMinutes)}
                </div>
              </div>

              {/* Timestamps Section: Scheduled vs Actual */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8D4B0]/40 text-xs">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="text-[#8E828B] font-medium">Scheduled Time:</span>
                  <span className="font-semibold text-[#2A1E26]">
                    {event.scheduledStartTime} – {event.scheduledEndTime}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="text-[#8E828B] font-medium">Actual Progression:</span>
                  {event.actualStartTime ? (
                    <span className={`font-semibold ${event.delayMinutes > 15 ? 'text-red-700' : 'text-emerald-700'}`}>
                      Started {event.actualStartTime} {event.actualEndTime ? `(Ended ${event.actualEndTime})` : '(In Progress)'}
                    </span>
                  ) : (
                    <span className="text-[#6B5E68] italic">Pending Commencement</span>
                  )}
                </div>
              </div>

              {/* Footer Meta: Lead Coordinator & Key Vendors */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-1.5 text-[#6B5E68]">
                  <User className="w-3.5 h-3.5 text-[#9A7E50]" />
                  <span>Lead: <strong className="text-[#2A1E26]">{event.leadCoordinator}</strong></span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-[#8E828B]">Key Vendors:</span>
                  {event.keyVendors.map((vendor, vIdx) => (
                    <span
                      key={vIdx}
                      className="text-[11px] font-medium text-[#493044] bg-white px-2 py-0.5 rounded border border-[#E8D4B0]/80 shadow-2xs"
                    >
                      {vendor}
                    </span>
                  ))}
                </div>
              </div>

              {event.notes && (
                <div className="mt-2 text-[11px] text-[#76636D] bg-[#FFFBF5] px-2.5 py-1.5 rounded border border-[#E8D4B0]/50 italic">
                  💡 Note: {event.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
