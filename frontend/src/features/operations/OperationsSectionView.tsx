'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { getAccessToken } from '@/features/client-management/services/authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

const sections: Record<string, { title: string; endpoint: string; fields: string[] }> = {
  agreements: { title: 'Agreements & e-signatures', endpoint: 'agreements', fields: ['title', 'status', 'document', 'customer_signed_at', 'vendor_signed_at'] },
  finance: { title: 'Payments & vendor invoices', endpoint: 'payments', fields: ['description', 'amount', 'payment_type', 'status'] },
  guests: { title: 'Guests & RSVP', endpoint: 'guests', fields: ['name', 'email', 'phone', 'invitation_status'] },
  vendors: { title: 'Vendor assignments', endpoint: 'vendor-assignments', fields: ['service', 'status', 'issue'] },
  documents: { title: 'Documents', endpoint: 'documents', fields: ['title', 'document_type', 'file_url'] },
  notifications: { title: 'Notifications', endpoint: 'notifications', fields: ['title', 'message', 'read_at'] },
};

export default function OperationsSectionView({ section }: { section: string }) {
  const config = sections[section];
  const [records, setRecords] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');
  const [signingId, setSigningId] = useState<string | null>(null);

  useEffect(() => {
    if (!config) return;
    const timer = window.setTimeout(() => {
      void getAccessToken().then((token) => fetch(`${API_BASE_URL}/operations/${config.endpoint}/`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }))
        .then(async (response) => {
          if (!response.ok) throw new Error('Unable to load this workspace.');
          const payload = await response.json() as { results?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>;
          setRecords(Array.isArray(payload) ? payload : payload.results ?? []);
        })
        .catch((loadError: Error) => setError(loadError.message));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [config]);

  const signAgreement = async (id: string) => {
    setSigningId(id);
    setError('');
    try {
      const token = await getAccessToken();
      const response = await fetch(`${API_BASE_URL}/operations/agreements/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sign: true }),
      });
      const payload = await response.json() as Record<string, unknown>;
      if (!response.ok) throw new Error(String(payload.detail ?? 'Unable to sign the agreement.'));
      setRecords((current) => current.map((record) => String(record.id) === id ? payload : record));
    } catch (signError) {
      setError(signError instanceof Error ? signError.message : 'Unable to sign the agreement.');
    } finally {
      setSigningId(null);
    }
  };

  if (!config) return <p className="p-8">Workspace not found.</p>;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex-1"><TopNav />
        <main className="max-w-6xl mx-auto px-5 lg:px-10 py-8">
          <Link href="/operations" className="text-sm text-[#8A6B36]">← Operations overview</Link>
          <h1 className="font-display text-4xl text-[#493044] font-bold mt-4">{config.title}</h1>
          <p className="text-sm text-[#766873] mt-2">Live records from the authenticated operations API.</p>
          {error && <p className="mt-5 text-sm text-red-700">{error}</p>}
          <div className="mt-8 space-y-3">
            {records.map((record, index) => <article key={String(record.id ?? index)} className="bg-white rounded-2xl border border-[#E8DCD0] p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{config.fields.map((field) => <div key={field}><p className="text-xs uppercase tracking-wide text-[#766873]">{field.replaceAll('_', ' ')}</p>{field === 'document' && record[field] ? <a className="text-sm text-[#8A6B36] underline mt-1 inline-block" href={String(record[field])} target="_blank" rel="noreferrer">Open agreement</a> : <p className="text-sm text-[#493044] mt-1 break-words">{String(record[field] ?? '—')}</p>}</div>)}{section === 'agreements' && record.status !== 'signed' && <button onClick={() => void signAgreement(String(record.id))} disabled={signingId === String(record.id)} className="rounded-lg bg-[#493044] text-white px-4 py-2 text-sm font-semibold disabled:opacity-60">{signingId === String(record.id) ? 'Signing…' : 'Sign agreement'}</button>}</article>)}
            {!error && records.length === 0 && <div className="bg-white rounded-2xl border border-[#E8DCD0] p-6 text-sm text-[#766873]">No records are available yet.</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
