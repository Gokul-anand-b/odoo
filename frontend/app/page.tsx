'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  UploadCloud, 
  Sparkles, 
  Award, 
  Scale, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { INITIAL_VENDORS, INITIAL_QUOTES } from '../features/vendor-intelligence/constants/mockVendorData';
import { Vendor, Quotation, VendorCategory } from '../features/vendor-intelligence/types/vendor.types';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Header } from '../components/header/Header';
import { VendorDirectory } from '../features/vendor-intelligence/components/VendorDirectory';
import { QuotationUploadDropzone } from '../features/vendor-intelligence/components/QuotationUploadDropzone';
import { QuotationComparisonMatrix } from '../features/vendor-intelligence/components/QuotationComparisonMatrix';
import { HiddenCostIntelligence } from '../features/vendor-intelligence/components/HiddenCostIntelligence';
import { VendorSelectionModal } from '../features/vendor-intelligence/components/VendorSelectionModal';
import { RegisterVendorModal } from '../features/vendor-intelligence/components/RegisterVendorModal';

const CATEGORIES: VendorCategory[] = [
  'Catering & Banquets',
  'Royal Decor & Floral',
  'Photography & Cinematography',
  'Palace Venues',
  'Live Entertainment & Folk',
  'Royal Logistics & Vintage Fleet',
];

