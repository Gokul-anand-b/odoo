'use client';

import { useState } from 'react';
import {
  Briefcase,
  IndianRupee,
  Calendar,
  CheckCircle2,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';
import { VendorRequirement, ResourceRequirement, PaymentMilestone } from '../types/blueprint.types';

interface AllocationsPanelProps {
  vendors: VendorRequirement[];
  resources: ResourceRequirement[];
  milestones: PaymentMilestone[];
}

export default function AllocationsPanel({ vendors, resources, milestones }: AllocationsPanelProps) {
  const [activeTab, setActiveTab] = useState<'vendors' | 'resources' | 'milestones'>('vendors');

  return (
    <div className="card p-6 border border-[rgba(185,154,101,0.25)] shadow-xl bg-white">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(185,154,101,0.18)]">
        <div className="flex items-center gap-2">
          {[
            { id: 'vendors', label: `Vendor Scopes (${vendors.length})`, icon: Briefcase },
            { id: 'resources', label: `Resource Assets (${resources.length})`, icon: Box },
            { id: 'milestones', label: `Payment Schedule (${milestones.length})`, icon: IndianRupee },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#493044] text-[#F0E8EE] shadow-md border border-[#B99A65]'
                    : 'bg-[#FAF5F0] text-[#8A7380] hover:text-[#493044]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#D4BA8A]' : 'text-[#8A7380]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Vendor Requirements */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-xl border border-[rgba(185,154,101,0.2)] bg-[#FFFCF8] hover:border-[#B99A65] transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF5F0] text-[#B99A65]">
                  {v.category.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-[#493044]">
                  ₹{Number(v.allocated_budget).toLocaleString('en-IN')}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-[#2A1E26]">{v.service_name}</h4>
              <div className="flex items-center justify-between text-xs text-[#8A7380] pt-1 border-t border-[rgba(185,154,101,0.1)]">
                <span>Headcount: {v.headcount_capacity} Pax</span>
                <span>Lock by: {v.target_booking_deadline}</span>
              </div>
              {v.deliverables && v.deliverables.length > 0 && (
                <div className="pt-2 space-y-1">
                  {v.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#4A3840]">
                      <CheckCircle2 className="w-3 h-3 text-[#B99A65]" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Resource Requirements */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {resources.map((r) => (
            <div
              key={r.id}
              className="p-3.5 rounded-xl border border-[rgba(185,154,101,0.18)] bg-[#FFFCF8] space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#493044]">
                  {r.quantity} {r.unit}
                </span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                  {r.importance}
                </span>
              </div>
              <div className="font-semibold text-xs text-[#2A1E26]">{r.resource_name}</div>
              <div className="text-[10px] text-[#8A7380] pt-1">
                Allocated: {r.allocated_for_event || 'All Events'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Payment Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-[rgba(185,154,101,0.2)] bg-[#FFFCF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#493044] text-[#D4BA8A] font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {m.percentage}%
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2A1E26]">{m.name}</h4>
                  <p className="text-xs text-[#8A7380]">{m.description}</p>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="font-bold text-sm text-[#493044]">
                  ₹{Number(m.amount).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-[#8A7380] flex items-center gap-1 sm:justify-end">
                  <Calendar className="w-3 h-3 text-[#B99A65]" /> Due {m.due_date}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
