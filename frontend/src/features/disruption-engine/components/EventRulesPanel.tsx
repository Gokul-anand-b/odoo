'use client';

import { useState } from 'react';
import { Check, Clock3, LockKeyhole, Save } from 'lucide-react';
import type { WeddingEvent } from '../types/disruption.types';

interface EventRulesPanelProps {
  events: WeddingEvent[];
  busyEventId: string | null;
  onSave: (event: WeddingEvent, fixed: boolean, moveCost: number) => Promise<boolean>;
}

export default function EventRulesPanel({ events, busyEventId, onSave }: EventRulesPanelProps) {
  const [drafts, setDrafts] = useState<Record<string, { fixed: boolean; cost: number }>>({});

  return (
    <section className="rounded-3xl p-5 sm:p-6" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(185,154,101,0.12)', color: 'var(--gold-muted)' }}><Clock3 className="h-5 w-5" /></div>
        <div><h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-ink)' }}>Event guardrails</h2><p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Set which moments must stay fixed and the cost of moving each event.</p></div>
      </div>
      {events.length === 0 ? <p className="rounded-2xl px-4 py-5 text-sm" style={{ background: 'var(--ivory)', color: 'var(--text-muted)' }}>No event schedule is available for this wedding.</p> : (
        <div className="space-y-2">
          {events.map((event) => {
            const draft = drafts[event.id] ?? { fixed: event.is_fixed_time, cost: event.recovery_move_cost ?? 0 };
            const isBusy = busyEventId === event.id;
            return (
              <div key={event.id} className="grid gap-3 rounded-2xl p-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center" style={{ background: 'var(--ivory)' }}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-ink)' }}>{event.name}</p>
                  <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-muted)' }}>{event.start_time || 'Time TBD'}{event.venue_space ? ` · ${event.venue_space}` : ''}</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-body)' }}>
                  <input type="checkbox" checked={draft.fixed} onChange={(e) => setDrafts({ ...drafts, [event.id]: { ...draft, fixed: e.target.checked } })} className="accent-[#8A6841]" />
                  <LockKeyhole className="h-3.5 w-3.5" style={{ color: 'var(--gold-muted)' }} /> Fixed time
                </label>
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`move-cost-${event.id}`}>Recovery move cost for {event.name}</label>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>₹</span>
                    <input id={`move-cost-${event.id}`} type="number" min={0} step="0.01" value={draft.cost} onChange={(e) => setDrafts({ ...drafts, [event.id]: { ...draft, cost: Number(e.target.value) } })} className="w-full rounded-lg py-2 pl-6 pr-2 text-xs outline-none" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', color: 'var(--text-ink)' }} />
                  </div>
                  <button type="button" aria-label={`Save rules for ${event.name}`} disabled={isBusy} onClick={async () => {
                    if (await onSave(event, draft.fixed, draft.cost)) {
                      setDrafts((current) => ({ ...current, [event.id]: { fixed: draft.fixed, cost: draft.cost } }));
                    }
                  }} className="flex h-9 w-9 items-center justify-center rounded-lg disabled:opacity-50" style={{ background: 'var(--plum)', color: 'white' }}>
                    {isBusy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Save className="h-4 w-4" />}
                  </button>
                  {!isBusy && draft.fixed === event.is_fixed_time && draft.cost === (event.recovery_move_cost ?? 0) && <Check className="hidden h-4 w-4 text-emerald-700 sm:block" aria-label="Saved" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
