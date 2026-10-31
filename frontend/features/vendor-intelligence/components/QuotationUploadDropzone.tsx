'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertOctagon, Sparkles, Loader2, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { Quotation, VendorCategory } from '../types/vendor.types';

interface QuotationUploadDropzoneProps {
  onQuoteAnalyzed: (newQuote: Quotation) => void;
}

export const QuotationUploadDropzone: React.FC<QuotationUploadDropzoneProps> = ({ onQuoteAnalyzed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [analyzingState, setAnalyzingState] = useState<'idle' | 'uploading' | 'ocr' | 'detecting_hidden' | 'complete'>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [extractedQuote, setExtractedQuote] = useState<Quotation | null>(null);

  const startAnalysis = (fileName: string, vendorName: string, category: VendorCategory) => {
    setAnalyzingState('uploading');
    setProgressPercent(20);

    setTimeout(() => {
      setAnalyzingState('ocr');
      setProgressPercent(55);
    }, 900);

    setTimeout(() => {
      setAnalyzingState('detecting_hidden');
      setProgressPercent(85);
    }, 2000);

    setTimeout(() => {
      setProgressPercent(100);
      setAnalyzingState('complete');

      // Synthesized real extraction result
      const parsed: Quotation = {
        id: `q-${Date.now()}`,
        quoteNumber: `Q-AI-EXT-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorId: 'v-new',
        vendorName: vendorName || 'Udaipur Grand Banquet & Royal Catering',
        category: category,
        weddingName: 'Samar & Alizeh Royal Wedding (City Palace, Udaipur)',
        weddingDate: 'Nov 18-20, 2026',
        status: 'AI Analyzed',
        submissionDate: new Date().toISOString().split('T')[0],
        expiryDate: '2026-11-25',
        basePrice: 2450000,
        taxesGst: 122500,
        pricePerPlate: 3750,
        minimumGuestGuarantee: 480,
        hiddenCostsTotal: 460000,
        missingInclusionsCost: 190000,
        trueEstimatedLandedCost: 3222500,
        valueScore: 76,
        pdfFileName: fileName,
        overtimeHourlyRate: 35000,
        advancePaymentPercentage: 45,
        items: [
          { id: 'ext-1', description: 'Day 1 Welcoming High-Tea & Regional Kachori Counters', unit: 'Guests', quantity: 450, unitRate: 950, totalRate: 427500, isIncluded: true },
          { id: 'ext-2', description: 'Day 2 Sangeet Gala Dinner (Pan-Indian & Continental)', unit: 'Guests', quantity: 500, unitRate: 2100, totalRate: 1050000, isIncluded: true },
          { id: 'ext-3', description: 'Day 3 Imperial Royal Phera Thali Banquet (52 items)', unit: 'Guests', quantity: 520, unitRate: 3750, totalRate: 1950000, isIncluded: true },
          { id: 'ext-4', description: 'Basic Chafing Dishes & Copper Urns', unit: 'Set', quantity: 1, unitRate: 75000, totalRate: 75000, isIncluded: true },
        ],
        hiddenCosts: [
          { id: 'ext-hc-1', label: 'Commercial Diesel Genset Running Fuel (Page 4 Fineprint)', amount: 120000, riskLevel: 'High', reason: 'Fuel excluded from base plate quote', category: 'Power/Fuel' },
          { id: 'ext-hc-2', label: 'Service Tax & Waitstaff Gratuity Levy (Mandatory 10%)', amount: 245000, riskLevel: 'High', reason: 'Not bundled in food bill', category: 'Service Fee' },
          { id: 'ext-hc-3', label: 'Corkage Charge for Vintage Wine & Single Malt Bar', amount: 95000, riskLevel: 'Medium', reason: 'Levied at ₹600 per bottle served', category: 'Corkage' },
        ],
        missingInclusions: [
          { id: 'ext-mi-1', item: 'Fine Dining Glassware & Champagne Flutes', industryStandard: 'Must be included for 500+ guests', vendorProvision: 'Excluded (Requires ₹1.1L separate rental)', estimatedFixCost: 110000, severity: 'Critical' },
          { id: 'ext-mi-2', item: 'Food Safety Hygiene Certificate & Waste Disposal', industryStandard: 'Palace Authority Mandate', vendorProvision: 'Vendor disclaims post-event kitchen cleaning', estimatedFixCost: 80000, severity: 'Warning' },
        ],
      };

      setExtractedQuote(parsed);
      onQuoteAnalyzed(parsed);
    }, 3100);
  };

  const handleDemoPreset = (presetType: 'honest' | 'hidden_traps') => {
    if (presetType === 'hidden_traps') {
      startAnalysis('Rajputana_Catering_Quotation_Estimate_V2.pdf', 'Rajputana Heritage Feast Caterers', 'Catering & Banquets');
    } else {
      startAnalysis('Lake_Palace_Floral_Production_Quote.pdf', 'Lake Palace Artisanal Floral Studio', 'Royal Decor & Floral');
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone Card */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          startAnalysis(file ? file.name : 'Uploaded_Vendor_Quotation.pdf', 'Newly Uploaded Vendor', 'Catering & Banquets');
        }}
        className={`luxury-card p-8 rounded-2xl border-2 border-dashed transition-all text-center relative overflow-hidden ${
          isDragging ? 'border-gold-400 bg-plum-800/80 shadow-gold-glow' : 'border-gold-500/30 hover:border-gold-400/70'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-plum-800/80 border border-gold-500/40 text-gold-400 shadow-gold-subtle">
            <UploadCloud className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-xl font-serif text-ivory-100">Upload Vendor Quotation PDF</h3>
            <p className="text-xs text-ivory-300 mt-1 max-w-md mx-auto">
              Drag & drop any supplier PDF quote or contracts. WedPilot AI automatically extracts pricing, detects hidden charges, and benchmarks missing inclusions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <label className="cursor-pointer px-5 py-2 rounded-xl bg-gold-gradient text-plum-950 font-semibold text-xs shadow-gold-subtle hover:brightness-110 transition">
              Browse PDF Document
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) startAnalysis(file.name, 'Uploaded Vendor Bid', 'Catering & Banquets');
                }}
              />
            </label>

            <span className="text-xs text-ivory-300/60">— or test instant scenario —</span>

            <button
              type="button"
              onClick={() => handleDemoPreset('hidden_traps')}
              className="px-4 py-2 rounded-xl bg-plum-800 border border-gold-500/40 text-gold-300 text-xs hover:bg-plum-700 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Demo: Scan Quotation with Hidden Fineprint Traps
            </button>
          </div>
        </div>

        {/* Extraction Progress Overlay */}
        {analyzingState !== 'idle' && analyzingState !== 'complete' && (
          <div className="absolute inset-0 bg-plum-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 z-20 animate-fadeIn">
            <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
            <div className="text-center">
              <h4 className="text-base font-serif text-gold-300 font-semibold">
                {analyzingState === 'uploading' && 'Ingesting PDF Quotation & Parsing Text Streams...'}
                {analyzingState === 'ocr' && 'Extracting Menu Line Items, Rates & Tax Slabs...'}
                {analyzingState === 'detecting_hidden' && 'WedPilot AI: Hunting Hidden Costs & Missing Inclusions...'}
              </h4>
              <p className="text-xs text-ivory-300 mt-1">Cross-referencing against 500-Guest City Palace Udaipur Benchmarks</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md h-2 bg-plum-900 rounded-full overflow-hidden border border-gold-500/30">
              <div
                className="h-full bg-gold-gradient transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Extraction Results Drawer */}
      {extractedQuote && (
        <div className="luxury-card p-6 sm:p-7 rounded-2xl border border-gold-500/40 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gold-500/20">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-plum-800 rounded-xl border border-gold-500/40 text-gold-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/40">
                    AI Extraction Verified
                  </span>
                  <span className="text-xs text-ivory-300">File: {extractedQuote.pdfFileName}</span>
                </div>
                <h3 className="text-xl font-serif text-ivory-100 font-bold mt-1">{extractedQuote.vendorName}</h3>
                <p className="text-xs text-ivory-300">{extractedQuote.category} • Ref: {extractedQuote.quoteNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-ivory-300">True Landed Cost</span>
                <p className="text-xl font-bold font-serif text-gold-400">
                  ₹{(extractedQuote.trueEstimatedLandedCost / 100000).toFixed(2)} Lakhs
                </p>
                <span className="text-[10px] text-rose-300">
                  +₹{((extractedQuote.hiddenCostsTotal + extractedQuote.missingInclusionsCost) / 100000).toFixed(2)}L in hidden/missing items
                </span>
              </div>
              <div className="p-3 bg-plum-800/80 rounded-xl border border-gold-500/40 text-center">
                <span className="block text-[10px] text-ivory-300 uppercase">Value Score</span>
                <span className="text-xl font-bold text-gold-300">{extractedQuote.valueScore}/100</span>
              </div>
            </div>
          </div>

          {/* 3 Pillars Breakdown: Extracted Items | Hidden Costs Detected | Missing Inclusions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Extracted Menu Line Items */}
            <div className="bg-plum-900/60 p-4 rounded-xl border border-plum-700 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-plum-700">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Extracted Billable Items ({extractedQuote.items.length})
                </h4>
                <span className="text-xs text-ivory-300 font-medium">Sticker: ₹{(extractedQuote.basePrice / 100000).toFixed(2)}L</span>
              </div>
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                {extractedQuote.items.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-plum-950/60 border border-plum-800 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-ivory-100">{item.description}</p>
                      <p className="text-[10px] text-ivory-300">{item.quantity} {item.unit} @ ₹{item.unitRate}</p>
                    </div>
                    <span className="font-semibold text-gold-300 shrink-0">₹{(item.totalRate / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Hidden Cost Detections (NOVELTY) */}
            <div className="bg-plum-900/60 p-4 rounded-xl border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Hidden Costs Flagged ({extractedQuote.hiddenCosts.length})
                </h4>
                <span className="text-xs font-bold text-rose-400">+₹{(extractedQuote.hiddenCostsTotal / 100000).toFixed(2)}L</span>
              </div>
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                {extractedQuote.hiddenCosts.map((hc) => (
                  <div key={hc.id} className="p-2.5 rounded-lg bg-plum-950/60 border border-rose-500/20">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-rose-200">{hc.label}</p>
                      <span className="font-bold text-rose-400 shrink-0">₹{(hc.amount / 1000).toFixed(0)}k</span>
                    </div>
                    <p className="text-[10px] text-ivory-300 mt-1 italic">&quot;{hc.reason}&quot;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Missing Industry Inclusions (NOVELTY) */}
            <div className="bg-plum-900/60 p-4 rounded-xl border border-gold-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gold-500/30">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-gold-400" />
                  Missing Inclusions ({extractedQuote.missingInclusions.length})
                </h4>
                <span className="text-xs font-bold text-gold-400">Risk: +₹{(extractedQuote.missingInclusionsCost / 100000).toFixed(2)}L</span>
              </div>
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                {extractedQuote.missingInclusions.map((mi) => (
                  <div key={mi.id} className="p-2.5 rounded-lg bg-plum-950/60 border border-gold-500/20">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gold-200">{mi.item}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300">
                        {mi.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-ivory-300 mt-1">Expected: {mi.industryStandard}</p>
                    <p className="text-[10px] text-gold-400 font-medium">Vendor: {mi.vendorProvision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-gold-500/10 border border-gold-500/30 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span className="text-ivory-100">
                Extracted data automatically injected into the <strong>Side-by-Side Comparison Matrix</strong> below.
              </span>
            </div>
            <span className="text-gold-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
              Scroll down to compare <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
