'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  Users, 
  Database,
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderProps {
  onSearchChange?: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchChange }) => {
  return (
    <header className="h-16 border-b border-gold-400/20 bg-wedding-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search proposals, caterers, floral decor... (Ctrl+K)"
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-wedding-900 border border-gold-400/25 focus:border-gold-400 focus:outline-none text-xs text-cream-100 placeholder:text-cream-300/40"
        />
        <Search className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-3" />
      </div>

      {/* Royal Wedding Operational Key Stat Strip */}
      <div className="hidden lg:flex items-center gap-6 text-xs border-x border-gold-400/20 px-6">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-cream-300 block">Wedding Budget</span>
          <span className="font-bold text-gold-300 font-serif text-sm">₹3.40 Crore</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-cream-300 block">Committed Outlay</span>
          <span className="font-bold text-cream-100">₹1.15 Cr (34%)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-cream-300 block">Guest Baseline</span>
          <span className="font-bold text-cream-100 flex items-center gap-1">
            <Users className="w-3 h-3 text-gold-400" /> 550 Guests
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-cream-300 block">Wedding Celebration</span>
          <span className="font-bold text-cream-100 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gold-400" /> Nov 18-20, 2026
          </span>
        </div>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3">

        <button className="p-2 rounded-xl bg-wedding-900 border border-gold-400/25 text-gold-400 hover:text-gold-300 hover:bg-wedding-850 transition relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-vermillion-500 absolute top-1.5 right-1.5" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gold-400/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 flex items-center justify-center text-wedding-950 font-bold text-xs shadow-gold-subtle">
            RK
          </div>
          <div className="hidden sm:block text-left text-xs">
            <span className="font-bold text-cream-100 block leading-tight">Lead Architect</span>
            <span className="text-[10px] text-gold-400">The Royal Knot Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};
