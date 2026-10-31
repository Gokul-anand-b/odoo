import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WedPilot AI | Smart Vendor Intelligence & Quote Comparison',
  description: 'Intelligent Wedding Operations & Resilience Platform — The Royal Knot Luxury Weddings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-plum-950 text-ivory-100 min-h-screen selection:bg-gold-500 selection:text-plum-950 antialiased">
        {/* Subtle Luxury Ambient Lighting */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-plum-700/20 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-gold-600/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-mauve-500/10 rounded-full blur-[130px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
