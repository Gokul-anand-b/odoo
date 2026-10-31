import React from 'react';
import {
  GitFork,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { DependencyImpactItem } from '../types/commandCenter.types';

interface DependencyImpactMatrixProps {
  dependencies: DependencyImpactItem[];
  onMitigate?: (dependencyId: string) => void;
}

export const DependencyImpactMatrix: React.FC<DependencyImpactMatrixProps> = ({
  dependencies,
  onMitigate,
}) => {
  const getRiskBadge = (risk: DependencyImpactItem['cascadingRisk']) => {
    switch (risk) {
      case 'Severe':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            Severe Cascade
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            High Cascade
          </span>
        );
      case 'Moderate':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            Moderate
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Absorbable
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
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2A1E26] flex items-center gap-2">
              Dependency Impact & Cascading Risk Matrix
              <span className="text-[11px] font-semibold text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded-full border border-[#E8D4B0]">
                Predictive Analysis
              </span>
            </h2>
            <p className="text-xs text-[#6B5E68]">
              Automated mapping of delayed precursors to downstream auspicious wedding milestones
            </p>
          </div>
        </div>
      </div>

      {/* Dependency Flow Cards */}
      <div className="space-y-3">
        {dependencies.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 bg-[#FCFAF7] rounded-xl border border-[#E8D4B0]/40">
            No cascading dependencies at risk. All milestone dependencies are protected.
          </div>
        ) : (
          dependencies.map((dep) => {
          const isMitigated = dep.status === 'Mitigated';

          return (
            <div
              key={dep.id}
              className={`p-4 rounded-xl border transition ${
                isMitigated
                  ? 'bg-gray-50/70 border-gray-200 opacity-75'
                  : 'bg-[#FFFDF9] border-[#E8D4B0]/70 hover:border-[#B99A65] shadow-xs'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                {/* Visual Flow: Bottleneck -> Affected Activity */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 flex-1">
                  {/* Origin Bottleneck */}
                  <div className="min-w-[190px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-block mb-1">
                      Origin Bottleneck
                    </span>
                    <p className="text-xs font-bold text-[#2A1E26]">
                      {dep.bottleneckName}
                    </p>
                    <p className="text-[11px] text-[#8E828B]">
                      Type: {dep.bottleneckType} Delay
                    </p>
                  </div>

                  {/* Flow Arrow */}
                  <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF5ED] border border-[#E8D4B0] text-[#9A7E50] shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Affected Milestone */}
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7E50] bg-[#FAF5ED] px-2 py-0.5 rounded border border-[#E8D4B0]/60 inline-block mb-1">
                      Impacting Activity
                    </span>
                    <p className="text-sm font-bold text-[#493044]">
                      {dep.affectedActivity}
                    </p>
                    <p className="text-[11px] text-[#6B5E68] flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-[#9A7E50]" />
                      Scheduled: <strong>{dep.scheduledTime}</strong>
                      <span className="text-red-700 font-bold ml-1">
                        (Projected Slip: +{dep.projectedSlipMinutes}m)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Risk & Action Column */}
                <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto border-t lg:border-t-0 pt-2 lg:pt-0 border-gray-100">
                  {getRiskBadge(dep.cascadingRisk)}

                  {!isMitigated ? (
                    <button
                      type="button"
                      onClick={() => onMitigate?.(dep.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#FAF5ED] hover:bg-[#F2E8DF] text-[#9A7E50] hover:text-[#493044] border border-[#E8D4B0] transition shadow-xs"
                    >
                      Mitigate Cascade
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Mitigated
                    </span>
                  )}
                </div>
              </div>

              {/* Mitigation Recommendation */}
              <div className="mt-3 p-2.5 rounded-lg bg-white border border-[#E8D4B0]/50 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#9A7E50] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#2A1E26]">Recommended Operational Buffer: </span>
                  <span className="text-[#6B5E68] leading-relaxed">
                    {dep.suggestedAction}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
};
