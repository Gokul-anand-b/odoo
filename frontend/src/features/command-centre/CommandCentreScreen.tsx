'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Radio,
  RefreshCw,
  Truck,
  Users,
} from 'lucide-react';

import { commandCentreApi } from './commandCentreApi';
import {
  CommandCentreDashboard,
  TaskStatus,
  VendorOption,
  VendorStatus,
  WeddingOption,
} from './types';

const cardClass = 'rounded-2xl border border-[#E8DCD0] bg-white shadow-sm';

function formatTime(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(value: string | null) {
  if (!value) return 'Arrival time not set';
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusPill({ children, tone = 'neutral' }: {
  children: string;
  tone?: 'neutral' | 'green' | 'amber' | 'red' | 'gold';
}) {
  const styles = {
    neutral: 'bg-stone-100 text-stone-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
    red: 'bg-rose-50 text-rose-700',
    gold: 'bg-[#F7F1E8] text-[#765B31]',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tone]}`}>
      {children.replaceAll('_', ' ')}
    </span>
  );
}

function statusTone(status: string): 'neutral' | 'green' | 'amber' | 'red' {
  if (status === 'completed' || status === 'checked_in') return 'green';
  if (status === 'in_progress' || status === 'en_route') return 'amber';
  if (status === 'delayed' || status === 'blocked') return 'red';
  return 'neutral';
}

export default function CommandCentreScreen() {
  const [weddings, setWeddings] = useState<WeddingOption[]>([]);
  const [weddingId, setWeddingId] = useState('');
  const [dashboard, setDashboard] = useState<CommandCentreDashboard | null>(null);
  const [availableVendors, setAvailableVendors] = useState<VendorOption[]>([]);
  const [vendorId, setVendorId] = useState('');
  const [eventId, setEventId] = useState('');
  const [expectedArrival, setExpectedArrival] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async (selectedWeddingId: string) => {
    if (!selectedWeddingId) {
      setDashboard(null);
      setAvailableVendors([]);
      setLoading(false);
      return;
    }
    try {
      const [overview, vendorOptions] = await Promise.all([
        commandCentreApi.getDashboard(selectedWeddingId),
        commandCentreApi.getAvailableVendors(selectedWeddingId),
      ]);
      setDashboard(overview);
      setAvailableVendors(vendorOptions);
      setError('');
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not load operations data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    commandCentreApi.getWeddings()
      .then((items) => {
        if (!active) return;
        setWeddings(items);
        if (items.length) setWeddingId(items[0].id);
        else setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : 'Could not load weddings.');
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!weddingId) return;
    const initialLoad = window.setTimeout(() => { void refresh(weddingId); }, 0);
    const timer = window.setInterval(() => { void refresh(weddingId); }, 30_000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
    };
  }, [weddingId, refresh]);

  const selectedWedding = useMemo(
    () => weddings.find((wedding) => wedding.id === weddingId),
    [weddingId, weddings],
  );

  const perform = async (
    action: () => Promise<unknown>,
    successMessage: string,
  ): Promise<boolean> => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await action();
      await refresh(weddingId);
      setNotice(successMessage);
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The update could not be saved.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const assignVendor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!vendorId) return;
    const saved = await perform(
      () => commandCentreApi.assignVendor(weddingId, {
        vendor: vendorId,
        ...(eventId ? { event: eventId } : {}),
        ...(expectedArrival ? { expected_arrival: new Date(expectedArrival).toISOString() } : {}),
      }),
      'Vendor assigned to the selected wedding.',
    );
    if (!saved) return;
    setVendorId('');
    setEventId('');
    setExpectedArrival('');
  };

  if (loading && !dashboard) {
    return <div className={`${cardClass} p-8 text-sm text-[#6B5E68]`}>Loading live operations from the wedding database…</div>;
  }

  if (!weddings.length && !error) {
    return (
      <div className={`${cardClass} p-10 text-center`}>
        <CalendarDays className="mx-auto mb-4 h-10 w-10 text-[#B99A65]" />
        <h1 className="font-display text-2xl font-semibold text-[#493044]">No wedding to monitor yet</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-[#756872]">
          Create a wedding in Wedding Blueprint first. Its saved schedule and tasks will appear here automatically.
        </p>
      </div>
    );
  }

  const tasks = dashboard?.tasks ?? [];
  const events = dashboard?.events ?? [];
  const vendors = dashboard?.vendors ?? [];
  const alerts = dashboard?.alerts ?? [];

  return (
    <section className="space-y-6">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#493044] via-[#3A2536] to-[#241720] p-6 text-white shadow-xl lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4BA8A]/30 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#D4BA8A]">
              <Radio className="h-3.5 w-3.5" /> Live operations monitor
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight lg:text-4xl">Wedding Command Centre</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#D4C8D0]">
              Track event execution, task progress and vendor arrivals. Schedule risks are checked against saved wedding dependencies.
            </p>
            {selectedWedding && (
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#F0E8EE]">
                <span className="font-semibold">{selectedWedding.couple_names}</span>
                <span className="inline-flex items-center gap-1.5 text-[#D4C8D0]">
                  <MapPin className="h-3.5 w-3.5 text-[#D4BA8A]" />
                  {selectedWedding.venue_name}, {selectedWedding.venue_city}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#D4C8D0]">
                  <Users className="h-3.5 w-3.5 text-[#D4BA8A]" /> {selectedWedding.guest_count} guests
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              aria-label="Select wedding"
              value={weddingId}
              onChange={(event) => setWeddingId(event.target.value)}
              className="min-w-60 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white outline-none focus:border-[#D4BA8A]"
            >
              {weddings.map((wedding) => (
                <option className="text-[#493044]" key={wedding.id} value={wedding.id}>
                  {wedding.couple_names} · {wedding.start_date}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => void refresh(weddingId)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4BA8A]/30 bg-[#D4BA8A]/10 px-4 py-2.5 text-sm font-semibold text-[#F0E8EE] transition hover:bg-[#D4BA8A]/20 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs text-[#C9B9C3]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Connected to saved wedding records
          {lastUpdated && <span className="text-white/50">· Updated {lastUpdated.toLocaleTimeString('en-IN')}</span>}
        </div>
      </header>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={CalendarDays} label="Scheduled events" value={String(events.length)} detail={`${events.filter((item) => item.status === 'completed').length} completed`} />
        <MetricCard icon={Activity} label="Blueprint tasks" value={String(dashboard?.task_counts.total ?? 0)} detail={`${dashboard?.task_counts.completed ?? 0} completed · ${dashboard?.task_counts.blocked ?? 0} blocked`} />
        <MetricCard icon={Truck} label="Vendor check-ins" value={`${dashboard?.vendor_counts.checked_in ?? 0}/${dashboard?.vendor_counts.assigned ?? 0}`} detail={`${dashboard?.vendor_counts.delayed ?? 0} delayed`} />
        <MetricCard icon={AlertTriangle} label="Schedule alerts" value={String(dashboard?.active_alerts_count ?? 0)} detail="Computed from current schedule and task states" alert={(dashboard?.active_alerts_count ?? 0) > 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <section className={`${cardClass} overflow-hidden`}>
          <SectionHeading icon={CalendarDays} title="Live event timeline" subtitle="Blueprint schedule with actual start/end and operational status" />
          {events.length ? (
            <div className="divide-y divide-[#F0E8E2]">
              {events.map((event) => (
                <article key={event.event_id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${event.status === 'delayed' ? 'bg-rose-500' : event.status === 'completed' ? 'bg-emerald-500' : event.status === 'in_progress' ? 'bg-amber-500' : 'bg-stone-300'}`} />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#493044]">{event.event_name}</p>
                      <p className="mt-1 text-xs text-[#837780]">
                        {event.event_date} · {event.scheduled_start ?? 'Time not set'}–{event.scheduled_end ?? '—'} · {event.venue_space}
                      </p>
                      {(event.actual_start || event.actual_end) && (
                        <p className="mt-1 text-xs text-[#9A7E50]">
                          Actual: {formatTime(event.actual_start)}–{formatTime(event.actual_end)}
                        </p>
                      )}
                      {event.delay_reason && <p className="mt-1 text-xs text-rose-700">{event.delay_reason}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <StatusPill tone={statusTone(event.status)}>{event.status}</StatusPill>
                    {event.status !== 'in_progress' && event.status !== 'completed' && (
                      <button disabled={saving} onClick={() => void perform(
                        () => commandCentreApi.updateEvent(weddingId, event.event_id, 'in_progress'),
                        `${event.event_name} marked in progress.`,
                      )} className="rounded-lg border border-[#E8DCD0] px-3 py-1.5 text-xs font-semibold text-[#493044] hover:bg-[#FAF5ED] disabled:opacity-50">
                        Start
                      </button>
                    )}
                    {event.status !== 'completed' && (
                      <button disabled={saving} onClick={() => void perform(
                        () => commandCentreApi.updateEvent(
                          weddingId,
                          event.event_id,
                          'delayed',
                          window.prompt(`Why is ${event.event_name} delayed?`) ?? '',
                        ),
                        `${event.event_name} marked delayed.`,
                      )} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">
                        Flag delay
                      </button>
                    )}
                    {event.status !== 'completed' && (
                      <button disabled={saving} onClick={() => void perform(
                        () => commandCentreApi.updateEvent(weddingId, event.event_id, 'completed'),
                        `${event.event_name} marked complete.`,
                      )} className="inline-flex items-center gap-1 rounded-lg bg-[#493044] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5B3D55] disabled:opacity-50">
                        <Check className="h-3.5 w-3.5" /> Complete
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : <EmptyState message="No events have been added to this wedding in Wedding Blueprint." />}
        </section>

        <section className={`${cardClass} overflow-hidden`}>
          <SectionHeading icon={AlertTriangle} title="Planner alerts" subtitle="Overdue work, blocked dependencies and schedule conflicts" />
          {alerts.length ? (
            <div className="max-h-[460px] divide-y divide-[#F0E8E2] overflow-y-auto">
              {alerts.map((alert) => (
                <article key={alert.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${alert.severity === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#493044]">{alert.title}</h3>
                        <StatusPill tone={alert.severity === 'high' ? 'red' : 'amber'}>{alert.severity}</StatusPill>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[#756872]">{alert.description}</p>
                      {alert.affected_events.length > 0 && (
                        <p className="mt-2 text-xs font-medium text-rose-700">
                          May affect: {alert.affected_events.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : <EmptyState message="No active schedule risks detected for this wedding." success />}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={`${cardClass} overflow-hidden`}>
          <SectionHeading icon={CheckCircle2} title="Task completion" subtitle="Status comes from the wedding’s saved Blueprint tasks" />
          {tasks.length ? (
            <div className="max-h-[430px] divide-y divide-[#F0E8E2] overflow-y-auto">
              {tasks.map((task) => (
                <article key={task.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#493044]">{task.title}</h3>
                      {task.is_critical_path && <StatusPill tone="gold">Critical path</StatusPill>}
                    </div>
                    <p className="mt-1 text-xs text-[#837780]">
                      {task.phase} · {task.coordinator_role} · Due {task.deadline ?? 'not set'}
                    </p>
                    {task.depends_on.length > 0 && <p className="mt-1 text-xs text-[#9A7E50]">Depends on: {task.depends_on.join(', ')}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={statusTone(task.status)}>{task.status}</StatusPill>
                    <select
                      aria-label={`Update status for ${task.title}`}
                      value={task.status}
                      disabled={saving}
                      onChange={(event) => void perform(
                        () => commandCentreApi.updateTask(weddingId, task.id, event.target.value as TaskStatus),
                        `${task.title} status saved.`,
                      )}
                      className="rounded-lg border border-[#E8DCD0] bg-white px-2 py-1.5 text-xs text-[#493044] disabled:opacity-50"
                    >
                      {(['pending', 'in_progress', 'completed', 'blocked'] as TaskStatus[]).map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
                    </select>
                  </div>
                </article>
              ))}
            </div>
          ) : <EmptyState message="No Blueprint tasks found. Generate a Wedding Blueprint to start monitoring tasks." />}
        </section>

        <section className={`${cardClass} overflow-hidden`}>
          <SectionHeading icon={Truck} title="Vendor arrival & check-in" subtitle="Assign real vendor directory records to this wedding" />
          <form onSubmit={assignVendor} className="grid gap-2 border-b border-[#F0E8E2] bg-[#FCFAF7] p-4 sm:grid-cols-[1fr_1fr_auto]">
            <select
              aria-label="Choose vendor to assign"
              value={vendorId}
              onChange={(event) => setVendorId(event.target.value)}
              required
              className="min-w-0 rounded-lg border border-[#E8DCD0] bg-white px-3 py-2 text-xs text-[#493044]"
            >
              <option value="">Select a saved vendor…</option>
              {availableVendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name} · {vendor.category}</option>)}
            </select>
            <select
              aria-label="Assign vendor to event"
              value={eventId}
              onChange={(event) => setEventId(event.target.value)}
              className="min-w-0 rounded-lg border border-[#E8DCD0] bg-white px-3 py-2 text-xs text-[#493044]"
            >
              <option value="">No specific event</option>
              {events.map((event) => <option key={event.event_id} value={event.event_id}>{event.event_name}</option>)}
            </select>
            <button disabled={saving || !availableVendors.length} className="rounded-lg bg-[#493044] px-3 py-2 text-xs font-semibold text-white hover:bg-[#5B3D55] disabled:opacity-50">
              Assign vendor
            </button>
            <label className="text-[11px] text-[#756872] sm:col-span-2">
              Expected arrival (optional)
              <input type="datetime-local" value={expectedArrival} onChange={(event) => setExpectedArrival(event.target.value)} className="mt-1 block w-full rounded-lg border border-[#E8DCD0] bg-white px-3 py-2 text-xs text-[#493044]" />
            </label>
          </form>
          {vendors.length ? (
            <div className="max-h-[340px] divide-y divide-[#F0E8E2] overflow-y-auto">
              {vendors.map((assignment) => (
                <article key={assignment.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#493044]">{assignment.vendor_name}</h3>
                    <p className="mt-1 text-xs text-[#837780]">
                      {assignment.vendor_category} · {assignment.event_name || 'Wedding-wide'}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#9A7E50]">
                      <Clock3 className="h-3 w-3" />
                      {assignment.actual_arrival ? `Checked in ${formatTime(assignment.actual_arrival)}` : formatDate(assignment.expected_arrival)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill tone={statusTone(assignment.status)}>{assignment.status}</StatusPill>
                    {assignment.status !== 'checked_in' && (
                      <button disabled={saving} onClick={() => void perform(
                        () => commandCentreApi.updateVendor(weddingId, assignment.id, 'checked_in' satisfies VendorStatus),
                        `${assignment.vendor_name} checked in.`,
                      )} className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50">
                        Check in
                      </button>
                    )}
                    {assignment.status !== 'delayed' && assignment.status !== 'checked_in' && (
                      <button disabled={saving} onClick={() => void perform(
                        () => commandCentreApi.updateVendor(weddingId, assignment.id, 'delayed'),
                        `${assignment.vendor_name} marked delayed.`,
                      )} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">
                        Flag delay
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState message={availableVendors.length ? 'No vendors assigned yet. Choose a saved vendor above.' : 'No unassigned vendor records are available. Add vendors in Vendor Intelligence first.'} />
          )}
        </section>
      </div>

      <p className="flex items-center justify-center gap-2 pb-2 text-[11px] text-[#8A7B84]">
        <Radio className="h-3.5 w-3.5 text-[#B99A65]" />
        Dashboard refreshes every 30 seconds; changes are saved to the backend database.
      </p>
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, detail, alert = false }: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  detail: string;
  alert?: boolean;
}) {
  return (
    <div className={`${cardClass} p-5 transition hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#837780]">{label}</p>
          <p className={`mt-2 font-display text-3xl font-semibold ${alert ? 'text-rose-700' : 'text-[#493044]'}`}>{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${alert ? 'bg-rose-50 text-rose-600' : 'bg-[#F7F1E8] text-[#9A7E50]'}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs text-[#8A7B84]">{detail}</p>
    </div>
  );
}

function SectionHeading({ icon: Icon, title, subtitle }: {
  icon: typeof CalendarDays;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#F0E8E2] px-5 py-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F1E8] text-[#9A7E50]">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold text-[#493044]">{title}</h2>
        <p className="mt-0.5 text-xs text-[#837780]">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyState({ message, success = false }: { message: string; success?: boolean }) {
  return (
    <div className="px-5 py-10 text-center">
      {success
        ? <CheckCircle2 className="mx-auto mb-2 h-7 w-7 text-emerald-500" />
        : <Clock3 className="mx-auto mb-2 h-7 w-7 text-[#B99A65]" />}
      <p className="text-sm text-[#756872]">{message}</p>
    </div>
  );
}
