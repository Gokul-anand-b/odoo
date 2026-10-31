'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Calendar,
  Users,
  IndianRupee,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Plus,
  Clock,
  Layers,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Briefcase,
  Box,
  Shield,
} from 'lucide-react';
import { BlueprintTask, Wedding, WeddingBlueprint } from '../types/blueprint.types';
import { blueprintApi } from '../services/blueprintService';
import type { LucideIcon } from 'lucide-react';
import WeddingSetupWizard from '../components/WeddingSetupWizard';
import BlueprintGenerationPanel from '../components/BlueprintGenerationPanel';
import TaskManagementTable from '../components/TaskChecklistTable';
import EventPlanningTimeline from '../components/EventPlanningTimeline';
import AllocationsPanel from '../components/AllocationsPanel';

/* ─── Hero Image Carousel ─── */
const HERO_SLIDES = [
  { src: '/weddings/hero-palace.jpg', caption: 'Royal Palace Courtyard Ceremony' },
  { src: '/weddings/sangeet-stage.jpg', caption: 'Grand Sangeet & Musical Night' },
  { src: '/weddings/mehendi-garden.jpg', caption: 'Colourful Garden Mehendi Soirée' },
];

function HeroCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[340px] rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={HERO_SLIDES[idx].src}
          alt={HERO_SLIDES[idx].caption}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1018]/90 via-[#1C1018]/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
        <div>
          <motion.div
            key={`tag-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] mb-3"
            style={{ background: 'rgba(185,154,101,0.25)', color: '#D4BA8A', border: '1px solid rgba(185,154,101,0.35)' }}
          >
            <Crown className="w-3 h-3" /> Core Feature 1 — Intelligent Blueprint Generator
          </motion.div>
          <motion.h1
            key={`h-${idx}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight"
          >
            Context-Aware Wedding<br />Blueprint Generation
          </motion.h1>
          <motion.p
            key={`p-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm text-[#D4C8D0] mt-2 max-w-xl"
          >
            {HERO_SLIDES[idx].caption}
          </motion.p>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all cursor-pointer ${
                i === idx ? 'w-8 h-2 bg-[#B99A65]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        onClick={() => setIdx((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 cursor-pointer transition-colors border border-white/10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setIdx((p) => (p + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 cursor-pointer transition-colors border border-white/10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* ─── Stat Card (Golden dashed borders like PlanifyHer) ─── */
function StatCard({ icon: Icon, label, value, sub, accent = false }: {
  icon: LucideIcon; label: string; value: string; sub: string; accent?: boolean;
}) {
  return (
    <div
      className="relative p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: accent
          ? 'linear-gradient(145deg, #493044, #3A2536)'
          : 'var(--warm-white)',
        border: '1.5px dashed',
        borderColor: accent ? 'rgba(212,186,138,0.5)' : 'rgba(185,154,101,0.25)',
        borderRadius: '1rem',
      }}
    >
      {/* Corner accents like PlanifyHer */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: 'rgba(185,154,101,0.4)' }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: 'rgba(185,154,101,0.4)' }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: 'rgba(185,154,101,0.4)' }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: 'rgba(185,154,101,0.4)' }} />

      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: accent ? 'rgba(185,154,101,0.3)' : 'rgba(185,154,101,0.12)',
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: accent ? '#D4BA8A' : '#B99A65' }} />
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ color: accent ? '#D4BA8A' : '#8A7380' }}
        >
          {label}
        </span>
      </div>
      <div
        className="font-display text-2xl lg:text-3xl font-bold tracking-tight"
        style={{ color: accent ? '#F0E8EE' : '#2A1E26' }}
      >
        {value}
      </div>
      <div
        className="text-xs mt-1"
        style={{ color: accent ? '#C9A6B2' : '#8A7380' }}
      >
        {sub}
      </div>
    </div>
  );
}

/* ─── Main Screen ─── */
export default function WeddingBlueprintScreen() {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [blueprint, setBlueprint] = useState<WeddingBlueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'setup' | 'generating'>('dashboard');
  const [forceRegenerate, setForceRegenerate] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'events' | 'allocations'>('tasks');
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [daysUntilWedding, setDaysUntilWedding] = useState(0);
  const selectedWeddingId = useRef<string | null>(null);

  const fetchWeddings = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const list = await blueprintApi.getWeddings();
      setWeddings(list);
      if (list.length > 0) {
        const wedding = list.find((item) => item.id === selectedWeddingId.current) ?? list[0];
        selectedWeddingId.current = wedding.id;
        setSelectedWedding(wedding);
        if (wedding.blueprint) {
          setBlueprint(wedding.blueprint);
        } else {
          setBlueprint(null);
        }
      }
    } catch (err) {
      console.error('Error fetching weddings', err);
      setLoadError(err instanceof Error ? err.message : 'Unable to load wedding plans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchWeddings();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchWeddings]);

  const handleSelectWedding = (w: Wedding) => {
    selectedWeddingId.current = w.id;
    setSelectedWedding(w);
    if (w.blueprint) {
      setBlueprint(w.blueprint);
      setViewMode('dashboard');
    } else {
      setBlueprint(null);
      setForceRegenerate(false);
      setViewMode('generating');
    }
  };

  const handleSetupComplete = (newWedding: Wedding) => {
    selectedWeddingId.current = newWedding.id;
    setWeddings((prev) => [newWedding, ...prev]);
    setSelectedWedding(newWedding);
    setForceRegenerate(false);
    setViewMode('generating');
  };

  const handleBlueprintGenerated = useCallback((newBp: WeddingBlueprint) => {
    setBlueprint(newBp);
    setForceRegenerate(false);
    setViewMode('dashboard');
    void fetchWeddings();
  }, [fetchWeddings]);

  const handleTaskUpdated = useCallback((updatedTask: BlueprintTask) => {
    setBlueprint((current) => current
      ? {
          ...current,
          tasks: current.tasks.map((task) => task.id === updatedTask.id ? updatedTask : task),
        }
      : current);
  }, []);

  useEffect(() => {
    const weddingDate = selectedWedding?.start_date;
    const timer = window.setTimeout(() => {
      setDaysUntilWedding(weddingDate
        ? Math.max(0, Math.ceil((new Date(weddingDate).getTime() - Date.now()) / 86400000))
        : 0);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedWedding?.start_date]);

  const handleApprove = async () => {
    if (!selectedWedding || !blueprint) return;
    setApprovalLoading(true);
    try {
      const approved = await blueprintApi.approveBlueprint(selectedWedding.id);
      setBlueprint(approved);
    } catch (err) { console.error('Failed to approve', err); }
    finally { setApprovalLoading(false); }
  };

  const totalTasks = blueprint?.tasks?.length || 0;
  const completedTasks = blueprint?.tasks?.filter(t => t.status === 'completed').length || 0;
  const criticalTasks = blueprint?.tasks?.filter(t => t.is_critical_path).length || 0;
  return (
    <div className="space-y-8 pb-16">
      {/* ═══════ HERO IMAGE CAROUSEL ═══════ */}
      <HeroCarousel />

      {/* ═══════ WEDDING SETUP WIZARD ═══════ */}
      {viewMode === 'setup' && (
        <WeddingSetupWizard
          onSuccess={handleSetupComplete}
          onCancel={() => setViewMode('dashboard')}
        />
      )}

      {/* ═══════ BLUEPRINT GENERATION PIPELINE ═══════ */}
      {viewMode === 'generating' && selectedWedding && (
        <BlueprintGenerationPanel
          wedding={selectedWedding}
          onBlueprintGenerated={handleBlueprintGenerated}
          forceRegenerate={forceRegenerate}
        />
      )}

      {/* ═══════ DASHBOARD VIEW ═══════ */}
      {viewMode === 'dashboard' && (
        <>
          {/* ── Top Bar: Title + Actions ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#2A1E26] tracking-tight">
                {selectedWedding ? (
                  <>Blueprint Dashboard</>
                ) : (
                  <>Wedding Blueprint</>
                )}
              </h2>
              {selectedWedding && (
                <p className="text-sm text-[#8A7380] mt-1">
                  {selectedWedding.couple_names} · {selectedWedding.venue_name} · {selectedWedding.theme.replace(/_/g, ' ')}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {blueprint && (
                <button
                  onClick={() => {
                    setForceRegenerate(true);
                    setViewMode('generating');
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  style={{
                    background: 'var(--warm-white)',
                    border: '1px solid rgba(185,154,101,0.25)',
                    color: '#493044',
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#B99A65]" />
                  Regenerate v{(blueprint.version || 0) + 1}
                </button>
              )}
              <button
                onClick={() => setViewMode('setup')}
                className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" /> New Wedding Setup
              </button>
            </div>
          </div>

          {/* ── Wedding Selector Strip ── */}
          {weddings.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {weddings.map((w) => {
                const sel = selectedWedding?.id === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => handleSelectWedding(w)}
                    className={`flex-shrink-0 px-5 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      sel
                        ? 'shadow-lg'
                        : 'hover:border-[rgba(185,154,101,0.4)]'
                    }`}
                    style={{
                      background: sel
                        ? 'linear-gradient(135deg, #493044, #3A2536)'
                        : 'var(--warm-white)',
                      borderColor: sel ? '#B99A65' : 'rgba(185,154,101,0.15)',
                      color: sel ? '#F0E8EE' : '#2A1E26',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: sel ? 'rgba(185,154,101,0.25)' : 'rgba(185,154,101,0.1)' }}
                      >
                        <Crown className="w-4 h-4" style={{ color: sel ? '#D4BA8A' : '#B99A65' }} />
                      </div>
                      <div>
                        <div className="text-sm font-bold truncate max-w-[180px]">{w.couple_names}</div>
                        <div className="text-[11px] opacity-70">{w.guest_count} Guests · {w.venue_city}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Stat Cards Row (PlanifyHer-inspired golden dashed border) ── */}
          {selectedWedding && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={IndianRupee}
                label="Total Budget"
                value={`₹${(Number(selectedWedding.budget) / 100000).toFixed(1)}L`}
                sub={`₹${Number(selectedWedding.budget).toLocaleString('en-IN')} allocated`}
                accent
              />
              <StatCard
                icon={Clock}
                label="Days Until Wedding"
                value={`${daysUntilWedding}`}
                sub="days to go"
              />
              <StatCard
                icon={Users}
                label="Guests Confirmed"
                value={`${selectedWedding.guest_count}`}
                sub={`${selectedWedding.duration_days}-Day celebration`}
              />
              <StatCard
                icon={CheckCircle2}
                label="Tasks Complete"
                value={`${completedTasks} / ${totalTasks}`}
                sub={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% done`}
              />
            </div>
          )}

          {/* ── Blueprint Details + Quick Navigation (Two Column PlanifyHer) ── */}
          {selectedWedding && blueprint && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Column: Wedding Details */}
              <div
                className="lg:col-span-2 p-6 rounded-2xl"
                style={{
                  background: 'var(--warm-white)',
                  border: '1.5px dashed rgba(185,154,101,0.25)',
                }}
              >
                {/* Corner accents */}
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: 'rgba(185,154,101,0.4)' }} />
                  <div className="absolute -top-6 -right-6 w-4 h-4 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: 'rgba(185,154,101,0.4)' }} />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-[#B99A65]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B99A65]">
                    Wedding Details
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#2A1E26] mb-5">
                  Your wedding
                </h3>

                <div className="space-y-4">
                  {[
                    { label: "Couple's Names", value: selectedWedding.couple_names },
                    { label: 'Wedding Date', value: `${selectedWedding.start_date} to ${selectedWedding.end_date}` },
                    { label: 'Venue Name', value: `${selectedWedding.venue_name}, ${selectedWedding.venue_city}` },
                    { label: 'Theme', value: selectedWedding.theme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                    { label: 'Package', value: selectedWedding.package.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-5 gap-2">
                      <div className="col-span-2 text-[11px] font-bold uppercase tracking-wider text-[#8A7380]">
                        {item.label}
                      </div>
                      <div className="col-span-3 text-sm font-medium text-[#2A1E26]">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Countdown */}
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(185,154,101,0.15)' }}>
                  <p className="font-display text-lg italic text-[#B99A65]">
                    {daysUntilWedding} days until &quot;I do&quot;
                  </p>
                </div>
              </div>

              {/* Right Column: Quick Navigation + Algorithm Metrics */}
              <div className="lg:col-span-3 space-y-6">
                {/* Algorithm Metrics Banner */}
                <div
                  className="p-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #493044, #3A2536)',
                    border: '1px solid rgba(185,154,101,0.3)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#D4BA8A]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4BA8A]">
                      Blueprint Intelligence Metrics
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { label: 'Template Match', value: `${((blueprint.matching_score || 0) * 100).toFixed(0)}%`, icon: Target },
                      { label: 'DAG Status', value: 'Acyclic ✓', icon: Layers },
                      { label: 'Critical Path', value: `${criticalTasks} Tasks`, icon: TrendingUp },
                      { label: 'Blueprint', value: `v${blueprint.version}`, icon: Shield },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl text-center"
                        style={{ background: 'rgba(255,252,248,0.08)', border: '1px solid rgba(185,154,101,0.15)' }}
                      >
                        <m.icon className="w-4 h-4 text-[#D4BA8A] mx-auto mb-1.5" />
                        <div className="text-xs font-bold text-[#F0E8EE]">{m.value}</div>
                        <div className="text-[10px] text-[#C9A6B2]">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Navigation Grid */}
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: 'var(--warm-white)',
                    border: '1.5px dashed rgba(185,154,101,0.25)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-[#B99A65]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B99A65]">
                      Quick Navigation
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#2A1E26] mb-4">
                    Jump to a section
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'Task Checklist', icon: CheckCircle2, tab: 'tasks' as const },
                      { label: 'Event Timeline', icon: Calendar, tab: 'events' as const },
                      { label: 'Vendor Scopes', icon: Briefcase, tab: 'allocations' as const },
                      { label: 'Resources', icon: Box, tab: 'allocations' as const },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTab(item.tab)}
                        className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer hover:-translate-y-0.5"
                        style={{
                          background: activeTab === item.tab ? 'rgba(73,48,68,0.06)' : 'white',
                          border: `1px solid ${activeTab === item.tab ? 'rgba(185,154,101,0.4)' : 'rgba(185,154,101,0.15)'}`,
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(185,154,101,0.1)' }}
                        >
                          <item.icon className="w-4 h-4 text-[#B99A65]" />
                        </div>
                        <span className="text-xs font-semibold text-[#2A1E26]">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Approve Button */}
                  <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(185,154,101,0.12)' }}>
                    <button
                      disabled={blueprint.approved_by_planner || approvalLoading}
                      onClick={handleApprove}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        blueprint.approved_by_planner
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ''
                      }`}
                      style={
                        blueprint.approved_by_planner
                          ? {}
                          : {
                              background: 'linear-gradient(135deg, #9A7E50, #CDB07A, #D4BA8A)',
                              color: '#2E1F2A',
                              boxShadow: '0 8px 32px rgba(185,154,101,0.35)',
                            }
                      }
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {blueprint.approved_by_planner
                        ? 'Blueprint Formally Approved ✓'
                        : 'Approve & Lock Blueprint'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab Navigation ── */}
          {blueprint && (
            <div>
              <div className="flex items-center gap-1 p-1 rounded-2xl" style={{ background: 'rgba(185,154,101,0.08)' }}>
                {[
                  { id: 'tasks' as const, label: `Task Checklist (${totalTasks})`, icon: CheckCircle2 },
                  { id: 'events' as const, label: `Event Timeline (${selectedWedding?.events?.length || 0})`, icon: Calendar },
                  { id: 'allocations' as const, label: 'Allocations & Payments', icon: Briefcase },
                ].map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active ? 'shadow-md' : ''
                      }`}
                      style={{
                        background: active ? 'white' : 'transparent',
                        color: active ? '#493044' : '#8A7380',
                        border: active ? '1px solid rgba(185,154,101,0.25)' : '1px solid transparent',
                      }}
                    >
                      <tab.icon className="w-3.5 h-3.5" style={{ color: active ? '#B99A65' : '#8A7380' }} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'tasks' && (
                    <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <TaskManagementTable
                        key={blueprint.id}
                        tasks={blueprint.tasks || []}
                        onTaskUpdated={handleTaskUpdated}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'events' && selectedWedding && (
                    <motion.div key="events" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <EventPlanningTimeline events={selectedWedding.events || []} weddingTitle={selectedWedding.title} />
                    </motion.div>
                  )}
                  {activeTab === 'allocations' && (
                    <motion.div key="alloc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <AllocationsPanel
                        vendors={blueprint.vendor_requirements || []}
                        resources={blueprint.resource_requirements || []}
                        milestones={blueprint.payment_milestones || []}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {loadError && !loading && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
              <p className="font-semibold">Wedding plans could not be loaded.</p>
              <p className="mt-1">{loadError}</p>
              <button
                type="button"
                onClick={fetchWeddings}
                className="mt-3 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-semibold hover:bg-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {!loadError && !blueprint && !loading && selectedWedding && (
            <div
              className="p-16 rounded-3xl text-center max-w-xl mx-auto"
              style={{
                background: 'var(--warm-white)',
                border: '2px dashed rgba(185,154,101,0.3)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(185,154,101,0.12)' }}
              >
                <Sparkles className="w-7 h-7 text-[#B99A65]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2A1E26] mb-2">
                Synthesize Blueprint
              </h3>
              <p className="text-sm text-[#8A7380] mb-6 leading-relaxed">
                Run our 4 intelligent algorithms on the backend to generate a complete,
                context-aware wedding operations blueprint for {selectedWedding.couple_names}.
              </p>
              <button
                onClick={() => setViewMode('generating')}
                className="btn-gold inline-flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Crown className="w-4 h-4" /> Generate Blueprint Now
              </button>
            </div>
          )}

          {/* ── Empty State: No Weddings ── */}
          {!loadError && !loading && weddings.length === 0 && (
            <div
              className="p-16 rounded-3xl text-center max-w-xl mx-auto"
              style={{
                background: 'var(--warm-white)',
                border: '2px dashed rgba(185,154,101,0.3)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(185,154,101,0.12)' }}
              >
                <Crown className="w-7 h-7 text-[#B99A65]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#2A1E26] mb-2">
                No Weddings Yet
              </h3>
              <p className="text-sm text-[#8A7380] mb-6 leading-relaxed">
                Begin by setting up your first wedding. Our intelligent blueprint engine will synthesize
                a complete operations plan powered by Template Matching, DAG Scheduling and more.
              </p>
              <button
                onClick={() => setViewMode('setup')}
                className="btn-gold inline-flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" /> Create Wedding Setup
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
