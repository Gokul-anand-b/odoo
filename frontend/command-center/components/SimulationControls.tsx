import React from 'react';
import {
  Radio,
  RefreshCw,
  Zap,
  Wifi,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { RealtimeFeedUpdate } from '../types/commandCenter.types';

interface SimulationControlsProps {
  isConnected: boolean;
  isStreaming: boolean;
  latestUpdate?: RealtimeFeedUpdate | null;
  onToggleStreaming: () => void;
  onSimulateVendorArrival: () => void;
  onSimulateTaskProgress: () => void;
  onSimulateNewAlert: () => void;
  onResetData: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isConnected,
  isStreaming,
  latestUpdate,
  onToggleStreaming,
  onSimulateVendorArrival,
  onSimulateTaskProgress,
  onSimulateNewAlert,
  onResetData,
}) => {
  return (
    <div className="cc-card p-4 bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF5ED] border border-[#E8D4B0]/80 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[#E8D4B0] text-[#9A7E50] shadow-2xs">
            <Radio className={`w-4 h-4 ${isStreaming ? 'text-emerald-600 animate-pulse' : 'text-gray-400'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#2A1E26]">
                Real-Time Telemetry Engine
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                  isStreaming
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isStreaming ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'
                  }`}
                />
                {isStreaming ? 'WebSocket Telemetry Active' : 'Stream Paused'}
              </span>
              <span className="text-[10px] text-[#8E828B] bg-white px-1.5 py-0.5 rounded border border-[#E8D4B0]/60 hidden sm:inline">
                SignalR & REST Ready
              </span>
            </div>

            <p className="text-[11px] text-[#6B5E68] mt-0.5">
              {latestUpdate ? (
                <span className="font-medium text-[#493044] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#B99A65]" />
                  Latest Telemetry ({latestUpdate.timestamp}): {latestUpdate.message}
                </span>
              ) : (
                'Listening for ceremony milestone triggers and sensor telemetry from Udaipur palace gates...'
              )}
            </p>
          </div>
        </div>

        {/* Real-time simulation action triggers */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E8D4B0]/40">
          <button
            type="button"
            onClick={onToggleStreaming}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-2xs ${
              isStreaming
                ? 'bg-white hover:bg-gray-50 text-[#684C65] border-[#E8D4B0]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
            }`}
          >
            {isStreaming ? 'Pause Stream' : 'Resume Live Stream'}
          </button>

          <button
            type="button"
            onClick={onSimulateVendorArrival}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#FAF5ED] text-[#493044] border border-[#E8D4B0] transition shadow-2xs"
            title="Simulate gate check-in for en-route vendor"
          >
            + Vendor Arrival
          </button>

          <button
            type="button"
            onClick={onSimulateTaskProgress}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-[#FAF5ED] text-[#493044] border border-[#E8D4B0] transition shadow-2xs"
            title="Simulate ongoing task progress update"
          >
            + Task Advance
          </button>

          <button
            type="button"
            onClick={onSimulateNewAlert}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-red-50 text-red-700 border border-red-200 transition shadow-2xs"
            title="Inject simulated real-time alert"
          >
            + Alert Trigger
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="p-1.5 rounded-lg text-[#8E828B] hover:text-[#2A1E26] hover:bg-white border border-transparent hover:border-[#E8D4B0] transition"
            title="Reset to default mock state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
