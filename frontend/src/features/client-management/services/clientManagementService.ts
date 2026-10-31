const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export type RequestStatus = 'pending_approval' | 'changes_requested' | 'approved' | 'rejected';

export type WeddingRequest = {
  id: string;
  customer: number;
  customer_name?: string;
  wedding_name: string;
  wedding_date: string;
  location: string;
  guest_count: number;
  theme: string;
  budget: string;
  package: string;
  requirements: string;
  status: RequestStatus;
  decision_reason: string;
  created_at: string;
  approved_wedding_id?: string | null;
  agreement_id?: number | null;
  agreement_document?: string | null;
};

export type WeddingRequestInput = Omit<
  WeddingRequest,
  'id' | 'customer' | 'customer_name' | 'status' | 'decision_reason' | 'created_at' | 'approved_wedding_id'
>;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? 'GET';
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  const token = await getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (method !== 'GET' && !token) {
    const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf/`, { credentials: 'include' });
    const csrf = await csrfResponse.json() as { csrfToken: string };
    headers.set('X-CSRFToken', csrf.csrfToken);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? 'Unable to complete the request.');
  }
  return response.json();
}

export const clientManagementApi = {
  list: () => request<WeddingRequest[]>('/wedding-requests/'),
  create: (input: WeddingRequestInput) =>
    request<WeddingRequest>('/wedding-requests/', { method: 'POST', body: JSON.stringify(input) }),
  resubmit: (id: string, input: WeddingRequestInput) =>
    request<WeddingRequest>(`/wedding-requests/${id}/`, { method: 'PUT', body: JSON.stringify(input) }),
};
import { getAccessToken } from './authService';
