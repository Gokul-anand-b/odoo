export type EventStatus = 'upcoming' | 'in_progress' | 'completed' | 'delayed';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type VendorStatus = 'expected' | 'en_route' | 'checked_in' | 'delayed';

export interface WeddingOption {
  id: string;
  title: string;
  couple_names: string;
  start_date: string;
  end_date: string;
  venue_name: string;
  venue_city: string;
  guest_count: number;
}

export interface EventMonitor {
  id: number;
  event_id: string;
  event_name: string;
  event_date: string;
  scheduled_start: string | null;
  scheduled_end: string | null;
  venue_space: string;
  status: EventStatus;
  actual_start: string | null;
  actual_end: string | null;
  delay_reason: string;
}

export interface TaskMonitor {
  id: string;
  code: string;
  title: string;
  category: string;
  phase: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: TaskStatus;
  deadline: string | null;
  coordinator_role: string;
  depends_on: string[];
  is_critical_path: boolean;
}

export interface VendorOption {
  id: string;
  name: string;
  category: string;
  contact_person: string;
  phone: string;
}

export interface VendorAssignment {
  id: number;
  vendor: string;
  vendor_name: string;
  vendor_category: string;
  contact_person: string;
  phone: string;
  event: string | null;
  event_name: string;
  expected_arrival: string | null;
  actual_arrival: string | null;
  status: VendorStatus;
  notes: string;
}

export interface PlannerAlert {
  id: string;
  severity: 'medium' | 'high';
  title: string;
  description: string;
  source_type: 'event' | 'task' | 'vendor';
  source_id: string;
  affected_events: string[];
  created_at: string | null;
}

export interface CommandCentreDashboard {
  wedding: WeddingOption;
  events: EventMonitor[];
  tasks: TaskMonitor[];
  vendors: VendorAssignment[];
  task_counts: {
    total: number;
    completed: number;
    in_progress: number;
    blocked: number;
  };
  alerts: PlannerAlert[];
  active_alerts_count: number;
  vendor_counts: {
    assigned: number;
    checked_in: number;
    delayed: number;
  };
}
