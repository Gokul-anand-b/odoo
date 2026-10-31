import {
  DashboardOverviewStats,
  WeddingEvent,
  TaskItem,
  VendorTrackingItem,
  DelayDetectionItem,
  DependencyImpactItem,
  AlertItem,
  RealtimeFeedUpdate,
} from '../types/commandCenter.types';
import {
  INITIAL_OVERVIEW_STATS,
  INITIAL_WEDDING_EVENTS,
  INITIAL_TASK_ITEMS,
  INITIAL_VENDORS_TRACKING,
  INITIAL_DELAY_DETECTIONS,
  INITIAL_DEPENDENCY_IMPACTS,
  INITIAL_ALERTS,
} from '../mock/commandCenterMockData';

// ─────────────────────────────────────────────────────────────────────────────
//  API Client  (Django DRF → http://localhost:8000/api/command-centre/)
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api') +
  '/command-centre';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Shape adaptors  (snake_case API  →  camelCase frontend types)
// ─────────────────────────────────────────────────────────────────────────────

function adaptEvent(raw: Record<string, unknown>): WeddingEvent {
  return {
    id: raw.id as string,
    name: raw.name as string,
    ceremonyType: raw.ceremony_type as WeddingEvent['ceremonyType'],
    venueLocation: raw.venue_location as string,
    scheduledStartTime: raw.scheduled_start_time as string,
    scheduledEndTime: raw.scheduled_end_time as string,
    actualStartTime: (raw.actual_start_time as string) || undefined,
    actualEndTime: (raw.actual_end_time as string) || undefined,
    status: raw.status as WeddingEvent['status'],
    delayMinutes: raw.delay_minutes as number,
    guestCount: raw.guest_count as number,
    leadCoordinator: raw.lead_coordinator as string,
    keyVendors: (raw.key_vendors as string[]) ?? [],
    notes: (raw.notes as string) || undefined,
  };
}

function adaptTask(raw: Record<string, unknown>): TaskItem {
  return {
    id: raw.id as string,
    eventId: (raw.event as string) ?? '',
    eventName: (raw.event_name as string) ?? '',
    title: raw.title as string,
    category: raw.category as TaskItem['category'],
    assignedTo: raw.assigned_to as string,
    assignedRole: (raw.assigned_role as string) ?? '',
    scheduledStart: raw.scheduled_start as string,
    scheduledEnd: raw.scheduled_end as string,
    progressPercent: raw.progress_percent as number,
    status: raw.status as TaskItem['status'],
    priority: raw.priority as TaskItem['priority'],
    delayMinutes: raw.delay_minutes as number,
    dependentTaskIds: (raw.dependent_task_ids as string[]) ?? [],
  };
}

function adaptVendor(raw: Record<string, unknown>): VendorTrackingItem {
  return {
    id: raw.id as string,
    vendorName: raw.vendor_name as string,
    serviceCategory: raw.service_category as string,
    contactPerson: raw.contact_person as string,
    phone: (raw.phone as string) ?? '',
    assignedEvent: (raw.assigned_event as string) ?? '',
    expectedArrivalTime: raw.expected_arrival_time as string,
    actualArrivalTime: (raw.actual_arrival_time as string) || undefined,
    checkInStatus: raw.check_in_status as VendorTrackingItem['checkInStatus'],
    gateLocation: (raw.gate_location as string) ?? '',
    pocCoordinator: (raw.poc_coordinator as string) ?? '',
    delayMinutes: raw.delay_minutes as number,
    equipmentStatus: (raw.equipment_status as VendorTrackingItem['equipmentStatus']) || undefined,
  };
}

function adaptDelay(raw: Record<string, unknown>): DelayDetectionItem {
  return {
    id: raw.id as string,
    sourceType: raw.source_type as DelayDetectionItem['sourceType'],
    entityName: raw.entity_name as string,
    delayMinutes: raw.delay_minutes as number,
    severity: raw.severity as DelayDetectionItem['severity'],
    rootCause: raw.root_cause as string,
    detectedAt: raw.detected_at as string,
    impactSummary: raw.impact_summary as string,
    cascadingRiskLevel: raw.cascading_risk_level as DelayDetectionItem['cascadingRiskLevel'],
    status: raw.status as DelayDetectionItem['status'],
  };
}