export default function VendorIntelligenceHub() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [quotes, setQuotes] = useState<Quotation[]>(INITIAL_QUOTES);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('Catering & Banquets');
  const [activeSection, setActiveSection] = useState<string>('matrix');

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedQuoteForContract, setSelectedQuoteForContract] = useState<Quotation | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Stats
  const totalVendors = vendors.length;
  const totalQuotes = quotes.length;
  const awardedContracts = quotes.filter((q) => q.status === 'Selected').length;

  const handleQuoteAnalyzed = (newQuote: Quotation) => {
    setQuotes((prev) => [newQuote, ...prev]);
    setNotification(`✓ New quotation successfully extracted: ${newQuote.vendorName} (${newQuote.quoteNumber})`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleAddVendor = (newVendor: Vendor) => {
    setVendors((prev) => [newVendor, ...prev]);
    setNotification(`✓ Vendor ${newVendor.name} registered into The Royal Knot directory.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleInitiateSelection = (quote: Quotation) => {
    setSelectedQuoteForContract(quote);
    setIsSelectionModalOpen(true);
  };

  const handleConfirmSelection = (quoteToAward: Quotation) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteToAward.id) {
          return { ...q, status: 'Selected' as const };
        }
        if (q.category === quoteToAward.category && q.id !== quoteToAward.id) {
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

  const scrollToSection = (secId: string) => {
    setActiveSection(secId);
    const element = document.getElementById(secId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen bg-wedding-950 text-cream-100 font-sans selection:bg-gold-400 selection:text-wedding-950">
      {/* 1. Left-Side Navigation Bar */}
      <Sidebar
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        quotesCount={totalQuotes}
        vendorsCount={totalVendors}
        awardedCount={awardedContracts}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        {/* Global Notification Banner */}
        {notification && (
          <div className="px-6 sm:px-8 mt-4 animate-fadeIn">
            <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
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

        {/* Unified Single Page Body */}
        <main className="flex-1 p-6 sm:p-8 space-y-10 max-w-7xl w-full mx-auto">
          {/* Section 1: Executive Wedding Context & Quick Metrics Ribbon */}
          <section className="luxury-gold-card p-6 sm:p-8 rounded-2xl relative overflow-hidden border border-gold-400/35">
            {/* Ambient inner golden glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gold-500/25 text-gold-300 border border-gold-400/40 font-sans shadow-sm">
                    The Royal Knot • Jaipur & Udaipur
                  </span>
                  <span className="text-xs text-cream-300 font-sans">City Palace, Udaipur • Season 2026-2027</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-cream-50 font-bold tracking-tight">
                  Vendor Intelligence
                </h1>
                <p className="text-sm text-cream-200 mt-2 max-w-2xl font-sans leading-relaxed">
                  Single-pane command center for luxury wedding suppliers. Compare true landed per-plate costs, audit hidden fineprint liabilities, ingest PDF quotations with AI OCR, and manage contracts across all service disciplines.
                </p>
              </div>

              {/* 4 Golden Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                <div className="bg-wedding-900/90 p-3.5 rounded-xl text-center border border-gold-400/30 shadow-inner">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Total Suppliers</span>
                  <span className="text-2xl font-serif font-bold text-cream-100">{totalVendors}</span>
                  <span className="text-[10px] text-gold-400 block font-semibold">Vetted Roster</span>
                </div>
                <div className="bg-wedding-900/90 p-3.5 rounded-xl text-center border border-gold-400/30 shadow-inner">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Quotations</span>
                  <span className="text-2xl font-serif font-bold text-gold-400">{totalQuotes}</span>
                  <span className="text-[10px] text-cream-300 block font-semibold">Live Proposals</span>
                </div>
                <div className="bg-wedding-900/90 p-3.5 rounded-xl text-center border border-gold-400/30 shadow-inner">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Top Value Index</span>
                  <span className="text-2xl font-serif font-bold text-gold-300">94 / 100</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Mewar Culinary</span>
                </div>
                <div className="bg-wedding-900/90 p-3.5 rounded-xl text-center border border-emerald-500/40 shadow-inner">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Awarded Deals</span>
                  <span className="text-2xl font-serif font-bold text-emerald-400">{awardedContracts}</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Contracts Locked</span>
                </div>
              </div>
            </div>

            {/* Quick In-Page Jump Anchor Ribbon */}
            <div className="mt-6 pt-5 border-t border-gold-400/20 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider mr-2">Jump On This Page:</span>
              <button
                onClick={() => scrollToSection('matrix')}
                className="px-3 py-1.5 rounded-lg bg-wedding-850 hover:bg-gold-500/20 border border-gold-400/30 text-cream-200 hover:text-gold-300 transition"
              >
                ⚖️ Quote Comparison Matrix
              </button>
              <button
                onClick={() => scrollToSection('hidden_costs')}
                className="px-3 py-1.5 rounded-lg bg-wedding-850 hover:bg-gold-500/20 border border-gold-400/30 text-cream-200 hover:text-gold-300 transition"
              >
                💎 Hidden Cost Auditor
              </button>
              <button
                onClick={() => scrollToSection('upload_ocr')}
                className="px-3 py-1.5 rounded-lg bg-wedding-850 hover:bg-gold-500/20 border border-gold-400/30 text-cream-200 hover:text-gold-300 transition"
              >
                📤 PDF Ingestion & OCR
              </button>
              <button
                onClick={() => scrollToSection('directory')}
                className="px-3 py-1.5 rounded-lg bg-wedding-850 hover:bg-gold-500/20 border border-gold-400/30 text-cream-200 hover:text-gold-300 transition"
              >
                🏛️ Supplier Directory
              </button>
            </div>
          </section>

          {/* Section 2: Interactive Category Selector Bar */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-gold-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-gold-400" />
                Wedding Service Disciplines (All in One Page)
              </span>
              <span className="text-xs text-cream-300">
                Active Category: <strong className="text-gold-300 font-serif text-sm">{selectedCategory}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 max-w-full">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'btn-gold shadow-gold-glow scale-[1.02] border border-amber-300/60'
                      : 'bg-wedding-900 border border-gold-400/30 text-cream-200 hover:text-cream-50 hover:bg-wedding-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Head-to-Head Comparison Matrix (Subcategory 1) */}
          <section id="matrix" className="scroll-mt-20 space-y-4">
            <QuotationComparisonMatrix
              quotations={quotes}
              onSelectWinner={handleInitiateSelection}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </section>

          {/* Section 4: Signature Novelty - Hidden Cost & True Landed Value Auditor (Subcategory 2) */}
          <section id="hidden_costs" className="scroll-mt-20 space-y-4">
            <HiddenCostIntelligence quotations={quotes} />
          </section>

          {/* Section 5: Quotation Upload & AI OCR Scanner (Subcategory 3) */}
          <section id="upload_ocr" className="scroll-mt-20 space-y-4">
            <div className="pb-1">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-gold-400" />
                Intelligent Ingestion Pipeline
              </span>
              <h3 className="text-2xl font-serif text-cream-100 font-bold mt-1">
                Upload Quotation PDF & AI Table Parser
              </h3>
              <p className="text-xs text-cream-300 mt-0.5">
                Extract line items, GST calculations, and detect fineprint risks directly from vendor quotation documents.
              </p>
            </div>
            <QuotationUploadDropzone onQuoteAnalyzed={handleQuoteAnalyzed} />
          </section>

          {/* Section 6: Vetted Supplier Directory (Subcategory 4) */}
          <section id="directory" className="scroll-mt-20 space-y-4">
            <div className="pb-1">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gold-400" />
                The Royal Knot Master Supplier Roster
              </span>
              <h3 className="text-2xl font-serif text-cream-100 font-bold mt-1">
                Rajasthan Tourism Accredited Suppliers
              </h3>
              <p className="text-xs text-cream-300 mt-0.5">
                Browse, filter, and onboard vetted wedding service providers across Jaipur, Udaipur, and Jodhpur.
              </p>
            </div>
            <VendorDirectory
              vendors={vendors}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              onSelectVendorForQuote={() => scrollToSection('matrix')}
              selectedCategory={selectedCategory}
              onCategoryChange={(c) => c !== 'All' && setSelectedCategory(c as VendorCategory)}
            />
          </section>
        </main>
      </div>

      {/* 3. Modals */}
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
