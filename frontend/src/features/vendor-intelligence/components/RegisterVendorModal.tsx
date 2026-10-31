'use client';

import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { Vendor, VendorCategory, VendorTier } from '../types/vendor.types';
import { quotationService } from '../services/quotationService';

interface RegisterVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: Vendor) => void;
}

const CATEGORIES: VendorCategory[] = [
  'Catering & Banquets',
  'Royal Decor & Floral',
  'Photography & Cinematography',
  'Palace Venues',
  'Live Entertainment & Folk',
  'Bridal Styling & Mehendi',
  'Royal Logistics & Vintage Fleet',
  'Lighting & Production',
];

const TIERS: VendorTier[] = ['Heritage Luxe', 'Premium Royal', 'Boutique Elite'];

export const RegisterVendorModal: React.FC<RegisterVendorModalProps> = ({
  isOpen,
  onClose,
  onAddVendor,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('Catering & Banquets');
  const [tier, setTier] = useState<VendorTier>('Heritage Luxe');
  const [city, setCity] = useState('Udaipur, Rajasthan');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState(8);
  const [specialties, setSpecialties] = useState('Royal Hospitality, Live Food Theatres, Palace Logistics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const vendorData: Partial<Vendor> = {
        name: name.trim(),
        category,
        tier,
        rating: 4.8,
        reviewCount: 1,
        city: city.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        experienceYears: Number(experienceYears) || 5,
        completedWeddingsCount: 1,
        verified: true,
        specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const savedVendor = await quotationService.createVendor(vendorData);
      onAddVendor(savedVendor);
      onClose();
    } catch (err: any) {
      console.error('Error creating vendor in Supabase:', err);
      setErrorMsg(err?.message || 'Failed to register vendor. Please verify the backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wedding-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-wedding-900 to-wedding-950 border border-gold-400/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-cream-100 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-cream-300 hover:text-gold-400 hover:bg-wedding-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gold-400/20">
          <div className="p-3 bg-wedding-850 rounded-xl border border-gold-400/40 text-gold-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-cream-100 font-bold">Register New Supplier Partner</h2>
            <p className="text-xs text-cream-300">
              Add verified royal hospitality, catering, floral, and cinema suppliers directly to Supabase.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          {/* Supplier Name */}
          <div>
            <label className="block text-cream-200 font-medium mb-1">Company / Brand Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maharani Jewels & Heritage Florals"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Category & Tier Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream-200 font-medium mb-1">Service Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-wedding-950">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-cream-200 font-medium mb-1">Curation Tier *</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as VendorTier)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t} className="bg-wedding-950">{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cream-200 font-medium mb-1">Base City / Headquarters</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-cream-200 font-medium mb-1">Years of Royal Experience</label>
              <input
                type="number"
                min={1}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-cream-200 font-medium mb-1">Lead Contact Person</label>
              <input
                type="text"
                placeholder="Manager / Proprietor"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-cream-200 font-medium mb-1">Official Phone</label>
              <input
                type="text"
                placeholder="+91 98XXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-cream-200 font-medium mb-1">Official Email</label>
              <input
                type="email"
                placeholder="contact@supplier.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Specialties / Tags */}
          <div>
            <label className="block text-cream-200 font-medium mb-1">Key Specialties (comma separated)</label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-wedding-950 border border-gold-400/30 text-cream-100 focus:border-gold-400 focus:outline-none"
            />
          </div>

          {/* Verification Badge Notice */}
          <div className="p-3 rounded-xl bg-wedding-850/60 border border-gold-400/20 flex items-center gap-2.5 text-xs text-cream-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Suppliers registered here will immediately be saved to Supabase and become available for quotation analysis.</span>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-wedding-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-wedding-850 text-cream-300 hover:text-cream-100 hover:bg-wedding-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4BA8A] to-[#B99A65] text-[#2E1F2A] font-bold shadow-gold-subtle hover:brightness-110 transition flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Saving to Database...' : 'Register in Supabase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
