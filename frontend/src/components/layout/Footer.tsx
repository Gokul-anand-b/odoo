'use client';

import { Crown, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-1 pb-8 pt-4">
      {/* Premium gold divider */}
      <div className="gold-line mb-8" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(145deg, var(--gold), var(--gold-light))', boxShadow: 'var(--shadow-gold)' }}>
            <Crown className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-base font-bold" style={{ color: 'var(--text-ink)' }}>
            WedPilot <span className="text-gold">AI</span>
          </span>
        </div>

        {/* Tagline */}
        <p className="flex items-center gap-1.5 text-sm italic" style={{ color: 'var(--text-muted)' }}>
          Beyond Wedding Planning. Intelligent Wedding Resilience.
          <Heart className="w-3 h-3 inline" style={{ color: 'var(--rose)' }} />
        </p>

        {/* Copyright */}
        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          © 2026 WedPilot AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
