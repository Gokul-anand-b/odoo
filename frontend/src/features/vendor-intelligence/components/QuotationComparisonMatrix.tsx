'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  Award, 
  Users, 
  Clock, 
  Wine, 
  Zap, 
  Utensils, 
  ArrowRight,
  AlertTriangle,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { Quotation, VendorCategory } from '../types/vendor.types';

interface QuotationComparisonMatrixProps {
  quotations: Quotation[];
  onSelectWinner: (quote: Quotation) => void;
  selectedCategory: VendorCategory;
  onCategoryChange: (cat: VendorCategory) => void;
}

export const QuotationComparisonMatrix: React.FC<QuotationComparisonMatrixProps> = ({
  quotations,
  onSelectWinner,
  selectedCategory,
  onCategoryChange,
}) => {
  const [simulatedGuestCount, setSimulatedGuestCount] = useState<number>(500);
  const [includeOvertimeHours, setIncludeOvertimeHours] = useState<number>(2);
  
  // Selection mode: 'all' or 'custom'
  const [compareMode, setCompareMode] = useState<'all' | 'custom'>('all');
  const [selectedQuoteIds, setSelectedQuoteIds] = useState<string[]>([]);

  // Filter quotations for current category
  const categoryQuotes = useMemo(
    () => quotations.filter((q) => q.category === selectedCategory),
    [quotations, selectedCategory]
  );

  // Initialize selected quote IDs if empty and category has quotes
  const effectiveSelectedIds = useMemo(() => {
    if (selectedQuoteIds.length > 0) return selectedQuoteIds;
    return categoryQuotes.map((q) => q.id);
  }, [selectedQuoteIds, categoryQuotes]);

  // Quotations to actually display side-by-side
  const displayedQuotes = useMemo(() => {
    if (compareMode === 'all') return categoryQuotes;
    return categoryQuotes.filter((q) => effectiveSelectedIds.includes(q.id));
  }, [compareMode, categoryQuotes, effectiveSelectedIds]);

  const bestValueQuote = useMemo(() => {
    if (displayedQuotes.length === 0) return null;
    return displayedQuotes.reduce((prev, current) => 
      (prev.valueScore > current.valueScore) ? prev : current, displayedQuotes[0]);
  }, [displayedQuotes]);

  const toggleQuoteSelection = (id: string) => {
    setSelectedQuoteIds((prev) => {
      const current = prev.length > 0 ? prev : categoryQuotes.map((q) => q.id);
      if (current.includes(id)) {
        // Prevent deselecting all
        if (current.length <= 1) return current;
        return current.filter((item) => item !== id);
      } else {
        return [...current, id];
      }
    });
  };

  const computeDynamicTotal = (quote: Quotation) => {
    const plateCost = (quote.pricePerPlate || 4000) * simulatedGuestCount;
    const overtimeTotal = quote.overtimeHourlyRate * includeOvertimeHours;
    return quote.basePrice - ((quote.pricePerPlate || 4000) * 500) + plateCost + overtimeTotal + quote.taxesGst + quote.hiddenCostsTotal + quote.missingInclusionsCost;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Simulation Controls */}
      <div className="p-6 rounded-2xl luxury-gold-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-500/20 text-gold-300 border border-gold-400/40 flex items-center gap-1 font-sans">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Decision Intelligence Matrix
            </span>
            <span className="text-xs text-cream-300">{selectedCategory} — Live Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-cream-100 font-bold mt-1">
            Quotation Comparison & True Cost Benchmarking
          </h2>
          <p className="text-xs text-cream-300 mt-1 max-w-xl font-sans">
            Side-by-side proposal analysis dynamically factoring in guest scale, overtime penalties, and hidden contract fineprint.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="bg-wedding-900 p-4 rounded-xl border border-gold-400/30 flex flex-wrap items-center gap-6">
          {/* Guest Count Slider */}
          <div className="space-y-1.5 min-w-[190px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cream-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gold-400" />
                Simulated Guest Scale:
              </span>
              <span className="font-bold text-gold-300 font-serif">{simulatedGuestCount} Guests</span>
            </div>
            <input
              type="range"
              min={400}
              max={650}
              step={25}
              value={simulatedGuestCount}
              onChange={(e) => setSimulatedGuestCount(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-wedding-950 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-cream-300/60 font-sans">
              <span>400 Intimate</span>
              <span>550 Confirmed</span>
              <span>650 Peak</span>
            </div>
          </div>

          {/* Overtime Simulator */}
          <div className="space-y-1.5 min-w-[150px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cream-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                Overtime Past Curfew:
              </span>
              <span className="font-bold text-gold-300">{includeOvertimeHours} Hours</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={includeOvertimeHours}
              onChange={(e) => setIncludeOvertimeHours(Number(e.target.value))}
              className="w-full accent-gold-500 cursor-pointer h-1.5 bg-wedding-950 rounded-lg"
            />
            <div className="flex justify-between text-[9px] text-cream-300/60 font-sans">
              <span>0h</span>
              <span>2h (Standard)</span>
              <span>4h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quotation Selector Bar: Compare All vs Particular Selected Numbers */}
      <div className="p-4 rounded-xl bg-wedding-900 border border-gold-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gold-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold-400" />
            Comparison Scope:
          </span>
          <div className="inline-flex rounded-lg p-0.5 bg-wedding-950 border border-gold-400/20 text-xs">
            <button
              type="button"
              onClick={() => setCompareMode('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                compareMode === 'all'
                  ? 'bg-gold-gradient text-wedding-950 shadow'
                  : 'text-cream-300 hover:text-cream-100'
              }`}
            >
              Compare All ({categoryQuotes.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setCompareMode('custom');
                if (selectedQuoteIds.length === 0) {
                  setSelectedQuoteIds(categoryQuotes.map((q) => q.id));
                }
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                compareMode === 'custom'
                  ? 'bg-gold-gradient text-wedding-950 shadow'
                  : 'text-cream-300 hover:text-cream-100'
              }`}
            >
              Select Specific ({displayedQuotes.length} active)
            </button>
          </div>
        </div>

        {/* Individual Quote Toggles when in Custom or All Mode */}
        {categoryQuotes.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-cream-300/70 mr-1">Proposals:</span>
            {categoryQuotes.map((q) => {
              const isChecked = compareMode === 'all' || effectiveSelectedIds.includes(q.id);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    if (compareMode === 'all') setCompareMode('custom');
                    toggleQuoteSelection(q.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                    isChecked
                      ? 'bg-gold-500/20 border-gold-400/60 text-gold-300'
                      : 'bg-wedding-950 border-wedding-800 text-cream-300/60 hover:text-cream-300'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-gold-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-cream-300/50" />
                  )}
                  <span className="font-bold">{q.quoteNumber}</span>
                  <span className="text-[10px] opacity-75 truncate max-w-[100px]">({q.vendorName.split(' ')[0]})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Decision Highlights Banner */}
      {displayedQuotes.length > 0 && bestValueQuote && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <div className="p-4 rounded-xl bg-gradient-to-br from-wedding-900 to-wedding-850 border border-emerald-500/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">True Cost Winner</span>
              <p className="text-sm font-bold text-cream-100 font-serif">{bestValueQuote.vendorName}</p>
              <p className="text-[11px] text-cream-300">
                True landed cost: <strong className="text-emerald-400">₹{(computeDynamicTotal(bestValueQuote) / 100000).toFixed(2)} Lakhs</strong>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-wedding-900 to-wedding-850 border border-vermillion-500/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-vermillion-500/20 border border-vermillion-500/40 text-vermillion-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-vermillion-400 tracking-wider">Audited Fineprint</span>
              <p className="text-sm font-bold text-cream-100 font-serif">
                ₹{((bestValueQuote.hiddenCostsTotal + bestValueQuote.missingInclusionsCost) / 100000).toFixed(2)}L Unbudgeted
              </p>
              <p className="text-[11px] text-cream-300">
                {bestValueQuote.hiddenCosts.length} hidden fees, {bestValueQuote.missingInclusions.length} exclusions checked
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-wedding-900 to-wedding-850 border border-gold-400/40 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-400/40 text-gold-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">Top Algorithm Rating</span>
              <p className="text-sm font-bold text-cream-100 font-serif">{bestValueQuote.valueScore} / 100 Index</p>
              <p className="text-[11px] text-cream-300">Composite index based on landed cost & reliability</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. The Side-by-Side Comparison Cards */}
      {displayedQuotes.length === 0 ? (
        <div className="p-12 rounded-2xl luxury-gold-card text-center space-y-3 font-sans">
          <Layers className="w-10 h-10 text-gold-400 mx-auto opacity-60" />
          <h3 className="text-lg font-serif font-bold text-cream-100">No proposals available in this view</h3>
          <p className="text-xs text-cream-300 max-w-md mx-auto">
            Upload a vendor quotation PDF below or select specific quotation checkboxes above to view the side-by-side comparison matrix.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedQuotes.map((quote) => {
            const isWinner = quote.id === bestValueQuote?.id;
            const isSelected = quote.status === 'Selected';
            const isClosed = quote.status === 'Closed' || quote.status === 'Rejected';
            const dynamicLanded = computeDynamicTotal(quote);

            return (
              <div
                key={quote.id}
                className={`luxury-gold-card rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
                  isSelected
                    ? 'border-2 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.3)]'
                    : isWinner
                    ? 'border-2 border-gold-400 shadow-gold-glow'
                    : isClosed
                    ? 'opacity-60 border-wedding-800'
                    : 'border-gold-400/25'
                }`}
              >
                {isSelected ? (
                  <div className="bg-emerald-600 text-cream-50 text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow font-sans">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Official Contract Awarded
                  </div>
                ) : isWinner ? (
                  <div className="bg-gold-gradient text-wedding-950 text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow font-sans">
                    <Award className="w-3.5 h-3.5" />
                    Eternelle AI Top Recommendation
                  </div>
                ) : isClosed ? (
                  <div className="bg-wedding-850 text-cream-300 text-[10px] font-bold py-1 px-4 text-center tracking-wider uppercase font-sans">
                    Proposal Closed / Competitor Awarded
                  </div>
                ) : null}

                <div className="p-6 space-y-5 flex-1">
                  {/* Header with Circular Radial Dial */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 block font-sans">
                        Ref: {quote.quoteNumber}
                      </span>
                      <h3 className="text-xl font-serif text-cream-100 font-bold mt-0.5 leading-snug">
                        {quote.vendorName}
                      </h3>
                      <p className="text-xs text-cream-300 font-sans">{quote.category}</p>
                    </div>

                    {/* Circular Radial Score Dial */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke="#201811"
                          strokeWidth="5"
                          fill="transparent"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          stroke={quote.valueScore >= 90 ? '#D7BA78' : quote.valueScore >= 75 ? '#C59B51' : '#E25C43'}
                          strokeWidth="5"
                          strokeDasharray={163}
                          strokeDashoffset={163 - (163 * quote.valueScore) / 100}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-sm font-bold font-serif text-cream-100 block leading-none">
                          {quote.valueScore}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-gold-400 leading-none font-sans">Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-xl bg-wedding-900 border border-gold-400/25 space-y-2.5 font-sans">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-cream-300">Sticker Advertised Quote:</span>
                      <span className="text-sm font-bold text-cream-200">
                        ₹{(quote.basePrice / 100000).toFixed(2)} Lakhs
                      </span>
                    </div>

                    {quote.pricePerPlate && (
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-cream-300">Rate per Guest Plate:</span>
                        <span className="font-semibold text-gold-300">
                          ₹{quote.pricePerPlate.toLocaleString('en-IN')} / plate
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-wedding-800 flex justify-between items-baseline">
                      <div>
                        <span className="text-xs font-bold text-gold-400 block font-serif">
                          True Landed Cost ({simulatedGuestCount} Pax):
                        </span>
                        <span className="text-[10px] text-cream-300 font-sans">With {includeOvertimeHours}h Overtime + Taxes</span>
                      </div>
                      <span className="text-xl font-serif font-extrabold text-gold-300">
                        ₹{(dynamicLanded / 100000).toFixed(2)}L
                      </span>
                    </div>
                  </div>

                  {/* Visual Service Inclusions Checklist */}
                  <div className="space-y-2 pt-1 text-xs font-sans">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-cream-300 block">
                      Essential Service Clauses:
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-wedding-950/80 border border-wedding-800 flex items-center gap-1.5">
                        <Wine className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <div>
                          <span className="text-cream-300 block text-[9px]">Corkage Fee</span>
                          <span className={`font-semibold ${quote.hiddenCosts.some(h => h.category === 'Corkage') ? 'text-vermillion-400' : 'text-emerald-400'}`}>
                            {quote.hiddenCosts.some(h => h.category === 'Corkage') ? '₹850 / btl' : 'Nil (Free)'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-wedding-950/80 border border-wedding-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <div>
                          <span className="text-cream-300 block text-[9px]">Overtime Penalty</span>
                          <span className="font-semibold text-cream-100">
                            ₹{(quote.overtimeHourlyRate / 1000).toFixed(0)}k / hr
                          </span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-wedding-950/80 border border-wedding-800 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <div>
                          <span className="text-cream-300 block text-[9px]">Kitchen Genset</span>
                          <span className={`font-semibold ${quote.hiddenCosts.some(h => h.category === 'Power/Fuel') ? 'text-vermillion-400' : 'text-emerald-400'}`}>
                            {quote.hiddenCosts.some(h => h.category === 'Power/Fuel') ? 'Excluded' : 'Included'}
                          </span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-wedding-950/80 border border-wedding-800 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                        <div>
                          <span className="text-cream-300 block text-[9px]">Glassware Included</span>
                          <span className={`font-semibold ${quote.missingInclusions.some(m => m.item.includes('Glassware')) ? 'text-vermillion-400' : 'text-emerald-400'}`}>
                            {quote.missingInclusions.some(m => m.item.includes('Glassware')) ? 'No (Hire)' : 'Crystal Cut'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Surcharges Quick Summary */}
                  <div className="p-3 rounded-xl bg-wedding-950 border border-gold-400/20 flex justify-between items-center text-xs font-sans">
                    <span className="text-cream-300">Total Unbudgeted Risk:</span>
                    <span className={`font-bold ${quote.hiddenCostsTotal + quote.missingInclusionsCost > 300000 ? 'text-vermillion-400' : 'text-emerald-400'}`}>
                      +₹{((quote.hiddenCostsTotal + quote.missingInclusionsCost) / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6 pt-0 font-sans">
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
                      className="w-full py-3 rounded-xl bg-wedding-900 border border-wedding-800 text-cream-300/50 font-bold text-xs cursor-not-allowed"
                    >
                      Proposal Closed
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectWinner(quote)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4BA8A] to-[#B99A65] text-[#2E1F2A] font-bold text-xs tracking-wider uppercase shadow-gold-subtle hover:shadow-gold-glow hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
                    >
                      <span>Award Contract & Lock Rates</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
