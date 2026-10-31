'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';
import { authApi } from '@/features/client-management/services/authService';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.login(email, password, 'admin');
      router.replace('/admin/dashboard');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in as admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--ivory)' }}>
      <section className="w-full max-w-md bg-white rounded-3xl border border-[#E8DCD0] p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #B99A65, #D4BA8A)' }}><Crown className="text-white" /></div>
          <div><p className="font-display text-2xl font-bold text-[#493044]">WedPilot AI</p><p className="text-xs uppercase tracking-[0.18em] text-[#B99A65]">Admin workspace</p></div>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#493044]">Admin sign in</h1>
        <p className="text-sm text-[#766873] mt-2 mb-6">Use the administrator email configured in the backend environment.</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium text-[#493044]">Admin email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-3 outline-none focus:border-[#B99A65]" /></label>
          <label className="block text-sm font-medium text-[#493044]">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-[#E8DCD0] px-3 py-3 outline-none focus:border-[#B99A65]" /></label>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-xl bg-[#493044] text-white py-3 font-semibold disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in as admin'}</button>
        </form>
        <div className="mt-6 flex justify-between text-sm"><Link href="/login" className="text-[#8A6B36]">User sign in</Link><Link href="/forgot-password" className="text-[#8A6B36]">Forgot password?</Link></div>
      </section>
    </main>
  );
}
