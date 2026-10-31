import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WedPilot AI — Beyond Wedding Planning. Intelligent Wedding Resilience.',
  description:
    'WedPilot AI is the premium intelligent wedding planning and operations management platform for luxury wedding agencies. Orchestrate every celebration perfectly.',
  keywords: ['wedding planning', 'luxury weddings', 'wedding management', 'AI wedding planner', 'vendor management'],
  openGraph: {
    title: 'WedPilot AI',
    description: 'Beyond Wedding Planning. Intelligent Wedding Resilience.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  );
}
