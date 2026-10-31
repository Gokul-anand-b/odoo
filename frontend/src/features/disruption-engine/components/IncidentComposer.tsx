'use client';

import { useState, type FormEvent } from 'react';
import { AlertTriangle, ArrowRight, LoaderCircle } from 'lucide-react';
import type { IncidentInput, WeddingEvent } from '../types/disruption.types';

interface IncidentComposerProps {
  events: WeddingEvent[];
  busy: boolean;
  onCreate: (incident: IncidentInput) => Promise<boolean>;
}

export default function IncidentComposer({ events, busy, onCreate }: IncidentComposerProps) {
  const [form, setForm] = useState<IncidentInput>({
    title: '',
    incident_type: 'vendor_delay',
    description: '',
    vendor_impact: '',
    affected_event: '',
    delay_minutes: 30,
    cost_per_minute: 0,
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await onCreate(form)) {
      setForm((current) => ({ ...current, title: '', description: '' }));
    }
  };

  const inputStyle = {
    border: '1px solid var(--border)',
    background: 'var(--warm-white)',
    color: 'var(--text-ink)',
  };

  return (
    <form onSubmit={submit} className="rounded-3xl p-5 sm:p-6" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(185,154,101,0.12)', color: 'var(--gold-muted)' }}>
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-ink)' }}>Log a disruption</h2>
          <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Capture the moment and affected event to prepare recovery options.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold sm:col-span-2" style={{ color: 'var(--text-body)' }}>
          Incident title
          <input required maxLength={140} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Monsoon rain at the garden venue" className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#B99A65]" style={inputStyle} />
        </label>
        <label className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>
          Type
          <select value={form.incident_type} onChange={(e) => setForm({ ...form, incident_type: e.target.value })} className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={inputStyle}>
            <option value="vendor_delay">Vendor delay</option>
            <option value="weather">Weather</option>
            <option value="venue">Venue disruption</option>
            <option value="transport">Transport delay</option>
            <option value="technical">Technical issue</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>
          Affected event
          <select required value={form.affected_event} onChange={(e) => setForm({ ...form, affected_event: e.target.value })} className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={inputStyle}>
            <option value="">Choose an event</option>
            {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
          </select>
        </label>
        <label className="text-xs font-semibold sm:col-span-2" style={{ color: 'var(--text-body)' }}>
          Impacted vendor or service <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(optional)</span>
          <input maxLength={200} value={form.vendor_impact} onChange={(e) => setForm({ ...form, vendor_impact: e.target.value })} placeholder="e.g. Floral decor team" className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#B99A65]" style={inputStyle} />
        </label>
        <label className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>
          Expected delay <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(minutes)</span>
          <input required type="number" min={1} value={form.delay_minutes} onChange={(e) => setForm({ ...form, delay_minutes: Number(e.target.value) })} className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={inputStyle} />
        </label>
        <label className="text-xs font-semibold" style={{ color: 'var(--text-body)' }}>
          Impact estimate <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(₹ / minute)</span>
          <input required type="number" min={0} step="0.01" value={form.cost_per_minute} onChange={(e) => setForm({ ...form, cost_per_minute: Number(e.target.value) })} className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none" style={inputStyle} />
        </label>
        <label className="text-xs font-semibold sm:col-span-2" style={{ color: 'var(--text-body)' }}>
          What happened?
          <textarea required rows={2} maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add context that will help the planning team assess the situation." className="mt-1.5 w-full resize-y rounded-xl px-3.5 py-2.5 text-sm outline-none" style={inputStyle} />
        </label>
      </div>

      <button type="submit" disabled={busy || events.length === 0} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto" style={{ background: 'linear-gradient(135deg, var(--plum), var(--plum-mid))', color: 'white', boxShadow: 'var(--shadow-md)' }}>
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Create incident <ArrowRight className="h-4 w-4" /></>}
      </button>
      {events.length === 0 && <p className="mt-2 text-xs" style={{ color: 'var(--rose-deep)' }}>Add events to this wedding before logging an incident.</p>}
    </form>
  );
}
