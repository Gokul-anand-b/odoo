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
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { INITIAL_VENDORS, INITIAL_QUOTES } from '../features/vendor-intelligence/constants/mockVendorData';
import { Vendor, Quotation } from '../features/vendor-intelligence/types/vendor.types';
import { Sidebar } from '../components/sidebar/Sidebar';
import { Header } from '../components/header/Header';
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
    <div className="flex min-h-screen bg-plum-950 text-ivory-100">
      {/* 1. Left-Side Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
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
              onSelectVendorForQuote={() => {
                setActiveTab('matrix');
              }}
            />
          )}
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
