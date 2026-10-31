'use client';

import React from 'react';
import { 
  Building2, 
  Scale
} from 'lucide-react';

interface SidebarProps {
  onOpenRegisterModal: () => void;
  quotesCount: number;
  vendorsCount: number;
  awardedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenRegisterModal,
  quotesCount,
  vendorsCount,
  awardedCount,
}) => {

  return (
    <aside className="w-72 bg-gradient-to-b from-wedding-950 via-wedding-900 to-wedding-950 border-r border-gold-400/20 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand & Royal Crest */}
      <div>
        <div className="p-5 border-b border-gold-400/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gold-gradient p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-wedding-950 rounded-[14px] flex items-center justify-center">
                <span className="font-serif font-extrabold text-gold-400 text-xl tracking-wider">WP</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-lg font-bold text-cream-100 tracking-wide">
                  WedPilot <span className="text-gold-400">AI</span>
                </h1>
              </div>
              <span className="text-[10px] font-semibold text-gold-400/90 tracking-widest uppercase">
                The Royal Knot • Udaipur
              </span>
            </div>
          </div>

          {/* Active Wedding Context Pill */}
          <div className="mt-4 p-3 rounded-xl bg-wedding-850 border border-gold-400/30 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-widest text-gold-400">Live Operation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs font-serif font-bold text-cream-100 mt-1 truncate">
              Samar & Alizeh Royal Wedding
            </p>
            <p className="text-[10px] text-cream-300">City Palace, Udaipur • 550 Guests</p>
          </div>
        </div>

        {/* Navigation Links - Single Dedicated Nav Item */}
        <div className="p-3 space-y-1.5">
          <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-gold-400/80">
            Platform Navigation
          </span>

          <div
            className="w-full p-3.5 rounded-xl text-left flex items-start gap-3 bg-wedding-800 border border-gold-400 shadow-gold-subtle text-cream-50 relative"
          >
            <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-gold-400 rounded-r-full shadow-gold-glow" />
            <div className="p-2 rounded-lg shrink-0 bg-gold-500 text-wedding-950 font-bold shadow">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cream-50 leading-tight">
                  Vendor Intelligence & Quote Comparison
                </span>
              </div>
              <p className="text-[10px] text-gold-300/80 truncate mt-1">
                Unified single-page command hub
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-gold-500/20 text-gold-300 border border-gold-400/40">
                  {quotesCount} Bids Active
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-wedding-850 text-cream-300 border border-gold-400/20">
                  {vendorsCount} Suppliers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Actions */}
      <div className="p-4 border-t border-gold-400/20 space-y-3 bg-wedding-950/80">
        <div className="flex items-center justify-between text-xs text-cream-300 px-1">
          <span>Awarded Contracts:</span>
          <span className="font-bold text-emerald-400">{awardedCount} Locked</span>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="w-full py-2.5 rounded-xl btn-gold text-xs flex items-center justify-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5" />
          Onboard New Supplier
        </button>
      </div>
    </aside>
  );
};
