'use client';

import { useState, type FormEvent } from 'react';
import { ArrowDown, GitBranch, Plus } from 'lucide-react';
import type { EventDependency, WeddingEvent } from '../types/disruption.types';

interface DependencyPanelProps {
  events: WeddingEvent[];
  dependencies: EventDependency[];
  busy: boolean;
  onAdd: (dependency: Omit<EventDependency, 'id'>) => Promise<void>;
}

export default function DependencyPanel({ events, dependencies, busy, onAdd }: DependencyPanelProps) {
  const [predecessor, setPredecessor] = useState('');
  const [successor, setSuccessor] = useState('');
  const [gap, setGap] = useState(0);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!predecessor || !successor || predecessor === successor) return;
    await onAdd({ predecessor_event: predecessor, successor_event: successor, minimum_gap_minutes: gap });
    setPredecessor('');
    setSuccessor('');
    setGap(0);
  };
  const eventName = (id: string) => events.find((event) => event.id === id)?.name || 'Event';

  return (
    <section className="rounded-3xl p-5 sm:p-6" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(185,154,101,0.12)', color: 'var(--gold-muted)' }}><GitBranch className="h-5 w-5" /></div>
        <div><h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-ink)' }}>Event dependencies</h2><p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Protect the order of connected moments and their minimum turnaround.</p></div>
      </div>
      <form onSubmit={submit} className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>Must happen first
          <select required value={predecessor} onChange={(e) => setPredecessor(e.target.value)} className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm" style={{ background: 'var(--ivory)', border: '1px solid var(--border)', color: 'var(--text-ink)' }}>
            <option value="">Select event</option>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>Must happen after
          <select required value={successor} onChange={(e) => setSuccessor(e.target.value)} className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm" style={{ background: 'var(--ivory)', border: '1px solid var(--border)', color: 'var(--text-ink)' }}>
            <option value="">Select event</option>{events.filter((event) => event.id !== predecessor).map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold sm:col-span-2" style={{ color: 'var(--text-body)' }}>Minimum gap <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(minutes)</span>
          <div className="mt-1.5 flex gap-2">
            <input required type="number" min={0} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm" style={{ background: 'var(--ivory)', border: '1px solid var(--border)', color: 'var(--text-ink)' }} />
            <button type="submit" disabled={busy || !predecessor || !successor || predecessor === successor} className="inline-flex items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-50" style={{ background: 'var(--plum)' }}><Plus className="h-4 w-4" /> Add</button>
          </div>
        </label>
      </form>
      <div className="mt-4 space-y-2">
        {dependencies.length === 0 ? <p className="rounded-xl px-3 py-3 text-xs" style={{ background: 'var(--ivory)', color: 'var(--text-muted)' }}>No dependencies defined yet.</p> : dependencies.map((dependency, index) => (
          <div key={dependency.id || `${dependency.predecessor_event}-${dependency.successor_event}-${index}`} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs" style={{ background: 'var(--ivory)', color: 'var(--text-body)' }}>
            <span className="truncate font-medium">{eventName(dependency.predecessor_event)}</span><ArrowDown className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--gold-muted)' }} /><span className="truncate font-medium">{eventName(dependency.successor_event)}</span><span className="ml-auto shrink-0 rounded-full px-2 py-1" style={{ background: 'var(--warm-white)', color: 'var(--text-muted)' }}>{dependency.minimum_gap_minutes} min</span>
          </div>
        ))}
      </div>
    </section>
  );
}
