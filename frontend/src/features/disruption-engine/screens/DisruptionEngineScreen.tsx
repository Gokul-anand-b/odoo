'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Shield,
  Sparkles,
} from 'lucide-react';
import DependencyPanel from '../components/DependencyPanel';
import EventRulesPanel from '../components/EventRulesPanel';
import IncidentComposer from '../components/IncidentComposer';
import RecoveryPlanCard from '../components/RecoveryPlanCard';
import ScheduleComparison from '../components/ScheduleComparison';
import { disruptionApi } from '../services/disruptionService';
import type {
  EventDependency,
  Incident,
  IncidentHistoryEntry,
  IncidentInput,
  RecoveryPlan,
  Wedding,
  WeddingEvent,
} from '../types/disruption.types';

type ActivityKey = 'loading' | 'create' | 'analyze' | 'approve' | 'resolve' | 'dependency';

function niceDate(value?: string) {
  if (!value) return 'Dates to be confirmed';
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function titleCase(value?: string) {
  return (value || 'open').replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusColor(status?: string) {
  const value = (status || '').toLowerCase();
  if (value.includes('resolv') || value.includes('complet')) return { background: 'rgba(57,119,82,0.10)', color: '#397752' };
  if (value.includes('approv') || value.includes('progress')) return { background: 'rgba(185,154,101,0.14)', color: 'var(--gold-muted)' };
  return { background: 'rgba(160,120,132,0.10)', color: 'var(--rose-deep)' };
}

function eventName(events: WeddingEvent[], id: string) {
  return events.find((event) => event.id === id)?.name || 'Selected event';
}

function readableHistory(entry: IncidentHistoryEntry) {
  return entry.message || (entry.action ? titleCase(entry.action) : entry.status ? `Status: ${titleCase(entry.status)}` : 'Incident updated');
}

export default function DisruptionEngineScreen() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [weddingsLoading, setWeddingsLoading] = useState(true);
  const [selectedWeddingId, setSelectedWeddingId] = useState('');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [dependencies, setDependencies] = useState<EventDependency[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState('');
  const [analysis, setAnalysis] = useState<{ incident: Incident; plans: RecoveryPlan[] } | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [history, setHistory] = useState<IncidentHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [busy, setBusy] = useState<ActivityKey | null>(null);
  const [busyEventId, setBusyEventId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const selectedWedding = useMemo(
    () => weddings.find((wedding) => wedding.id === selectedWeddingId) || null,
    [weddings, selectedWeddingId],
  );
  const selectedIncident = incidents.find((incident) => incident.id === selectedIncidentId) || null;
  const selectedPlan = analysis?.plans.find((plan) => plan.id === selectedPlanId) || analysis?.plans[0] || null;

  const refreshIncidents = useCallback(async (weddingId: string) => {
    const records = await disruptionApi.getIncidents(weddingId);
    setIncidents(records);
    return records;
  }, []);

  const refreshHistory = useCallback(async (incidentId: string) => {
    setHistoryLoading(true);
    try {
      setHistory(await disruptionApi.getHistory(incidentId));
    } catch (reason) {
      setHistory([]);
      setError(reason instanceof Error ? reason.message : 'Could not load incident history.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const refreshWeddings = useCallback(async () => {
    setWeddingsLoading(true);
    setError('');
    try {
      const items = await disruptionApi.getWeddings();
      setWeddings(items);
      setSelectedWeddingId((current) =>
        items.some((wedding) => wedding.id === current) ? current : items[0]?.id || '',
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not load weddings.');
    } finally {
      setWeddingsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refreshWeddings);
  }, [refreshWeddings]);

  useEffect(() => {
    if (!selectedWeddingId) return;
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return null;
      setBusy('loading');
      setError('');
      setIncidents([]);
      setDependencies([]);
      setSelectedIncidentId('');
      setAnalysis(null);
      setHistory([]);
      return Promise.allSettled([
        disruptionApi.getIncidents(selectedWeddingId),
        disruptionApi.getDependencies(selectedWeddingId),
      ]);
    }).then((results) => {
      if (!results || !active) return;
      const [incidentResult, dependencyResult] = results;
      if (incidentResult.status === 'fulfilled') setIncidents(incidentResult.value);
      else setError(incidentResult.reason instanceof Error ? incidentResult.reason.message : 'Could not load incidents.');
      if (dependencyResult.status === 'fulfilled') setDependencies(dependencyResult.value);
      else if (incidentResult.status === 'fulfilled') setError(dependencyResult.reason instanceof Error ? dependencyResult.reason.message : 'Could not load event dependencies.');
      setSelectedIncidentId(incidentResult.status === 'fulfilled' ? incidentResult.value[0]?.id || '' : '');
    }).finally(() => {
      if (active) setBusy((current) => current === 'loading' ? null : current);
    });
    return () => { active = false; };
  }, [selectedWeddingId]);

  useEffect(() => {
    if (!selectedIncidentId) return;
    const timer = window.setTimeout(() => {
      void refreshHistory(selectedIncidentId);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [selectedIncidentId, refreshHistory]);

  const createIncident = async (input: IncidentInput): Promise<boolean> => {
    if (!selectedWeddingId) return false;
    setError('');
    setNotice('');
    setBusy('create');
    try {
      const created = await disruptionApi.createIncident(selectedWeddingId, input);
      const updatedIncidents = await refreshIncidents(selectedWeddingId);
      const incidentId = created.id || updatedIncidents[0]?.id || '';
      setSelectedIncidentId(incidentId);
      setAnalysis(null);
      setSelectedPlanId('');
      setNotice('Incident logged. Review it below and build recovery options when ready.');
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not create the incident.');
      return false;
    } finally {
      setBusy(null);
    }
  };

  const analyzeIncident = async () => {
    if (!selectedIncidentId) return;
    setError('');
    setNotice('');
    setBusy('analyze');
    try {
      const result = await disruptionApi.analyzeIncident(selectedIncidentId);
      setAnalysis(result);
      setSelectedPlanId(result.plans[0]?.id || '');
      setNotice(result.plans.length ? 'Recovery options are ready to review.' : 'Analysis completed, but no recovery options were returned.');
      await refreshHistory(selectedIncidentId);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not prepare recovery options.');
    } finally {
      setBusy(null);
    }
  };

  const approvePlan = async () => {
    if (!selectedIncidentId || !selectedPlan) return;
    setError('');
    setNotice('');
    setBusy('approve');
    try {
      await disruptionApi.approvePlan(selectedIncidentId, selectedPlan.id);
      await refreshIncidents(selectedWeddingId);
      await refreshHistory(selectedIncidentId);
      setNotice('Recovery option approved and recorded.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not approve this recovery option.');
    } finally {
      setBusy(null);
    }
  };

  const resolveIncident = async () => {
    if (!selectedIncidentId) return;
    setError('');
    setNotice('');
    setBusy('resolve');
    try {
      await disruptionApi.resolveIncident(selectedIncidentId);
      await refreshIncidents(selectedWeddingId);
      await refreshHistory(selectedIncidentId);
      setNotice('Incident marked as resolved.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not resolve this incident.');
    } finally {
      setBusy(null);
    }
  };

  const saveEventRule = async (event: WeddingEvent, fixed: boolean, moveCost: number): Promise<boolean> => {
    if (!selectedWeddingId) return false;
    setBusyEventId(event.id);
    setError('');
    setNotice('');
    try {
      const updated = await disruptionApi.updateEventRule(selectedWeddingId, event.id, {
        is_fixed_time: fixed,
        recovery_move_cost: moveCost,
      });
      setWeddings((current) => current.map((wedding) => wedding.id !== selectedWeddingId ? wedding : ({
        ...wedding,
        events: wedding.events.map((item) => item.id === event.id ? { ...item, ...updated, is_fixed_time: fixed, recovery_move_cost: moveCost } : item),
      })));
      setNotice(`Recovery guardrails saved for ${event.name}.`);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save event guardrails.');
      return false;
    } finally {
      setBusyEventId(null);
    }
  };

  const addDependency = async (dependency: Omit<EventDependency, 'id'>) => {
    if (!selectedWeddingId) return;
    setBusy('dependency');
    setError('');
    setNotice('');
    try {
      await disruptionApi.addDependency(selectedWeddingId, dependency);
      setDependencies(await disruptionApi.getDependencies(selectedWeddingId));
      setNotice('Event dependency added to the wedding schedule.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not add that dependency.');
    } finally {
      setBusy(null);
    }
  };

  const selectIncident = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setAnalysis(null);
    setSelectedPlanId('');
    setNotice('');
  };

  const openCount = incidents.filter((incident) => !(incident.status || '').toLowerCase().includes('resolv')).length;

  return (
    <div className="space-y-6 pb-3">
      <section className="relative overflow-hidden rounded-[28px] p-5 sm:p-7 lg:p-8" style={{ background: 'linear-gradient(112deg, #342230 0%, #493044 58%, #684859 100%)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,186,138,0.23), transparent 68%)' }} />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ background: 'rgba(212,186,138,0.14)', color: 'var(--gold-light)', border: '1px solid rgba(212,186,138,0.25)' }}>
              <Shield className="h-3.5 w-3.5" /> Core Feature 4 <span className="opacity-60">/</span> Recovery intelligence
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">When plans change,<br className="hidden sm:block" /> clarity stays.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: '#E4D9DE' }}>
              Capture a disruption, compare practical schedule recovery options, and keep every decision visible to your team.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(240,232,238,0.66)' }}><Sparkles className="h-3 w-3" /> Decision support from your event schedule and guardrails.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <div className="min-w-[128px] rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#D4BA8A' }}>Open incidents</p>
              <p className="mt-1 font-display text-3xl font-semibold text-white">{incidentsLoading(busy, weddingsLoading) ? '—' : openCount}</p>
            </div>
            <div className="min-w-[128px] rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: '#D4BA8A' }}>Guardrails</p>
              <p className="mt-1 font-display text-3xl font-semibold text-white">{selectedWedding?.events.length || 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--ivory)', color: 'var(--gold-muted)' }}><CalendarDays className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Working wedding</p><p className="text-sm font-semibold" style={{ color: 'var(--text-ink)' }}>{selectedWedding ? `${selectedWedding.couple_names} · ${niceDate(selectedWedding.start_date)}` : 'Choose a wedding to get started'}</p></div>
        </div>
        <label className="relative flex w-full items-center sm:max-w-sm">
          <span className="sr-only">Select wedding</span>
          <select value={selectedWeddingId} disabled={weddingsLoading || weddings.length === 0} onChange={(e) => setSelectedWeddingId(e.target.value)} className="w-full appearance-none rounded-xl py-3 pl-3.5 pr-10 text-sm font-medium outline-none" style={{ background: 'var(--ivory)', border: '1px solid var(--border)', color: 'var(--text-ink)' }}>
            {weddings.length === 0 && <option value="">{weddingsLoading ? 'Loading weddings…' : 'No weddings available'}</option>}
            {weddings.map((wedding) => <option key={wedding.id} value={wedding.id}>{wedding.title || wedding.couple_names}</option>)}
          </select>
          {weddingsLoading ? <LoaderCircle className="pointer-events-none absolute right-3 h-4 w-4 animate-spin" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4" style={{ color: 'var(--text-muted)' }} />}
        </label>
      </section>

      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl px-4 py-3.5" style={{ background: '#fff6f4', border: '1px solid rgba(160,120,132,0.28)', color: 'var(--rose-deep)' }}><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-sm">{error}</p></div>}
      {notice && !error && <div role="status" className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: 'rgba(57,119,82,0.08)', border: '1px solid rgba(57,119,82,0.18)', color: '#397752' }}><CheckCircle2 className="h-4 w-4 shrink-0" /><p className="text-sm">{notice}</p></div>}

      {weddingsLoading && !selectedWedding ? (
        <div className="flex min-h-60 items-center justify-center rounded-3xl" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)' }}><LoaderCircle className="h-6 w-6 animate-spin" style={{ color: 'var(--gold)' }} /><span className="ml-3 text-sm" style={{ color: 'var(--text-muted)' }}>Loading wedding schedule…</span></div>
      ) : !selectedWedding ? (
        <div className="rounded-3xl px-6 py-12 text-center" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)' }}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--ivory)', color: 'var(--gold-muted)' }}><CalendarDays className="h-6 w-6" /></div>
          <h2 className="mt-4 font-display text-2xl font-semibold" style={{ color: 'var(--text-ink)' }}>Your recovery workspace is ready</h2>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: 'var(--text-muted)' }}>Create a wedding with a scheduled set of events to configure recovery guardrails and respond to disruptions here.</p>
          <button type="button" onClick={() => void refreshWeddings()} disabled={weddingsLoading} className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-wait disabled:opacity-70" style={{ background: 'var(--plum)', color: 'white' }}><RefreshCw className={`h-4 w-4 ${weddingsLoading ? 'animate-spin' : ''}`} /> {weddingsLoading ? 'Refreshing…' : 'Refresh weddings'}</button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
            <IncidentComposer events={selectedWedding.events || []} busy={busy === 'create'} onCreate={createIncident} />
            <div className="space-y-4">
              <EventRulesPanel events={selectedWedding.events || []} busyEventId={busyEventId} onSave={saveEventRule} />
              <DependencyPanel events={selectedWedding.events || []} dependencies={dependencies} busy={busy === 'dependency'} onAdd={addDependency} />
            </div>
          </div>

          <section className="overflow-hidden rounded-3xl" style={{ background: 'var(--warm-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6" style={{ borderColor: 'var(--border-soft)' }}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ background: 'rgba(185,154,101,0.12)', color: 'var(--gold-muted)' }}><Activity className="h-5 w-5" /></div>
                <div><h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-ink)' }}>Incident desk</h2><p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>Track what changed and decide on an accountable next step.</p></div>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: 'var(--ivory)', color: 'var(--text-muted)' }}><CircleDot className="h-3 w-3" /> {incidents.length} logged</span>
            </div>

            {busy === 'loading' ? <div className="flex min-h-32 items-center justify-center"><LoaderCircle className="h-5 w-5 animate-spin" style={{ color: 'var(--gold)' }} /><span className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>Loading incident desk…</span></div> : incidents.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'var(--ivory)', color: 'var(--gold-muted)' }}><AlertTriangle className="h-5 w-5" /></div>
                <h3 className="mt-3 font-display text-lg font-semibold" style={{ color: 'var(--text-ink)' }}>No disruptions logged</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>When the unexpected happens, add an incident above to explore schedule recovery options.</p>
              </div>
            ) : (
              <div className="grid min-w-0 lg:grid-cols-[300px_minmax(0,1fr)]">
                <div className="border-b p-3 lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--border-soft)' }}>
                  <div className="mb-2 flex items-center justify-between px-2 py-1"><p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--text-muted)' }}>Recent incidents</p><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{incidents.length}</span></div>
                  <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                    {incidents.map((incident) => {
                      const status = statusColor(incident.status);
                      const active = selectedIncidentId === incident.id;
                      return <button key={incident.id} type="button" onClick={() => selectIncident(incident.id)} className="min-w-[245px] rounded-2xl p-3 text-left transition lg:min-w-0" style={{ background: active ? 'rgba(185,154,101,0.11)' : 'transparent', border: `1px solid ${active ? 'rgba(185,154,101,0.32)' : 'transparent'}` }}>
                        <div className="flex items-start justify-between gap-2"><p className="line-clamp-2 text-xs font-semibold leading-relaxed" style={{ color: 'var(--text-ink)' }}>{incident.title}</p><ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} /></div>
                        <p className="mt-1.5 truncate text-[10px]" style={{ color: 'var(--text-muted)' }}>{eventName(selectedWedding.events || [], incident.affected_event)}</p>
                        <span className="mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide" style={status}>{titleCase(incident.status)}</span>
                      </button>;
                    })}
                  </div>
                </div>

                <div className="min-w-0 p-4 sm:p-6">
                  {selectedIncident ? (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2"><span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ background: 'rgba(160,120,132,0.10)', color: 'var(--rose-deep)' }}>{titleCase(selectedIncident.incident_type)}</span><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{selectedIncident.delay_minutes} minute delay</span></div>
                          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight" style={{ color: 'var(--text-ink)' }}>{selectedIncident.title}</h3>
                          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>Affects <strong style={{ color: 'var(--text-body)' }}>{eventName(selectedWedding.events || [], selectedIncident.affected_event)}</strong></p>
                          {selectedIncident.description && <p className="mt-3 max-w-3xl text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>{selectedIncident.description}</p>}
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button type="button" disabled={busy !== null} onClick={analyzeIncident} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-semibold disabled:opacity-55" style={{ background: 'var(--plum)', color: 'white' }}>
                            {busy === 'analyze' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {analysis ? 'Refresh options' : 'Build recovery options'}
                          </button>
                          {selectedIncident.status?.toLowerCase().includes('approv') && !selectedIncident.status.toLowerCase().includes('resolv') && <button type="button" disabled={busy !== null} onClick={resolveIncident} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3.5 text-xs font-semibold disabled:opacity-55" style={{ background: 'rgba(57,119,82,0.10)', color: '#397752' }}>{busy === 'resolve' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Resolve</button>}
                        </div>
                      </div>

                      {analysis && (
                        <div className="mt-6">
                          <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h4 className="font-display text-lg font-semibold" style={{ color: 'var(--text-ink)' }}>Recovery options</h4><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Compare feasibility, schedule impact, and estimated additional cost.</p></div><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{analysis.plans.length} {analysis.plans.length === 1 ? 'option' : 'options'}</span></div>
                          {analysis.plans.length === 0 ? <div className="rounded-2xl px-4 py-6 text-center text-sm" style={{ background: 'var(--ivory)', color: 'var(--text-muted)' }}>No recovery options were returned for this incident. Review the event guardrails or dependencies and try again.</div> : (
                            <>
                              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                                {analysis.plans.map((plan) => <RecoveryPlanCard key={plan.id} plan={plan} selected={selectedPlan?.id === plan.id} onSelect={() => setSelectedPlanId(plan.id)} />)}
                              </div>
                              {selectedPlan && <>
                                <div className="mt-4"><ScheduleComparison plan={selectedPlan} /></div>
                                <div className="mt-3 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: 'var(--ivory)', border: '1px solid var(--border-soft)' }}>
                                  <div><p className="text-sm font-semibold" style={{ color: 'var(--text-ink)' }}>{selectedPlan.feasible && selectedPlan.validation.valid ? 'Ready for planner approval' : 'This option cannot be approved yet'}</p><p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{selectedPlan.feasible && selectedPlan.validation.valid ? 'Approval records the selected recovery plan for this incident.' : 'Choose a feasible option that passes its schedule validation.'}</p></div>
                                  <button type="button" disabled={!selectedPlan.feasible || !selectedPlan.validation.valid || busy !== null} onClick={approvePlan} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--gold-muted), var(--gold))' }}>
                                    {busy === 'approve' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Approve selected option
                                  </button>
                                </div>
                              </>}
                            </>
                          )}
                        </div>
                      )}

                      <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--border-soft)' }}>
                        <div className="mb-3 flex items-center justify-between gap-3"><div><h4 className="font-display text-lg font-semibold" style={{ color: 'var(--text-ink)' }}>Recovery history</h4><p className="text-xs" style={{ color: 'var(--text-muted)' }}>An audit trail of decisions for this incident.</p></div>{historyLoading && <LoaderCircle className="h-4 w-4 animate-spin" style={{ color: 'var(--gold)' }} />}</div>
                        {history.length === 0 && !historyLoading ? <p className="rounded-xl px-3 py-3 text-xs" style={{ background: 'var(--ivory)', color: 'var(--text-muted)' }}>No history is available yet. Analysis, approval, and resolution updates will appear here.</p> : (
                          <div className="space-y-2">
                            {history.map((entry, index) => <div key={entry.id || `${entry.timestamp || entry.created_at || 'history'}-${index}`} className="flex items-start gap-3 rounded-xl px-3 py-2.5" style={{ background: 'var(--ivory)' }}>
                              <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--warm-white)', color: 'var(--gold-muted)' }}><Clock3 className="h-3 w-3" /></div>
                              <div className="min-w-0 flex-1"><p className="text-xs font-medium" style={{ color: 'var(--text-body)' }}>{readableHistory(entry)}</p><p className="mt-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>{entry.timestamp || entry.created_at ? new Date(entry.timestamp || entry.created_at || '').toLocaleString('en-IN') : 'Recorded in incident history'}</p></div>
                              {entry.status && <span className="rounded-full px-2 py-1 text-[9px] font-bold" style={statusColor(entry.status)}>{titleCase(entry.status)}</span>}
                            </div>)}
                          </div>
                        )}
                      </div>
                    </>
                  ) : <div className="flex min-h-56 flex-col items-center justify-center text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--ivory)', color: 'var(--gold-muted)' }}><AlertTriangle className="h-5 w-5" /></div><h3 className="mt-3 font-display text-lg font-semibold" style={{ color: 'var(--text-ink)' }}>Select an incident</h3><p className="mt-1 max-w-sm text-xs" style={{ color: 'var(--text-muted)' }}>Choose an incident from the list to review its details, build options, or inspect its history.</p></div>}
                </div>
              </div>
            )}
          </section>
          <div className="flex items-center justify-center gap-2 py-1 text-[10px]" style={{ color: 'var(--text-muted)' }}><Shield className="h-3 w-3" /> Recovery options support planner decisions; review each schedule change before approval.</div>
        </>
      )}
    </div>
  );
}

function incidentsLoading(busy: ActivityKey | null, weddingsLoading: boolean) {
  return weddingsLoading || busy === 'loading';
}
