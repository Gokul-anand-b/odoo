import { Quotation, VendorCategory } from '../types/vendor.types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const quotationService = {
  async getComparisonMatrix(category: VendorCategory = 'Catering & Banquets'): Promise<{
    category: string;
    recommendedQuoteId: string | null;
    quotations: Quotation[];
  }> {
    try {
      const res = await fetch(`${API_BASE}/quotations/compare/?category=${encodeURIComponent(category)}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('API response not ok');
      const data = await res.json();
      return {
        category: data.category,
        recommendedQuoteId: data.recommended_quote_id,
        quotations: data.quotations.map(transformBackendQuote),
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unable to load quotations from the database.');
    }
  },

  async selectWinningVendor(quoteId: string): Promise<{
    success: boolean;
    message: string;
    closedCount: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/quotations/${quoteId}/select-winner/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to select winner on backend');
      const data = await res.json();
      return {
        success: true,
        message: data.message,
        closedCount: data.closed_rival_quotes_count,
      };
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unable to select quotation.');
    }
  },

  async extractPdfProposal(fileName: string, rawText: string): Promise<Quotation | null> {
    try {
      const res = await fetch(`${API_BASE}/quotations/extract-pdf/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: fileName, raw_text: rawText, base_price: 2450000 }),
      });
      if (!res.ok) throw new Error('Extraction failed');
      const data = await res.json();
      return {
        id: `q-ext-${Date.now()}`,
        quoteNumber: `Q-AI-EXT-${Math.floor(1000 + Math.random() * 9000)}`,
        vendorId: 'v-new',
        vendorName: 'Udaipur Imperial Banquet Supplier',
        category: 'Catering & Banquets',
        weddingName: 'Samar & Alizeh Royal Wedding',
        weddingDate: 'Nov 18-20, 2026',
        status: 'AI Analyzed',
        submissionDate: new Date().toISOString().split('T')[0],
        expiryDate: '2026-11-30',
        basePrice: data.base_price,
        taxesGst: data.taxes_gst,
        pricePerPlate: 3750,
        minimumGuestGuarantee: 500,
        hiddenCostsTotal: data.hidden_costs_total,
        missingInclusionsCost: data.missing_inclusions_cost,
        trueEstimatedLandedCost: data.true_estimated_landed_cost,
        valueScore: data.value_score,
        pdfFileName: fileName,
        overtimeHourlyRate: 35000,
        advancePaymentPercentage: 45,
        items: [],
        hiddenCosts: data.hidden_costs.map((h: any, i: number) => ({
          id: `hc-${i}`,
          label: h.label,
          amount: h.amount,
          riskLevel: h.risk_level,
          reason: h.reason,
          category: h.category,
        })),
        missingInclusions: data.missing_inclusions.map((m: any, i: number) => ({
          id: `mi-${i}`,
          item: m.item,
          industryStandard: m.industry_standard,
          vendorProvision: m.vendor_provision,
          estimatedFixCost: m.estimated_fix_cost,
          severity: m.severity,
        })),
      };
    } catch (err) {
      console.warn('Using local fallback parser:', err);
      return null;
    }
  },
};

function transformBackendQuote(bq: any): Quotation {
  return {
    id: bq.id,
    quoteNumber: bq.quote_number,
    vendorId: bq.vendor,
    vendorName: bq.vendor_name || 'Vendor Partner',
    category: bq.category || 'Catering & Banquets',
    weddingName: bq.wedding_name,
    weddingDate: bq.wedding_date,
    status: bq.status,
    submissionDate: bq.submission_date,
    expiryDate: bq.expiry_date || '',
    basePrice: Number(bq.base_price),
    taxesGst: Number(bq.taxes_gst),
    pricePerPlate: bq.price_per_plate ? Number(bq.price_per_plate) : undefined,
    minimumGuestGuarantee: bq.minimum_guest_guarantee,
    hiddenCostsTotal: Number(bq.hidden_costs_total),
    missingInclusionsCost: Number(bq.missing_inclusions_cost),
    trueEstimatedLandedCost: Number(bq.true_estimated_landed_cost),
    valueScore: bq.value_score,
    pdfFileName: bq.pdf_file_name || 'Quotation.pdf',
    overtimeHourlyRate: Number(bq.overtime_hourly_rate || 20000),
    advancePaymentPercentage: bq.advance_payment_percentage || 40,
    items: (bq.items || []).map((it: any) => ({
      id: it.id,
      description: it.description,
      unit: it.unit,
      quantity: Number(it.quantity),
      unitRate: Number(it.unit_rate),
      totalRate: Number(it.total_rate),
      isIncluded: it.is_included,
      notes: it.notes,
    })),
    hiddenCosts: (bq.hidden_costs || []).map((h: any) => ({
      id: h.id,
      label: h.label,
      amount: Number(h.amount),
      riskLevel: h.risk_level,
      reason: h.reason,
      category: h.category,
    })),
    missingInclusions: (bq.missing_inclusions || []).map((m: any) => ({
      id: m.id,
      item: m.item,
      industryStandard: m.industry_standard,
      vendorProvision: m.vendor_provision,
      estimatedFixCost: Number(m.estimated_fix_cost),
      severity: m.severity,
    })),
  };
}
