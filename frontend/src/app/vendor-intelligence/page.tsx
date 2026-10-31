'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileSearch,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Wallet,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import { quotationService } from '@/features/vendor-intelligence/services/quotationService';
import { HiddenCostIntelligence } from '@/features/vendor-intelligence/components/HiddenCostIntelligence';
import { QuotationComparisonMatrix } from '@/features/vendor-intelligence/components/QuotationComparisonMatrix';
import { QuotationUploadDropzone } from '@/features/vendor-intelligence/components/QuotationUploadDropzone';
import { RegisterVendorModal } from '@/features/vendor-intelligence/components/RegisterVendorModal';
import { VendorDirectory } from '@/features/vendor-intelligence/components/VendorDirectory';
import { VendorSelectionModal } from '@/features/vendor-intelligence/components/VendorSelectionModal';
import { BlueprintRequirementsPanel } from '@/features/vendor-intelligence/components/BlueprintRequirementsPanel';
import { Quotation, Vendor, VendorCategory, VendorRequirement, ResourceRequirement } from '@/features/vendor-intelligence/types/vendor.types';

const CATEGORIES: VendorCategory[] = [
  'Catering & Banquets',
  'Royal Decor & Floral',
  'Photography & Cinematography',
  'Palace Venues',
  'Live Entertainment & Folk',
  'Royal Logistics & Vintage Fleet',
];

