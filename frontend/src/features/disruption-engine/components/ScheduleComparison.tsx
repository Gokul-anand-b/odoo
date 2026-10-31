import { ArrowRight, CalendarClock, LockKeyhole } from 'lucide-react';
import type { RecoveryPlan, ScheduleEntry } from '../types/disruption.types';

interface ScheduleComparisonProps {
  plan: RecoveryPlan;
}

function timeLabel(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (!Number.isNaN(date.getTime()) && value.includes('T')) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  return value.slice(0, 5);
}

function ScheduleList({ entries, proposed }: { entries: ScheduleEntry[]; proposed: boolean }) {
  return (
    <div className="space-y-2">
      {entries.length === 0 ? <p className="py-5 text-center text-xs" style={{ color: 'var(--text-muted)' }}>No schedule details available.</p> : entries.map((entry) => (
        <div key={entry.event_id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: proposed && entry.shift_minutes ? 'rgba(185,154,101,0.10)' : 'var(--ivory)' }}>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold" style={{ color: 'var(--text-ink)' }}>{entry.name}</p>
            <p className="mt-0.5 truncate text-[10px]" style={{ color: 'var(--text-muted)' }}>{entry.venue_space || 'Venue space not specified'}</p>
          </div>
          <div className="text-right">
            <p className="whitespace-nowrap text-xs font-semibold tabular-nums" style={{ color: 'var(--text-body)' }}>{timeLabel(proposed ? entry.proposed_start : entry.original_start)} – {timeLabel(proposed ? entry.proposed_end : entry.original_end)}</p>
            {proposed && entry.shift_minutes !== 0 && <p className="mt-0.5 text-[10px] font-semibold" style={{ color: entry.shift_minutes > 0 ? 'var(--gold-muted)' : 'var(--rose-deep)' }}>{entry.shift_minutes > 0 ? '+' : ''}{entry.shift_minutes} min shift</p>}
            {!proposed && entry.is_fixed_time && <p className="mt-0.5 inline-flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}><LockKeyhole className="h-2.5 w-2.5" /> Fixed</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ScheduleComparison({ plan }: ScheduleComparisonProps) {
  const proposed = new Map(plan.proposed_schedule.map((entry) => [entry.event_id, entry]));
  const baseline = plan.baseline_schedule.map((entry) => ({
    ...entry,
    proposed_start: proposed.get(entry.event_id)?.proposed_start ?? entry.proposed_start,
    proposed_end: proposed.get(entry.event_id)?.proposed_end ?? entry.proposed_end,
    shift_minutes: proposed.get(entry.event_id)?.shift_minutes ?? entry.shift_minutes,
  }));
  return (
    <section className="rounded-3xl p-5 sm:p-6" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: 'rgba(185,154,101,0.12)', color: 'var(--gold-muted)' }}><CalendarClock className="h-5 w-5" /></div>
        <div><h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-ink)' }}>Schedule comparison</h2><p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Review the selected option before confirming a recovery move.</p></div>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
        <div><div className="mb-2 flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Current schedule</h3><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{plan.baseline_schedule.length} events</span></div><ScheduleList entries={plan.baseline_schedule} proposed={false} /></div>
        <div className="hidden justify-center pt-10 lg:flex"><ArrowRight className="h-5 w-5" style={{ color: 'var(--gold)' }} /></div>
        <div><div className="mb-2 flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--gold-muted)' }}>Proposed schedule</h3><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{plan.proposed_schedule.length} events</span></div><ScheduleList entries={baseline} proposed /></div>
      </div>
    </section>
  );
}
