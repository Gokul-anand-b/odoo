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
  if (!activeQuote) return null;

  const totalHiddenAndMissing = activeQuote.hiddenCostsTotal + activeQuote.missingInclusionsCost;
  const percentageIncrease = ((totalHiddenAndMissing / activeQuote.basePrice) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Novelty Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            WedPilot AI Signature Novelty
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
            value={selectedQuoteId}
            onChange={(e) => setSelectedQuoteId(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-wedding-900 border border-gold-400/40 text-xs font-semibold text-gold-300 focus:outline-none"
          >
            {quotations.map((q) => (
              <option key={q.id} value={q.id} className="bg-wedding-900 text-cream-100">
                {q.vendorName} ({q.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Financial Waterfall Card */}
      <div className="luxury-gold-card p-6 sm:p-7 rounded-2xl border border-gold-400/30 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gold-400/20 font-sans">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-gold-400">Proposal In Focus</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-wedding-800 text-cream-200 border border-gold-400/20">
                {activeQuote.quoteNumber}
              </span>
            </div>
            <h3 className="text-xl font-serif text-cream-100 font-bold mt-1">
              {activeQuote.vendorName}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-wedding-900 rounded-xl border border-gold-400/30 text-right">
              <span className="text-[10px] uppercase text-cream-300 block">Sticker Quoted Rate</span>
              <span className="text-lg font-bold text-cream-100 font-serif">
                ₹{(activeQuote.basePrice / 100000).toFixed(2)}L
              </span>
            </div>
            <div className="p-3 bg-gold-500/20 rounded-xl border border-gold-400/40 text-right">
              <span className="text-[10px] uppercase text-gold-400 block font-semibold">True Landed Cost</span>
              <span className="text-lg font-bold text-gold-300 font-serif">
                ₹{(activeQuote.trueEstimatedLandedCost / 100000).toFixed(2)}L
              </span>
            </div>
          </div>
        </div>

        {/* Stacked Cost Slices */}
        <div className="space-y-3 font-sans">
          <div className="flex justify-between items-center text-xs">
            <span className="text-cream-200 font-medium">True Landed Outlay Breakdown:</span>
            <span className="text-vermillion-400 font-semibold">
              +{percentageIncrease}% above initial advertised proposal
            </span>
          </div>

          <div className="h-7 w-full rounded-xl overflow-hidden bg-wedding-950 flex border border-gold-400/30 shadow-inner">
            <div
              className="bg-gold-700 h-full flex items-center justify-center text-[10px] font-bold text-cream-100 truncate px-2"
              style={{ width: `${(activeQuote.basePrice / activeQuote.trueEstimatedLandedCost) * 100}%` }}
              title={`Base Price: ₹${(activeQuote.basePrice / 100000).toFixed(2)}L`}
            >
              Base ₹{(activeQuote.basePrice / 100000).toFixed(1)}L
            </div>
            <div
              className="bg-wedding-700 h-full flex items-center justify-center text-[9px] font-bold text-cream-200 truncate px-1"
              style={{ width: `${(activeQuote.taxesGst / activeQuote.trueEstimatedLandedCost) * 100}%` }}
              title={`GST: ₹${(activeQuote.taxesGst / 100000).toFixed(2)}L`}
            >
              GST
            </div>
            {activeQuote.hiddenCostsTotal > 0 && (
              <div
                className="bg-vermillion-500 h-full flex items-center justify-center text-[10px] font-bold text-cream-50 truncate px-1"
                style={{ width: `${(activeQuote.hiddenCostsTotal / activeQuote.trueEstimatedLandedCost) * 100}%` }}
                title={`Hidden Surcharges: ₹${(activeQuote.hiddenCostsTotal / 100000).toFixed(2)}L`}
              >
                Hidden ₹{(activeQuote.hiddenCostsTotal / 100000).toFixed(1)}L
              </div>
            )}
            {activeQuote.missingInclusionsCost > 0 && (
              <div
                className="bg-gold-400 h-full flex items-center justify-center text-[10px] font-bold text-wedding-950 truncate px-1"
                style={{ width: `${(activeQuote.missingInclusionsCost / activeQuote.trueEstimatedLandedCost) * 100}%` }}
                title={`Missing Inclusions: ₹${(activeQuote.missingInclusionsCost / 100000).toFixed(2)}L`}
              >
                Missing ₹{(activeQuote.missingInclusionsCost / 100000).toFixed(1)}L
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-cream-300">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold-700 inline-block" /> Advertised Base Rate</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-wedding-700 inline-block" /> Mandatory GST</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-vermillion-500 inline-block" /> Hidden Surcharges (Corkage/Genset)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold-400 inline-block" /> Missing Inclusions (Glassware/Cleanup)</span>
          </div>
        </div>

        {/* Detailed Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-wedding-800 font-sans">
          {/* Hidden Costs Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-vermillion-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-vermillion-400" />
                Unbundled Surcharges & Fine-Print Penalties
              </h4>
              <span className="text-xs font-bold text-vermillion-400">
                ₹{(activeQuote.hiddenCostsTotal / 100000).toFixed(2)}L
              </span>
            </div>

            {activeQuote.hiddenCosts.length === 0 ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                Zero hidden fees discovered. Vendor contract has 100% price transparency.
              </div>
            ) : (
              <div className="space-y-2">
                {activeQuote.hiddenCosts.map((hc) => (
                  <div key={hc.id} className="p-3 bg-wedding-950 border border-vermillion-500/20 rounded-xl text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-cream-100">{hc.label}</span>
                      <span className="font-bold text-vermillion-400 shrink-0 ml-2">₹{hc.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10px] text-cream-300 mt-1">Context: {hc.reason}</p>
                    <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded font-semibold bg-vermillion-500/20 text-vermillion-300">
                      Risk Level: {hc.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing Inclusions Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-gold-400" />
                Missing Inclusions (Palace Standards)
              </h4>
              <span className="text-xs font-bold text-gold-400">
                ₹{(activeQuote.missingInclusionsCost / 100000).toFixed(2)}L
              </span>
            </div>

            {activeQuote.missingInclusions.length === 0 ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                Zero missing items. Proposal bundles stemware, service staff, waste clearance and setup.
              </div>
            ) : (
              <div className="space-y-2">
                {activeQuote.missingInclusions.map((mi) => (
                  <div key={mi.id} className="p-3 bg-wedding-950 border border-gold-400/20 rounded-xl text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-cream-100">{mi.item}</span>
                      <span className="font-bold text-gold-300 shrink-0 ml-2">₹{mi.estimatedFixCost.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10px] text-cream-300 mt-0.5">Industry Benchmark: {mi.industryStandard}</p>
                    <p className="text-[10px] text-vermillion-400 mt-0.5 font-medium">Vendor Proposal: {mi.vendorProvision}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Algorithm Formula Explanation */}
        <div className="p-4 bg-wedding-900 border border-gold-400/20 rounded-xl text-xs text-cream-300 space-y-1.5 font-sans">
          <div className="flex items-center gap-2 text-gold-400 font-semibold">
            <Award className="w-4 h-4" />
            <span>WedPilot AI Multi-Criteria Value-for-Money Formula:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            WedPilot does not simply recommend the lowest bidder. The <strong>Value Score ({activeQuote.valueScore}/100)</strong> combines:
            <code className="text-gold-300 bg-wedding-950 px-2 py-0.5 rounded ml-1 font-mono text-[10px] border border-gold-400/20">
              Score = 0.40(Cost Transparency) + 0.30(Quality Tier & Rating) + 0.20(Inclusion Completeness) + 0.10(Palace SLA Track Record)
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};
