'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import HeroSection from '@/components/layout/HeroSection';
import FeaturesSection from '@/components/layout/FeaturesSection';
import Footer from '@/components/layout/Footer';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        <TopNav />

        {/* Page Body */}
        <motion.main
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 min-w-0"
        >
          <div className="dashboard-page flex flex-col gap-8 lg:gap-10">
            {/* Hero */}
            <HeroSection />

            {/* Platform capabilities */}
            <FeaturesSection />

            {/* Footer */}
            <Footer />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
