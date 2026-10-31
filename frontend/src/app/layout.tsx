import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body style={{ fontFamily: 'var(--font-body, "Inter", system-ui, sans-serif)' }}>
        {children}
      </body>
    </html>
  );
}
