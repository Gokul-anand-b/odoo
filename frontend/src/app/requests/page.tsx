'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import { clientManagementApi, WeddingRequest, WeddingRequestInput } from '@/features/client-management/services/clientManagementService';

const initialForm: WeddingRequestInput = {
  wedding_name: '',
  wedding_date: '',
  location: '',
  guest_count: 150,
  theme: '',
  budget: '',
  package: 'Full-Service',
  requirements: '',
};

const statusLabels: Record<WeddingRequest['status'], string> = {
  pending_approval: 'Pending Approval',
  changes_requested: 'Changes Requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<WeddingRequest[]>([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRequests = async () => {
    try {
      setRequests(await clientManagementApi.list());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load wedding requests.');
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadRequests(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      await clientManagementApi.create(form);
      setForm(initialForm);
      setSuccess('Your wedding request was submitted for admin approval.');
      await loadRequests();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit the request.');
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <TopNav />
        <main className="max-w-6xl mx-auto px-5 lg:px-10 py-8 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B99A65] font-semibold">Client portal</p>
            <h1 className="font-display text-4xl text-[#493044] font-bold mt-2">Wedding requests</h1>
            <p className="text-sm text-[#766873] mt-2">Submit a celebration brief and follow every approval decision.</p>
          </div>

          <section className="bg-white rounded-3xl border border-[#E8DCD0] p-6 shadow-sm">
            <h2 className="font-display text-2xl text-[#493044] font-semibold mb-5">Create a wedding request</h2>
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
              {[
                ['wedding_name', 'Wedding name', 'text'],
                ['wedding_date', 'Wedding date', 'date'],
                ['location', 'Location', 'text'],
                ['theme', 'Theme', 'text'],
                ['budget', 'Budget (INR)', 'number'],
              ].map(([name, label, type]) => (
                <label key={name} className="text-sm text-[#493044] font-medium">
                  {label}
                  <input required={name !== 'theme'} type={type} value={String(form[name as keyof WeddingRequestInput])}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-2.5 font-normal outline-none focus:border-[#B99A65]" />
                </label>
              ))}
              <label className="text-sm text-[#493044] font-medium">Guest count
                <input required type="number" min="1" value={form.guest_count}
                  onChange={(e) => setForm({ ...form, guest_count: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-2.5 font-normal outline-none focus:border-[#B99A65]" />
              </label>
              <label className="text-sm text-[#493044] font-medium">Package
                <select value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-2.5 font-normal outline-none focus:border-[#B99A65]">
                  <option>Full-Service</option><option>Partial Planning</option><option>Day-of Coordination</option>
                </select>
              </label>
              <label className="md:col-span-2 text-sm text-[#493044] font-medium">Requirements
                <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  rows={3} className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-2.5 font-normal outline-none focus:border-[#B99A65]" />
              </label>
              {error && <p className="md:col-span-2 text-sm text-red-700">{error}</p>}
              {success && <p className="md:col-span-2 text-sm text-green-700">{success}</p>}
              <button className="md:col-span-2 rounded-xl bg-[#493044] text-white px-5 py-3 font-semibold hover:bg-[#3A2536]">Submit for approval</button>
            </form>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between"><h2 className="font-display text-2xl text-[#493044] font-semibold">My submissions</h2><Link href="/" className="text-sm text-[#8A6B36]">Back to overview</Link></div>
            {requests.length === 0 ? <div className="bg-white rounded-2xl border border-[#E8DCD0] p-6 text-sm text-[#766873]">No wedding requests yet.</div> : requests.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl border border-[#E8DCD0] p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div><h3 className="font-semibold text-[#493044]">{item.wedding_name}</h3><p className="text-sm text-[#766873]">{item.wedding_date} · {item.location} · {item.guest_count} guests</p>{item.decision_reason && <p className="text-sm text-[#8A4B44] mt-2">Admin note: {item.decision_reason}</p>}</div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold bg-[#F7EFE8] text-[#493044]">{statusLabels[item.status]}</span>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
