'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import WeddingBlueprintScreen from '@/features/wedding-blueprint/screens/WeddingBlueprintScreen';

export default function WeddingBlueprintPage() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-6">
            <WeddingBlueprintScreen />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
