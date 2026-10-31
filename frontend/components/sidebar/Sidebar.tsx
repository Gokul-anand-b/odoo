'use client';

import React from 'react';
import { 
  Building2, 
  Scale, 
  Sparkles, 
  UploadCloud, 
  ShieldCheck, 
  Award, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Database,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'matrix' | 'hidden_cost' | 'upload' | 'directory';
  setActiveTab: (tab: 'matrix' | 'hidden_cost' | 'upload' | 'directory') => void;
  onOpenRegisterModal: () => void;
  quotesCount: number;
  vendorsCount: number;
  awardedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRegisterModal,
  quotesCount,
  vendorsCount,
  awardedCount,
}) => {
  const navItems = [
    {
      id: 'matrix' as const,
      label: 'Quote Comparison Matrix',
      description: 'Side-by-side bid benchmarking',
      icon: Scale,
      badge: `${quotesCount} Bids`,
    },
    {
      id: 'hidden_cost' as const,
      label: 'Hidden Cost & Value Auditor',
      description: 'Signature AI fee extraction',
      icon: Sparkles,
      badge: 'Novelty',
      badgeColor: 'bg-gold-500/20 text-gold-300 border border-gold-500/40',
    },
    {
      id: 'upload' as const,
      label: 'Upload Quotation & OCR',
      description: 'PDF ingestion & line extraction',
      icon: UploadCloud,
    },
    {
      id: 'directory' as const,
      label: 'Royal Vendor Directory',
      description: 'Jaipur & Udaipur vetted suppliers',
      icon: Building2,
      badge: `${vendorsCount}`,
    },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-plum-950 via-plum-900 to-plum-950 border-r border-gold-500/25 flex flex-col justify-between h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* 1. Brand & Royal Crest */}
      <div>
        <div className="p-5 border-b border-gold-500/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gold-gradient p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-plum-950 rounded-[14px] flex items-center justify-center">
                <span className="font-serif font-extrabold text-gold-400 text-xl tracking-wider">WP</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-serif text-lg font-bold text-ivory-50 tracking-wide">
                  WedPilot <span className="text-gold-400">AI</span>
                </h1>
              </div>
              <span className="text-[10px] font-semibold text-gold-400/90 tracking-widest uppercase">
                The Royal Knot • Udaipur
              </span>
            </div>
          </div>

          {/* Active Wedding Selector Badge */}
          <div className="mt-4 p-3 rounded-xl bg-plum-850/90 border border-gold-500/30 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold tracking-widest text-gold-400">Active Operation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs font-serif font-bold text-ivory-100 mt-1 truncate">
              Samar & Alizeh Royal Wedding
            </p>
            <p className="text-[10px] text-ivory-300">City Palace, Udaipur • 550 Guests</p>
          </div>
        </div>

        {/* 2. Primary Navigation */}
        <div className="p-3 space-y-1.5">
          <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-gold-400/70">
            Feature 2: Vendor Intelligence
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-all relative ${
                  isActive
                    ? 'bg-plum-800/90 border border-gold-400 shadow-gold-subtle text-ivory-50'
                    : 'text-ivory-300 hover:text-ivory-100 hover:bg-plum-850/60 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-gold-400 rounded-r-full" />
                )}
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive ? 'bg-gold-500 text-plum-950 font-bold shadow' : 'bg-plum-900 text-gold-400'
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
                          item.badgeColor || 'bg-plum-800 text-ivory-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-ivory-300/70 truncate mt-0.5">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Operational Readiness & Supabase Status */}
      <div className="p-4 border-t border-gold-500/20 space-y-3 bg-plum-950/70">
        <div className="p-3 rounded-xl bg-plum-900/60 border border-gold-500/20 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-ivory-200">Supabase DB</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            PostgreSQL Ready
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-ivory-300 px-1">
          <span>Awarded Contracts</span>
          <span className="font-bold text-emerald-400">{awardedCount} Locked</span>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="w-full py-2.5 rounded-xl bg-gold-gradient text-plum-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 transition flex items-center justify-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5" />
          Onboard New Supplier
        </button>
      </div>
    </aside>
  );
};
