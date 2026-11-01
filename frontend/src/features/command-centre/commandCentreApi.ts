import {
  CommandCentreDashboard,
  EventStatus,
  TaskStatus,
  VendorOption,
  VendorStatus,
  WeddingOption,
} from './types';
import { getAccessToken } from '@/features/client-management/services/authService';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      payload.message ||
      (response.status === 401 || response.status === 403
        ? 'Your admin session is not authorized. Sign in again and reload the Command Centre.'
        : `Request failed (${response.status})`),
    );
  }
  return payload.data as T;
}

export const commandCentreApi = {
  getWeddings: () => request<WeddingOption[]>('/weddings/'),
  getDashboard: (weddingId: string) =>
    request<CommandCentreDashboard>(`/command-centre/weddings/${weddingId}/dashboard/`),
  getAvailableVendors: (weddingId: string) =>
    request<VendorOption[]>(`/command-centre/weddings/${weddingId}/vendors/`),
  assignVendor: (weddingId: string, input: {
    vendor: string;
    event?: string;
    expected_arrival?: string;
  }) =>
    request<VendorAssignmentResponse>(`/command-centre/weddings/${weddingId}/vendors/`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateVendor: (weddingId: string, assignmentId: number, status: VendorStatus) =>
    request<unknown>(`/command-centre/weddings/${weddingId}/vendors/${assignmentId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updateEvent: (weddingId: string, eventId: string, status: EventStatus, delay_reason?: string) =>
    request<unknown>(`/command-centre/weddings/${weddingId}/events/${eventId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status, delay_reason }),
    }),
  updateTask: (weddingId: string, taskId: string, status: TaskStatus) =>
    request<unknown>(`/command-centre/weddings/${weddingId}/tasks/${taskId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

interface VendorAssignmentResponse {
  id: number;
  vendor: string;
  vendor_name: string;
}
