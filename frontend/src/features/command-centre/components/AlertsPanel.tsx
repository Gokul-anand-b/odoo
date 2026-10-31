import React, { useState } from 'react';
import {
  BellRing,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { AlertItem, AlertSeverity } from '../types/commandCenter.types';

interface AlertsPanelProps {
  alerts: AlertItem[];
  onAcknowledgeAlert?: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onAcknowledgeAlert,
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter === 'All') return true;
    if (severityFilter === 'Unacknowledged') return !alert.acknowledged;
    return alert.severity === severityFilter;
  });

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical':
        return {
          icon: AlertOctagon,
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          border: 'border-red-200',
          bg: 'bg-red-50/50',
          dot: 'bg-red-500',
        };
      case 'High':
        return {
          icon: AlertTriangle,
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          border: 'border-amber-200',
          bg: 'bg-amber-50/40',
          dot: 'bg-amber-500',
        };
      case 'Medium':
        return {
          icon: Info,
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          border: 'border-blue-100',
          bg: 'bg-blue-50/30',
          dot: 'bg-blue-500',
        };
      case 'Low':
      default:
        return {
          icon: Info,
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          border: 'border-emerald-100',
          bg: 'bg-emerald-50/30',
          dot: 'bg-emerald-500',
        };
    }
  };

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="cc-card p-5 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-[#E8D4B0]/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#2A1E26] flex items-center gap-2">
              Operational Alerts & Safety Notifications
              {unacknowledgedCount > 0 ? (
                <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
                  {unacknowledgedCount} Action Required
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  All Clear
                </span>
              )}
            </h2>
            <p className="text-xs text-[#6B5E68]">
              High-priority event alerts with severity classification and operational sign-offs
            </p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E8D4B0]/60 self-start sm:self-auto">
          {['All', 'Unacknowledged', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 text-xs rounded-lg transition font-medium ${
                severityFilter === sev
                  ? 'bg-white text-[#2A1E26] shadow-xs font-bold border border-[#E8D4B0]'
                  : 'text-[#6B5E68] hover:text-[#2A1E26]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 bg-[#FCFAF7] rounded-xl border border-[#E8D4B0]/40">
            No alerts currently match this filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            const Icon = style.icon;

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  alert.acknowledged
                    ? 'bg-gray-50/60 border-gray-200 opacity-80'
                    : `${style.bg} ${style.border} shadow-xs`
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${style.badgeBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style.badgeBg}`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[11px] font-medium text-[#8E828B]">
                          {alert.category}
                        </span>
                        <span className="text-[11px] text-[#8E828B]">•</span>
                        <span className="text-[11px] text-[#8E828B]">
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#2A1E26] mt-1">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-[#6B5E68] mt-1 leading-relaxed">
                        {alert.description}
                      </p>

                      {alert.acknowledged && (
                        <p className="text-[11px] font-medium text-emerald-700 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Acknowledged by {alert.acknowledgedBy || 'Coordinator'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-start sm:self-auto pt-2 sm:pt-0">
                    {!alert.acknowledged ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert?.(alert.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-[#FAF5ED] text-[#2A1E26] border border-[#B99A65] shadow-xs transition"
                        >
                          Acknowledge Alert
                        </button>
                        {alert.actionLabel && (
                          <span className="text-[11px] font-semibold text-[#9A7E50] cursor-pointer hover:underline flex items-center gap-1">
                            {alert.actionLabel} <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded border border-gray-200">
                        Resolved & Logged
                      </span>
                    )}
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
