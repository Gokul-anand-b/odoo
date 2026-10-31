'use client';

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shirt,
  UserCheck,
} from 'lucide-react';
import { WeddingEvent } from '../types/blueprint.types';

interface EventPlanningTimelineProps {
  events: WeddingEvent[];
  weddingTitle: string;
}

export default function EventPlanningTimeline({ events, weddingTitle }: EventPlanningTimelineProps) {
  return (
    <div className="card p-6 border border-[rgba(185,154,101,0.25)] shadow-xl bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-[rgba(185,154,101,0.18)]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-bold text-[#2A1E26]">
              Wedding Ceremony & Event Rundown
            </h3>
            <span className="badge-gold">{events.length} Ceremonies</span>
          </div>
          <p className="text-xs text-[#8A7380] mt-0.5">
            Synchronized schedule for {weddingTitle}, with dedicated coordinators and guest capacities.
          </p>
        </div>
      </div>

      {/* Chronological Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#B99A65] before:via-[rgba(185,154,101,0.4)] before:to-transparent">
        {events.map((ev, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Marker Node */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-[#493044] border-2 border-[#D4BA8A] flex items-center justify-center text-[10px] font-bold text-[#D4BA8A] shadow-md group-hover:scale-110 transition-transform">
              {idx + 1}
            </div>

            {/* Event Card */}
            <div className="p-5 rounded-2xl bg-[#FFFCF8] border border-[rgba(185,154,101,0.2)] hover:border-[#B99A65] transition-all shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[rgba(185,154,101,0.1)]">
                <div>
                  <h4 className="font-display text-lg font-bold text-[#2A1E26]">
                    {ev.name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[#8A7380] mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-[#493044]">
                      <Calendar className="w-3.5 h-3.5 text-[#B99A65]" /> {ev.date}
                    </span>
                    {(ev.start_time || ev.end_time) && (
                      <span className="flex items-center gap-1 text-[#8A7380]">
                        <Clock className="w-3.5 h-3.5 text-[#B99A65]" /> {ev.start_time} - {ev.end_time}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF5F0] text-[#493044] border border-[rgba(185,154,101,0.25)] font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#B99A65]" /> {ev.expected_guests} Pax
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF5F0]/60">
                  <div className="text-[10px] uppercase font-bold text-[#8A7380] mb-0.5">
                    Venue Space
                  </div>
                  <div className="font-semibold text-[#2A1E26] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B99A65]" /> {ev.venue_space || 'Grand Courtyard'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF5F0]/60">
                  <div className="text-[10px] uppercase font-bold text-[#8A7380] mb-0.5">
                    Lead Coordinator
                  </div>
                  <div className="font-semibold text-[#2A1E26] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#B99A65]" /> {ev.coordinator_name || 'Senior Planner'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF5F0]/60">
                  <div className="text-[10px] uppercase font-bold text-[#8A7380] mb-0.5">
                    Dress Code & Palette
                  </div>
                  <div className="font-semibold text-[#2A1E26] flex items-center gap-1">
                    <Shirt className="w-3.5 h-3.5 text-[#B99A65]" /> {ev.dress_code || 'Plum & Antique Gold Royal'}
                  </div>
                </div>
              </div>

              {ev.notes && (
                <div className="text-xs text-[#8A7380] italic bg-white p-2.5 rounded-xl border border-[rgba(185,154,101,0.15)]">
                  &ldquo;{ev.notes}&rdquo;
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
