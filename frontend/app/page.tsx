'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  UploadCloud, 
  FileCheck2, 
  Sparkles, 
  Award, 
  Scale, 
  Users, 
  DollarSign, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { INITIAL_VENDORS, INITIAL_QUOTES } from '../features/vendor-intelligence/constants/mockVendorData';
import { Vendor, Quotation } from '../features/vendor-intelligence/types/vendor.types';
import { VendorDirectory } from '../features/vendor-intelligence/components/VendorDirectory';
import { QuotationUploadDropzone } from '../features/vendor-intelligence/components/QuotationUploadDropzone';
import { QuotationComparisonMatrix } from '../features/vendor-intelligence/components/QuotationComparisonMatrix';
import { HiddenCostIntelligence } from '../features/vendor-intelligence/components/HiddenCostIntelligence';
import { VendorSelectionModal } from '../features/vendor-intelligence/components/VendorSelectionModal';
import { RegisterVendorModal } from '../features/vendor-intelligence/components/RegisterVendorModal';

export default function VendorIntelligenceHub() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [quotes, setQuotes] = useState<Quotation[]>(INITIAL_QUOTES);
  const [activeTab, setActiveTab] = useState<'matrix' | 'hidden_cost' | 'upload' | 'directory'>('matrix');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedQuoteForContract, setSelectedQuoteForContract] = useState<Quotation | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Stats
  const totalVendors = vendors.length;
  const totalQuotes = quotes.length;
  const underReviewQuotes = quotes.filter((q) => q.status === 'Under Review' || q.status === 'Shortlisted').length;
  const awardedContracts = quotes.filter((q) => q.status === 'Selected').length;

  // Handle adding new quotation
  const handleQuoteAnalyzed = (newQuote: Quotation) => {
    setQuotes((prev) => [newQuote, ...prev]);
    setNotification(`New quotation successfully extracted: ${newQuote.vendorName} (${newQuote.quoteNumber})`);
    setTimeout(() => setNotification(null), 6000);
  };

  // Handle adding new vendor
  const handleAddVendor = (newVendor: Vendor) => {
    setVendors((prev) => [newVendor, ...prev]);
    setNotification(`Vendor ${newVendor.name} successfully registered into The Royal Knot directory.`);
    setTimeout(() => setNotification(null), 6000);
  };

  // Handle initiating vendor selection
  const handleInitiateSelection = (quote: Quotation) => {
    setSelectedQuoteForContract(quote);
    setIsSelectionModalOpen(true);
  };

  // Handle confirming vendor selection & auto-closing competitors (Scenario 2)
  const handleConfirmSelection = (quoteToAward: Quotation) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteToAward.id) {
          return { ...q, status: 'Selected' as const };
        }
        if (q.category === quoteToAward.category && q.id !== quoteToAward.id) {
          // Rule from problem statement: "Once a vendor is selected, close the other quotation requests."
          return { ...q, status: 'Closed' as const };
        }
        return q;
      })
    );

    setIsSelectionModalOpen(false);
    setNotification(
      `✓ Contract officially awarded to ${quoteToAward.vendorName}. All competing ${quoteToAward.category} quotations have been automatically closed.`
    );
    setTimeout(() => setNotification(null), 8000);
  };

  return (
    <div className="flex-1 pb-16">
      {/* 1. Royal Top Bar */}
      <header className="border-b border-gold-500/25 bg-plum-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Agency Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient p-0.5 shadow-gold-subtle flex items-center justify-center">
              <div className="w-full h-full bg-plum-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-extrabold text-gold-400 text-lg tracking-wider">WP</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-ivory-50">
                  WedPilot <span className="text-gold-400">AI</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/15 text-gold-400 border border-gold-500/30 uppercase tracking-widest">
                  Royal Knot Edition
                </span>
              </div>
              <p className="text-[11px] text-ivory-300">
                Intelligent Wedding Operations Platform • Jaipur & Udaipur
              </p>
            </div>
          </div>

          {/* Active Wedding Context Pill */}
          <div className="flex items-center gap-3 bg-plum-900/80 px-4 py-2 rounded-2xl border border-gold-500/30 shadow-inner">
            <div className="p-1.5 rounded-lg bg-plum-800 text-gold-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-gold-400">Active Operation</span>
              <span className="text-xs font-semibold text-ivory-100 flex items-center gap-1.5">
                Samar & Alizeh Royal Wedding
                <span className="text-[10px] text-gold-300 px-1.5 py-0.2 bg-plum-950 rounded border border-gold-500/20 font-normal">
                  ₹3.4 Cr Budget • 550 Guests
                </span>
              </span>
            </div>
          </div>

          {/* Quick Action */}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gold-gradient text-plum-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Supplier
          </button>
        </div>
      </header>

      {/* 2. Notification Toast Bar */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-fadeIn">
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-300 hover:text-emerald-100 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 3. Hero Feature Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gold-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gold-500/20 text-gold-300 border border-gold-500/40">
                Core Feature 2
              </span>
              <span className="text-xs text-ivory-300 font-medium">
                Operational Scenario 2: Vendor Quotation Comparison
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-ivory-100 font-bold tracking-tight">
              Smart Vendor Intelligence & Quote Comparison
            </h2>
            <p className="text-sm text-ivory-300 mt-2 max-w-2xl">
              Eliminate PDF chaos, compare true per-plate rates, identify hidden fine-print surcharges, and award contracts with automated rival quotation closure.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="luxury-card p-3.5 rounded-xl text-center border border-gold-500/25">
              <span className="block text-[10px] uppercase font-bold text-ivory-300">Registered</span>
              <span className="text-xl font-serif font-bold text-ivory-100">{totalVendors}</span>
              <span className="text-[10px] text-gold-400 block">Active Suppliers</span>
            </div>
            <div className="luxury-card p-3.5 rounded-xl text-center border border-gold-500/25">
              <span className="block text-[10px] uppercase font-bold text-ivory-300">Proposals</span>
              <span className="text-xl font-serif font-bold text-gold-400">{totalQuotes}</span>
              <span className="text-[10px] text-ivory-300 block">PDF Ingested</span>
            </div>
            <div className="luxury-card p-3.5 rounded-xl text-center border border-gold-500/25">
              <span className="block text-[10px] uppercase font-bold text-ivory-300">Shortlisted</span>
              <span className="text-xl font-serif font-bold text-amber-400">{underReviewQuotes}</span>
              <span className="text-[10px] text-ivory-300 block">Under Matrix</span>
            </div>
            <div className="luxury-card p-3.5 rounded-xl text-center border border-emerald-500/30">
              <span className="block text-[10px] uppercase font-bold text-ivory-300">Awarded</span>
              <span className="text-xl font-serif font-bold text-emerald-400">{awardedContracts}</span>
              <span className="text-[10px] text-emerald-400 block">Contracts Locked</span>
            </div>
          </div>
        </div>

        {/* 4. Tab Navigation Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 mt-6 border-b border-plum-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-gold-gradient text-plum-950 font-bold shadow-gold-subtle'
                : 'text-ivory-300 hover:text-ivory-100 hover:bg-plum-900/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            Comparison Matrix (Side-by-Side)
          </button>

          <button
            onClick={() => setActiveTab('hidden_cost')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'hidden_cost'
                ? 'bg-gold-gradient text-plum-950 font-bold shadow-gold-subtle'
                : 'text-ivory-300 hover:text-ivory-100 hover:bg-plum-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Hidden Cost & Value Auditor (Novelty)
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-gold-gradient text-plum-950 font-bold shadow-gold-subtle'
                : 'text-ivory-300 hover:text-ivory-100 hover:bg-plum-900/60'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Quotation & OCR Parser
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === 'directory'
                ? 'bg-gold-gradient text-plum-950 font-bold shadow-gold-subtle'
                : 'text-ivory-300 hover:text-ivory-100 hover:bg-plum-900/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Vendor Directory & Categories
          </button>
        </div>
      </section>

      {/* 5. Main Interactive Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'matrix' && (
          <QuotationComparisonMatrix
            quotations={quotes}
            onSelectWinner={handleInitiateSelection}
          />
        )}

        {activeTab === 'hidden_cost' && (
          <HiddenCostIntelligence quotations={quotes} />
        )}

        {activeTab === 'upload' && (
          <QuotationUploadDropzone onQuoteAnalyzed={handleQuoteAnalyzed} />
        )}

        {activeTab === 'directory' && (
          <VendorDirectory
            vendors={vendors}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onSelectVendorForQuote={(v) => {
              setActiveTab('matrix');
            }}
          />
        )}
      </main>

      {/* 6. Modals */}
      <RegisterVendorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddVendor={handleAddVendor}
      />

      <VendorSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        selectedQuote={selectedQuoteForContract}
        rivalQuotesCount={
          selectedQuoteForContract
            ? quotes.filter((q) => q.category === selectedQuoteForContract.category && q.id !== selectedQuoteForContract.id).length
            : 0
        }
        onConfirmSelection={handleConfirmSelection}
      />
    </div>
  );
}
