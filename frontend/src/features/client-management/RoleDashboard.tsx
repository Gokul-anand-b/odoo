'use client';

import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { AuthUser } from './services/authService';
import { getAccessToken } from './services/authService';
import { useEffect, useState } from 'react';

const links: Record<AuthUser['role'], Array<[string, string, string]>> = {
  customer: [['Wedding blueprint', '/wedding-blueprint', 'Submit your wedding brief and view the blueprint after approval.'], ['Agreements', '/operations/agreements', 'Review your private service agreement and signature status.'], ['Operations', '/operations', 'Payments, guests and notifications.']],
  vendor: [
    ['Vendor profile', '/operations/vendors', 'Business information, services, pricing, portfolio and availability.'],
    ['Quotation requests', '/vendor-intelligence', 'Review wedding requirements and submit quotations.'],
    ['My quotations', '/vendor-intelligence', 'Track pending, selected, rejected and approved quotations.'],
    ['Wedding assignments', '/operations/vendors', 'Review confirmed weddings, services and requirements.'],
    ['Wedding schedule', '/operations/vendors', 'Review functions, timings and setup deadlines.'],
    ['Arrival & check-in', '/command-centre', 'Update arrival, service started and completed status.'],
    ['Task & service management', '/operations/vendors', 'Track responsibilities, deadlines and progress.'],
    ['Issue reporting', '/operations/vendors', 'Report delays, equipment problems and resource needs.'],
    ['Invoice management', '/operations/vendor-invoices', 'Submit invoices and extra expenses for approval.'],
    ['Payments', '/operations/finance', 'View contract amount, advances, paid amount and balance.'],
    ['Documents', '/operations/documents', 'Access contracts, quotations and operational documents.'],
    ['Notifications', '/operations/notifications', 'Review assignment, schedule and payment updates.'],
    ['Profile & settings', '/operations/vendors', 'Update business details and account settings.'],
  ],
  admin: [['Wedding requests', '/admin/requests', 'Approve, reject, or request changes.'], ['Operations', '/operations', 'Manage agreements, finance, guests, and assignments.'], ['Reports', '/operations', 'Review operational reports and financial summaries.']],
};

export default function RoleDashboard({ role }: { role: AuthUser['role'] }) {
  const [requestCounts, setRequestCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  useEffect(() => {
    if (role !== 'admin') return;
    const load = async () => {
      const token = await getAccessToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1'}/wedding-requests/`, {
        headers: token ? { Authorization: 'Bearer ' + token } : undefined,
      });
      if (!response.ok) return;
      const requests = await response.json() as Array<{ status: string }>;
      setRequestCounts({
        total: requests.length,
        pending: requests.filter((item) => item.status === 'pending_approval').length,
        approved: requests.filter((item) => item.status === 'approved').length,
        rejected: requests.filter((item) => item.status === 'rejected').length,
      });
    };
    void load();
  }, [role]);
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex-1"><TopNav />
        <main className="max-w-6xl mx-auto px-5 lg:px-10 py-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B99A65] font-semibold">{role} portal</p>
          <h1 className="font-display text-4xl font-bold text-[#493044] mt-2">{role === 'admin' ? 'Admin dashboard' : role === 'vendor' ? 'Vendor dashboard' : 'Customer dashboard'}</h1>
          <p className="text-sm text-[#766873] mt-2">Your workspace is restricted to the permissions for this role.</p>
          {role === 'admin' && <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              ['Total requests', requestCounts.total],
              ['Pending approvals', requestCounts.pending],
              ['Approved / blueprints', requestCounts.approved],
              ['Rejected', requestCounts.rejected],
            ].map(([label, value]) => <div key={String(label)} className="bg-white rounded-2xl border border-[#E8DCD0] p-5"><p className="text-xs uppercase tracking-wide text-[#766873]">{label}</p><p className="font-display text-3xl font-bold text-[#493044] mt-2">{value}</p></div>)}
          </section>}
          <section className="grid md:grid-cols-3 gap-4 mt-8">{links[role].map(([title, href, description]) => <Link key={href} href={href} className="bg-white rounded-2xl border border-[#E8DCD0] p-5 hover:border-[#B99A65] transition"><h2 className="font-display text-2xl font-semibold text-[#493044]">{title}</h2><p className="text-sm text-[#766873] mt-2">{description}</p><span className="inline-block text-sm text-[#8A6B36] mt-4">Open →</span></Link>)}</section>
        </main>
      </div>
    </div>
  );
}
