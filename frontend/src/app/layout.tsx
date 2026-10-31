import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eternelle — Luxury Operations & Intelligent Wedding Resilience',
  description:
    'Eternelle is the premium intelligent wedding planning and operations management platform for luxury wedding agencies. Orchestrate every celebration perfectly.',
  keywords: ['wedding planning', 'luxury weddings', 'wedding management', 'AI wedding planner', 'vendor management', 'Eternelle'],
  openGraph: {
    title: 'Eternelle — Luxury Operations',
    description: 'Intelligent Wedding Resilience & Operations Platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'var(--font-body, "Inter", system-ui, sans-serif)' }}>
        {children}
      </body>
    </html>
  );
}
