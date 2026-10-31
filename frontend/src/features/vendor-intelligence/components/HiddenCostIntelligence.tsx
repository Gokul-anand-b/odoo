'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  Award, 
  Layers, 
  TrendingUp, 
  DollarSign
} from 'lucide-react';
import { Quotation } from '../types/vendor.types';

interface HiddenCostIntelligenceProps {
  quotations: Quotation[];
}

export const HiddenCostIntelligence: React.FC<HiddenCostIntelligenceProps> = ({ quotations }) => {
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(quotations[0]?.id || '');

  const activeQuote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  if (!activeQuote) {
    return (
      <div className="p-10 rounded-2xl luxury-gold-card text-center space-y-2 font-sans">
        <Sparkles className="w-8 h-8 text-gold-400 mx-auto opacity-60" />
        <h3 className="text-base font-serif font-bold text-cream-100">No proposals available for fineprint auditing</h3>
        <p className="text-xs text-cream-300">
          Upload a vendor proposal PDF or select proposals in the comparison matrix above to audit hidden costs.
        </p>
      </div>
    );
  }

  const totalHiddenAndMissing = activeQuote.hiddenCostsTotal + activeQuote.missingInclusionsCost;
  const percentageIncrease = activeQuote.basePrice > 0 
    ? ((totalHiddenAndMissing / activeQuote.basePrice) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Novelty Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Eternelle Signature Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-cream-100 font-bold">
            Hidden Cost & Landed Value Auditor
          </h2>
          <p className="text-xs text-cream-300 mt-0.5 font-sans">
            Algorithmic detection of contract exclusions, corkage markups, power fuel charges, and unbudgeted risk liabilities.
          </p>
        </div>

        {/* Quote Selector Dropdown */}
        <div className="flex items-center gap-2 font-sans">
          <span className="text-xs text-cream-300">Auditing Bid:</span>
          <select
            value={activeQuote.id}
            onChange={(e) => setSelectedQuoteId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-wedding-900 border border-gold-400/40 text-gold-300 text-xs font-semibold focus:outline-none focus:border-gold-400 cursor-pointer"
          >
            {quotations.map((q) => (
              <option key={q.id} value={q.id} className="bg-wedding-950 text-cream-100">
                {q.vendorName} ({q.quoteNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Warning Banner if Significant Hidden Costs */}
      {totalHiddenAndMissing > 200000 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-vermillion-950/80 via-wedding-900 to-vermillion-950/80 border border-vermillion-500/50 flex items-start sm:items-center gap-3 font-sans animate-fadeIn">
          <div className="p-2 bg-vermillion-500/20 rounded-lg text-vermillion-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-vermillion-300 uppercase tracking-wider block">
              High Unbudgeted Exposure Alert (+{percentageIncrease}% Over Sticker Price)
            </span>
            <p className="text-xs text-cream-200 mt-0.5">
              This proposal contains <strong>₹{(totalHiddenAndMissing / 100000).toFixed(2)} Lakhs</strong> in undisclosed liabilities and missing essential provisions.
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Intelligence Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        {/* Left Column: The 5 Hidden Cost Categories */}
        <div className="luxury-gold-card p-6 rounded-2xl border border-vermillion-500/30 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-wedding-800">
            <div>
              <h3 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-vermillion-500"></span>
                Detected Surcharges & Fineprint Add-ons
              </h3>
              <p className="text-[11px] text-cream-300">5 contract liabilities scanned automatically by AI</p>
            </div>
            <span className="text-sm font-bold text-vermillion-400 font-serif">
              +₹{(activeQuote.hiddenCostsTotal / 100000).toFixed(2)} Lakhs
            </span>
          </div>

          <div className="space-y-3">
            {activeQuote.hiddenCosts.length === 0 ? (
              <p className="text-xs text-emerald-400 py-4 text-center">✓ No hidden surcharges found in this proposal.</p>
            ) : (
              activeQuote.hiddenCosts.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-wedding-900 border border-wedding-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-cream-100 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-wedding-800 text-gold-300">
                        {item.category}
                      </span>
                      {item.label}
                    </span>
                    <span className="font-bold text-vermillion-400 font-serif">
                      +₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-cream-300/80 leading-relaxed pl-1 border-l-2 border-vermillion-500/40">
                    {item.reason}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Missing Industry Inclusions */}
        <div className="luxury-gold-card p-6 rounded-2xl border border-gold-400/30 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-wedding-800">
            <div>
              <h3 className="text-lg font-serif font-bold text-cream-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-400"></span>
                Missing Industry Standard Inclusions
              </h3>
              <p className="text-[11px] text-cream-300">Mandatory wedding requirements absent from quotation</p>
            </div>
            <span className="text-sm font-bold text-gold-400 font-serif">
              +₹{(activeQuote.missingInclusionsCost / 100000).toFixed(2)} Lakhs
            </span>
          </div>

          <div className="space-y-3">
            {activeQuote.missingInclusions.length === 0 ? (
              <p className="text-xs text-emerald-400 py-4 text-center">✓ All palace standard inclusions are verified.</p>
            ) : (
              activeQuote.missingInclusions.map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-xl bg-wedding-900 border border-wedding-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-cream-100">{inc.item}</span>
                    <span className="font-bold text-gold-300 font-serif">
                      Est. Fix: +₹{inc.estimatedFixCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                    <div className="p-2 bg-wedding-950 rounded text-cream-300">
                      <span className="font-bold text-gold-400 block mb-0.5">Industry Benchmark:</span>
                      {inc.industryStandard}
                    </div>
                    <div className="p-2 bg-wedding-950 rounded text-vermillion-300">
                      <span className="font-bold text-vermillion-400 block mb-0.5">Vendor Provision:</span>
                      {inc.vendorProvision}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
