'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award,
  Filter,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { Vendor, VendorCategory, VendorTier } from '../types/vendor.types';

interface VendorDirectoryProps {
  vendors: Vendor[];
  onOpenRegisterModal: () => void;
  onSelectVendorForQuote: (vendor: Vendor) => void;
}

const ALL_CATEGORIES: ('All' | VendorCategory)[] = [
  'All',
  'Catering & Banquets',
  'Royal Decor & Floral',
  'Photography & Cinematography',
  'Palace Venues',
  'Live Entertainment & Folk',
  'Royal Logistics & Vintage Fleet',
];

export const VendorDirectory: React.FC<VendorDirectoryProps> = ({
  vendors,
  onOpenRegisterModal,
  onSelectVendorForQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | VendorCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  const filteredVendors = vendors.filter((v) => {
    const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesTier = selectedTier === 'All' || v.tier === selectedTier;
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Category Filters & Register CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search vendor by name, Udaipur/Jaipur city, cuisine, or floral specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-plum-900/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-sm text-ivory-100 placeholder:text-ivory-300/40"
          />
          <Search className="w-4 h-4 text-gold-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Tier Selector & Register Button */}
        <div className="flex items-center gap-3">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-plum-900/70 border border-gold-500/30 text-xs text-ivory-200 focus:outline-none"
          >
            <option value="All">All Quality Tiers</option>
            <option value="Heritage Luxe">Heritage Luxe</option>
            <option value="Premium Royal">Premium Royal</option>
            <option value="Boutique Elite">Boutique Elite</option>
          </select>

          <button
            onClick={onOpenRegisterModal}
            className="px-4 py-2.5 rounded-xl bg-gold-gradient text-plum-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Register Supplier
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-gold-500 text-plum-950 shadow-gold-subtle'
                : 'bg-plum-900/50 border border-gold-500/20 text-ivory-300 hover:text-ivory-100 hover:bg-plum-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="luxury-card rounded-2xl p-6 border border-gold-500/25 flex flex-col justify-between hover:border-gold-500/50 transition-all space-y-4"
          >
            <div className="space-y-3">
              {/* Top Row: Category & Tier Badges */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  {vendor.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-plum-800 border border-gold-500/30 text-gold-300">
                  {vendor.tier}
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-serif text-ivory-100 font-bold">
                    {vendor.name}
                  </h3>
                  {vendor.verified && (
                    <span title="Tourism Board Verified">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-ivory-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" />
                  {vendor.city}
                </p>
              </div>

              {/* Stats Bar: Rating & Experience */}
              <div className="flex items-center gap-4 py-2 border-y border-plum-800 text-xs">
                <div className="flex items-center gap-1 text-gold-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  {vendor.rating} <span className="text-[10px] font-normal text-ivory-300">({vendor.reviewCount})</span>
                </div>
                <div className="text-ivory-300">
                  {vendor.experienceYears} Years Exp
                </div>
                <div className="text-ivory-300 flex items-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
                  {vendor.completedWeddingsCount} Weddings
                </div>
              </div>

              {/* Specialties Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-ivory-300">Royal Specialties:</span>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-plum-950/70 border border-gold-500/20 text-ivory-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Preview */}
              <div className="text-[11px] text-ivory-300 space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gold-500" />
                  <span>{vendor.phone} ({vendor.contactPerson})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gold-500" />
                  <span className="truncate">{vendor.email}</span>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-2">
              <button
                onClick={() => onSelectVendorForQuote(vendor)}
                className="w-full py-2 rounded-xl bg-plum-800/90 border border-gold-500/40 text-gold-300 text-xs font-semibold hover:bg-gold-500 hover:text-plum-950 transition"
              >
                View Existing Quotes & Bids
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
