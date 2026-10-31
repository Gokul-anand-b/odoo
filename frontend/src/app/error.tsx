'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--ivory, #F7EFE8)' }}
    >
      <div
        className="max-w-md w-full p-8 rounded-3xl text-center space-y-6 shadow-2xl"
        style={{
          background: 'var(--warm-white, #FFFCF8)',
          border: '1.5px dashed rgba(185,154,101,0.3)',
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: 'rgba(185,154,101,0.15)' }}
        >
          <AlertTriangle className="w-8 h-8 text-[#B99A65]" />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-[#2A1E26]">
            Something went wrong
          </h2>
          <p className="text-xs text-[#8A7380] mt-2 leading-relaxed">
            {error?.message || 'An unexpected error occurred while rendering the page.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-[#493044] hover:bg-[#FAF5F0] text-xs font-bold transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
