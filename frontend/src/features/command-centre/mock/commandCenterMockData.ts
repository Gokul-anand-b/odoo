/**
 * DEPRECATED: Hardcoded mock data has been removed.
 * All wedding command centre operational data is fetched live from the Django REST API backend
 * at http://localhost:8000/api/command-centre/.
 */

import {
  DashboardOverviewStats,
  WeddingEvent,
  TaskItem,
  VendorTrackingItem,
  DelayDetectionItem,
  DependencyImpactItem,
  AlertItem
} from '../types/commandCenter.types';

export const INITIAL_OVERVIEW_STATS: DashboardOverviewStats = {
  totalEvents: 0,
  completedEvents: 0,
  ongoingEvents: 0,
  upcomingEvents: 0,
  delayedEvents: 0,
  activeAlertsCount: 0,
  onTimeRatePercent: 0,
  activeVendorsOnSite: 0,
};

export const INITIAL_WEDDING_EVENTS: WeddingEvent[] = [];
export const INITIAL_TASK_ITEMS: TaskItem[] = [];
export const INITIAL_VENDORS_TRACKING: VendorTrackingItem[] = [];
export const INITIAL_DELAY_DETECTIONS: DelayDetectionItem[] = [];
export const INITIAL_DEPENDENCY_IMPACTS: DependencyImpactItem[] = [];
export const INITIAL_ALERTS: AlertItem[] = [];
