import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--ivory)' }}>
      <section className="w-full max-w-md bg-white rounded-3xl border border-[#E8DCD0] p-8 shadow-xl">
        <h1 className="font-display text-3xl font-bold text-[#493044]">Password recovery</h1>
        <p className="text-sm text-[#766873] mt-3">Password recovery is managed by the configured authentication provider. Contact an administrator if self-service recovery is not enabled yet.</p>
        <Link href="/login" className="inline-block mt-6 rounded-xl bg-[#493044] text-white px-5 py-3 font-semibold">Return to login</Link>
      </section>
    </main>
  );
}
