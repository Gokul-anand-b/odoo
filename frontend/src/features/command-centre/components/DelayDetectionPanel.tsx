import React from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { DelayDetectionItem, PriorityLevel } from '../types/commandCenter.types';

interface DelayDetectionPanelProps {
  delays: DelayDetectionItem[];
  onResolveDelay?: (delayId: string) => void;
  onViewImpactMatrix?: () => void;
}

export const DelayDetectionPanel: React.FC<DelayDetectionPanelProps> = ({
  delays,
  onResolveDelay,
  onViewImpactMatrix,
}) => {
  const getSeverityBadge = (severity: PriorityLevel) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800 border border-red-300">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
            High Severity
          </span>
        );
      case 'Medium':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-yellow-50 text-yellow-800 border border-yellow-200">
            Medium Severity
          </span>
        );
    }
  };

  const getRiskBadge = (risk: DelayDetectionItem['cascadingRiskLevel']) => {
    switch (risk) {
      case 'Severe':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Moderate':
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="cc-card p-5 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-[#E8D4B0]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2A1E26] flex items-center gap-2">
              AI Delay & Bottleneck Detection
              <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                {delays.filter((d) => d.status !== 'Resolved').length} Active Flags
              </span>
            </h2>
            <p className="text-xs text-[#6B5E68]">
              Automated anomaly detection across task timelines and vendor arrival schedules
            </p>
          </div>
        </div>

        {onViewImpactMatrix && (
          <button
            type="button"
            onClick={onViewImpactMatrix}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9A7E50] hover:text-[#493044] transition"
          >
            View Cascade Impact Matrix <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Delay Cards Grid */}
      {delays.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-500 bg-[#FCFAF7] rounded-xl border border-[#E8D4B0]/40">
          No active delays or schedule bottlenecks detected. All operations are on schedule.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {delays.map((delay) => {
            const isResolved = delay.status === 'Resolved';

            return (
              <div
                key={delay.id}
                className={`p-4 rounded-xl border transition ${
                  isResolved
                    ? 'bg-gray-50 border-gray-200 opacity-70'
                    : 'bg-[#FFFDFB] border-red-200 hover:border-red-300 shadow-2xs'
                }`}
              >
                {/* Header: Source and Minutes */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#E8D4B0]/60">
                    {delay.sourceType} Anomaly
                  </span>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 animate-pulse">
                    +{delay.delayMinutes} min delay
                  </span>
                </div>

                {/* Entity Title */}
                <h3 className="text-sm font-bold text-[#2A1E26] mt-2 line-clamp-1">
                  {delay.entityName}
                </h3>

                {/* Root Cause Details */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-[#E8D4B0]/40 text-xs">
                  <p className="text-[#8E828B] text-[10px] uppercase font-bold tracking-wider">
                    Identified Root Cause:
                  </p>
                  <p className="text-[#493044] font-medium mt-0.5 leading-relaxed">
                    {delay.rootCause}
                  </p>
                </div>

                {/* Impact Summary */}
                <div className="mt-2.5 text-xs">
                  <p className="text-[11px] text-[#6B5E68] leading-normal">
                    <strong className="text-[#2A1E26]">Impact:</strong> {delay.impactSummary}
                  </p>
                </div>

                {/* Meta & Status Action */}
                <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(delay.severity)}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getRiskBadge(
                        delay.cascadingRiskLevel
                      )}`}
                    >
                      {delay.cascadingRiskLevel} Cascade Risk
                    </span>
                  </div>

                  {!isResolved ? (
                    <button
                      type="button"
                      onClick={() => onResolveDelay?.(delay.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300 transition"
                    >
                      Mitigate
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
