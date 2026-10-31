export interface WeddingEvent {
  id?: string;
  name: string;
  event_order: number;
  date: string;
  start_time?: string;
  end_time?: string;
  venue_space: string;
  expected_guests: number;
  dress_code: string;
  coordinator_name: string;
  notes?: string;
}

export interface BlueprintTask {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  phase: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  deadline: string;
  estimated_duration_days: number;
  coordinator_role: string;
  depends_on: string[];
  is_critical_path: boolean;
  is_manually_edited: boolean;
  notes?: string;
}

export interface VendorRequirement {
  id: string;
  category: string;
  service_name: string;
  headcount_capacity: number;
  allocated_budget: number;
  target_booking_deadline: string;
  status: string;
  deliverables: string[];
}

export interface ResourceRequirement {
  id: string;
  resource_name: string;
  quantity: number;
  unit: string;
  importance: string;
  allocated_for_event: string;
}

export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  due_date: string;
  status: string;
  description: string;
}

export interface WeddingBlueprint {
  id: string;
  wedding: string;
  wedding_title: string;
  couple_names: string;
  version: number;
  status: 'draft' | 'generating' | 'active' | 'revision_requested' | 'archived';
  template_code: string;
  template_name: string;
  matching_score: number;
  dag_topological_valid: boolean;
  generation_summary: Record<string, any>;
  approved_by_planner: boolean;
  approved_at: string | null;
  tasks: BlueprintTask[];
  vendor_requirements: VendorRequirement[];
  resource_requirements: ResourceRequirement[];
  payment_milestones: PaymentMilestone[];
  created_at: string;
  updated_at: string;
}

export interface Wedding {
  id: string;
  title: string;
  couple_names: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  guest_count: number;
  budget: number;
  venue_name: string;
  venue_city: string;
  theme: string;
  package: string;
  selected_services: string[];
  notes?: string;
  events?: WeddingEvent[];
  blueprint?: WeddingBlueprint;
  created_at?: string;
}
