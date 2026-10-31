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
          <div className="absolute -top-32 left-1/3 w-[700px] h-[700px] bg-gold-400/10 rounded-full blur-[160px]" />
          <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-gold-600/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-vermillion-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
