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
  Database,
  Layers,
  Copy,
  ExternalLink,
  X
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
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [selectedQuoteForContract, setSelectedQuoteForContract] = useState<Quotation | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

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

  const copySqlCode = () => {
    const sqlText = `-- Copy and run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.vendors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    tier VARCHAR(32) DEFAULT 'Premium Royal',
    rating NUMERIC(3, 2) DEFAULT 4.8,
    review_count INTEGER DEFAULT 1,
    city VARCHAR(128) DEFAULT 'Udaipur, Rajasthan',
    contact_person VARCHAR(128),
    phone VARCHAR(32),
    email VARCHAR(128),
    experience_years INTEGER DEFAULT 5,
    completed_weddings_count INTEGER DEFAULT 10,
    verified BOOLEAN DEFAULT true,
    specialties JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotations (
    id VARCHAR(64) PRIMARY KEY,
    quote_number VARCHAR(64) UNIQUE NOT NULL,
    vendor_id VARCHAR(64) REFERENCES public.vendors(id) ON DELETE CASCADE,
    wedding_name VARCHAR(255) DEFAULT 'Samar & Alizeh Royal Wedding',
    wedding_date VARCHAR(128) DEFAULT 'Nov 18-20, 2026',
    status VARCHAR(32) DEFAULT 'Under Review',
    base_price NUMERIC(12, 2) DEFAULT 0.0,
    taxes_gst NUMERIC(12, 2) DEFAULT 0.0,
    price_per_plate NUMERIC(10, 2),
    minimum_guest_guarantee INTEGER DEFAULT 500,
    hidden_costs_total NUMERIC(12, 2) DEFAULT 0.0,
    missing_inclusions_cost NUMERIC(12, 2) DEFAULT 0.0,
    true_estimated_landed_cost NUMERIC(12, 2) DEFAULT 0.0,
    value_score INTEGER DEFAULT 80,
    pdf_file_name VARCHAR(255),
    overtime_hourly_rate NUMERIC(10, 2) DEFAULT 20000.0,
    advance_payment_percentage INTEGER DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quote_line_items (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) REFERENCES public.quotations(id) ON DELETE CASCADE,
    description VARCHAR(255) NOT NULL,
    unit VARCHAR(32) DEFAULT 'Guests',
    quantity NUMERIC(10, 2) DEFAULT 1.0,
    unit_rate NUMERIC(10, 2) DEFAULT 0.0,
    total_rate NUMERIC(12, 2) DEFAULT 0.0,
    is_included BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.hidden_cost_items (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) REFERENCES public.quotations(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) DEFAULT 0.0,
    risk_level VARCHAR(16) DEFAULT 'Medium',
    reason TEXT,
    category VARCHAR(64) DEFAULT 'Service Fee'
);

CREATE TABLE IF NOT EXISTS public.missing_inclusions (
    id VARCHAR(64) PRIMARY KEY,
    quotation_id VARCHAR(64) REFERENCES public.quotations(id) ON DELETE CASCADE,
    item VARCHAR(255) NOT NULL,
    industry_standard TEXT,
    vendor_provision TEXT,
    estimated_fix_cost NUMERIC(10, 2) DEFAULT 0.0,
    severity VARCHAR(16) DEFAULT 'Warning'
);

ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hidden_cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missing_inclusions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read vendors" ON public.vendors FOR SELECT USING (true);
CREATE POLICY "Allow write vendors" ON public.vendors FOR ALL USING (true);
CREATE POLICY "Allow read quotations" ON public.quotations FOR SELECT USING (true);
CREATE POLICY "Allow write quotations" ON public.quotations FOR ALL USING (true);
CREATE POLICY "Allow read items" ON public.quote_line_items FOR ALL USING (true);
CREATE POLICY "Allow read hidden" ON public.hidden_cost_items FOR ALL USING (true);
CREATE POLICY "Allow read missing" ON public.missing_inclusions FOR ALL USING (true);
`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-wedding-950 text-cream-100 font-sans selection:bg-gold-400 selection:text-wedding-950">
      {/* 1. Left-Side Navigation Bar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={scrollToSection}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        quotesCount={totalQuotes}
        vendorsCount={totalVendors}
        awardedCount={awardedContracts}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSqlModal={() => setIsSqlModalOpen(true)} />

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
          <section className="luxury-gold-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gold-500/20 text-gold-300 border border-gold-400/40">
                    The Royal Knot • Operational Dashboard
                  </span>
                  <span className="text-xs text-cream-300">City Palace, Udaipur • Season 2026-2027</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif text-cream-50 font-bold tracking-tight">
                  Vendor Intelligence & Quotation Resilience
                </h1>
                <p className="text-sm text-cream-300 mt-2 max-w-2xl font-sans">
                  Intelligent supplier management: compare true landed per-plate costs, expose hidden fineprint liabilities, and automate contract awards with instant rival bid cancellation.
                </p>
              </div>

              {/* 4 Golden Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                <div className="bg-wedding-900 p-3.5 rounded-xl text-center border border-gold-400/25">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Total Suppliers</span>
                  <span className="text-xl font-serif font-bold text-cream-100">{totalVendors}</span>
                  <span className="text-[10px] text-gold-400 block">Vetted Partners</span>
                </div>
                <div className="bg-wedding-900 p-3.5 rounded-xl text-center border border-gold-400/25">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">PDF Ingested</span>
                  <span className="text-xl font-serif font-bold text-gold-400">{totalQuotes}</span>
                  <span className="text-[10px] text-cream-300 block">Active Bids</span>
                </div>
                <div className="bg-wedding-900 p-3.5 rounded-xl text-center border border-gold-400/25">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Value Leader</span>
                  <span className="text-xl font-serif font-bold text-gold-300">94 / 100</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Mewar Royal</span>
                </div>
                <div className="bg-wedding-900 p-3.5 rounded-xl text-center border border-emerald-500/40">
                  <span className="block text-[10px] uppercase font-bold text-cream-300">Locked Deals</span>
                  <span className="text-xl font-serif font-bold text-emerald-400">{awardedContracts}</span>
                  <span className="text-[10px] text-emerald-400 block">Contracts Sunk</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Interactive Category Selector Bar */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-gold-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-gold-400" />
                Select Wedding Service Discipline
              </span>
              <span className="text-xs text-cream-300">
                Active Category: <strong className="text-gold-300 font-serif">{selectedCategory}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gold-gradient text-wedding-950 font-bold shadow-gold-subtle scale-[1.02]'
                      : 'bg-wedding-900 border border-gold-400/25 text-cream-300 hover:text-cream-100 hover:bg-wedding-850'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Head-to-Head Comparison Matrix (Core Scenario 2) */}
          <section id="matrix" className="scroll-mt-20 space-y-4">
            <QuotationComparisonMatrix
              quotations={quotes}
              onSelectWinner={handleInitiateSelection}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </section>

          {/* Section 4: Signature Novelty - Hidden Cost & True Landed Value Auditor */}
          <section id="hidden_costs" className="scroll-mt-20 space-y-4">
            <HiddenCostIntelligence quotations={quotes} />
          </section>

          {/* Section 5: Quotation Upload & AI OCR Scanner */}
          <section id="upload_ocr" className="scroll-mt-20 space-y-4">
            <div className="pb-2">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-gold-400" />
                Intelligent Ingestion Pipeline
              </span>
              <h3 className="text-2xl font-serif text-cream-100 font-bold mt-1">
                Upload Quotation PDF & AI Table Parser
              </h3>
            </div>
            <QuotationUploadDropzone onQuoteAnalyzed={handleQuoteAnalyzed} />
          </section>

          {/* Section 6: Vetted Supplier Directory */}
          <section id="directory" className="scroll-mt-20 space-y-4">
            <div className="pb-2">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gold-400" />
                The Royal Knot Master Supplier Roster
              </span>
              <h3 className="text-2xl font-serif text-cream-100 font-bold mt-1">
                Rajasthan Tourism Accredited Suppliers
              </h3>
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

      {/* Supabase Schema SQL Copy Helper Modal */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wedding-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-wedding-900 to-wedding-950 border border-gold-400/50 rounded-2xl shadow-gold-glow p-6 sm:p-8 text-cream-100 font-sans">
            <button
              onClick={() => setIsSqlModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-cream-300 hover:text-gold-400 hover:bg-wedding-850 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-gold-400/20">
              <div className="p-3 bg-gold-500/20 rounded-xl border border-gold-400/40 text-gold-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-cream-50">Create Tables in Supabase</h3>
                <p className="text-xs text-cream-300">Run this SQL in Supabase SQL Editor to populate all 5 tables</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-wedding-950 border border-gold-400/25 space-y-3">
              <p className="text-xs text-cream-200">
                To create <code className="text-gold-300">vendors</code>, <code className="text-gold-300">quotations</code>, <code className="text-gold-300">quote_line_items</code>, <code className="text-gold-300">hidden_cost_items</code>, and <code className="text-gold-300">missing_inclusions</code> in your Supabase project:
              </p>
              <ol className="list-decimal list-inside text-xs text-cream-300 space-y-1">
                <li>Click <strong>Copy SQL Script</strong> below.</li>
                <li>Open your <a href="https://supabase.com/dashboard/project/ccjaplmejbjhlgdxwvss/sql/new" target="_blank" rel="noreferrer" className="text-gold-400 underline font-semibold inline-flex items-center gap-1">Supabase SQL Editor <ExternalLink className="w-3 h-3" /></a></li>
                <li>Paste and click <strong>RUN</strong>. All tables and seed data will instantly populate!</li>
              </ol>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gold-400/20">
              <button
                onClick={() => setIsSqlModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-gold-400/30 text-cream-300 hover:bg-wedding-850 text-xs transition"
              >
                Close
              </button>
              <button
                onClick={copySqlCode}
                className="px-5 py-2.5 rounded-xl bg-gold-gradient text-wedding-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 flex items-center gap-2 transition"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-wedding-950" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-wedding-950" />
                    Copy SQL Script
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
