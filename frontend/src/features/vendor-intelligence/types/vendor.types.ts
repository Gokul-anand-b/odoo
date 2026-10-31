export type VendorCategory = 
  | 'Catering & Banquets'
  | 'Royal Decor & Floral'
  | 'Photography & Cinematography'
  | 'Palace Venues'
  | 'Live Entertainment & Folk'
  | 'Bridal Styling & Mehendi'
  | 'Royal Logistics & Vintage Fleet'
  | 'Lighting & Production';

export type VendorTier = 'Heritage Luxe' | 'Premium Royal' | 'Boutique Elite';

export type QuoteStatus = 
  | 'Draft'
  | 'Under Review'
  | 'AI Analyzed'
  | 'Shortlisted'
  | 'Selected'
  | 'Rejected'
  | 'Closed';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  tier: VendorTier;
  rating: number;
  reviewCount: number;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  experienceYears: number;
  completedWeddingsCount: number;
  verified: boolean;
  avatarUrl?: string;
  specialties: string[];
}

export interface QuoteItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  totalRate: number;
  isIncluded: boolean;
  notes?: string;
}

export interface HiddenCostItem {
  id: string;
  label: string;
  amount: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  reason: string;
  category: 'Overtime' | 'Power/Fuel' | 'Corkage' | 'Service Fee' | 'Breakage Deposit';
}

export interface MissingInclusion {
  id: string;
  item: string;
  industryStandard: string;
  vendorProvision: string;
  estimatedFixCost: number;
  severity: 'Critical' | 'Warning' | 'Notice';
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  vendorId: string;
  vendorName: string;
  category: VendorCategory;
  weddingName: string;
  weddingDate: string;
  status: QuoteStatus;
  submissionDate: string;
  expiryDate: string;
  basePrice: number;
  taxesGst: number;
  pricePerPlate?: number;
  minimumGuestGuarantee?: number;
  hiddenCostsTotal: number;
  missingInclusionsCost: number;
  trueEstimatedLandedCost: number; // Novelty calculation
  valueScore: number; // 0-100 composite index
  pdfFileName: string;
  items: QuoteItem[];
  hiddenCosts: HiddenCostItem[];
  missingInclusions: MissingInclusion[];
  overtimeHourlyRate: number;
  advancePaymentPercentage: number;
}


export interface VendorRequirement {
  id: string;
  blueprint: string;
  weddingId?: string;
  weddingTitle?: string;
  coupleNames?: string;
  category: string;
  serviceName: string;
  headcountCapacity: number;
  allocatedBudget: number;
  targetBookingDeadline?: string | null;
  status: string;
  deliverables: string[];
  createdAt?: string;
}

export interface ResourceRequirement {
  id: string;
  blueprint: string;
  weddingId?: string;
  weddingTitle?: string;
  coupleNames?: string;
  resourceName: string;
  quantity: number;
  unit: string;
  allocatedForEvent: string;
  importance: string;
  createdAt?: string;
}
