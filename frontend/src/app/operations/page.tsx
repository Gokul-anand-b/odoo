'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { getAccessToken } from '@/features/client-management/services/authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

type Summary = {
  payments: { count: number; total: string | number };
  assignments_by_status: Array<{ status: string; count: number }>;
  guest_count: number;
  rsvp_count: number;
};

export default function OperationsPage() {
  const [summary, setSummary] = useState<Summary>();
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getAccessToken().then((token) => fetch(`${API_BASE_URL}/operations/reports/`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })).then(async (response) => {
        if (!response.ok) throw new Error('Unable to load operational summary.');
        return response.json() as Promise<Summary>;
      }).then(setSummary).catch((loadError: Error) => setError(loadError.message));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const cards = summary ? [
    ['Client and vendor payments', summary.payments.count],
    ['Tracked payment value', `₹${Number(summary.payments.total).toLocaleString('en-IN')}`],
    ['Guests', summary.guest_count],
    ['RSVP records', summary.rsvp_count],
  ] : [];

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex-1"><TopNav />
        <main className="max-w-6xl mx-auto px-5 lg:px-10 py-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.2em] text-[#B99A65] font-semibold">Operations workspace</p><h1 className="font-display text-4xl text-[#493044] font-bold mt-2">Wedding operations</h1><p className="text-sm text-[#766873] mt-2">Agreements, payments, guests, assignments, documents and notifications.</p></div>
            <Link href="/wedding-blueprint" className="rounded-xl bg-[#493044] text-white px-4 py-2.5 text-sm font-semibold">Create wedding</Link>
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(([label, value]) => <div key={label} className="bg-white rounded-2xl border border-[#E8DCD0] p-5"><p className="text-xs text-[#766873]">{label}</p><p className="font-display text-3xl font-bold text-[#493044] mt-2">{value}</p></div>)}
            {!summary && <div className="sm:col-span-2 lg:col-span-4 bg-white rounded-2xl border border-[#E8DCD0] p-6 text-sm text-[#766873]">Loading live operational data…</div>}
          </section>
          <section className="grid md:grid-cols-2 gap-4">
            {[
              ['Agreements & e-signatures', 'Review, sign and track service agreements.', '/operations/agreements'],
              ['Payments & invoices', 'Track booking, advances, final payments and vendor invoices.', '/operations/finance'],
              ['Guests & RSVP', 'Manage guest records and attendance responses.', '/operations/guests'],
              ['Vendor assignments', 'Coordinate assignments, status updates and issues.', '/operations/vendors'],
              ['Documents', 'Keep agreements, quotations and invoices accessible.', '/operations/documents'],
              ['Notifications', 'Review approval, payment and operational alerts.', '/operations/notifications'],
            ].map(([title, description, href]) => <Link key={title} href={href} className="bg-white rounded-2xl border border-[#E8DCD0] p-5 hover:border-[#B99A65] transition"><h2 className="font-display text-2xl text-[#493044] font-semibold">{title}</h2><p className="text-sm text-[#766873] mt-2">{description}</p><span className="inline-block text-sm text-[#8A6B36] mt-4">Open workspace →</span></Link>)}
          </section>
        </main>
      </div>
    </div>
  );
}
