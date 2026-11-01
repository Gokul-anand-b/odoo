'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { authApi, getAccessToken } from '@/features/client-management/services/authService';

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
  const [agreementId, setAgreementId] = useState<string | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [records, setRecords] = useState<Array<Record<string, unknown>>>([]);
  const [agreement, setAgreement] = useState<Record<string, unknown> | null>(null);
  const [blueprint, setBlueprint] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [signingId, setSigningId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    void authApi.me().then((user) => setCurrentRole(user.role)).catch(() => setCurrentRole(null));
    const params = new URLSearchParams(window.location.search);
    setAgreementId(params.get('agreementId'));
    setWeddingId(params.get('weddingId'));
  }, []);

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

  useEffect(() => {
    if (section !== 'agreements' || !agreementId) return;
    const loadDetails = async () => {
      try {
        const token = await getAccessToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const requests = [
          fetch(`${API_BASE_URL}/operations/agreements/${agreementId}/`, {
            credentials: 'include',
            headers,
          }),
          ...(weddingId
            ? [fetch(`${API_BASE_URL}/weddings/${weddingId}/blueprint/`, {
                credentials: 'include',
                headers,
                cache: 'no-store',
              })]
            : []),
        ];
        const responses = await Promise.all(requests);
        const agreementResponse = responses[0];
        const agreementPayload = await agreementResponse.json() as Record<string, unknown>;
        if (!agreementResponse.ok) throw new Error(String(agreementPayload.detail ?? agreementPayload.message ?? 'Unable to load the agreement.'));
        setAgreement(agreementPayload);
        if (responses[1]) {
          const blueprintPayload = await responses[1].json() as { data?: Record<string, unknown>; message?: string };
          if (!responses[1].ok) throw new Error(blueprintPayload.message ?? 'Unable to load the wedding blueprint.');
          setBlueprint(blueprintPayload.data ?? null);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the agreement and blueprint.');
      }
    };
    void loadDetails();
  }, [agreementId, section, weddingId]);

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

  if (section === 'agreements' && agreementId) {
    const documentUrl = typeof agreement?.document === 'string' ? agreement.document : '';
    const isImage = /\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(documentUrl);
    const tasks = Array.isArray(blueprint?.tasks) ? blueprint.tasks as Array<Record<string, unknown>> : [];
    const signAgreement = async () => {
      setSigningId(agreementId);
      setError('');
      try {
        const token = await getAccessToken();
        const response = await fetch(`${API_BASE_URL}/operations/agreements/${agreementId}/`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ sign: true }),
        });
        const payload = await response.json() as Record<string, unknown>;
        if (!response.ok) throw new Error(String(payload.detail ?? payload.message ?? 'Unable to sign the agreement.'));
        setAgreement(payload);
      } catch (signError) {
        setError(signError instanceof Error ? signError.message : 'Unable to sign the agreement.');
      } finally {
        setSigningId(null);
      }
    };
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
        <Sidebar />
        <div className="flex-1"><TopNav />
          <main className="max-w-6xl mx-auto px-5 lg:px-10 py-8">
            <Link href={currentRole === 'admin' ? '/admin/requests' : '/wedding-blueprint'} className="text-sm text-[#8A6B36]">
              ← {currentRole === 'admin' ? 'Blueprint approvals' : 'Wedding blueprint'}
            </Link>
            <h1 className="font-display text-4xl text-[#493044] font-bold mt-4">Wedding agreement & blueprint</h1>
            {error && <p className="mt-5 text-sm text-red-700">{error}</p>}
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] mt-8">
              <section className="overflow-hidden rounded-xl border border-[#DCCFC0] bg-white shadow-[0_18px_45px_rgba(73,48,68,0.10)]">
                <div className="border-b-4 border-[#B99A65] bg-gradient-to-r from-[#493044] to-[#684C65] px-7 py-7 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#D4BA8A]">WedPilot AI</p>
                      <h2 className="font-display text-3xl font-semibold mt-2 tracking-tight">Wedding service invoice</h2>
                      <p className="mt-2 text-sm text-[#E8DDE3]">Agreement and blueprint deliverables</p>
                    </div>
                    <span className="rounded-md border border-[#D4BA8A]/40 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                      {String(agreement?.status ?? 'Loading…')}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <div className="grid gap-5 border-b border-[#E8DCD0] pb-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A8064]">Bill to</p>
                      <p className="mt-1 font-semibold text-[#493044]">{String(blueprint?.couple_names ?? 'Customer')}</p>
                      <p className="text-sm text-[#766873]">{String(blueprint?.wedding_title ?? 'Approved wedding')}</p>
                      <p className="mt-2 text-xs text-[#766873]">{String(blueprint?.wedding_date ?? 'Wedding planning services')}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A8064]">Invoice details</p>
                      <p className="mt-1 font-semibold text-[#493044]">AGR-{agreementId ?? '—'}</p>
                      <p className="text-sm text-[#766873]">Blueprint v{String(blueprint?.version ?? '—')}</p>
                      <p className="mt-1 text-xs text-[#766873]">Issued for customer review</p>
                    </div>
                  </div>
                  <div className="mt-6 overflow-hidden rounded-lg border border-[#E8DCD0]">
                    <div className="grid grid-cols-[1fr_auto] gap-4 bg-[#FAF5ED] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#766873] sm:grid-cols-[1fr_auto_auto]">
                      <span>Service / blueprint deliverable</span><span>Status</span><span className="text-right">Included</span>
                    </div>
                    {tasks.length ? tasks.slice(0, 10).map((task) => (
                      <div key={String(task.id)} className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-[#E8DCD0] px-4 py-3 sm:grid-cols-[1fr_auto_auto]">
                        <div><p className="text-sm font-semibold text-[#493044]">{String(task.title)}</p><p className="mt-1 text-xs text-[#766873]">{String(task.phase ?? '')} · Due {String(task.deadline ?? '—')}</p></div>
                        <span className="self-center text-xs font-semibold capitalize text-[#8A6B36]">{String(task.status ?? 'pending').replaceAll('_', ' ')}</span>
                        <span className="text-right text-xs font-semibold text-[#493044]">Included</span>
                      </div>
                    )) : (
                      <div className="border-t border-[#E8DCD0] px-4 py-5 text-sm text-[#766873]">Blueprint deliverables are loading...</div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-xs space-y-2 border-t border-[#E8DCD0] pt-4 text-sm">
                      <div className="flex justify-between text-[#766873]"><span>Blueprint deliverables</span><span>Included</span></div>
                      <div className="flex justify-between border-t border-[#E8DCD0] pt-3 font-display text-lg font-bold text-[#493044]"><span>Total services</span><span>As agreed</span></div>
                    </div>
                  </div>
                  {currentRole === 'customer' && agreement?.status !== 'signed' && (
                    <button type="button" onClick={() => void signAgreement()} disabled={signingId === agreementId} className="mt-6 w-full rounded-lg bg-[#493044] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#684C65] disabled:opacity-60">
                      {signingId === agreementId ? 'Signing invoice…' : 'Digitally sign this invoice & agreement'}
                    </button>
                  )}
                  {agreement?.status === 'signed' && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">Digitally signed and recorded</p>}
                  <div className="mt-7 grid gap-5 border-t border-[#E8DCD0] pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A8064]">Customer signature</p>
                      <p className="mt-5 border-b border-dashed border-[#B99A65] pb-2 text-sm text-[#766873]">{agreement?.status === 'signed' ? 'Digitally signed and recorded' : 'Awaiting customer signature'}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#9A8064]">WedPilot AI</p>
                      <p className="mt-5 border-b border-dashed border-[#B99A65] pb-2 text-sm text-[#766873]">Authorized service provider</p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="rounded-xl border border-[#DCCFC0] bg-white p-6 shadow-[0_18px_45px_rgba(73,48,68,0.08)]">
                <p className="text-xs uppercase tracking-[0.2em] text-[#B99A65] font-semibold">Uploaded agreement</p>
                <h2 className="font-display text-2xl text-[#493044] font-semibold mt-2">Document preview</h2>
                <p className="text-sm text-[#766873] mt-2">The document uploaded by Admin is shown here for review.</p>
                {documentUrl ? (
                  <div className="mt-6 overflow-hidden rounded-xl border border-[#E8DCD0] bg-[#F7EFE8]">
                    {isImage
                      ? <img src={documentUrl} alt="Uploaded wedding agreement" className="max-h-[520px] w-full object-contain" />
                      : <iframe title="Uploaded wedding agreement" src={documentUrl} className="h-[520px] w-full" />}
                  </div>
                ) : <p className="mt-5 text-sm text-[#766873]">The Admin has not uploaded the agreement file yet.</p>}
                <a href={documentUrl || '#'} target="_blank" rel="noreferrer" className={`mt-5 inline-block rounded-lg bg-[#493044] px-4 py-2 text-sm font-semibold text-white ${documentUrl ? '' : 'pointer-events-none opacity-50'}`}>Open uploaded document</a>
              </section>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
