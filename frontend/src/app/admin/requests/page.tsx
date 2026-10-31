'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { getAccessToken } from '@/features/client-management/services/authService';
import { WeddingRequest } from '@/features/client-management/services/clientManagementService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<WeddingRequest[]>([]);
  const [error, setError] = useState('');
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const load = async () => {
    const token = await getAccessToken();
    const response = await fetch(`${API_BASE_URL}/wedding-requests/`, {
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!response.ok) throw new Error('Unable to load wedding requests.');
    setRequests(await response.json());
  };

  const uploadAgreement = async (item: WeddingRequest) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploadingFor(item.id);
      try {
        const token = await getAccessToken();
        const form = new FormData();
        form.append('customer', String(item.customer));
        form.append('wedding_request', item.id);
        form.append('title', `${item.wedding_name} service agreement`);
        form.append('content', 'Service agreement attached for customer review and signature.');
        form.append('document', file);
        if (!item.agreement_id) throw new Error('The agreement record is not ready yet. Refresh and try again.');
        const response = await fetch(`${API_BASE_URL}/operations/agreements/${item.agreement_id}/`, {
          method: 'PATCH',
          credentials: 'include',
          headers: token ? { Authorization: 'Bearer ' + token } : undefined,
          body: form,
        });
        if (!response.ok) throw new Error('Unable to upload the agreement.');
        await load();
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload the agreement.');
      } finally {
        setUploadingFor(null);
      }
    };
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch((loadError) => setError(loadError.message));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const decide = async (id: string, decision: 'approve' | 'reject' | 'request_changes') => {
    const reason = decision === 'approve' ? '' : window.prompt('Reason for the customer:')?.trim() ?? '';
    if (decision !== 'approve' && !reason) return;
    const token = await getAccessToken();
    const csrf = token ? null : await fetch(`${API_BASE_URL}/auth/csrf/`, { credentials: 'include' })
      .then((csrfResponse) => csrfResponse.json())
      .then((body) => body.csrfToken as string);
    const response = await fetch(`${API_BASE_URL}/wedding-requests/${id}/decision/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(csrf ? { 'X-CSRFToken': csrf } : {}),
      },
      body: JSON.stringify({ decision, reason }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.detail ?? 'Unable to update the request.');
      return;
    }
    await load();
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex-1"><TopNav />
        <main className="max-w-6xl mx-auto px-5 lg:px-10 py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B99A65] font-semibold">Admin workspace</p>
          <h1 className="font-display text-4xl text-[#493044] font-bold mt-2">Wedding Blueprint approvals</h1>
          <p className="text-sm text-[#766873] mt-2">Approve a request to generate its private blueprint for that customer. Upload the agreement here for the same customer.</p>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
          <div className="mt-8 space-y-3">
            {requests.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl border border-[#E8DCD0] p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div><h2 className="font-semibold text-[#493044]">{item.wedding_name}</h2><p className="text-sm text-[#766873]">{item.customer_name ?? 'Customer'} · {item.wedding_date} · {item.location} · {item.guest_count} guests</p><p className="text-sm text-[#766873] mt-1">Package: {item.package} · Budget: ₹{Number(item.budget).toLocaleString('en-IN')}</p></div>
                  <span className="text-xs font-semibold rounded-full px-3 py-1 bg-[#F7EFE8] text-[#493044]">{item.status.replace('_', ' ')}</span>
                </div>
                {item.status === 'pending_approval' && <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => void decide(item.id, 'approve')} className="rounded-lg bg-[#493044] text-white px-4 py-2 text-sm font-semibold">Approve</button>
                  <button onClick={() => void decide(item.id, 'request_changes')} className="rounded-lg border border-[#B99A65] text-[#493044] px-4 py-2 text-sm font-semibold">Request changes</button>
                  <button onClick={() => void decide(item.id, 'reject')} className="rounded-lg border border-red-200 text-red-700 px-4 py-2 text-sm font-semibold">Reject</button>
                </div>}
                {item.status === 'approved' && <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-emerald-700 font-medium">Blueprint generated for this customer</span>
                  <button
                    onClick={() => void uploadAgreement(item)}
                    disabled={uploadingFor === item.id}
                    className="rounded-lg bg-[#B99A65] text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                  >
                    {uploadingFor === item.id ? 'Uploading…' : 'Upload agreement (PDF/JPG)'}
                  </button>
                  <Link href="/operations/agreements" className="text-sm text-[#8A6B36] underline">View agreements</Link>
                </div>}
              </article>
            ))}
            {requests.length === 0 && <div className="bg-white rounded-2xl border border-[#E8DCD0] p-6 text-sm text-[#766873]">No requests found.</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
