import type {
  EventDependency,
  Incident,
  IncidentAnalysis,
  IncidentHistoryEntry,
  IncidentInput,
  Wedding,
  WeddingEvent,
} from '../types/disruption.types';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}/disruptions`;
let pendingWeddingsRequest: Promise<Wedding[]> | null = null;

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      cache: 'no-store',
    });
  } catch {
    throw new Error('Unable to reach the disruption service. Check the API connection and try again.');
  }

  const result = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || `Request failed (${response.status}). Please try again.`);
  }
  if (!result || !('data' in result)) {
    throw new Error('The disruption service returned an unexpected response.');
  }
  return result.data;
}

const jsonRequest = (method: 'POST' | 'PUT', body: unknown): RequestInit => ({
  method,
  body: JSON.stringify(body),
});

export const disruptionApi = {
  getWeddings: () => {
    if (!pendingWeddingsRequest) {
      pendingWeddingsRequest = request<Wedding[]>('weddings/').finally(() => {
        pendingWeddingsRequest = null;
      });
    }
    return pendingWeddingsRequest;
  },
  getIncidents: (weddingId: string) => request<Incident[]>(`weddings/${encodeURIComponent(weddingId)}/incidents/`),
  createIncident: (weddingId: string, input: IncidentInput) =>
    request<Incident>(`weddings/${encodeURIComponent(weddingId)}/incidents/`, jsonRequest('POST', input)),
  analyzeIncident: (incidentId: string) =>
    request<IncidentAnalysis>(`incidents/${encodeURIComponent(incidentId)}/analyze/`, jsonRequest('POST', {})),
  approvePlan: (incidentId: string, recoveryPlanId: string) =>
    request<Incident>(`incidents/${encodeURIComponent(incidentId)}/approve/`, jsonRequest('POST', {
      recovery_plan_id: recoveryPlanId,
    })),
  resolveIncident: (incidentId: string) =>
    request<Incident>(`incidents/${encodeURIComponent(incidentId)}/resolve/`, jsonRequest('POST', {})),
  getHistory: (incidentId: string) =>
    request<IncidentHistoryEntry[]>(`incidents/${encodeURIComponent(incidentId)}/history/`),
  getDependencies: (weddingId: string) =>
    request<EventDependency[]>(`weddings/${encodeURIComponent(weddingId)}/dependencies/`),
  addDependency: (weddingId: string, dependency: Omit<EventDependency, 'id'>) =>
    request<EventDependency>(`weddings/${encodeURIComponent(weddingId)}/dependencies/`, jsonRequest('POST', dependency)),
  updateEventRule: (weddingId: string, eventId: string, rule: Pick<WeddingEvent, 'is_fixed_time' | 'recovery_move_cost'>) =>
    request<WeddingEvent>(
      `weddings/${encodeURIComponent(weddingId)}/events/${encodeURIComponent(eventId)}/rule/`,
      jsonRequest('PUT', rule),
    ),
};