const SECTIONS = [
  { id: 'blueprint-requirements', label: 'Blueprint requirements' },
  { id: 'vendor-comparison', label: 'Compare quotes' },
  { id: 'vendor-cost-intelligence', label: 'Cost intelligence' },
  { id: 'vendor-quotations', label: 'Quotations' },
  { id: 'vendor-directory', label: 'Vendor directory' },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Building2;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between font-sans">
      <div className="min-w-0">
        <p className="mb-1.5 flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-[#9A7E50]">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[#2A1E26] sm:text-[1.8rem]">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#76636D]">{description}</p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = 'gold',
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Building2;
  tone?: 'gold' | 'plum' | 'green';
}) {
  const iconStyles = {
    gold: { color: '#9A7E50', background: 'rgba(185,154,101,0.13)' },
    plum: { color: '#684C65', background: 'rgba(93,63,88,0.10)' },
    green: { color: '#39745D', background: 'rgba(57,116,93,0.11)' },
  };

  return (
    <article className="vendor-metric-card flex min-w-0 items-start gap-4 rounded-2xl p-4 sm:p-5 font-sans">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={iconStyles[tone]}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-[#76636D]">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold leading-none text-[#2A1E26]">{value}</p>
        <p className="mt-2 text-xs leading-5 text-[#8A7380]">{detail}</p>
      </div>
    </article>
  );
}

export default function VendorIntelligencePage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [vendorRequirements, setVendorRequirements] = useState<VendorRequirement[]>([]);
  const [resourceRequirements, setResourceRequirements] = useState<ResourceRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('Catering & Banquets');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Load live data from Supabase PostgreSQL via Django API
  const loadRealTimeData = useCallback(async () => {
    try {
      setLoading(true);
      const [vList, qList, vrList, rrList] = await Promise.all([
        quotationService.getVendors().catch(() => []),
        quotationService.getQuotations().catch(() => []),
        quotationService.getVendorRequirements().catch(() => []),
        quotationService.getResourceRequirements().catch(() => []),
      ]);

      setVendors(vList);
      setQuotes(qList);
      setVendorRequirements(vrList);
      setResourceRequirements(rrList);
    } catch (err: any) {
      console.error('Failed to load vendor intelligence live data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRealTimeData();
  }, [loadRealTimeData]);

  const selectedContracts = quotes.filter((quote) => quote.status === 'Selected').length;
  const reviewQuotes = quotes.filter((quote) => quote.status === 'AI Analyzed' || quote.status === 'Under Review').length;
  const bestValue = quotes.reduce<Quotation | null>(
    (best, quote) => (!best || quote.valueScore > best.valueScore ? quote : best),
    null,
  );

  const showNotification = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(null), 6000);
  };

  const handleQuoteAnalyzed = (quote: Quotation) => {
    setQuotes((current) => [quote, ...current.filter((q) => q.id !== quote.id)]);
    showNotification(`Quotation ${quote.quoteNumber} extracted and saved to Supabase for ${quote.vendorName}.`);
    void loadRealTimeData();
  };

  const handleAddVendor = (vendor: Vendor) => {
    setVendors((current) => [vendor, ...current.filter((v) => v.id !== vendor.id)]);
    showNotification(`${vendor.name} was successfully registered in Supabase.`);
    void loadRealTimeData();
  };

  const handleConfirmSelection = async (winner: Quotation) => {
    try {
      const res = await quotationService.selectWinningVendor(winner.id);
      setIsSelectionModalOpen(false);
      showNotification(`${winner.vendorName} selected! ${res.closedCount} competing proposals were officially closed in Supabase.`);
      void loadRealTimeData();
    } catch (err: any) {
      console.error('Error awarding contract:', err);
      // Fallback local update
      setQuotes((current) =>
        current.map((quote) => {
          if (quote.id === winner.id) return { ...quote, status: 'Selected' };
          if (quote.category === winner.category && quote.id !== winner.id) return { ...quote, status: 'Closed' };
          return quote;
        })
      );
      setIsSelectionModalOpen(false);
      showNotification(`${winner.vendorName} awarded locally. Verify backend connection.`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="vendor-workspace flex min-h-screen" style={{ background: 'var(--ivory)' }}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-screen-2xl space-y-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            {/* Hero Section */}
            <section className="vendor-hero relative isolate overflow-hidden rounded-[26px] p-6 sm:p-8 lg:min-h-[286px] lg:p-10">
              <div className="vendor-hero-photo absolute inset-0 -z-20" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#21151f]/95 via-[#2e1f2a]/80 to-[#2e1f2a]/35" />
              <div className="relative flex h-full flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4BA8A]/35 bg-[#2E1F2A]/50 px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[#E8D4B0] backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Core Feature 02 • Smart Vendor Intelligence & Decision Matrix
                  </div>
                  <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight text-[#FFFCF8] sm:text-4xl lg:text-[2.8rem]">
                    Choose with clarity.
                    <span className="block text-[#D4BA8A]">Know the true cost.</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#F0E8EE]/85 sm:text-base">
                    Connected live to Supabase. Compare real landed costs, surface hidden penalties, inspect derived blueprint requirements, and award official contracts across all team machines.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3 font-sans">
                  <button
                    type="button"
                    onClick={() => scrollToSection('vendor-quotations')}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Upload className="h-4 w-4" />
                    Upload proposal PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-[#D4BA8A] to-[#B99A65] px-4 py-2.5 text-sm font-bold text-[#2E1F2A] shadow-[0_8px_24px_rgba(185,154,101,0.24)] transition hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    Register supplier
                  </button>
                </div>
              </div>
            </section>

            {notification && (
              <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm font-sans">
                <span className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  {notification}
                </span>
                <button type="button" onClick={() => setNotification(null)} className="shrink-0 text-xs font-semibold text-emerald-800 hover:underline">
                  Dismiss
                </button>
              </div>
            )}

            {/* Overview Metric Cards */}
            <section aria-label="Vendor intelligence overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard 
                label="Registered suppliers" 
                value={loading ? '...' : vendors.length} 
                detail="Live in Supabase directory" 
                icon={Building2} 
              />
              <MetricCard 
                label="Quotations received" 
                value={loading ? '...' : quotes.length} 
                detail={`${reviewQuotes} active for comparison`} 
                icon={FileText} 
                tone="plum" 
              />
              <MetricCard 
                label="Contracts awarded" 
                value={loading ? '...' : selectedContracts} 
                detail="Locked vendor commitments" 
                icon={BadgeCheck} 
                tone="green" 
              />
              <MetricCard 
                label="Top value score" 
                value={bestValue ? `${bestValue.valueScore}/100` : '—'} 
                detail={bestValue?.vendorName ?? 'Upload quotations to score'} 
                icon={Wallet} 
              />
            </section>

            {/* Service Category Switcher */}
            <section className="vendor-category-panel rounded-2xl p-4 sm:p-5 font-sans">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#2A1E26]">Explore by service category</p>
                  <p className="mt-0.5 text-xs text-[#8A7380]">Select a luxury discipline to compare proposals and requirements.</p>
                </div>
                <span className="rounded-full bg-[#F2E8DF] px-3 py-1 text-xs font-semibold text-[#684C65]">{selectedCategory}</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      type="button"
                      key={category}
                      aria-pressed={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`shrink-0 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                        active
                          ? 'bg-[#493044] text-[#FFFCF8] shadow-[0_4px_12px_rgba(73,48,68,0.16)]'
                          : 'border border-[#E8D4B0]/70 bg-[#FFFCF8] text-[#684C65] hover:border-[#B99A65]/60 hover:bg-[#F7EFE8]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* In-Page Quick Navigation */}
            <nav aria-label="Vendor intelligence sections" className="vendor-section-nav flex gap-2 overflow-x-auto border-b border-[#E8D4B0]/70 pb-2 font-sans">
              {SECTIONS.map((section) => (
                <button
                  type="button"
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-[#76636D] transition hover:bg-[#F2E8DF] hover:text-[#493044]"
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {loading && (
              <div className="p-8 rounded-2xl luxury-gold-card text-center space-y-3 font-sans">
                <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto" />
                <p className="text-sm text-gold-300 font-semibold">Synchronizing with Supabase database...</p>
              </div>
            )}

            {/* 1. Blueprint Demands (VendorRequirement & ResourceRequirement) */}
            <section id="blueprint-requirements" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Derived Blueprint Demands"
                title="Operational Vendor & Resource Requirements"
                description="Live requirements synthesized by the Wedding Blueprint engine. Compare these required allocations against incoming supplier proposals."
                icon={ClipboardList}
              />
              <BlueprintRequirementsPanel
                vendorRequirements={vendorRequirements}
                resourceRequirements={resourceRequirements}
              />
            </section>

            {/* 2. Quotation Comparison Matrix */}
            <section id="vendor-comparison" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Side-by-side proposals"
                title="Compare quotations"
                description="Model guest scale and curfew overtime to evaluate dynamic landed costs. Compare all quotes or select specific proposal numbers."
                icon={FileSearch}
              />
              <QuotationComparisonMatrix
                quotations={quotes}
                onSelectWinner={(quote) => {
                  setSelectedQuote(quote);
                  setIsSelectionModalOpen(true);
                }}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </section>

            {/* 3. Cost & Fineprint Intelligence */}
            <section id="vendor-cost-intelligence" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Look beyond the headline price"
                title="Hidden costs & vendor value"
                description="Review add-on charges, missing inclusions and true estimated cost before a quote is marked as a good deal."
                icon={ShieldCheck}
              />
              <HiddenCostIntelligence quotations={quotes} />
            </section>

            {/* 4. Proposal PDF Intake */}
            <section id="vendor-quotations" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Document intake"
                title="Upload and review quotations"
                description="Upload supplier PDF proposals to extract itemized costs, audit hidden fees, and save directly to Supabase."
                icon={Upload}
              />
              <QuotationUploadDropzone 
                onQuoteAnalyzed={handleQuoteAnalyzed}
                defaultCategory={selectedCategory}
              />
            </section>

            {/* 5. Vendor Directory */}
            <section id="vendor-directory" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Your supplier roster"
                title="Vendor directory"
                description="Browse vendor profiles, compare specialities and register new partners stored live in Supabase."
                icon={Users}
              />
              <VendorDirectory
                vendors={vendors}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
                onSelectVendorForQuote={(vendor) => {
                  setSelectedCategory(vendor.category);
                  scrollToSection('vendor-comparison');
                }}
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => {
                  if (category !== 'All') setSelectedCategory(category);
                }}
              />
            </section>

            {/* Footer Insight Callout */}
            <aside className="flex flex-col gap-3 rounded-2xl border border-[#E8D4B0]/70 bg-[#F2E8DF]/65 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 font-sans">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#9A7E50]">
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#493044]">A smarter way to select</p>
                  <p className="mt-0.5 text-xs leading-5 text-[#76636D]">Review inclusions, additional charges and estimated landed cost alongside every vendor&apos;s value score.</p>
                </div>
              </div>
              <button type="button" onClick={() => scrollToSection('vendor-cost-intelligence')} className="inline-flex shrink-0 items-center gap-1.5 self-start text-xs font-bold text-[#684C65] hover:text-[#493044] sm:self-auto">
                Review cost insights <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </aside>
          </div>
        </main>
        <Footer />
      </div>

      <RegisterVendorModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onAddVendor={handleAddVendor}
      />
      <VendorSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        selectedQuote={selectedQuote}
        rivalQuotesCount={
          selectedQuote
            ? quotes.filter((quote) => quote.category === selectedQuote.category && quote.id !== selectedQuote.id).length
            : 0
        }
        onConfirmSelection={handleConfirmSelection}
      />
    </div>
  );
}
