'use client';

import React, { useState } from 'react';
import {
  ClipboardList,
  Sparkles,
  Building2,
  Package,
  Layers,
  Calendar,
  IndianRupee,
  ShieldAlert,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { VendorRequirement, ResourceRequirement } from '../types/vendor.types';

interface BlueprintRequirementsPanelProps {
  vendorRequirements: VendorRequirement[];
  resourceRequirements: ResourceRequirement[];
}

export const BlueprintRequirementsPanel: React.FC<BlueprintRequirementsPanelProps> = ({
  vendorRequirements,
  resourceRequirements,
}) => {
  const [activeTab, setActiveTab] = useState<'vendors' | 'resources'>('vendors');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(vendorRequirements.map((v) => v.category)))];

  const filteredVendorReqs = vendorRequirements.filter(
    (v) => categoryFilter === 'All' || v.category === categoryFilter
  );

  const totalAllocatedBudget = vendorRequirements.reduce(
    (sum, v) => sum + (Number(v.allocatedBudget) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header with summary stats */}
      <div className="p-6 rounded-2xl luxury-gold-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-500/20 text-gold-300 border border-gold-400/40 flex items-center gap-1 font-sans">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Live Blueprint Demands
            </span>
            <span className="text-xs text-cream-300">Synchronized with Wedding Blueprint Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-cream-100 font-bold mt-1">
            Vendor & Physical Resource Requirements
          </h2>
          <p className="text-xs text-cream-300 mt-1 max-w-xl font-sans">
            Directly mapped from synthesized wedding blueprints. Match incoming supplier quotations against verified operational quotas.
          </p>
        </div>

        {/* Tab & Filter Switchers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl p-1 bg-wedding-900 border border-gold-400/30">
            <button
              type="button"
              onClick={() => setActiveTab('vendors')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'vendors'
                  ? 'bg-gradient-to-r from-[#D4BA8A] to-[#B99A65] text-[#2E1F2A] shadow'
                  : 'text-cream-300 hover:text-cream-100'
              }`}
            >
              Vendor Requirements ({vendorRequirements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'resources'
                  ? 'bg-gradient-to-r from-[#D4BA8A] to-[#B99A65] text-[#2E1F2A] shadow'
                  : 'text-cream-300 hover:text-cream-100'
              }`}
            >
              Resource Equipment ({resourceRequirements.length})
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-wedding-900 border border-gold-400/25 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider">Total Allocated Budget</span>
            <p className="text-xl font-bold font-serif text-gold-300 mt-0.5">
              ₹{(totalAllocatedBudget / 100000).toFixed(2)} Lakhs
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-wedding-900 border border-gold-400/25 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider">Required Vendor Slots</span>
            <p className="text-xl font-bold font-serif text-cream-100 mt-0.5">
              {vendorRequirements.length} Categories
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-wedding-900 border border-gold-400/25 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-cream-300 tracking-wider">Physical Resource Items</span>
            <p className="text-xl font-bold font-serif text-emerald-400 mt-0.5">
              {resourceRequirements.length} Tracked
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'vendors' ? (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          {categories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    categoryFilter === cat
                      ? 'bg-gold-500 text-wedding-950 font-bold'
                      : 'bg-wedding-900 text-cream-300 border border-gold-400/20 hover:border-gold-400/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filteredVendorReqs.length === 0 ? (
            <div className="p-10 rounded-2xl luxury-gold-card text-center space-y-2">
              <ClipboardList className="w-8 h-8 text-gold-400 mx-auto opacity-60" />
              <p className="text-sm font-semibold text-cream-100">No vendor requirements found</p>
              <p className="text-xs text-cream-300">
                Generate a wedding blueprint to synthesize dynamic vendor specifications.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendorReqs.map((vr) => (
                <div
                  key={vr.id}
                  className="p-5 rounded-2xl luxury-gold-card border border-gold-400/30 flex flex-col justify-between space-y-4 hover:border-gold-400/60 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gold-500/20 text-gold-300 border border-gold-400/30">
                        {vr.category}
                      </span>
                      <span className="text-[10px] text-cream-300 bg-wedding-900 px-2 py-0.5 rounded">
                        {vr.status}
                      </span>
                    </div>

                    <h4 className="text-base font-serif font-bold text-cream-100 leading-snug">
                      {vr.serviceName}
                    </h4>

                    {vr.weddingTitle && (
                      <p className="text-[11px] text-gold-300 font-medium truncate">
                        Wedding: {vr.weddingTitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-wedding-800/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-cream-300">
                      <span>Allocated Budget:</span>
                      <span className="font-bold text-gold-300 font-serif">
                        ₹{(Number(vr.allocatedBudget) / 100000).toFixed(2)}L
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-cream-300">
                      <span>Guest Capacity:</span>
                      <span className="font-semibold text-cream-100">
                        {vr.headcountCapacity} Pax
                      </span>
                    </div>

                    {vr.targetBookingDeadline && (
                      <div className="flex justify-between items-center text-cream-300">
                        <span>Deadline:</span>
                        <span className="font-medium text-cream-200">
                          {vr.targetBookingDeadline}
                        </span>
                      </div>
                    )}

                    {vr.deliverables && vr.deliverables.length > 0 && (
                      <div className="pt-2 text-[10px] text-cream-300/80">
                        <span className="font-semibold text-gold-400 block mb-1">Key Deliverables:</span>
                        <ul className="list-disc list-inside space-y-0.5">
                          {vr.deliverables.slice(0, 3).map((d, i) => (
                            <li key={i} className="truncate">{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {resourceRequirements.length === 0 ? (
            <div className="p-10 rounded-2xl luxury-gold-card text-center space-y-2">
              <Package className="w-8 h-8 text-gold-400 mx-auto opacity-60" />
              <p className="text-sm font-semibold text-cream-100">No physical resource requirements logged</p>
              <p className="text-xs text-cream-300">
                Resource requirements will appear here once wedding blueprints are synthesized.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resourceRequirements.map((rr) => (
                <div
                  key={rr.id}
                  className="p-5 rounded-2xl luxury-gold-card border border-gold-400/30 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {rr.importance} Priority
                    </span>
                    <span className="text-[10px] text-cream-300 bg-wedding-900 px-2 py-0.5 rounded">
                      {rr.allocatedForEvent}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-serif font-bold text-cream-100">
                      {rr.resourceName}
                    </h4>
                    {rr.weddingTitle && (
                      <p className="text-[11px] text-gold-300 mt-0.5 truncate">
                        {rr.weddingTitle}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-wedding-800 flex justify-between items-center text-xs">
                    <span className="text-cream-300">Required Quantity:</span>
                    <span className="font-bold text-gold-300">
                      {rr.quantity} {rr.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

