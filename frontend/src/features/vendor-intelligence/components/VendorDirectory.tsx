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
  CalendarCheck
} from 'lucide-react';
import { Vendor, VendorCategory, VendorTier } from '../types/vendor.types';

interface VendorDirectoryProps {
  vendors: Vendor[];
  onOpenRegisterModal: () => void;
  onSelectVendorForQuote: (vendor: Vendor) => void;
  selectedCategory: VendorCategory | 'All';
  onCategoryChange: (cat: VendorCategory | 'All') => void;
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
  selectedCategory,
  onCategoryChange,
}) => {
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
      {/* Top Controls: Search & Register CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search suppliers by name, Udaipur/Jaipur city, cuisine, or floral..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-wedding-900 border border-gold-400/30 focus:border-gold-400 focus:outline-none text-sm text-cream-100 placeholder:text-cream-300/40"
          />
          <Search className="w-4 h-4 text-gold-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Tier Selector & Register Button */}
        <div className="flex items-center gap-3">
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-wedding-900 border border-gold-400/30 text-xs text-cream-200 focus:outline-none"
          >
            <option value="All">All Quality Tiers</option>
            <option value="Heritage Luxe">Heritage Luxe</option>
            <option value="Premium Royal">Premium Royal</option>
            <option value="Boutique Elite">Boutique Elite</option>
          </select>

          <button
            onClick={onOpenRegisterModal}
            className="px-4 py-2.5 rounded-xl bg-gold-gradient text-wedding-950 font-bold text-xs shadow-gold-subtle hover:brightness-110 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Register Supplier
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="luxury-gold-card rounded-2xl p-6 border border-gold-400/25 flex flex-col justify-between hover:border-gold-400/50 transition-all space-y-4"
          >
            <div className="space-y-3 font-sans">
              {/* Category & Tier Badges */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                  {vendor.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-wedding-800 border border-gold-400/30 text-gold-300">
                  {vendor.tier}
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-serif text-cream-100 font-bold">
                    {vendor.name}
                  </h3>
                  {vendor.verified && (
                    <span title="Rajasthan Tourism Board Verified">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-cream-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  {vendor.city}
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 py-2 border-y border-wedding-800 text-xs">
                <div className="flex items-center gap-1 text-gold-300 font-bold font-serif">
                  <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  {vendor.rating} <span className="text-[10px] font-normal text-cream-300 font-sans">({vendor.reviewCount})</span>
                </div>
                <div className="text-cream-300">
                  {vendor.experienceYears} Years Exp
                </div>
                <div className="text-cream-300 flex items-center gap-1">
                  <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
                  {vendor.completedWeddingsCount} Weddings
                </div>
              </div>

              {/* Specialties Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-cream-300 font-semibold">Specialties:</span>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-wedding-950 border border-gold-400/20 text-cream-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="text-[11px] text-cream-300 space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gold-400" />
                  <span>{vendor.phone} ({vendor.contactPerson})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gold-400" />
                  <span className="truncate">{vendor.email}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 font-sans">
              <button
                onClick={() => onSelectVendorForQuote(vendor)}
                className="w-full py-2 rounded-xl bg-wedding-800 border border-gold-400/40 text-gold-300 text-xs font-semibold hover:bg-gold-500 hover:text-wedding-950 transition"
              >
                View Linked Proposals
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
