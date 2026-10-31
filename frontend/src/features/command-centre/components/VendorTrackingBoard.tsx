import React, { useState } from 'react';
import {
  Truck,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Radio,
  Search,
  ExternalLink,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { VendorTrackingItem, VendorCheckInStatus } from '../types/commandCenter.types';

interface VendorTrackingBoardProps {
  vendors: VendorTrackingItem[];
  onCheckInVendor?: (vendorId: string, gateLocation?: string) => void;
}

export const VendorTrackingBoard: React.FC<VendorTrackingBoardProps> = ({
  vendors,
  onCheckInVendor,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredVendors = vendors.filter((vnd) => {
    const matchesStatus =
      statusFilter === 'All' || vnd.checkInStatus === statusFilter;
    const matchesSearch =
      vnd.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vnd.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vnd.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vnd.assignedEvent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: VendorCheckInStatus, delayMinutes: number) => {
    switch (status) {
      case 'Checked-In':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Checked-In (On-Site)
          </span>
        );
      case 'En Route':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Radio className="w-3 h-3 text-blue-500 animate-pulse" />
            En Route
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Delayed (+{delayMinutes}m)
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <Clock className="w-3 h-3 text-gray-400" />
            Pending Arrival
          </span>
        );
    }
  };

  return (
    <div className="cc-card p-5 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-[#E8D4B0]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF5ED] border border-[#E8D4B0] flex items-center justify-center text-[#9A7E50]">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2A1E26] flex items-center gap-2">
              Vendor Logistics & Arrival Tracking
              <span className="text-[11px] font-semibold text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#E8D4B0]">
                {vendors.filter((v) => v.checkInStatus === 'Checked-In').length}/{vendors.length} On-Site
              </span>
            </h2>
            <p className="text-xs text-[#6B5E68]">
              Monitor gate checkpoints, arrival times, and inspection statuses
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor or gate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E8D4B0] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#B99A65]/40 text-[#2A1E26] w-44 sm:w-52"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8D4B0]/60">
            {['All', 'Checked-In', 'En Route', 'Delayed', 'Pending'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                  statusFilter === st
                    ? 'bg-white text-[#2A1E26] shadow-xs font-bold border border-[#E8D4B0]'
                    : 'text-[#6B5E68] hover:text-[#2A1E26]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Vendor Cards */}
      {filteredVendors.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500 bg-[#FCFAF7] rounded-xl border border-[#E8D4B0]/40">
          No vendors match the current filter or data is loading from the server.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredVendors.map((vendor) => {
          const isCheckedIn = vendor.checkInStatus === 'Checked-In';
          const isDelayed = vendor.checkInStatus === 'Delayed';

          return (
            <div
              key={vendor.id}
              className={`p-4 rounded-xl border transition-all ${
                isCheckedIn
                  ? 'bg-[#FBFDFB] border-emerald-200'
                  : isDelayed
                  ? 'bg-[#FFF9F9] border-red-200'
                  : 'bg-white border-[#E8D4B0]/70 hover:border-[#B99A65]'
              }`}
            >
              {/* Header: Name and Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#E8D4B0]/50 inline-block mb-1">
                    {vendor.serviceCategory}
                  </span>
                  <h3 className="text-sm font-bold text-[#2A1E26] line-clamp-1">
                    {vendor.vendorName}
                  </h3>
                </div>
                {getStatusBadge(vendor.checkInStatus, vendor.delayMinutes)}
              </div>

              {/* Event Allocation */}
              <p className="text-xs text-[#6B5E68] mt-1.5 flex items-center gap-1">
                <span>Serving:</span>
                <strong className="text-[#493044]">{vendor.assignedEvent}</strong>
              </p>

              {/* Arrival Details */}
              <div className="mt-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E8D4B0]/50 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E828B]">Expected Arrival:</span>
                  <span className="font-semibold text-[#2A1E26]">
                    {vendor.expectedArrivalTime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8E828B]">Actual Check-In:</span>
                  <span
                    className={`font-semibold ${
                      vendor.actualArrivalTime
                        ? isDelayed
                          ? 'text-red-700'
                          : 'text-emerald-700'
                        : 'text-gray-400 italic'
                    }`}
                  >
                    {vendor.actualArrivalTime || 'Not recorded yet'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                  <span className="text-[#8E828B] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9A7E50]" /> Gate Entry:
                  </span>
                  <span className="font-medium text-[#493044]">
                    {vendor.gateLocation}
                  </span>
                </div>
              </div>

              {/* Contact & Equipment Meta */}
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <div className="min-w-0">
                  <p className="font-semibold text-[#2A1E26] truncate">
                    {vendor.contactPerson}
                  </p>
                  <a
                    href={`tel:${vendor.phone}`}
                    className="text-[11px] text-[#9A7E50] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3" /> {vendor.phone}
                  </a>
                </div>

                <div>
                  {!isCheckedIn ? (
                    <button
                      type="button"
                      onClick={() => onCheckInVendor?.(vendor.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF5ED] hover:bg-[#F2E8DF] text-[#9A7E50] border border-[#E8D4B0] transition shadow-xs"
                    >
                      Check In Now
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {vendor.equipmentStatus || 'Verified'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
