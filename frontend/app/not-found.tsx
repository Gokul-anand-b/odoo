import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <h2 className="text-3xl font-serif text-gold-300 font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-sm text-ivory-300 mb-6">The requested wedding operations screen does not exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-gold-gradient text-plum-950 font-bold text-xs"
      >
        Return to WedPilot AI Hub
      </Link>
    </div>
  );
}
