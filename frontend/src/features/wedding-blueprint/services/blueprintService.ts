import { Wedding, WeddingBlueprint, BlueprintTask, WeddingEvent } from '../types/blueprint.types';
import { getAccessToken } from '@/features/client-management/services/authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const blueprintApi = {
  // Fetch all weddings
  getWeddings: async (): Promise<Wedding[]> => {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/weddings/`, {
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      cache: 'no-store',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch weddings');
    if (!Array.isArray(json.data)) throw new Error('The weddings response was invalid');
    return json.data;
  },

  // Create new wedding setup with events
  createWedding: async (data: Partial<Wedding>): Promise<Wedding> => {
    const res = await fetch(`${API_BASE_URL}/weddings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create wedding setup');
    return json.data;
  },

  // Get wedding details
  getWeddingDetail: async (id: string): Promise<Wedding> => {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/weddings/${id}/`, {
      headers: token ? { Authorization: 'Bearer ' + token } : undefined,
      cache: 'no-store',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch wedding details');
    return json.data;
  },

  // Trigger intelligent blueprint generation
  generateBlueprint: async (weddingId: string, forceRegenerate = false): Promise<WeddingBlueprint> => {
    const res = await fetch(`${API_BASE_URL}/weddings/${weddingId}/blueprint/generate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force_regenerate: forceRegenerate }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to generate blueprint');
    return json.data;
  },

  // Get blueprint details
  getBlueprint: async (weddingId: string): Promise<WeddingBlueprint> => {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE_URL}/weddings/${weddingId}/blueprint/`, {
      headers: token ? { Authorization: 'Bearer ' + token } : undefined,
      cache: 'no-store',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch blueprint');
    return json.data;
  },

  // Approve blueprint
  approveBlueprint: async (weddingId: string): Promise<WeddingBlueprint> => {
    const res = await fetch(`${API_BASE_URL}/weddings/${weddingId}/blueprint/approve/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to approve blueprint');
    return json.data;
  },

  // Update a task (marks as manually edited so it is preserved during regeneration)
  updateTask: async (taskId: string, data: Partial<BlueprintTask>): Promise<BlueprintTask> => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update task');
    return json.data;
  },

  // Add event to wedding
  addEvent: async (weddingId: string, event: Partial<WeddingEvent>): Promise<WeddingEvent> => {
    const res = await fetch(`${API_BASE_URL}/weddings/${weddingId}/events/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to add event');
    return json.data;
  },
};
