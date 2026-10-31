import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WedPilot AI | Vendor Intelligence Hub',
  description: 'Intelligent Wedding Operations Platform — The Royal Knot Luxury Weddings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-wedding-950 text-cream-100 min-h-screen selection:bg-gold-400 selection:text-wedding-950 antialiased font-sans">
        {/* Warm Golden Royal Wedding Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[750px] h-[750px] bg-gold-400/15 rounded-full blur-[170px]" />
          <div className="absolute top-1/3 -right-24 w-[650px] h-[650px] bg-gold-500/12 rounded-full blur-[180px]" />
          <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
