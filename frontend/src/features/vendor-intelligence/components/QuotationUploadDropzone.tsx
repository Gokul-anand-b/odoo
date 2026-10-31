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
          { id: 'ext-1', description: 'Day 1 Welcoming High-Tea & Regional Chaat Bazaar', unit: 'Guests', quantity: 450, unitRate: 950, totalRate: 427500, isIncluded: true },
          { id: 'ext-2', description: 'Day 2 Sangeet Gala Imperial Dinner (Pan-Asian & Continental)', unit: 'Guests', quantity: 500, unitRate: 2100, totalRate: 1050000, isIncluded: true },
          { id: 'ext-3', description: 'Day 3 Royal Phera Thali Banquet (52 items)', unit: 'Guests', quantity: 520, unitRate: 3750, totalRate: 1950000, isIncluded: true },
          { id: 'ext-4', description: 'Antique Brass Chafing Dishes & Urns', unit: 'Set', quantity: 1, unitRate: 75000, totalRate: 75000, isIncluded: true },
        ],
        hiddenCosts: [
          { id: 'ext-hc-1', label: 'Commercial Diesel Genset Fuel Surcharge', amount: 120000, riskLevel: 'High', reason: 'Fuel excluded from base plate quote', category: 'Power/Fuel' },
          { id: 'ext-hc-2', label: 'Service Tax & Waitstaff Gratuity Levy (Mandatory 10%)', amount: 245000, riskLevel: 'High', reason: 'Not bundled in food bill', category: 'Service Fee' },
          { id: 'ext-hc-3', label: 'Corkage Charge for Imported Single Malt Bar', amount: 95000, riskLevel: 'Medium', reason: 'Levied at ₹600 per bottle served', category: 'Corkage' },
        ],
        missingInclusions: [
          { id: 'ext-mi-1', item: 'Crystal Cut Glassware & Stemware', industryStandard: 'Must be included for 500+ palace guests', vendorProvision: 'Excluded (Requires separate rental)', estimatedFixCost: 110000, severity: 'Critical' },
          { id: 'ext-mi-2', item: 'Post-Event Kitchen Deep Clean & Waste Disinfection', industryStandard: 'Palace Authority Mandate', vendorProvision: 'Vendor disclaims kitchen sanitization', estimatedFixCost: 80000, severity: 'Warning' },
        ],
      };

      setExtractedQuote(parsed);
      onQuoteAnalyzed(parsed);
    }, 3100);
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
        className={`luxury-gold-card p-8 rounded-2xl border-2 border-dashed transition-all text-center relative overflow-hidden ${
          isDragging ? 'border-gold-400 bg-wedding-800 shadow-gold-glow' : 'border-gold-400/30 hover:border-gold-400/70'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 rounded-full bg-wedding-900 border border-gold-400/40 text-gold-400 shadow-gold-subtle">
            <UploadCloud className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <h3 className="text-xl font-serif text-cream-100 font-bold">Upload Supplier Quotation PDF</h3>
            <p className="text-xs text-cream-300 mt-1 max-w-md mx-auto font-sans">
              Drag & drop supplier PDF proposals. WedPilot AI extracts billable line items, highlights unbundled hidden charges, and benchmarks missing palace inclusions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-sans">
            <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-gold-gradient text-wedding-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 transition">
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

            <span className="text-xs text-cream-300/60">— or test instant scenario —</span>

            <button
              type="button"
              onClick={() => startAnalysis('Rajputana_Catering_Quotation_Estimate_V2.pdf', 'Rajputana Heritage Feast Caterers', 'Catering & Banquets')}
              className="px-4 py-2 rounded-xl bg-wedding-900 border border-gold-400/40 text-gold-300 text-xs hover:bg-wedding-850 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Demo: Scan Quote with Hidden Fineprint Traps
            </button>
          </div>
        </div>

        {/* Extraction Progress Overlay */}
        {analyzingState !== 'idle' && analyzingState !== 'complete' && (
          <div className="absolute inset-0 bg-wedding-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 z-20 animate-fadeIn font-sans">
            <Loader2 className="w-10 h-10 text-gold-400 animate-spin" />
            <div className="text-center">
              <h4 className="text-base font-serif text-gold-300 font-semibold">
                {analyzingState === 'uploading' && 'Ingesting PDF Quotation & Parsing Text Streams...'}
                {analyzingState === 'ocr' && 'Extracting Menu Line Items, Rates & Tax Slabs...'}
                {analyzingState === 'detecting_hidden' && 'WedPilot AI: Hunting Hidden Costs & Missing Inclusions...'}
              </h4>
              <p className="text-xs text-cream-300 mt-1">Cross-referencing against 500-Guest City Palace Udaipur Benchmarks</p>
            </div>

            <div className="w-full max-w-md h-2 bg-wedding-900 rounded-full overflow-hidden border border-gold-400/30">
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
        <div className="luxury-gold-card p-6 sm:p-7 rounded-2xl border border-gold-400/40 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gold-400/20">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-wedding-900 rounded-xl border border-gold-400/40 text-gold-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gold-500/20 text-gold-400 border border-gold-400/40">
                    AI Extraction Verified
                  </span>
                  <span className="text-xs text-cream-300">File: {extractedQuote.pdfFileName}</span>
                </div>
                <h3 className="text-xl font-serif text-cream-100 font-bold mt-1">{extractedQuote.vendorName}</h3>
                <p className="text-xs text-cream-300 font-sans">{extractedQuote.category} • Ref: {extractedQuote.quoteNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 font-sans">
              <div className="text-right">
                <span className="text-[11px] text-cream-300">True Landed Cost</span>
                <p className="text-xl font-bold font-serif text-gold-400">
                  ₹{(extractedQuote.trueEstimatedLandedCost / 100000).toFixed(2)} Lakhs
                </p>
                <span className="text-[10px] text-vermillion-400">
                  +₹{((extractedQuote.hiddenCostsTotal + extractedQuote.missingInclusionsCost) / 100000).toFixed(2)}L in hidden/missing items
                </span>
              </div>
              <div className="p-3 bg-wedding-900 rounded-xl border border-gold-400/40 text-center">
                <span className="block text-[10px] text-cream-300 uppercase">Value Score</span>
                <span className="text-xl font-bold text-gold-300 font-serif">{extractedQuote.valueScore}/100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            {/* 1. Extracted Menu Line Items */}
            <div className="bg-wedding-900 p-4 rounded-xl border border-wedding-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-wedding-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Extracted Billable Items ({extractedQuote.items.length})
                </h4>
                <span className="text-xs text-cream-300 font-medium">Sticker: ₹{(extractedQuote.basePrice / 100000).toFixed(2)}L</span>
              </div>
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                {extractedQuote.items.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-lg bg-wedding-950 border border-wedding-800 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-cream-100">{item.description}</p>
                      <p className="text-[10px] text-cream-300">{item.quantity} {item.unit} @ ₹{item.unitRate}</p>
                    </div>
                    <span className="font-semibold text-gold-300 shrink-0">₹{(item.totalRate / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Hidden Cost Detections */}
            <div className="bg-wedding-900 p-4 rounded-xl border border-vermillion-500/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-vermillion-500/30">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-vermillion-400 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-vermillion-400" />
                  Hidden Costs Flagged ({extractedQuote.hiddenCosts.length})
                </h4>
                <span className="text-xs font-bold text-vermillion-400">+₹{(extractedQuote.hiddenCostsTotal / 100000).toFixed(2)}L</span>
              </div>
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                {extractedQuote.hiddenCosts.map((hc) => (
                  <div key={hc.id} className="p-2.5 rounded-lg bg-wedding-950 border border-vermillion-500/20">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-cream-100">{hc.label}</p>
                      <span className="font-bold text-vermillion-400 shrink-0 ml-1">₹{(hc.amount / 1000).toFixed(0)}k</span>
                    </div>
                    <p className="text-[10px] text-cream-300 mt-1 italic">&quot;{hc.reason}&quot;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Missing Industry Inclusions */}
            <div className="bg-wedding-900 p-4 rounded-xl border border-gold-400/30 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gold-400/30">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-gold-400" />
                  Missing Inclusions ({extractedQuote.missingInclusions.length})
                </h4>
                <span className="text-xs font-bold text-gold-400">+₹{(extractedQuote.missingInclusionsCost / 100000).toFixed(2)}L</span>
              </div>
              <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                {extractedQuote.missingInclusions.map((mi) => (
                  <div key={mi.id} className="p-2.5 rounded-lg bg-wedding-950 border border-gold-400/20">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gold-300">{mi.item}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-vermillion-500/20 text-vermillion-300">
                        {mi.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-cream-300 mt-1">Expected: {mi.industryStandard}</p>
                    <p className="text-[10px] text-gold-400 font-medium">Vendor: {mi.vendorProvision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
