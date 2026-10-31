'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, X, ShieldAlert, Award, FileText, ArrowRight } from 'lucide-react';
import { Quotation } from '../types/vendor.types';

interface VendorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuote: Quotation | null;
  rivalQuotesCount: number;
  onConfirmSelection: (quote: Quotation) => void;
}

export const VendorSelectionModal: React.FC<VendorSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedQuote,
  rivalQuotesCount,
  onConfirmSelection,
}) => {
  if (!isOpen || !selectedQuote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-plum-900 to-plum-950 border border-gold-500/50 rounded-2xl shadow-gold-glow p-6 sm:p-8 text-ivory-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ivory-300 hover:text-gold-400 hover:bg-plum-800/60 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-gold-500/20">
          <div className="p-3 bg-gold-500/20 rounded-2xl border border-gold-500/40 text-gold-400">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">Contract Award Protocol</span>
            <h2 className="text-xl sm:text-2xl font-serif text-ivory-50">Confirm Official Vendor Selection</h2>
          </div>
        </div>

        {/* Details Card */}
        <div className="mt-5 p-4 rounded-xl bg-plum-850/80 border border-gold-500/30 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-gold-400 font-medium">Selected Vendor & Category</p>
              <h3 className="text-lg font-serif text-ivory-100 font-semibold">{selectedQuote.vendorName}</h3>
              <p className="text-xs text-ivory-300">{selectedQuote.category} • Ref: {selectedQuote.quoteNumber}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40">
                Score: {selectedQuote.valueScore}/100
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-plum-700/60 text-xs">
            <div>
              <span className="text-ivory-300">Sticker Base Price:</span>
              <p className="text-sm font-semibold text-ivory-100">₹{(selectedQuote.basePrice / 100000).toFixed(2)} Lakhs</p>
            </div>
            <div>
              <span className="text-gold-400 font-medium">True Landed Cost (AI):</span>
              <p className="text-sm font-bold text-gold-300">₹{(selectedQuote.trueEstimatedLandedCost / 100000).toFixed(2)} Lakhs</p>
            </div>
          </div>
        </div>

        {/* Operational Consequences Notice */}
        <div className="mt-4 p-4 rounded-xl bg-plum-800/40 border border-gold-500/20 space-y-2.5 text-xs text-ivory-200">
          <div className="flex items-center gap-2 text-gold-400 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Automated Operational Ripple Effects:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-ivory-300">
            <li>
              <strong className="text-ivory-100">Auto-Close Rival Quotations:</strong> All <span className="text-gold-300 font-semibold">{rivalQuotesCount} competing quotes</span> in this category will be politely closed and moved to &apos;Rejected / Closed&apos;.
            </li>
            <li>
              <strong className="text-ivory-100">Financial Milestone Lock:</strong> Generates booking advance invoice for {selectedQuote.advancePaymentPercentage}% (₹{((selectedQuote.basePrice * (selectedQuote.advancePaymentPercentage / 100)) / 100000).toFixed(2)} Lakhs) into Financial Settlement.
            </li>
            <li>
              <strong className="text-ivory-100">Digital SLA Agreement:</strong> Dispatches binding digital agreement packet to {selectedQuote.vendorName}.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gold-500/20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gold-500/30 text-ivory-300 hover:bg-plum-800 text-sm transition"
          >
            Review Other Bids
          </button>
          <button
            type="button"
            onClick={() => onConfirmSelection(selectedQuote)}
            className="px-6 py-2.5 rounded-xl bg-gold-gradient text-plum-950 font-bold text-sm shadow-gold-glow hover:brightness-110 flex items-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-plum-950" />
            Award Contract & Close Others
          </button>
        </div>
      </div>
    </div>
  );
};
