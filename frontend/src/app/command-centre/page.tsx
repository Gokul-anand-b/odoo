'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import CommandCentreScreen from '@/features/command-centre/CommandCentreScreen';

export default function CommandCentrePage() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-screen-2xl px-4 py-6 lg:px-8">
            <CommandCentreScreen />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
