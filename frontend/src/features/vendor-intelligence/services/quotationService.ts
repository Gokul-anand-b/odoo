import { Quotation, Vendor, VendorCategory, VendorRequirement, ResourceRequirement } from '../types/vendor.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

async function safeJson<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(
      `Server returned status ${res.status} (non-JSON response). ` +
      `Check backend service connection at ${API_BASE_URL}.\nPreview: ${text.slice(0, 100)}`
    );
  }
  return res.json();
}

function transformBackendVendor(bv: any): Vendor {
  return {
    id: String(bv.id),
    name: bv.name || 'Unnamed Vendor',
    category: bv.category as VendorCategory,
    tier: bv.tier || 'Heritage Luxe',
    rating: Number(bv.rating) || 4.8,
    reviewCount: Number(bv.review_count) || 1,
    city: bv.city || 'Udaipur, Rajasthan',
    contactPerson: bv.contact_person || '',
    phone: bv.phone || '',
    email: bv.email || '',
    experienceYears: Number(bv.experience_years) || 5,
    completedWeddingsCount: Number(bv.completed_weddings_count) || 1,
    verified: Boolean(bv.verified),
    avatarUrl: bv.avatar_url,
    specialties: Array.isArray(bv.specialties)
      ? bv.specialties
      : typeof bv.specialties === 'string'
      ? bv.specialties.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
  };
}

function transformBackendQuote(bq: any): Quotation {
  return {
    id: String(bq.id),
    quoteNumber: bq.quote_number || `Q-${bq.id}`,
    vendorId: String(bq.vendor || bq.vendor_id || ''),
    vendorName: bq.vendor_name || 'Vendor Partner',
    category: (bq.category || 'Catering & Banquets') as VendorCategory,
    weddingName: bq.wedding_name || 'Royal Celebration',
    weddingDate: bq.wedding_date || 'TBD',
    status: bq.status || 'AI Analyzed',
    submissionDate: bq.submission_date || new Date().toISOString().split('T')[0],
    expiryDate: bq.expiry_date || '',
    basePrice: Number(bq.base_price) || 0,
    taxesGst: Number(bq.taxes_gst) || 0,
    pricePerPlate: bq.price_per_plate ? Number(bq.price_per_plate) : undefined,
    minimumGuestGuarantee: bq.minimum_guest_guarantee ? Number(bq.minimum_guest_guarantee) : undefined,
    hiddenCostsTotal: Number(bq.hidden_costs_total) || 0,
    missingInclusionsCost: Number(bq.missing_inclusions_cost) || 0,
    trueEstimatedLandedCost: Number(bq.true_estimated_landed_cost) || 0,
    valueScore: Number(bq.value_score) || 75,
    pdfFileName: bq.pdf_file_name || 'Quotation.pdf',
    overtimeHourlyRate: Number(bq.overtime_hourly_rate) || 25000,
    advancePaymentPercentage: Number(bq.advance_payment_percentage) || 40,
    items: (bq.items || []).map((it: any) => ({
      id: String(it.id),
      description: it.description || '',
      unit: it.unit || 'unit',
      quantity: Number(it.quantity) || 1,
      unitRate: Number(it.unit_rate) || 0,
      totalRate: Number(it.total_rate) || 0,
      isIncluded: Boolean(it.is_included),
      notes: it.notes,
    })),
    hiddenCosts: (bq.hidden_costs || []).map((h: any) => ({
      id: String(h.id),
      label: h.label || 'Additional Fee',
      amount: Number(h.amount) || 0,
      riskLevel: h.risk_level || 'Medium',
      reason: h.reason || '',
      category: h.category || 'Service Fee',
    })),
    missingInclusions: (bq.missing_inclusions || []).map((m: any) => ({
      id: String(m.id),
      item: m.item || 'Standard Item',
      industryStandard: m.industry_standard || '',
      vendorProvision: m.vendor_provision || '',
      estimatedFixCost: Number(m.estimated_fix_cost || 0),
      severity: m.severity || 'Warning',
    })),
  };
}

function transformVendorRequirement(vr: any): VendorRequirement {
  return {
    id: String(vr.id),
    blueprint: String(vr.blueprint),
    weddingId: vr.wedding_id,
    weddingTitle: vr.wedding_title,
    coupleNames: vr.couple_names,
    category: vr.category || 'venue',
    serviceName: vr.service_name || 'Required Service',
    headcountCapacity: Number(vr.headcount_capacity) || 150,
    allocatedBudget: Number(vr.allocated_budget) || 0,
    targetBookingDeadline: vr.target_booking_deadline,
    status: vr.status || 'Requirement Identified',
    deliverables: Array.isArray(vr.deliverables) ? vr.deliverables : [],
    createdAt: vr.created_at,
  };
}

function transformResourceRequirement(rr: any): ResourceRequirement {
  return {
    id: String(rr.id),
    blueprint: String(rr.blueprint),
    weddingId: rr.wedding_id,
    weddingTitle: rr.wedding_title,
    coupleNames: rr.couple_names,
    resourceName: rr.resource_name || 'Equipment / Staff',
    quantity: Number(rr.quantity) || 1,
    unit: rr.unit || 'units',
    allocatedForEvent: rr.allocated_for_event || 'All Events',
    importance: rr.importance || 'High',
    createdAt: rr.created_at,
  };
}

