export type EventStatus = 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed' | 'Warning';

export type TaskStatus = 'Pending' | 'Ongoing' | 'Completed' | 'Delayed';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type VendorCheckInStatus = 'Checked-In' | 'En Route' | 'Delayed' | 'Pending';

export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface DashboardOverviewStats {
  totalEvents: number;
  completedEvents: number;
  ongoingEvents: number;
  upcomingEvents: number;
  delayedEvents: number;
  activeAlertsCount: number;
  onTimeRatePercent: number;
  activeVendorsOnSite: number;
}

export interface WeddingEvent {
  id: string;
  name: string;
  ceremonyType: 'Mehendi' | 'Sangeet' | 'Baraat' | 'Varmala' | 'Pheras' | 'Reception' | 'Haldi';
  venueLocation: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  status: EventStatus;
  delayMinutes: number;
  guestCount: number;
  leadCoordinator: string;
  keyVendors: string[];
  notes?: string;
  weddingName?: string;
}

export interface TaskItem {
  id: string;
  eventId: string;
  eventName: string;
  title: string;
  category: 'Decor & Mandap' | 'Catering' | 'Sound & Light' | 'Logistics' | 'Styling' | 'Security';
  assignedTo: string;
  assignedRole: string;
  scheduledStart: string;
  scheduledEnd: string;
  progressPercent: number;
  status: TaskStatus;
  priority: PriorityLevel;
  delayMinutes: number;
  dependentTaskIds?: string[];
}

export interface VendorTrackingItem {
  id: string;
  vendorName: string;
  serviceCategory: string;
  contactPerson: string;
  phone: string;
  assignedEvent: string;
  expectedArrivalTime: string;
  actualArrivalTime?: string;
  checkInStatus: VendorCheckInStatus;
  gateLocation: string;
  pocCoordinator: string;
  delayMinutes: number;
  equipmentStatus?: 'Clear' | 'Pending Inspection' | 'Offloading';
}

export interface DelayDetectionItem {
  id: string;
  sourceType: 'Vendor' | 'Task' | 'Event' | 'Logistics' | 'Weather';
  entityName: string;
  delayMinutes: number;
  severity: PriorityLevel;
  rootCause: string;
  detectedAt: string;
  impactSummary: string;
  cascadingRiskLevel: 'Moderate' | 'High' | 'Severe';
  status: 'Active' | 'Mitigating' | 'Resolved';
}

export interface DependencyImpactItem {
  id: string;
  bottleneckId: string;
  bottleneckName: string;
  bottleneckType: 'Vendor' | 'Task';
  affectedActivity: string;
  scheduledTime: string;
  projectedSlipMinutes: number;
  cascadingRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  suggestedAction: string;
  status: 'Open' | 'Mitigated';
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: 'Schedule Delay' | 'Vendor Late' | 'Capacity & Power' | 'Protocol & VIP';
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  actionRequired: boolean;
  actionLabel?: string;
}

export interface RealtimeFeedUpdate {
  type: 'EVENT_UPDATE' | 'TASK_PROGRESS' | 'VENDOR_CHECKIN' | 'NEW_ALERT' | 'DELAY_DETECTED';
  timestamp: string;
  message: string;
  payload: any;
}
