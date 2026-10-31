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

// ─────────────────────────────────────────────────────────────────────────────
//  Zero/Empty Initial State (No hardcoded data)
// ─────────────────────────────────────────────────────────────────────────────

export const EMPTY_OVERVIEW_STATS: DashboardOverviewStats = {
  totalEvents: 0,
  completedEvents: 0,
  ongoingEvents: 0,
  upcomingEvents: 0,
  delayedEvents: 0,
  activeAlertsCount: 0,
  onTimeRatePercent: 100,
  activeVendorsOnSite: 0,
};

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
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API ${res.status} (${path}): ${errorBody || res.statusText}`);
  }
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
    delayMinutes: Number(raw.delay_minutes ?? 0),
    guestCount: Number(raw.guest_count ?? 0),
    leadCoordinator: (raw.lead_coordinator as string) ?? '',
    keyVendors: Array.isArray(raw.key_vendors) ? (raw.key_vendors as string[]) : [],
    notes: (raw.notes as string) || undefined,
    weddingName: (raw.wedding_name as string) || undefined,
  };
}

function adaptTask(raw: Record<string, unknown>): TaskItem {
  return {
    id: raw.id as string,
    eventId: (raw.event as string) ?? '',
    eventName: (raw.event_name as string) ?? '',
    title: raw.title as string,
    category: raw.category as TaskItem['category'],
    assignedTo: (raw.assigned_to as string) ?? '',
    assignedRole: (raw.assigned_role as string) ?? '',
    scheduledStart: raw.scheduled_start as string,
    scheduledEnd: raw.scheduled_end as string,
    progressPercent: Number(raw.progress_percent ?? 0),
    status: raw.status as TaskItem['status'],
    priority: raw.priority as TaskItem['priority'],
    delayMinutes: Number(raw.delay_minutes ?? 0),
    dependentTaskIds: Array.isArray(raw.dependent_task_ids)
      ? (raw.dependent_task_ids as string[])
      : [],
  };
}

function adaptVendor(raw: Record<string, unknown>): VendorTrackingItem {
  return {
    id: raw.id as string,
    vendorName: raw.vendor_name as string,
    serviceCategory: (raw.service_category as string) ?? '',
    contactPerson: (raw.contact_person as string) ?? '',
    phone: (raw.phone as string) ?? '',
    assignedEvent: (raw.assigned_event as string) ?? '',
    expectedArrivalTime: raw.expected_arrival_time as string,
    actualArrivalTime: (raw.actual_arrival_time as string) || undefined,
    checkInStatus: raw.check_in_status as VendorTrackingItem['checkInStatus'],
    gateLocation: (raw.gate_location as string) ?? '',
    pocCoordinator: (raw.poc_coordinator as string) ?? '',
    delayMinutes: Number(raw.delay_minutes ?? 0),
    equipmentStatus:
      (raw.equipment_status as VendorTrackingItem['equipmentStatus']) || undefined,
  };
}

function adaptDelay(raw: Record<string, unknown>): DelayDetectionItem {
  return {
    id: raw.id as string,
    sourceType: raw.source_type as DelayDetectionItem['sourceType'],
    entityName: raw.entity_name as string,
    delayMinutes: Number(raw.delay_minutes ?? 0),
    severity: raw.severity as DelayDetectionItem['severity'],
    rootCause: raw.root_cause as string,
    detectedAt: raw.detected_at as string,
    impactSummary: raw.impact_summary as string,
    cascadingRiskLevel:
      raw.cascading_risk_level as DelayDetectionItem['cascadingRiskLevel'],
    status: raw.status as DelayDetectionItem['status'],
  };
}

function adaptDependency(raw: Record<string, unknown>): DependencyImpactItem {
  return {
    id: raw.id as string,
    bottleneckId: raw.bottleneck_id as string,
    bottleneckName: raw.bottleneck_name as string,
    bottleneckType:
      raw.bottleneck_type as DependencyImpactItem['bottleneckType'],
    affectedActivity: raw.affected_activity as string,
    scheduledTime: raw.scheduled_time as string,
    projectedSlipMinutes: Number(raw.projected_slip_minutes ?? 0),
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
    acknowledged: Boolean(raw.acknowledged),
    acknowledgedBy: (raw.acknowledged_by as string) || undefined,
    actionRequired: Boolean(raw.action_required),
    actionLabel: (raw.action_label as string) || undefined,
  };
}

function adaptStats(raw: Record<string, unknown>): DashboardOverviewStats {
  return {
    totalEvents: Number(raw.total_events ?? 0),
    completedEvents: Number(raw.completed_events ?? 0),
    ongoingEvents: Number(raw.ongoing_events ?? 0),
    upcomingEvents: Number(raw.upcoming_events ?? 0),
    delayedEvents: Number(raw.delayed_events ?? 0),
    activeAlertsCount: Number(raw.active_alerts_count ?? 0),
    onTimeRatePercent: Number(raw.on_time_rate_percent ?? 0),
    activeVendorsOnSite: Number(raw.active_vendors_on_site ?? 0),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Service Class
// ─────────────────────────────────────────────────────────────────────────────

class CommandCenterService {
  // Live cache — strictly initialized as empty, populated ONLY from Django backend
  private stats: DashboardOverviewStats = { ...EMPTY_OVERVIEW_STATS };
  private events: WeddingEvent[] = [];
  private tasks: TaskItem[] = [];
  private vendors: VendorTrackingItem[] = [];
  private delays: DelayDetectionItem[] = [];
  private dependencies: DependencyImpactItem[] = [];
  private alerts: AlertItem[] = [];
  private loaded = false;
  private error: string | null = null;

  // ── Synchronous getters (return current live state) ──

  public getOverviewStats(): DashboardOverviewStats {
    return { ...this.stats };
  }
  public getEvents(): WeddingEvent[] { return [...this.events]; }
  public getTasks(): TaskItem[] { return [...this.tasks]; }
  public getVendors(): VendorTrackingItem[] { return [...this.vendors]; }
  public getDelays(): DelayDetectionItem[] { return [...this.delays]; }
  public getDependencies(): DependencyImpactItem[] { return [...this.dependencies]; }
  public getAlerts(): AlertItem[] { return [...this.alerts]; }
  public isLoaded(): boolean { return this.loaded; }
  public getError(): string | null { return this.error; }

  // ── Async loaders — fetch all from Django REST API ──────────────────────────

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
      this.error = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      console.error('[CommandCentre] Backend API connection error:', err);
      throw err;
    }
  }

  public async refreshStats(): Promise<DashboardOverviewStats> {
    try {
      const raw = await apiFetch<Record<string, unknown>>('/overview/');
      this.stats = adaptStats(raw);
    } catch (err) {
      console.warn('[CommandCentre] refreshStats failed:', err);
    }
    return { ...this.stats };
  }

  // ── Action methods — update Django REST API and mutate cache ──────────────

  public async acknowledgeAlert(
    alertId: string,
    coordinator = 'Operations Lead'
  ): Promise<AlertItem[]> {
    // Optimistic cache update
    this.alerts = this.alerts.map((a) =>
      a.id === alertId ? { ...a, acknowledged: true, acknowledgedBy: coordinator } : a
    );
    // Persist to Django backend
    try {
      await apiFetch(`/alerts/${alertId}/acknowledge/`, {
        method: 'POST',
        body: JSON.stringify({ acknowledged_by: coordinator }),
      });
      await this.refreshStats();
    } catch (err) {
      console.error('[CommandCentre] acknowledgeAlert failed on server:', err);
      throw err;
    }
    return [...this.alerts];
  }

  public async createAlert(alertData: {
    title: string;
    description: string;
    severity: AlertItem['severity'];
    category: AlertItem['category'];
    actionRequired?: boolean;
    actionLabel?: string;
  }): Promise<AlertItem[]> {
    const payload = {
      title: alertData.title,
      description: alertData.description,
      severity: alertData.severity,
      category: alertData.category,
      timestamp: 'Just now',
      acknowledged: false,
      action_required: alertData.actionRequired ?? false,
      action_label: alertData.actionLabel ?? '',
    };

    const created = await apiFetch<Record<string, unknown>>('/alerts/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const newAlert = adaptAlert(created);
    this.alerts = [newAlert, ...this.alerts];
    await this.refreshStats();
    return [...this.alerts];
  }

  public async updateTaskStatus(
    taskId: string,
    newStatus: TaskItem['status'],
    progress: number
  ): Promise<TaskItem[]> {
    this.tasks = this.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: newStatus,
            progressPercent: progress,
            delayMinutes: newStatus === 'Completed' ? 0 : t.delayMinutes,
          }
        : t
    );

    try {
      await apiFetch(`/tasks/${taskId}/update-progress/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, progress_percent: progress }),
      });
      await this.refreshStats();
    } catch (err) {
      console.error('[CommandCentre] updateTaskStatus failed on server:', err);
      throw err;
    }
    return [...this.tasks];
  }

  public async checkInVendor(
    vendorId: string,
    gateLocation?: string
  ): Promise<VendorTrackingItem[]> {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    this.vendors = this.vendors.map((v) =>
      v.id === vendorId
        ? {
            ...v,
            checkInStatus: 'Checked-In',
            actualArrivalTime: nowTime,
            equipmentStatus: 'Clear',
            delayMinutes: 0,
            gateLocation: gateLocation ?? v.gateLocation,
          }
        : v
    );

    try {
      await apiFetch(`/vendors/${vendorId}/check-in/`, {
        method: 'POST',
        body: JSON.stringify({ gate_location: gateLocation ?? '' }),
      });
      await this.refreshStats();
    } catch (err) {
      console.error('[CommandCentre] checkInVendor failed on server:', err);
      throw err;
    }
    return [...this.vendors];
  }

  public async resolveDelay(delayId: string): Promise<DelayDetectionItem[]> {
    this.delays = this.delays.map((d) =>
      d.id === delayId ? { ...d, status: 'Resolved' } : d
    );

    try {
      await apiFetch(`/delays/${delayId}/resolve/`, { method: 'POST' });
      await this.refreshStats();
    } catch (err) {
      console.error('[CommandCentre] resolveDelay failed on server:', err);
      throw err;
    }
    return [...this.delays];
  }

  public async mitigateDependency(
    dependencyId: string
  ): Promise<DependencyImpactItem[]> {
    this.dependencies = this.dependencies.map((dep) =>
      dep.id === dependencyId ? { ...dep, status: 'Mitigated' } : dep
    );

    try {
      await apiFetch(`/dependencies/${dependencyId}/mitigate/`, { method: 'POST' });
    } catch (err) {
      console.error('[CommandCentre] mitigateDependency failed on server:', err);
      throw err;
    }
    return [...this.dependencies];
  }

  // ── Realtime Telemetry Poller ─────────────────────────────────────────────

  public subscribeToRealtimeTelemetry(
    onMessage: (update: RealtimeFeedUpdate) => void
  ): () => void {
    // Poll the backend periodically to detect telemetry changes
    const intervalId = setInterval(async () => {
      try {
        const raw = await apiFetch<Record<string, unknown>>('/overview/');
        const fresh = adaptStats(raw);
        if (
          fresh.activeAlertsCount !== this.stats.activeAlertsCount ||
          fresh.completedEvents !== this.stats.completedEvents ||
          fresh.activeVendorsOnSite !== this.stats.activeVendorsOnSite
        ) {
          this.stats = fresh;
          onMessage({
            type: 'EVENT_UPDATE',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: `Operational state updated from Django backend. Live on-time rate: ${fresh.onTimeRatePercent}%.`,
            payload: fresh,
          });
        }
      } catch {
        // network hiccup
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }
}

export const commandCenterService = new CommandCenterService();