export const quotationService = {
  // Fetch real-time vendors from Supabase
  async getVendors(category?: string): Promise<Vendor[]> {
    const url = new URL(`${API_BASE_URL}/vendors/`);
    if (category && category !== 'All') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch vendors: ${res.statusText}`);
    const data = await safeJson(res);
    const list = Array.isArray(data) ? data : data.results || data.data || [];
    return list.map(transformBackendVendor);
  },

  // Register new vendor in Supabase
  async createVendor(vendorData: Partial<Vendor>): Promise<Vendor> {
    const payload = {
      name: vendorData.name,
      category: vendorData.category,
      tier: vendorData.tier || 'Heritage Luxe',
      rating: vendorData.rating || 4.8,
      review_count: vendorData.reviewCount || 1,
      city: vendorData.city || 'Udaipur, Rajasthan',
      contact_person: vendorData.contactPerson || '',
      phone: vendorData.phone || '',
      email: vendorData.email || '',
      experience_years: vendorData.experienceYears || 5,
      completed_weddings_count: vendorData.completedWeddingsCount || 1,
      verified: vendorData.verified ?? true,
      specialties: Array.isArray(vendorData.specialties) ? vendorData.specialties : [],
    };

    const res = await fetch(`${API_BASE_URL}/vendors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to create vendor: ${res.statusText}`);
    const data = await safeJson(res);
    return transformBackendVendor(data);
  },

  // Fetch real-time quotations from Supabase
  async getQuotations(category?: string): Promise<Quotation[]> {
    const url = new URL(`${API_BASE_URL}/quotations/`);
    if (category && category !== 'All') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch quotations: ${res.statusText}`);
    const data = await safeJson(res);
    const list = Array.isArray(data) ? data : data.results || data.data || [];
    return list.map(transformBackendQuote);
  },

  // Compare quotations in real-time
  async getComparisonMatrix(category: VendorCategory = 'Catering & Banquets'): Promise<{
    category: string;
    recommendedQuoteId: string | null;
    quotations: Quotation[];
  }> {
    const res = await fetch(`${API_BASE_URL}/quotations/compare/?category=${encodeURIComponent(category)}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to compare quotations: ${res.statusText}`);
    const data = await safeJson(res);
    return {
      category: data.category,
      recommendedQuoteId: data.recommended_quote_id,
      quotations: (data.quotations || []).map(transformBackendQuote),
    };
  },

  // Award contract and update in Supabase
  async selectWinningVendor(quoteId: string): Promise<{
    success: boolean;
    message: string;
    closedCount: number;
  }> {
    const res = await fetch(`${API_BASE_URL}/quotations/${quoteId}/select-winner/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to select winner: ${res.statusText}`);
    const data = await safeJson(res);
    return {
      success: true,
      message: data.message,
      closedCount: data.closed_rival_quotes_count ?? 0,
    };
  },

  // Extract PDF proposal, run AI analysis, and persist in Supabase
  async extractPdfProposal(options: {
    fileName: string;
    rawText?: string;
    vendorId?: string;
    vendorName?: string;
    category?: VendorCategory;
    basePrice?: number;
    weddingName?: string;
    overtimeHourlyRate?: number;
    pricePerPlate?: number;
    minimumGuestGuarantee?: number;
  }): Promise<Quotation> {
    const payload = {
      file_name: options.fileName,
      raw_text: options.rawText || 'Luxury palace wedding proposal including banquet catering, welcome live counters, single malt corkage, genset fuel surcharge, and late-night overtime provisions.',
      vendor_id: options.vendorId,
      vendor_name: options.vendorName || 'Udaipur Imperial Culinary & Banquets',
      category: options.category || 'Catering & Banquets',
      base_price: options.basePrice || 2450000,
      wedding_name: options.weddingName || 'Samar & Alizeh Royal Wedding',
      overtime_hourly_rate: options.overtimeHourlyRate || 35000,
      price_per_plate: options.pricePerPlate || 3750,
      minimum_guest_guarantee: options.minimumGuestGuarantee || 500,
      save_to_db: true,
    };

    const res = await fetch(`${API_BASE_URL}/quotations/extract-pdf/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`PDF extraction failed: ${res.statusText}`);
    const data = await safeJson(res);
    return transformBackendQuote(data);
  },

  // Fetch real-time VendorRequirements from wedding_blueprint table
  async getVendorRequirements(weddingId?: string, category?: string): Promise<VendorRequirement[]> {
    const url = new URL(`${API_BASE_URL}/vendor-requirements/`);
    if (weddingId) url.searchParams.set('wedding_id', weddingId);
    if (category && category !== 'All') url.searchParams.set('category', category);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch vendor requirements: ${res.statusText}`);
    const json = await safeJson(res);
    const list = json.data || (Array.isArray(json) ? json : []);
    return list.map(transformVendorRequirement);
  },

  // Fetch real-time ResourceRequirements from wedding_blueprint table
  async getResourceRequirements(weddingId?: string): Promise<ResourceRequirement[]> {
    const url = new URL(`${API_BASE_URL}/resource-requirements/`);
    if (weddingId) url.searchParams.set('wedding_id', weddingId);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch resource requirements: ${res.statusText}`);
    const json = await safeJson(res);
    const list = json.data || (Array.isArray(json) ? json : []);
    return list.map(transformResourceRequirement);
  },
};