function adaptDependency(raw: Record<string, unknown>): DependencyImpactItem {
  return {
    id: raw.id as string,
    bottleneckId: raw.bottleneck_id as string,
    bottleneckName: raw.bottleneck_name as string,
    bottleneckType: raw.bottleneck_type as DependencyImpactItem['bottleneckType'],
    affectedActivity: raw.affected_activity as string,
    scheduledTime: raw.scheduled_time as string,
    projectedSlipMinutes: raw.projected_slip_minutes as number,
    cascadingRisk: raw.cascading_risk as DependencyImpactItem['cascadingRisk'],
    suggestedAction: raw.suggested_action as string,
    status: raw.status as DependencyImpactItem['status'],
  };
}

function adaptAlert(raw: Record<string, unknown>): AlertItem {
  return {
    id: raw.id as string,
    title: raw.title as string,
    description: raw.description as string,
    severity: raw.severity as AlertItem['severity'],
    category: raw.category as AlertItem['category'],
    timestamp: raw.timestamp as string,
    acknowledged: raw.acknowledged as boolean,
    acknowledgedBy: (raw.acknowledged_by as string) || undefined,
    actionRequired: raw.action_required as boolean,
    actionLabel: (raw.action_label as string) || undefined,
  };
}

function adaptStats(raw: Record<string, unknown>): DashboardOverviewStats {
  return {
    totalEvents: raw.total_events as number,
    completedEvents: raw.completed_events as number,
    ongoingEvents: raw.ongoing_events as number,
    upcomingEvents: raw.upcoming_events as number,
    delayedEvents: raw.delayed_events as number,
    activeAlertsCount: raw.active_alerts_count as number,
    onTimeRatePercent: raw.on_time_rate_percent as number,
    activeVendorsOnSite: raw.active_vendors_on_site as number,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Service Class
// ─────────────────────────────────────────────────────────────────────────────

class CommandCenterService {
  // Local state cache — populated from API on first load, mutated optimistically
  private stats: DashboardOverviewStats = { ...INITIAL_OVERVIEW_STATS };
  private events: WeddingEvent[] = [...INITIAL_WEDDING_EVENTS];
  private tasks: TaskItem[] = [...INITIAL_TASK_ITEMS];
  private vendors: VendorTrackingItem[] = [...INITIAL_VENDORS_TRACKING];
  private delays: DelayDetectionItem[] = [...INITIAL_DELAY_DETECTIONS];
  private dependencies: DependencyImpactItem[] = [...INITIAL_DEPENDENCY_IMPACTS];
  private alerts: AlertItem[] = [...INITIAL_ALERTS];
  private loaded = false;

  // ── Synchronous getters (use cached state, fallback to mock until first load) ──

  public getOverviewStats(): DashboardOverviewStats {
    return { ...this.stats };
  }
  public getEvents(): WeddingEvent[] { return [...this.events]; }
  public getTasks(): TaskItem[] { return [...this.tasks]; }
  public getVendors(): VendorTrackingItem[] { return [...this.vendors]; }
  public getDelays(): DelayDetectionItem[] { return [...this.delays]; }
  public getDependencies(): DependencyImpactItem[] { return [...this.dependencies]; }
  public getAlerts(): AlertItem[] { return [...this.alerts]; }

  // ── Async loaders — fetch from Django API ──────────────────────────────────

  public async loadAll(): Promise<void> {
    try {
      const [rawStats, rawEvents, rawTasks, rawVendors, rawDelays, rawDeps, rawAlerts] =
        await Promise.all([
          apiFetch<Record<string, unknown>>('/overview/'),
          apiFetch<Record<string, unknown>[]>('/events/'),
          apiFetch<Record<string, unknown>[]>('/tasks/'),
          apiFetch<Record<string, unknown>[]>('/vendors/'),
          apiFetch<Record<string, unknown>[]>('/delays/'),
          apiFetch<Record<string, unknown>[]>('/dependencies/'),
          apiFetch<Record<string, unknown>[]>('/alerts/'),
        ]);

      this.stats = adaptStats(rawStats);
      this.events = rawEvents.map(adaptEvent);
      this.tasks = rawTasks.map(adaptTask);
      this.vendors = rawVendors.map(adaptVendor);
      this.delays = rawDelays.map(adaptDelay);
      this.dependencies = rawDeps.map(adaptDependency);
      this.alerts = rawAlerts.map(adaptAlert);
      this.loaded = true;
    } catch (err) {
      // Silently fall back to mock data — no crash in dev
      console.warn('[CommandCentre] API unreachable, using mock data:', err);
    }
  }

  public async refreshStats(): Promise<void> {
    try {
      const raw = await apiFetch<Record<string, unknown>>('/overview/');
      this.stats = adaptStats(raw);
    } catch {/* keep stale */}
  }

  // ── Action methods — optimistic update + API call ─────────────────────────

  public acknowledgeAlert(alertId: string, coordinator = 'Operations Lead'): AlertItem[] {
    // Optimistic
    this.alerts = this.alerts.map(a =>
      a.id === alertId ? { ...a, acknowledged: true, acknowledgedBy: coordinator } : a
    );
    // Async API
    apiFetch(`/alerts/${alertId}/acknowledge/`, {
      method: 'POST',
      body: JSON.stringify({ acknowledged_by: coordinator }),
    }).catch(console.warn);
    return [...this.alerts];
  }

  public updateTaskStatus(taskId: string, newStatus: TaskItem['status'], progress: number): TaskItem[] {
    this.tasks = this.tasks.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus, progressPercent: progress, delayMinutes: newStatus === 'Completed' ? 0 : t.delayMinutes }
        : t
    );
    apiFetch(`/tasks/${taskId}/update-progress/`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus, progress_percent: progress }),
    }).catch(console.warn);
    return [...this.tasks];
  }

  public checkInVendor(vendorId: string, gateLocation?: string): VendorTrackingItem[] {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.vendors = this.vendors.map(v =>
      v.id === vendorId
        ? { ...v, checkInStatus: 'Checked-In', actualArrivalTime: nowTime, equipmentStatus: 'Clear', delayMinutes: 0, gateLocation: gateLocation ?? v.gateLocation }
        : v
    );
    apiFetch(`/vendors/${vendorId}/check-in/`, {
      method: 'POST',
      body: JSON.stringify({ gate_location: gateLocation ?? '' }),
    }).catch(console.warn);
    return [...this.vendors];
  }

  public resolveDelay(delayId: string): DelayDetectionItem[] {
    this.delays = this.delays.map(d =>
      d.id === delayId ? { ...d, status: 'Resolved' } : d
    );
    apiFetch(`/delays/${delayId}/resolve/`, { method: 'POST' }).catch(console.warn);
    return [...this.delays];
  }

  public mitigateDependency(dependencyId: string): DependencyImpactItem[] {
    this.dependencies = this.dependencies.map(dep =>
      dep.id === dependencyId ? { ...dep, status: 'Mitigated' } : dep
    );
    apiFetch(`/dependencies/${dependencyId}/mitigate/`, { method: 'POST' }).catch(console.warn);
    return [...this.dependencies];
  }

  // ── Realtime telemetry simulator ──────────────────────────────────────────

  public subscribeToRealtimeTelemetry(
    onMessage: (update: RealtimeFeedUpdate) => void
  ): () => void {
    const mockUpdates: RealtimeFeedUpdate[] = [
      {
        type: 'VENDOR_CHECKIN',
        timestamp: 'Just now',
        message: 'Royal Fireworks & SFX truck cleared Gate 3 security checkpoint.',
        payload: { vendorId: 'vnd-05', status: 'Checked-In' },
      },
      {
        type: 'TASK_PROGRESS',
        timestamp: 'Just now',
        message: 'Mandap Lotus Garland rigging progress updated: 92% completed.',
        payload: { taskId: 'tsk-104', progress: 92 },
      },
      {
        type: 'EVENT_UPDATE',
        timestamp: 'Just now',
        message: 'Baraat procession reached Badi Pol inner courtyard.',
        payload: { eventId: 'evt-03', location: 'Badi Pol' },
      },
      {
        type: 'NEW_ALERT',
        timestamp: 'Just now',
        message: 'VIP Motorcade approaching Lake Gate; parking bay cleared.',
        payload: { severity: 'Low', title: 'VIP Motorcade Clearance' },
      },
    ];

    let index = 0;
    const intervalId = setInterval(() => {
      onMessage(mockUpdates[index % mockUpdates.length]);
      index++;
    }, 18000);

    return () => clearInterval(intervalId);
  }
}

export const commandCenterService = new CommandCenterService();
