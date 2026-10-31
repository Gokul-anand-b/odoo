'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Calendar,
  Clock,
  Sparkles,
  ShieldAlert,
  Layers,
  ArrowRight,
  Bell,
  RefreshCw,
  Building2,
  MapPin,
  Compass,
  CheckCircle2,
  X
} from 'lucide-react';
import { commandCenterService } from './services/commandCenterService';
import {
  DashboardOverviewStats,
  WeddingEvent,
  TaskItem,
  VendorTrackingItem,
  DelayDetectionItem,
  DependencyImpactItem,
  AlertItem,
  RealtimeFeedUpdate
} from './types/commandCenter.types';
import { OverviewStatsCards } from './components/OverviewStatsCards';
import { LiveEventTimeline } from './components/LiveEventTimeline';
import { TaskMonitoringTable } from './components/TaskMonitoringTable';
import { VendorTrackingBoard } from './components/VendorTrackingBoard';
import { DelayDetectionPanel } from './components/DelayDetectionPanel';
import { DependencyImpactMatrix } from './components/DependencyImpactMatrix';
import { AlertsPanel } from './components/AlertsPanel';
import { SimulationControls } from './components/SimulationControls';
import './styles/commandCenter.css';

export default function CommandCenterDashboard() {
  // Operational State
  const [stats, setStats] = useState<DashboardOverviewStats>(commandCenterService.getOverviewStats());
  const [events, setEvents] = useState<WeddingEvent[]>(commandCenterService.getEvents());
  const [tasks, setTasks] = useState<TaskItem[]>(commandCenterService.getTasks());
  const [vendors, setVendors] = useState<VendorTrackingItem[]>(commandCenterService.getVendors());
  const [delays, setDelays] = useState<DelayDetectionItem[]>(commandCenterService.getDelays());
  const [dependencies, setDependencies] = useState<DependencyImpactItem[]>(commandCenterService.getDependencies());
  const [alerts, setAlerts] = useState<AlertItem[]>(commandCenterService.getAlerts());

  // Interactive View States
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'tasks' | 'vendors' | 'impact'>('overview');
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Telemetry / Simulation State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [latestUpdate, setLatestUpdate] = useState<RealtimeFeedUpdate | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isApiLoading, setIsApiLoading] = useState<boolean>(true);

  // ── Bootstrap: load from API on mount ────────────────────────────────────
  useEffect(() => {
    commandCenterService.loadAll().then(() => {
      setStats(commandCenterService.getOverviewStats());
      setEvents(commandCenterService.getEvents());
      setTasks(commandCenterService.getTasks());
      setVendors(commandCenterService.getVendors());
      setDelays(commandCenterService.getDelays());
      setDependencies(commandCenterService.getDependencies());
      setAlerts(commandCenterService.getAlerts());
      setIsApiLoading(false);
    });
  }, []);

  // Live Clock (IST)
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time telemetry subscription simulation
  useEffect(() => {
    if (!isStreaming) return;

    const unsubscribe = commandCenterService.subscribeToRealtimeTelemetry((update) => {
      setLatestUpdate(update);

      if (update.type === 'TASK_PROGRESS') {
        const { taskId, progress } = update.payload;
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, progressPercent: progress } : t))
        );
      } else if (update.type === 'VENDOR_CHECKIN') {
        const { vendorId } = update.payload;
        setVendors((prev) =>
          prev.map((v) =>
            v.id === vendorId
              ? { ...v, checkInStatus: 'Checked-In', actualArrivalTime: '04:15 PM' }
              : v
          )
        );
      }
      refreshStats();
    });

    return () => unsubscribe();
  }, [isStreaming]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const refreshStats = () => {
    // async refresh from API, sync fallback immediately
    commandCenterService.refreshStats().then(() =>
      setStats(commandCenterService.getOverviewStats())
    );
  };

  // Actions
  const handleAcknowledgeAlert = (alertId: string) => {
    const updated = commandCenterService.acknowledgeAlert(alertId, 'Lead Planner (Ananya Verma)');
    setAlerts(updated);
    refreshStats();
    showToast('✓ Alert acknowledged and logged to palace operational record.');
  };

  const handleUpdateTask = (taskId: string, status: TaskItem['status'], progress: number) => {
    const updated = commandCenterService.updateTaskStatus(taskId, status, progress);
    setTasks(updated);
    refreshStats();
    showToast(`✓ Task updated: ${status} (${progress}%)`);
  };

  const handleCheckInVendor = (vendorId: string) => {
    const updated = commandCenterService.checkInVendor(vendorId);
    setVendors(updated);
    refreshStats();
    showToast('✓ Vendor checked-in successfully at gate security point.');
  };

  const handleResolveDelay = (delayId: string) => {
    const updated = commandCenterService.resolveDelay(delayId);
    setDelays(updated);
    refreshStats();
    showToast('✓ Delay marked as mitigated and schedule variance absorbed.');
  };

  const handleMitigateDependency = (depId: string) => {
    const updated = commandCenterService.mitigateDependency(depId);
    setDependencies(updated);
    showToast('✓ Cascading buffer applied. Downstream milestone protected.');
  };

  // Simulation Manual Controls
  const handleSimulateVendorArrival = () => {
    const enRoute = vendors.find((v) => v.checkInStatus === 'En Route' || v.checkInStatus === 'Delayed');
    if (enRoute) {
      handleCheckInVendor(enRoute.id);
    } else {
      showToast('All primary vendors are currently checked-in on site.');
    }
  };

  const handleSimulateTaskProgress = () => {
    const ongoing = tasks.find((t) => t.status === 'Ongoing' || t.status === 'Delayed');
    if (ongoing) {
      const nextProgress = Math.min(100, ongoing.progressPercent + 20);
      handleUpdateTask(ongoing.id, nextProgress === 100 ? 'Completed' : 'Ongoing', nextProgress);
    }
  };

  const handleSimulateNewAlert = () => {
    const newAlert: AlertItem = {
      id: `alt-${Date.now()}`,
      title: 'Varmala Sound Level Exceeds Courtyard Limit',
      description: 'Audio sensors at Jagmandir pier peaked at 88dB. Acoustic dampening requested.',
      severity: 'Medium',
      category: 'Capacity & Power',
      timestamp: 'Just now',
      acknowledged: false,
      actionRequired: true,
      actionLabel: 'Adjust Master Gain -4dB',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    refreshStats();
    showToast('⚠️ New real-time alert received from City Palace courtyard sensors.');
  };

  const handleResetData = () => {
    setEvents(commandCenterService.getEvents());
    setTasks(commandCenterService.getTasks());
    setVendors(commandCenterService.getVendors());
    setDelays(commandCenterService.getDelays());
    setDependencies(commandCenterService.getDependencies());
    setAlerts(commandCenterService.getAlerts());
    refreshStats();
    showToast('Command Centre operational data reset to baseline mock schedule.');
  };

  return (
    <div className="command-center-container min-h-screen pb-14 bg-[#FAF9F5]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-3 bg-[#2A1E26] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#B99A65]/40 text-xs animate-bounce">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4BA8A]" />
            {toastMessage}
          </span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Banner / Executive Wedding Header */}
      <section className="bg-white border-b border-[#E8D4B0]/60 px-4 lg:px-8 py-5 shadow-2xs">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#9A7E50] bg-[#FAF5ED] px-2.5 py-0.5 rounded-full border border-[#E8D4B0]">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Live Command Centre
              </span>
              <span className="text-[11px] font-medium text-[#8E828B]">
                Core Feature 03 · Operational Intelligence
              </span>
              {isApiLoading ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  Syncing with server…
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Compass className="w-2.5 h-2.5" />
                  API Connected · Django 8000
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#2A1E26] tracking-tight">
              Samar & Alizeh <span className="gold-gradient-text">Royal Wedding</span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-[#6B5E68]">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#9A7E50]" />
                The City Palace & Jagmandir Island, Udaipur, Rajasthan
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#9A7E50]" />
                Saturday, Nov 20, 2026 (Main Ceremony Day)
              </span>
            </div>
          </div>

          {/* Real-time Clock & Live Telemetry Badge */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
            <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8D4B0]/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8D4B0] flex items-center justify-center text-[#9A7E50] shadow-2xs">
                <Clock className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E828B]">
                  Palace Time (IST)
                </span>
                <p className="font-mono text-lg font-bold text-[#2A1E26]">
                  {currentTime || '04:45:00 PM'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#FAF8F5] border-b border-[#E8D4B0]/50 sticky top-0 z-30 px-4 lg:px-8">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 cc-custom-scroll">
          {[
            { id: 'overview', label: 'Overview & Telemetry', count: stats.totalEvents },
            { id: 'timeline', label: 'Live Timeline', count: events.length },
            { id: 'tasks', label: 'Task Execution', count: tasks.length },
            { id: 'vendors', label: 'Vendor Logistics', count: vendors.length },
            { id: 'impact', label: 'Risk & Dependency Matrix', count: dependencies.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#493044] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F2E8DF] text-[#6B5E68] border border-[#E8D4B0]/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#FAF5ED] text-[#9A7E50]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-screen-2xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Requirement 8: Real-time Telemetry Controls */}
        <SimulationControls
          isConnected={true}
          isStreaming={isStreaming}
          latestUpdate={latestUpdate}
          onToggleStreaming={() => setIsStreaming(!isStreaming)}
          onSimulateVendorArrival={handleSimulateVendorArrival}
          onSimulateTaskProgress={handleSimulateTaskProgress}
          onSimulateNewAlert={handleSimulateNewAlert}
          onResetData={handleResetData}
        />

        {/* Requirement 1: Dashboard Overview Stats */}
        <OverviewStatsCards
          stats={stats}
          onFilterByStatus={(statusId) => {
            if (statusId === 'total' || statusId === 'ongoing') setActiveTab('timeline');
            if (statusId === 'delayed') setActiveTab('timeline');
            if (statusId === 'alerts') setActiveTab('overview');
          }}
        />

        {/* Tab-driven Content Layout */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Row: Timeline (Left 7 cols) & Alerts (Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <LiveEventTimeline
                  events={events}
                  selectedEventId={selectedEvent?.id}
                  onSelectEvent={(evt) => setSelectedEvent(evt)}
                />
              </div>
              <div className="lg:col-span-5">
                <AlertsPanel
                  alerts={alerts}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                />
              </div>
            </div>

            {/* Middle Row: Delay Detection Panel */}
            <DelayDetectionPanel
              delays={delays}
              onResolveDelay={handleResolveDelay}
              onViewImpactMatrix={() => setActiveTab('impact')}
            />

            {/* Bottom Row: Task Monitoring Summary */}
            <TaskMonitoringTable
              tasks={tasks}
              onUpdateTaskStatus={handleUpdateTask}
            />

            {/* Vendor Logistics Overview */}
            <VendorTrackingBoard
              vendors={vendors}
              onCheckInVendor={handleCheckInVendor}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <LiveEventTimeline
              events={events}
              selectedEventId={selectedEvent?.id}
              onSelectEvent={(evt) => setSelectedEvent(evt)}
            />
            <DelayDetectionPanel
              delays={delays}
              onResolveDelay={handleResolveDelay}
              onViewImpactMatrix={() => setActiveTab('impact')}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <TaskMonitoringTable
              tasks={tasks}
              onUpdateTaskStatus={handleUpdateTask}
            />
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <VendorTrackingBoard
              vendors={vendors}
              onCheckInVendor={handleCheckInVendor}
            />
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-6">
            <DependencyImpactMatrix
              dependencies={dependencies}
              onMitigate={handleMitigateDependency}
            />
            <DelayDetectionPanel
              delays={delays}
              onResolveDelay={handleResolveDelay}
            />
          </div>
        )}
      </main>

      {/* Selected Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#B99A65]/40 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A7E50] bg-[#FAF5ED] px-2.5 py-0.5 rounded border border-[#E8D4B0]">
                {selectedEvent.ceremonyType} Ceremony
              </span>
              <span className="text-xs font-semibold text-gray-500">
                Event ID: {selectedEvent.id}
              </span>
            </div>

            <h3 className="text-xl font-display font-bold text-[#2A1E26]">
              {selectedEvent.name}
            </h3>

            <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8D4B0]/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8E828B]">Scheduled Timeline:</span>
                <span className="font-bold text-[#2A1E26]">
                  {selectedEvent.scheduledStartTime} – {selectedEvent.scheduledEndTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E828B]">Current Operational Status:</span>
                <span className="font-bold text-[#493044]">
                  {selectedEvent.status} ({selectedEvent.delayMinutes > 0 ? `+${selectedEvent.delayMinutes}m delay` : 'On time'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E828B]">Venue & Island Pier:</span>
                <span className="font-medium text-[#2A1E26]">
                  {selectedEvent.venueLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E828B]">Lead Protocol Coordinator:</span>
                <span className="font-medium text-[#2A1E26]">
                  {selectedEvent.leadCoordinator}
                </span>
              </div>
            </div>

            {selectedEvent.notes && (
              <div className="mt-3 text-xs text-[#6B5E68] bg-[#FFFDF9] p-3 rounded-lg border border-[#E8D4B0]/40">
                <p className="font-semibold text-[#2A1E26] mb-0.5">Coordinator Operational Field Notes:</p>
                {selectedEvent.notes}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#493044] text-white hover:bg-[#3A2536] transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
