export interface WeddingEvent {
  id: string;
  name: string;
  event_order: number;
  date: string;
  start_time: string;
  end_time: string;
  venue_space: string;
  expected_guests: number;
  is_fixed_time: boolean;
  recovery_move_cost: number;
}

export interface Wedding {
  id: string;
  title: string;
  couple_names: string;
  start_date: string;
  end_date: string;
  events: WeddingEvent[];
}

export interface IncidentInput {
  title: string;
  incident_type: string;
  description: string;
  vendor_impact: string;
  affected_event: string;
  delay_minutes: number;
  cost_per_minute: number;
}

export interface Incident {
  id: string;
  title: string;
  incident_type: string;
  description: string;
  affected_event: string;
  delay_minutes: number;
  cost_per_minute: number;
  status?: string;
  created_at?: string;
  resolved_at?: string | null;
  recovery_plan?: string | null;
}

export interface ScheduleEntry {
  event_id: string;
  name: string;
  venue_space: string;
  is_fixed_time: boolean;
  original_start: string;
  original_end: string;
  proposed_start: string;
  proposed_end: string;
  shift_minutes: number;
}

export interface PlanValidation {
  valid: boolean;
  errors: string[];
}

export interface RecoveryPlan {
  id: string;
  strategy: string;
  feasible: boolean;
  changed_event_count: number;
  estimated_additional_cost: number;
  impact_summary: string;
  validation: PlanValidation;
  baseline_schedule: ScheduleEntry[];
  proposed_schedule: ScheduleEntry[];
}

export interface IncidentAnalysis {
  incident: Incident;
  plans: RecoveryPlan[];
}

export interface EventDependency {
  id?: string;
  predecessor_event: string;
  successor_event: string;
  minimum_gap_minutes: number;
}

export interface IncidentHistoryEntry {
  id?: string;
  action?: string;
  status?: string;
  message?: string;
  recovery_plan_id?: string | null;
  created_at?: string;
  timestamp?: string;
}
