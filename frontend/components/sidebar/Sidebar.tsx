'use client';

import React from 'react';
import { 
  Building2, 
  Scale, 
  Sparkles, 
  UploadCloud, 
  Award, 
  Calendar, 
  Database,
  Layers,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenRegisterModal: () => void;
  quotesCount: number;
  vendorsCount: number;
  awardedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onOpenRegisterModal,
  quotesCount,
  vendorsCount,
  awardedCount,
}) => {
  const sections = [
    {
      id: 'matrix',
      label: 'Comparison Matrix',
      sub: 'Side-by-side bid analysis',
      icon: Scale,
      badge: `${quotesCount} Bids`,
    },
    {
      id: 'hidden_costs',
      label: 'Hidden Fee Auditor',
      sub: 'True landed cost novelty',
      icon: Sparkles,
      badge: 'Novelty',
      badgeColor: 'bg-gold-500/20 text-gold-300 border border-gold-400/40',
    },
    {
      id: 'upload_ocr',
      label: 'Upload Quote & OCR',
      sub: 'PDF ingestion & parser',
      icon: UploadCloud,
    },
    {
      id: 'directory',
      label: 'Supplier Directory',
      sub: 'Jaipur & Udaipur partners',
      icon: Building2,
      badge: `${vendorsCount}`,
    },
  ];

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

        {/* Navigation Links */}
        <div className="p-3 space-y-1.5">
          <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-gold-400/70">
            Vendor Intelligence
          </span>

          {sections.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-all relative ${
                  isActive
                    ? 'bg-wedding-800 border border-gold-400 shadow-gold-subtle text-cream-50'
                    : 'text-cream-300 hover:text-cream-100 hover:bg-wedding-850/60 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-gold-400 rounded-r-full" />
                )}
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive ? 'bg-gold-500 text-wedding-950 font-bold shadow' : 'bg-wedding-900 text-gold-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          item.badgeColor || 'bg-wedding-850 text-cream-300 border border-gold-400/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-cream-300/70 truncate mt-0.5">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Supabase Status & Action */}
      <div className="p-4 border-t border-gold-400/20 space-y-3 bg-wedding-950/80">
        <div className="p-3 rounded-xl bg-wedding-900 border border-gold-400/25 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-cream-200">Supabase DB</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            PostgreSQL Ready
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-cream-300 px-1">
          <span>Awarded Contracts:</span>
          <span className="font-bold text-emerald-400">{awardedCount} Locked</span>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="w-full py-2.5 rounded-xl bg-gold-gradient text-wedding-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 transition flex items-center justify-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5" />
          Onboard New Supplier
        </button>
      </div>
    </aside>
  );
};
