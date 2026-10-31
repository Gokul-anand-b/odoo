'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import CommandCenterDashboard from '../../../command-center/CommandCenterDashboard';

export default function CommandCentrePage() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 min-w-0">
          <CommandCenterDashboard />
        </main>
        <Footer />
      </div>
    </div>
  );
}
