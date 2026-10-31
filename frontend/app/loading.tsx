export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
      <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs text-gold-300 font-serif tracking-widest uppercase">WedPilot AI • Loading Experience...</p>
    </div>
  );
}
