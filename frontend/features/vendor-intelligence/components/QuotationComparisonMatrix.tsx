'use client';

import React, { useState } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Layers, 
  ArrowRight,
  Info,
  Clock,
  Wine,
  Zap,
  Utensils
} from 'lucide-react';
import { Quotation, VendorCategory } from '../types/vendor.types';

interface QuotationComparisonMatrixProps {
  quotations: Quotation[];
  onSelectWinner: (quote: Quotation) => void;
}

export const QuotationComparisonMatrix: React.FC<QuotationComparisonMatrixProps> = ({
  quotations,
  onSelectWinner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('Catering & Banquets');
  const [simulatedGuestCount, setSimulatedGuestCount] = useState<number>(500);
  const [includeOvertimeHours, setIncludeOvertimeHours] = useState<number>(2);

  const categoryQuotes = quotations.filter((q) => q.category === selectedCategory);

  const bestValueQuote = categoryQuotes.reduce((prev, current) => 
    (prev.valueScore > current.valueScore) ? prev : current, categoryQuotes[0]);

  // Dynamic calculations based on simulated guest count & overtime
  const computeDynamicTotal = (quote: Quotation) => {
    const plateCost = (quote.pricePerPlate || 4000) * simulatedGuestCount;
    const overtimeTotal = quote.overtimeHourlyRate * includeOvertimeHours;
    return quote.basePrice - ((quote.pricePerPlate || 4000) * 500) + plateCost + overtimeTotal + quote.taxesGst + quote.hiddenCostsTotal + quote.missingInclusionsCost;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Simulation Controls */}
      <div className="p-6 rounded-2xl luxury-card border border-gold-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-500/20 text-gold-300 border border-gold-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Live Interactive Benchmarking
            </span>
            <span className="text-xs text-ivory-300">Operational Scenario 2</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-ivory-50 font-bold mt-1">
            Structured Quotation Comparison Matrix
          </h2>
          <p className="text-xs text-ivory-300 mt-1 max-w-xl">
            Side-by-side multi-vendor evaluation dynamically adjusting for headcount scaling, overtime liabilities, and hidden fine-print fees.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="bg-plum-900/90 p-4 rounded-xl border border-gold-500/30 flex flex-wrap items-center gap-6">
          {/* Guest Count Slider */}
          <div className="space-y-1.5 min-w-[180px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ivory-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gold-400" />
                Simulated Guests:
              </span>
              <span className="font-bold text-gold-300 font-serif">{simulatedGuestCount} Pax</span>
            </div>
            <input
              type="range"
              min={400}
              max={650}
              step={25}
              value={simulatedGuestCount}
              onChange={(e) => setSimulatedGuestCount(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-plum-950 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-ivory-300/60">
              <span>400 Min</span>
              <span>550 Base</span>
              <span>650 Max</span>
            </div>
          </div>

          {/* Overtime Simulator */}
          <div className="space-y-1.5 min-w-[150px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-ivory-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                Overtime Past 1:00 AM:
              </span>
              <span className="font-bold text-gold-300">{includeOvertimeHours} hrs</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={includeOvertimeHours}
              onChange={(e) => setIncludeOvertimeHours(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-plum-950 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-ivory-300/60">
              <span>0h</span>
              <span>2h (Expected)</span>
              <span>4h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Decision Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Banner 1: Landed Cost Advantage */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-plum-900 to-plum-850 border border-emerald-500/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">True Cost Winner</span>
            <p className="text-sm font-bold text-ivory-100">Mewar Royal Culinary</p>
            <p className="text-[11px] text-ivory-300">
              Saves <strong className="text-emerald-400">₹2.22 Lakhs</strong> vs. Jaipur Shahi Rasoi
            </p>
          </div>
        </div>

        {/* Banner 2: Fine-Print Exposure */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-plum-900 to-plum-850 border border-rose-500/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Hidden Cost Trap Flagged</span>
            <p className="text-sm font-bold text-ivory-100">+₹9.45 Lakhs in Hidden/Missing</p>
            <p className="text-[11px] text-ivory-300">Jaipur Shahi Rasoi surcharges detected</p>
          </div>
        </div>

        {/* Banner 3: Value Score Winner */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-plum-900 to-plum-850 border border-gold-500/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">Highest Value Index</span>
            <p className="text-sm font-bold text-ivory-100">94 / 100 Quality Rating</p>
            <p className="text-[11px] text-ivory-300">Zero missing inclusions, all-inclusive</p>
          </div>
        </div>
      </div>

      {/* 3. The 3 Columns Visual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryQuotes.map((quote) => {
          const isWinner = quote.id === bestValueQuote?.id;
          const isSelected = quote.status === 'Selected';
          const isClosed = quote.status === 'Closed' || quote.status === 'Rejected';
          const dynamicLanded = computeDynamicTotal(quote);

          return (
            <div
              key={quote.id}
              className={`luxury-card rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-2 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.3)]'
                  : isWinner
                  ? 'border-2 border-gold-400 shadow-gold-glow'
                  : isClosed
                  ? 'opacity-60 border-plum-800'
                  : 'border-gold-500/30'
              }`}
            >
              {/* Top Banner Tag */}
              {isSelected ? (
                <div className="bg-emerald-600 text-ivory-50 text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official Contract Awarded
                </div>
              ) : isWinner ? (
                <div className="bg-gold-gradient text-plum-950 text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow">
                  <Award className="w-3.5 h-3.5" />
                  WedPilot AI Top Recommendation
                </div>
              ) : isClosed ? (
                <div className="bg-plum-800 text-ivory-300 text-[10px] font-bold py-1 px-4 text-center tracking-wider uppercase">
                  Proposal Closed / Cancelled
                </div>
              ) : null}

              {/* Card Body */}
              <div className="p-6 space-y-5 flex-1">
                {/* Header with Circular Value Score Dial */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 block">
                      Ref: {quote.quoteNumber}
                    </span>
                    <h3 className="text-xl font-serif text-ivory-100 font-bold mt-0.5 leading-snug">
                      {quote.vendorName}
                    </h3>
                    <p className="text-xs text-ivory-300">{quote.category}</p>
                  </div>

                  {/* Circular Radial Score Dial */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke="#2E1527"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke={quote.valueScore >= 90 ? '#C59B51' : quote.valueScore >= 75 ? '#D7BA78' : '#D1A0AC'}
                        strokeWidth="5"
                        strokeDasharray={163}
                        strokeDashoffset={163 - (163 * quote.valueScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-sm font-bold font-serif text-ivory-100 block leading-none">
                        {quote.valueScore}
                      </span>
                      <span className="text-[8px] uppercase tracking-wider text-gold-400 leading-none">Score</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Visual Dial */}
                <div className="p-4 rounded-xl bg-plum-900/90 border border-gold-500/25 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-ivory-300">Sticker Advertised Rate:</span>
                    <span className="text-base font-bold text-ivory-200">
                      ₹{(quote.basePrice / 100000).toFixed(2)}L
                    </span>
                  </div>

                  {quote.pricePerPlate && (
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="text-ivory-300">Rate per Guest Plate:</span>
                      <span className="font-semibold text-gold-300">
                        ₹{quote.pricePerPlate.toLocaleString('en-IN')} / plate
                      </span>
                    </div>
                  )}

                  {/* True Landed Cost with Dynamic Calculation */}
                  <div className="pt-2.5 border-t border-plum-700/80 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-gold-400 block">
                        True Landed Cost ({simulatedGuestCount} Pax):
                      </span>
                      <span className="text-[10px] text-ivory-300">With {includeOvertimeHours}h Overtime + Taxes</span>
                    </div>
                    <span className="text-xl font-serif font-extrabold text-gold-300">
                      ₹{(dynamicLanded / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                </div>

                {/* Visual Feature Check Matrix */}
                <div className="space-y-2 pt-1 text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-ivory-300 block">
                    Essential Service Clauses:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-plum-950/60 border border-plum-800 flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <div>
                        <span className="text-ivory-300 block text-[9px]">Corkage Fee</span>
                        <span className={`font-semibold ${quote.hiddenCosts.some(h => h.category === 'Corkage') ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {quote.hiddenCosts.some(h => h.category === 'Corkage') ? '₹850 / bottle' : 'Nil (Free)'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-plum-950/60 border border-plum-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <div>
                        <span className="text-ivory-300 block text-[9px]">Overtime Penalty</span>
                        <span className="font-semibold text-ivory-100">
                          ₹{(quote.overtimeHourlyRate / 1000).toFixed(0)}k / hr
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-plum-950/60 border border-plum-800 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <div>
                        <span className="text-ivory-300 block text-[9px]">Generator Fuel</span>
                        <span className={`font-semibold ${quote.hiddenCosts.some(h => h.category === 'Power/Fuel') ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {quote.hiddenCosts.some(h => h.category === 'Power/Fuel') ? 'Excluded' : 'Bundled'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-plum-950/60 border border-plum-800 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <div>
                        <span className="text-ivory-300 block text-[9px]">Glassware Included</span>
                        <span className={`font-semibold ${quote.missingInclusions.some(m => m.item.includes('Glassware')) ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {quote.missingInclusions.some(m => m.item.includes('Glassware')) ? 'No (Hire Ext)' : 'Crystal Cut'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surcharges Quick Pill Summary */}
                <div className="p-3 rounded-xl bg-plum-950/80 border border-gold-500/20 flex justify-between items-center text-xs">
                  <span className="text-ivory-300">Total Unbudgeted Risk:</span>
                  <span className={`font-bold ${quote.hiddenCostsTotal + quote.missingInclusionsCost > 300000 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    +₹{((quote.hiddenCostsTotal + quote.missingInclusionsCost) / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                {isSelected ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold text-xs cursor-default flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Contract Formally Awarded
                  </button>
                ) : isClosed ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-plum-900 border border-plum-800 text-ivory-300/40 text-xs cursor-not-allowed"
                  >
                    Request Closed
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectWinner(quote)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow ${
                      isWinner
                        ? 'bg-gold-gradient text-plum-950 hover:brightness-110 shadow-gold-subtle'
                        : 'bg-plum-800 border border-gold-500/40 text-gold-300 hover:bg-plum-750'
                    }`}
                  >
                    Select & Award Contract
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
