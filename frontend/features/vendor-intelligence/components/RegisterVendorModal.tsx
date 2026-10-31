'use client';

import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Vendor, VendorCategory, VendorTier } from '../types/vendor.types';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVendor: Vendor = {
      id: `v-${Date.now().toString().slice(-4)}`,
      name,
      category,
      tier,
      rating: 4.8,
      reviewCount: 1,
      city,
      contactPerson,
      phone,
      email,
      experienceYears: Number(experienceYears),
      completedWeddingsCount: 1,
      verified: true,
      specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
    };

    onAddVendor(newVendor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-plum-900 to-plum-950 border border-gold-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-ivory-100 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-gold-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-plum-800 rounded-xl border border-gold-500/30 text-gold-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-gold-300">Register Royal Vendor</h2>
              <p className="text-xs text-ivory-300">Add trusted wedding agency supplier to The Royal Knot ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-ivory-300 hover:text-gold-400 hover:bg-plum-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Vendor Company Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maharana Imperial Banquets"
                className="w-full px-4 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 text-sm placeholder:text-ivory-300/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full px-4 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-sm text-ivory-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-plum-900 text-ivory-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Quality Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as VendorTier)}
                className="w-full px-4 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-sm text-ivory-100"
              >
                {TIERS.map((t) => (
                  <option key={t} value={t} className="bg-plum-900 text-ivory-100">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Operating City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Experience (Years)
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Primary Contact Person
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Raghuvir Rathore"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 text-sm"
                />
                <User className="w-4 h-4 text-gold-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98290 XXXXX"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 text-sm"
                />
                <Phone className="w-4 h-4 text-gold-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@vendor.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 text-sm"
                />
                <Mail className="w-4 h-4 text-gold-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-1.5">
              Specialties & Royal Offerings (Comma Separated)
            </label>
            <textarea
              rows={2}
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-plum-950/70 border border-gold-500/30 focus:border-gold-400 text-sm"
            />
          </div>

          <div className="p-3 bg-plum-800/40 border border-gold-500/20 rounded-xl flex items-center gap-3 text-xs text-ivory-200">
            <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0" />
            <span>Automatic compliance check: Rajasthan Tourism Board license & FSSAI / safety accreditation will be flagged.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gold-500/30 text-ivory-200 hover:bg-plum-800/60 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-plum-950 font-semibold text-sm hover:brightness-110 shadow-gold-subtle transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
