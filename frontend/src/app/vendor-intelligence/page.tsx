'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import Footer from '@/components/layout/Footer';
import { INITIAL_QUOTES, INITIAL_VENDORS } from '../../../features/vendor-intelligence/constants/mockVendorData';
import { HiddenCostIntelligence } from '../../../features/vendor-intelligence/components/HiddenCostIntelligence';
import { QuotationComparisonMatrix } from '../../../features/vendor-intelligence/components/QuotationComparisonMatrix';
import { QuotationUploadDropzone } from '../../../features/vendor-intelligence/components/QuotationUploadDropzone';
import { RegisterVendorModal } from '../../../features/vendor-intelligence/components/RegisterVendorModal';
import { VendorDirectory } from '../../../features/vendor-intelligence/components/VendorDirectory';
import { VendorSelectionModal } from '../../../features/vendor-intelligence/components/VendorSelectionModal';
import { Quotation, Vendor, VendorCategory } from '../../../features/vendor-intelligence/types/vendor.types';

const CATEGORIES: VendorCategory[] = [
  'Catering & Banquets',
  'Royal Decor & Floral',
  'Photography & Cinematography',
  'Palace Venues',
  'Live Entertainment & Folk',
  'Royal Logistics & Vintage Fleet',
];

const SECTIONS = [
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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
    <article className="vendor-metric-card flex min-w-0 items-start gap-4 rounded-2xl p-4 sm:p-5">
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
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [quotes, setQuotes] = useState<Quotation[]>(INITIAL_QUOTES);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('Catering & Banquets');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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
    setQuotes((current) => [quote, ...current]);
    showNotification(`Quotation extracted and added for ${quote.vendorName}.`);
  };

  const handleAddVendor = (vendor: Vendor) => {
    setVendors((current) => [vendor, ...current]);
    showNotification(`${vendor.name} was added to your vendor directory.`);
  };

  const handleConfirmSelection = (winner: Quotation) => {
    setQuotes((current) =>
      current.map((quote) => {
        if (quote.id === winner.id) return { ...quote, status: 'Selected' };
        if (quote.category === winner.category && quote.id !== winner.id) return { ...quote, status: 'Closed' };
        return quote;
      }),
    );
    setIsSelectionModalOpen(false);
    showNotification(`${winner.vendorName} selected. Competing quotations in this category were closed.`);
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
            <section className="vendor-hero relative isolate overflow-hidden rounded-[26px] p-6 sm:p-8 lg:min-h-[286px] lg:p-10">
              <div className="vendor-hero-photo absolute inset-0 -z-20" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#21151f]/95 via-[#2e1f2a]/80 to-[#2e1f2a]/35" />
              <div className="relative flex h-full flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4BA8A]/35 bg-[#2E1F2A]/50 px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[#E8D4B0] backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    Core feature 02 · Smart vendor intelligence
                  </div>
                  <h1 className="max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-tight text-[#FFFCF8] sm:text-4xl lg:text-[2.8rem]">
                    Choose with clarity.
                    <span className="block text-[#D4BA8A]">Know the true cost.</span>
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-[#F0E8EE]/85 sm:text-base">
                    Keep every vendor, quotation and commitment in one place. Compare real landed costs, surface exclusions and select the best-fit partner—not just the lowest headline price.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('vendor-quotations')}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <Upload className="h-4 w-4" />
                    Add a quotation
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-[#D4BA8A] to-[#B99A65] px-4 py-2.5 text-sm font-bold text-[#2E1F2A] shadow-[0_8px_24px_rgba(185,154,101,0.24)] transition hover:-translate-y-0.5"
                  >
                    <Plus className="h-4 w-4" />
                    Register vendor
                  </button>
                </div>
              </div>
            </section>

            {notification && (
              <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
                <span className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  {notification}
                </span>
                <button type="button" onClick={() => setNotification(null)} className="shrink-0 text-xs font-semibold text-emerald-800 hover:underline">
                  Dismiss
                </button>
              </div>
            )}

            <section aria-label="Vendor intelligence overview" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Registered vendors" value={vendors.length} detail="Profiles in your directory" icon={Building2} />
              <MetricCard label="Quotations received" value={quotes.length} detail={`${reviewQuotes} awaiting review`} icon={FileText} tone="plum" />
              <MetricCard label="Contracts selected" value={selectedContracts} detail="Confirmed vendor decisions" icon={BadgeCheck} tone="green" />
              <MetricCard label="Top value score" value={bestValue ? `${bestValue.valueScore}/100` : '—'} detail={bestValue?.vendorName ?? 'Add quotations to compare'} icon={Wallet} />
            </section>

            <section className="vendor-category-panel rounded-2xl p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#2A1E26]">Explore by service</p>
                  <p className="mt-0.5 text-xs text-[#8A7380]">Choose a category to compare matching proposals.</p>
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

            <nav aria-label="Vendor intelligence sections" className="vendor-section-nav flex gap-2 overflow-x-auto border-b border-[#E8D4B0]/70 pb-2">
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

            <section id="vendor-comparison" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Side-by-side proposals"
                title="Compare quotations"
                description="Model guest count and overtime to see how each proposal's estimated cost changes before you make a decision."
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

            <section id="vendor-cost-intelligence" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Look beyond the headline price"
                title="Hidden costs & vendor value"
                description="Review add-on charges, missing inclusions and true estimated cost before a quote is marked as a good deal."
                icon={ShieldCheck}
              />
              <HiddenCostIntelligence quotations={quotes} />
            </section>

            <section id="vendor-quotations" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Document intake"
                title="Upload and review quotations"
                description="Add a vendor proposal to extract its pricing details and include it in your comparison."
                icon={Upload}
              />
              <QuotationUploadDropzone onQuoteAnalyzed={handleQuoteAnalyzed} />
            </section>

            <section id="vendor-directory" className="vendor-content-section scroll-mt-24">
              <SectionHeading
                eyebrow="Your supplier roster"
                title="Vendor directory"
                description="Browse vendor profiles, compare specialities and register new partners for your celebration."
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

            <aside className="flex flex-col gap-3 rounded-2xl border border-[#E8D4B0]/70 bg-[#F2E8DF]/65 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
