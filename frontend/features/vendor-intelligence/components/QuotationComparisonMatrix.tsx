'use client';

import React, { useState } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Info
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

  // Filter quotes by selected category
  const categoryQuotes = quotations.filter((q) => q.category === selectedCategory);

  // Identify recommended vendor (highest value score)
  const bestValueQuote = categoryQuotes.reduce((prev, current) => 
    (prev.valueScore > current.valueScore) ? prev : current, categoryQuotes[0]);

  return (
    <div className="space-y-6">
      {/* Category Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Decision Intelligence Matrix
          </span>
          <h2 className="text-2xl font-serif text-ivory-100 font-bold">
            Structured Quotation & True Cost Comparison
          </h2>
          <p className="text-xs text-ivory-300 mt-0.5">
            Comparing <span className="text-gold-300 font-semibold">{categoryQuotes.length} supplier proposals</span> for 500 Guests @ City Palace, Udaipur
          </p>
        </div>

        {/* Category Pill Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {(['Catering & Banquets', 'Royal Decor & Floral'] as VendorCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gold-gradient text-plum-950 shadow-gold-subtle'
                  : 'bg-plum-900/60 border border-gold-500/30 text-ivory-300 hover:text-ivory-100 hover:bg-plum-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Signature Novelty Banner: The True Cost Trap Explained */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-plum-900 via-plum-850 to-plum-900 border border-gold-500/40 shadow-plum-deep">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gold-500/20 rounded-xl border border-gold-500/40 text-gold-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-300">
                WedPilot AI Decision Verdict
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Landed Cost Advantage
              </span>
            </div>
            <p className="text-sm text-ivory-100">
              <strong className="text-gold-300 font-semibold">Do not be misled by sticker prices!</strong>{' '}
              <span className="text-rose-300 font-medium">Jaipur Shahi Rasoi</span> advertises a low sticker price of ₹22.80L, but buries <strong className="text-rose-300">₹6.85L in hidden fees</strong> (mandatory corkage, genset fuel) and excludes <strong className="text-rose-300">₹2.60L in missing inclusions</strong> (glassware, waste clearance), reaching <span className="underline decoration-rose-400 font-bold">₹33.39L True Landed Cost</span>.
            </p>
            <p className="text-xs text-ivory-300">
              Conversely, <strong className="text-emerald-400 font-semibold">Mewar Royal Culinary</strong> has an all-inclusive quote of ₹28.50L with zero missing inclusions, delivering an effective savings of <span className="text-emerald-400 font-bold">₹2.22 Lakhs</span> and superior luxury reliability (Value Score: 94/100).
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryQuotes.map((quote) => {
          const isWinner = quote.id === bestValueQuote?.id;
          const isSelected = quote.status === 'Selected';
          const isClosed = quote.status === 'Closed' || quote.status === 'Rejected';

          return (
            <div
              key={quote.id}
              className={`luxury-card rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-2 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.25)]'
                  : isWinner
                  ? 'border-2 border-gold-400 shadow-gold-glow'
                  : isClosed
                  ? 'opacity-60 border-plum-800'
                  : 'border-gold-500/30'
              }`}
            >
              {/* Card Badges */}
              {isSelected ? (
                <div className="bg-emerald-600 text-ivory-50 text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Contract Formally Awarded
                </div>
              ) : isWinner ? (
                <div className="bg-gold-gradient text-plum-950 text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow">
                  <Award className="w-3.5 h-3.5" />
                  WedPilot AI Recommended Choice
                </div>
              ) : isClosed ? (
                <div className="bg-plum-800 text-ivory-300 text-[10px] font-bold py-1 px-4 text-center tracking-wider uppercase">
                  Closed / Auto-Cancelled
                </div>
              ) : null}

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-5 flex-1">
                {/* Header Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">
                      Ref: {quote.quoteNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      quote.status === 'Selected' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      quote.status === 'Shortlisted' ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' :
                      quote.status === 'Closed' ? 'bg-plum-800 text-ivory-300' :
                      'bg-plum-800/80 text-ivory-200 border border-plum-700'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-ivory-100 font-bold leading-tight">
                    {quote.vendorName}
                  </h3>
                  <p className="text-xs text-ivory-300">{quote.category}</p>
                </div>

                {/* Pricing Block: Sticker vs True Cost */}
                <div className="p-4 rounded-xl bg-plum-900/80 border border-gold-500/30 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-ivory-300">Advertised Base Quote:</span>
                    <span className="text-base font-bold text-ivory-100">
                      ₹{(quote.basePrice / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>

                  {quote.pricePerPlate && (
                    <div className="flex justify-between items-baseline text-xs text-ivory-300">
                      <span>Rate per Guest Plate:</span>
                      <span className="font-semibold text-gold-300">
                        ₹{quote.pricePerPlate.toLocaleString('en-IN')} / plate
                      </span>
                    </div>
                  )}

                  {/* True Landed Cost Display */}
                  <div className="pt-2 border-t border-plum-700 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-gold-400 block">True Landed Cost (AI):</span>
                      <span className="text-[10px] text-ivory-300">Base + GST + Hidden + Exclusions</span>
                    </div>
                    <span className="text-lg font-serif font-extrabold text-gold-300">
                      ₹{(quote.trueEstimatedLandedCost / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                </div>

                {/* Score & Risk Metrics */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-plum-850 border border-gold-500/20">
                    <span className="block text-[10px] uppercase tracking-wider text-ivory-300">Value Score</span>
                    <span className={`text-xl font-serif font-bold ${
                      quote.valueScore >= 90 ? 'text-emerald-400' : quote.valueScore >= 75 ? 'text-gold-300' : 'text-rose-400'
                    }`}>
                      {quote.valueScore} <span className="text-xs font-normal text-ivory-300">/ 100</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-plum-850 border border-gold-500/20">
                    <span className="block text-[10px] uppercase tracking-wider text-ivory-300">Overtime Fee</span>
                    <span className="text-sm font-bold text-ivory-100 block mt-1">
                      ₹{(quote.overtimeHourlyRate / 1000).toFixed(0)}k <span className="text-[10px] font-normal text-ivory-300">/ hour</span>
                    </span>
                  </div>
                </div>

                {/* Hidden Charges Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ivory-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Hidden Fees Discovered ({quote.hiddenCosts.length})
                    </span>
                    <span className={`font-bold ${quote.hiddenCostsTotal > 200000 ? 'text-rose-400' : 'text-ivory-300'}`}>
                      +₹{(quote.hiddenCostsTotal / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {quote.hiddenCosts.length === 0 ? (
                      <p className="text-[11px] text-emerald-400 italic bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                        ✓ Clean, transparent quote with zero unexpected surcharges.
                      </p>
                    ) : (
                      quote.hiddenCosts.map((hc) => (
                        <div key={hc.id} className="text-[11px] p-2 rounded-lg bg-plum-950/70 border border-plum-800 flex justify-between items-start">
                          <div>
                            <span className="font-medium text-ivory-200">{hc.label}</span>
                            <span className="block text-[10px] text-ivory-300/80">{hc.category}</span>
                          </div>
                          <span className="text-rose-300 font-bold shrink-0 ml-2">₹{(hc.amount / 1000).toFixed(0)}k</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Missing Inclusions Detection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ivory-200 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-gold-400" />
                      Missing Inclusions ({quote.missingInclusions.length})
                    </span>
                    <span className="font-bold text-gold-400">
                      {quote.missingInclusionsCost > 0 ? `+₹${(quote.missingInclusionsCost / 1000).toFixed(0)}k` : 'None'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {quote.missingInclusions.length === 0 ? (
                      <p className="text-[11px] text-emerald-400 italic bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                        ✓ All standard 5-star palace wedding inclusions provided.
                      </p>
                    ) : (
                      quote.missingInclusions.map((mi) => (
                        <div key={mi.id} className="text-[11px] p-2 rounded-lg bg-plum-950/70 border border-gold-500/20">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gold-300">{mi.item}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-rose-500/20 text-rose-300">
                              {mi.severity}
                            </span>
                          </div>
                          <p className="text-[10px] text-ivory-300 mt-0.5">{mi.vendorProvision}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0">
                {isSelected ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs cursor-default flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Selected & Agreement Locked
                  </button>
                ) : isClosed ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-plum-900 border border-plum-800 text-ivory-300/40 text-xs cursor-not-allowed"
                  >
                    Quotation Closed
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectWinner(quote)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow ${
                      isWinner
                        ? 'bg-gold-gradient text-plum-950 hover:brightness-110 shadow-gold-subtle'
                        : 'bg-plum-800 border border-gold-500/40 text-gold-300 hover:bg-plum-700'
                    }`}
                  >
                    Award Contract to This Vendor
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
