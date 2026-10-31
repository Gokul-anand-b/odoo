'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi, AuthUser } from './services/authService';

export default function RoleRegistrationForm({ role }: { role: 'customer' | 'vendor' }) {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const label = role === 'customer' ? 'Customer' : 'Vendor';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user: AuthUser = await authApi.register(form.email, form.password, role, form.fullName);
      router.replace(user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--ivory)' }}>
      <section className="w-full max-w-md bg-white rounded-3xl border border-[#E8DCD0] p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B99A65] font-semibold">The Royal Knot</p>
        <h1 className="font-display text-3xl font-bold text-[#493044] mt-2">{label} registration</h1>
        <p className="text-sm text-[#766873] mt-2">Create a dedicated {role} account. Roles cannot be changed from the client.</p>
        <form onSubmit={submit} className="space-y-4 mt-6">
          <label className="block text-sm font-medium text-[#493044]">Full name<input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-3 outline-none focus:border-[#B99A65]" /></label>
          <label className="block text-sm font-medium text-[#493044]">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-3 outline-none focus:border-[#B99A65]" /></label>
          <label className="block text-sm font-medium text-[#493044]">Password<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-3 outline-none focus:border-[#B99A65]" /></label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-[#493044] text-white py-3 font-semibold disabled:opacity-60">{loading ? 'Creating account…' : `Create ${label.toLowerCase()} account`}</button>
        </form>
        <p className="text-sm text-[#766873] mt-6">Already registered? <Link href="/login" className="text-[#8A6B36]">Sign in</Link></p>
      </section>
    </main>
  );
}
