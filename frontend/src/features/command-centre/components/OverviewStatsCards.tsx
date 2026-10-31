import React from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  BellRing,
  Truck,
  TrendingUp
} from 'lucide-react';
import { DashboardOverviewStats } from '../types/commandCenter.types';

interface OverviewStatsCardsProps {
  stats: DashboardOverviewStats;
  onFilterByStatus?: (status: string) => void;
}

export const OverviewStatsCards: React.FC<OverviewStatsCardsProps> = ({
  stats,
  onFilterByStatus
}) => {
  const cards = [
    {
      id: 'total',
      label: 'Total Ceremonies',
      value: stats.totalEvents,
      detail: 'Scheduled today & tonight',
      icon: CalendarDays,
      badge: 'Full Day',
      color: '#493044',
      bgGlow: 'rgba(73, 48, 68, 0.05)',
      borderColor: 'rgba(73, 48, 68, 0.15)',
    },
    {
      id: 'ongoing',
      label: 'Ongoing Live Event',
      value: stats.ongoingEvents,
      detail: 'Baraat crossing Tripoliya',
      icon: Radio,
      badge: 'Live Now',
      color: '#9A7E50',
      bgGlow: 'rgba(185, 154, 101, 0.08)',
      borderColor: 'rgba(185, 154, 101, 0.35)',
      isLive: true,
    },
    {
      id: 'completed',
      label: 'Completed Events',
      value: stats.completedEvents,
      detail: 'Hi-Tea & Sufi Sangeet',
      icon: CheckCircle2,
      badge: 'On Schedule',
      color: '#2E8555',
      bgGlow: 'rgba(46, 133, 85, 0.08)',
      borderColor: 'rgba(46, 133, 85, 0.25)',
    },
    {
      id: 'upcoming',
      label: 'Upcoming Ceremonies',
      value: stats.upcomingEvents,
      detail: 'Pheras & Grand Banquet',
      icon: Clock,
      badge: 'Queued',
      color: '#2563EB',
      bgGlow: 'rgba(37, 99, 235, 0.06)',
      borderColor: 'rgba(37, 99, 235, 0.22)',
    },
    {
      id: 'delayed',
      label: 'Delayed Events',
      value: stats.delayedEvents,
      detail: 'Lotus Mandap (+25m)',
      icon: AlertTriangle,
      badge: stats.delayedEvents > 0 ? 'Requires Action' : 'All Clear',
      color: '#D97706',
      bgGlow: 'rgba(217, 119, 6, 0.08)',
      borderColor: 'rgba(217, 119, 6, 0.3)',
      highlight: stats.delayedEvents > 0,
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: stats.activeAlertsCount,
      detail: stats.activeAlertsCount > 0 ? 'Unacknowledged operational warnings' : 'All alerts resolved',
      icon: BellRing,
      badge: stats.activeAlertsCount > 0 ? 'Action Needed' : 'Normal',
      color: stats.activeAlertsCount > 0 ? '#DC2626' : '#2E8555',
      bgGlow: stats.activeAlertsCount > 0 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(46, 133, 85, 0.06)',
      borderColor: stats.activeAlertsCount > 0 ? 'rgba(220, 38, 38, 0.3)' : 'rgba(46, 133, 85, 0.2)',
      isCritical: stats.activeAlertsCount > 0,
    },
  ];

  return (
    <section aria-label="Dashboard Overview Metrics" className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onFilterByStatus?.(card.id)}
              className="cc-card p-4 flex flex-col justify-between cursor-pointer group"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: card.borderColor,
                background: `linear-gradient(180deg, #FFFFFF 65%, ${card.bgGlow} 100%)`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  style={{
                    backgroundColor: card.bgGlow,
                    color: card.color,
                    border: `1px solid ${card.borderColor}`,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: card.bgGlow,
                    color: card.color,
                    border: `1px solid ${card.borderColor}`,
                  }}
                >
                  {card.isLive && (
                    <span className="live-pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1" />
                  )}
                  {card.badge}
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-2xl lg:text-3xl font-display font-bold tracking-tight"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-[#2A1E26] mt-0.5 line-clamp-1">
                  {card.label}
                </h3>
                <p className="text-[11px] text-[#6B5E68] mt-1 line-clamp-1">
                  {card.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Operational Health Micro-Banner */}
      <div className="mt-3.5 cc-card p-3.5 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] border border-[#E8D4B0] flex items-center justify-center text-[#9A7E50]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2A1E26]">Schedule Integrity Index:</span>
              <span className="text-xs font-bold text-[#2E8555] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {stats.onTimeRatePercent}% On-Time
              </span>
            </div>
            <p className="text-[11px] text-[#6B5E68]">
              Overall ceremony schedule is 83.3% compliant with auspicious Muhurat buffers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-[#6B5E68]">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#9A7E50]" />
            <span>Vendors Checked-In: <strong className="text-[#2A1E26]">{stats.activeVendorsOnSite} on site</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 border-l border-[#E8D4B0] pl-4">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="text-emerald-700 font-semibold">City Palace Telemetry Live</span>
          </div>
        </div>
      </div>
    </section>
  );
};
