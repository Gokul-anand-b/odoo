'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h2 className="text-2xl font-serif text-gold-300 font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-ivory-300 mb-6">{error.message || 'An unexpected operational error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-xl bg-gold-gradient text-plum-950 font-bold text-xs"
      >
        Try Again
      </button>
    </div>
  );
}
