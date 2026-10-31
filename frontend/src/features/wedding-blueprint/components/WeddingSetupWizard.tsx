'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Crown,
  Clock,
  Shirt,
  UserCheck,
} from 'lucide-react';
import { Wedding, WeddingEvent } from '../types/blueprint.types';
import { blueprintApi } from '../services/blueprintService';
import { clientManagementApi } from '@/features/client-management/services/clientManagementService';

interface WeddingSetupWizardProps {
  onSuccess: (createdWedding: Wedding) => void;
  onRequestSubmitted?: () => void;
  requestOnly?: boolean;
  onCancel?: () => void;
}

const THEME_OPTIONS = [
  {
    id: 'plum_antique_gold',
    name: 'Plum & Antique Gold Elegance',
    tag: 'Signature Recommended',
    desc: 'Deep royal velvet plum, muted antique gold accents, opulent crystal chandeliers and warm candlelight.',
    bg: 'linear-gradient(135deg, #493044 0%, #301E2D 100%)',
    goldAccent: '#D4BA8A',
  },
  {
    id: 'royal_heritage',
    name: 'Royal Heritage & Palace Grandeur',
    tag: 'Grand Palatial',
    desc: 'Fort and palace aesthetics with traditional Shehnai, Marigold-Rose floral architecture, and elephant processions.',
    bg: 'linear-gradient(135deg, #3A2536 0%, #22141F 100%)',
    goldAccent: '#CDB07A',
  },
  {
    id: 'modern_minimalist',
    name: 'Modern Minimalist Luxury',
    tag: 'Sleek & Contemporary',
    desc: 'Monochromatic floral clouds, architectural geometry, warm alabaster surfaces and bespoke ambient lighting.',
    bg: 'linear-gradient(135deg, #2E1F2A 0%, #1A1017 100%)',
    goldAccent: '#B99A65',
  },
  {
    id: 'coastal_breeze',
    name: 'Coastal Beach Destination',
    tag: 'Island & Resort',
    desc: 'Bespoke oceanic canopies, barefoot luxury beachside dinners, sunset acoustic symphony, and tropical floral arches.',
    bg: 'linear-gradient(135deg, #42293C 0%, #281724 100%)',
    goldAccent: '#E8D4B0',
  },
];

const PACKAGE_OPTIONS = [
  {
    id: 'gold_signature',
    name: 'Gold Signature Experience',
    badge: 'Most Popular',
    subtitle: 'Comprehensive luxury wedding management & production',
    priceEstimate: '₹25,00,000 - ₹50,00,000',
    included: ['Senior Wedding Director', 'Full Decor Concept & 3D Renders', 'Guest Hospitality Team', 'Live Sound & Stage Rig'],
  },
  {
    id: 'platinum_royal',
    name: 'Platinum Royal Bespoke',
    badge: 'Ultra Luxury',
    subtitle: 'High-touch concierges, multi-day coordination & celebrity riders',
    priceEstimate: '₹50,00,000 - ₹1,50,00,000',
    included: ['24/7 VIP Concierge Escort', 'Full Drone & Cinema Film Crew', 'Private Airport Chauffeur Fleet', 'Overseas Floral Procurement'],
  },
  {
    id: 'diamond_emperor',
    name: 'Diamond Imperial Elite',
    badge: 'Palace Scale',
    subtitle: 'Multi-destination charter flights, private security & international designers',
    priceEstimate: '₹1,50,00,000+',
    included: ['White-Glove Executive Protocol', 'International Culinary Masters', 'Drone Airshow & Pyrotechnics', 'Complete Hotel Buyout Operations'],
  },
  {
    id: 'silver_curated',
    name: 'Silver Curated Collection',
    badge: 'Intimate',
    subtitle: 'Essential high-end coordination for intimate gatherings',
    priceEstimate: 'Up to ₹25,00,000',
    included: ['Lead Wedding Planner', 'Curated Vendor Roster', 'Day-of Execution Lead', 'Custom Seating Arrangement'],
  },
];

const SERVICE_OPTIONS = [
  { id: 'catering', label: 'Fine Dining & Live Banquet Catering', icon: '🍽️', cat: 'F&B' },
  { id: 'decor', label: 'Bespoke Scenography & Floral Decor', icon: '🌸', cat: 'Design' },
  { id: 'photography', label: 'Master Candid Photography & Albums', icon: '📸', cat: 'Media' },
  { id: 'drone_photography', label: '4K Drone Aerial Cinematography', icon: '🚁', cat: 'Media' },
  { id: 'live_band', label: 'Symphony Strings & Live Band', icon: '🎻', cat: 'Music' },
  { id: 'makeup_styling', label: 'Bridal Couture Styling & Make-up', icon: '💄', cat: 'Style' },
  { id: 'logistics', label: 'VIP Mercedes Fleet & Valet Logistics', icon: '🚘', cat: 'Logistics' },
  { id: 'fireworks', label: 'Synchronized Eco Cold-Pyrotechnics', icon: '✨', cat: 'Production' },
];

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function WeddingSetupWizard({ onSuccess, onRequestSubmitted, requestOnly = false, onCancel }: WeddingSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: 'The Royal Union of Aanya & Rohan',
    couple_names: 'Aanya Sharma & Rohan Singhania',
    start_date: '2026-12-15',
    end_date: '2026-12-17',
    duration_days: 3,
    guest_count: 350,
    budget: 4500000,
    venue_name: 'The Taj Lake Palace',
    venue_city: 'Udaipur, Rajasthan',
    theme: 'plum_antique_gold',
    package: 'platinum_royal',
    selected_services: ['catering', 'decor', 'photography', 'drone_photography', 'live_band', 'makeup_styling', 'logistics'],
    notes: 'Bride prefers deep velvet plum backdrop for Sangeet. Strict vegetarian menu required for Vedic ceremony.',
  });

  // Events Sub-list
  const [events, setEvents] = useState<WeddingEvent[]>([
    {
      name: 'Welcome Gala & Mehendi Soiree',
      event_order: 1,
      date: '2026-12-15',
      start_time: '16:00',
      end_time: '21:00',
      venue_space: 'Pichola Poolside Terrace',
      expected_guests: 250,
      dress_code: 'Pastel & Warm Antique Gold',
      coordinator_name: 'Priya Verma',
      notes: 'Live bangle makers, organic henna stations, sunset acoustic sitar duo.',
    },
    {
      name: 'Royal Sangeet & Musical Night',
      event_order: 2,
      date: '2026-12-16',
      start_time: '19:00',
      end_time: '01:00',
      venue_space: 'Mewar Grand Ballroom',
      expected_guests: 350,
      dress_code: 'Deep Royal Plum & Diamond Sparkle',
      coordinator_name: 'Vikram Malhotra',
      notes: 'Stage length 40ft, line-array acoustics, LED backdrop, choreography rehearsals at 14:00.',
    },
    {
      name: 'Vedic Muhurtham & Royal Reception',
      event_order: 3,
      date: '2026-12-17',
      start_time: '10:00',
      end_time: '16:00',
      venue_space: 'Jagmandir Island Palace Courtyard',
      expected_guests: 350,
      dress_code: 'Traditional Silk with Gold Zari',
      coordinator_name: 'Arjun Kapoor',
      notes: 'Heritage Shehnai troupe, flower petal rain clearance, priest travel protocol.',
    },
  ]);

  const updateField = <K extends keyof typeof formData,>(field: K, value: (typeof formData)[K]) => {
    if (field === 'start_date' && typeof value === 'string') {
      const currentStart = new Date(`${formData.start_date}T00:00:00`);
      const nextStart = new Date(`${value}T00:00:00`);
      const dayShift = Math.round((nextStart.getTime() - currentStart.getTime()) / 86400000);
      if (Number.isFinite(dayShift)) {
        setEvents((current) => current.map((event) => {
          const shiftedDate = new Date(`${event.date}T00:00:00`);
          shiftedDate.setDate(shiftedDate.getDate() + dayShift);
          return { ...event, date: toDateInputValue(shiftedDate) };
        }));
      }
    } else if (field === 'end_date' && typeof value === 'string') {
      setEvents((current) => current.map((event) => (
        event.date > value ? { ...event, date: value } : event
      )));
    }

    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto calculate duration if dates change
      if (field === 'start_date' || field === 'end_date') {
        const d1 = new Date(field === 'start_date' ? String(value) : prev.start_date);
        const d2 = new Date(field === 'end_date' ? String(value) : prev.end_date);
        if (!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d2 >= d1) {
          const diffTime = Math.abs(d2.getTime() - d1.getTime());
          next.duration_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
      }
      return next;
    });
  };

  const toggleService = (svcId: string) => {
    setFormData((prev) => {
      const exists = prev.selected_services.includes(svcId);
      return {
        ...prev,
        selected_services: exists
          ? prev.selected_services.filter((s) => s !== svcId)
          : [...prev.selected_services, svcId],
      };
    });
  };

  const addEvent = () => {
    const nextOrder = Math.max(0, ...events.map((event) => event.event_order)) + 1;
    setEvents([
      ...events,
      {
        name: `New Event ${nextOrder}`,
        event_order: nextOrder,
        date: formData.start_date,
        start_time: '18:00',
        end_time: '22:00',
        venue_space: formData.venue_name,
        expected_guests: formData.guest_count,
        dress_code: 'Plum & Antique Gold Royal Attire',
        coordinator_name: 'Senior Event Lead',
        notes: '',
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEvents(events
      .filter((_, idx) => idx !== index)
      .map((event, idx) => ({ ...event, event_order: idx + 1 })));
  };

  const updateEventField = <K extends keyof WeddingEvent,>(
    index: number,
    field: K,
    value: WeddingEvent[K],
  ) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    setEvents(updated);
  };

  const handleSubmit = async () => {
    if (formData.end_date < formData.start_date) {
      setError('The wedding end date cannot be earlier than its start date.');
      return;
    }
    const outOfRangeEvent = events.find(
      (event) => event.date < formData.start_date || event.date > formData.end_date,
    );
    if (outOfRangeEvent) {
      setError(`${outOfRangeEvent.name} must fall within the wedding date range.`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        events,
      };

      if (requestOnly) {
        await clientManagementApi.create({
          wedding_name: formData.title,
          wedding_date: formData.start_date,
          location: `${formData.venue_name}, ${formData.venue_city}`,
          guest_count: formData.guest_count,
          theme: formData.theme,
          budget: String(formData.budget),
          package: formData.package,
          requirements: formData.notes,
        });
        onRequestSubmitted?.();
      } else {
        const wedding = await blueprintApi.createWedding(payload);
        onSuccess(wedding);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating wedding setup');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-6 lg:p-10 max-w-5xl mx-auto my-4 shadow-xl border border-[rgba(185,154,101,0.25)] relative overflow-hidden">
      {/* Background ambient gold gradient glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #B99A65 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[rgba(185,154,101,0.18)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-gold">Core Feature 1</span>
            <span className="text-xs uppercase tracking-widest text-[#B99A65] font-semibold">
              Step {step} of 4
            </span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#2A1E26]">
            Intelligent Wedding Setup & Blueprint Configurator
          </h2>
          <p className="text-sm text-[#8A7380] mt-1">
            Provide baseline logistics, creative themes and event programs to synthesize your contextual wedding blueprint.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="text-xs text-[#8A7380] hover:text-[#493044] underline font-medium mt-3 md:mt-0"
          >
            Cancel & Return
          </button>
        )}
      </div>

      {/* Progress Steps Indicators */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, label: 'Basics & Logistics' },
          { num: 2, label: 'Theme & Tier' },
          { num: 3, label: 'Bespoke Services' },
          { num: 4, label: 'Event Schedule' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
              step === s.num
                ? 'bg-[#493044] text-[#F0E8EE] border-[#B99A65] shadow-md'
                : step > s.num
                ? 'bg-[#FAF5F0] text-[#493044] border-[rgba(185,154,101,0.3)]'
                : 'bg-[#FFFCF8] text-[#8A7380] border-[rgba(185,154,101,0.1)]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                0{s.num}
              </span>
              {step > s.num && <CheckCircle2 className="w-4 h-4 text-[#B99A65]" />}
            </div>
            <div className="text-xs font-semibold truncate">{s.label}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          <strong>Validation Warning:</strong> {error}
        </div>
      )}

      {/* Step 1: Basics & Logistics */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                Celebration Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
                placeholder="e.g. The Imperial Wedding of Aanya & Rohan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                Couple Names
              </label>
              <input
                type="text"
                value={formData.couple_names}
                onChange={(e) => updateField('couple_names', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
                placeholder="e.g. Aanya Sharma & Rohan Singhania"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#B99A65]" /> Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#B99A65]" /> End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => updateField('end_date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                Duration (Days)
              </label>
              <div className="px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.2)] bg-[#FAF5F0] text-sm font-semibold text-[#493044]">
                {formData.duration_days} Day{formData.duration_days > 1 ? 's' : ''} Itinerary
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                <Users className="w-3.5 h-3.5 inline mr-1 text-[#B99A65]" /> Guest Count
              </label>
              <input
                type="number"
                min="20"
                max="5000"
                value={formData.guest_count}
                onChange={(e) => updateField('guest_count', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
              />
              <span className="text-[11px] text-[#8A7380] mt-1 block">
                {formData.guest_count > 250
                  ? '⚡ Scaled Rule: Large event infrastructure & VIP shuttles will automatically trigger.'
                  : 'Intimate to mid-sized boutique wedding configuration.'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                <IndianRupee className="w-3.5 h-3.5 inline mr-1 text-[#B99A65]" /> Total Master Budget (INR)
              </label>
              <input
                type="number"
                step="50000"
                value={formData.budget}
                onChange={(e) => updateField('budget', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
              />
              <span className="text-[11px] text-[#8A7380] mt-1 block">
                ₹{(formData.budget / 100000).toFixed(1)} Lakhs allocated for all vendor & operational lines.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#B99A65]" /> Primary Venue Name
              </label>
              <input
                type="text"
                value={formData.venue_name}
                onChange={(e) => updateField('venue_name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
                placeholder="e.g. Umaid Bhawan Palace"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
                Destination City / State
              </label>
              <input
                type="text"
                value={formData.venue_city}
                onChange={(e) => updateField('venue_city', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
                placeholder="e.g. Jodhpur, Rajasthan"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 2: Theme & Package Tier */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-3">
              Curated Aesthetic Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEME_OPTIONS.map((th) => {
                const selected = formData.theme === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => updateField('theme', th.id)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      selected
                        ? 'border-[#B99A65] ring-2 ring-[#B99A65] shadow-lg transform -translate-y-1'
                        : 'border-[rgba(185,154,101,0.2)] hover:border-[#B99A65]'
                    }`}
                    style={{ background: selected ? th.bg : '#FFFCF8' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          selected
                            ? 'bg-[rgba(185,154,101,0.3)] text-[#D4BA8A]'
                            : 'bg-[#FAF5F0] text-[#8A7380]'
                        }`}
                      >
                        {th.tag}
                      </span>
                      {selected && <CheckCircle2 className="w-5 h-5 text-[#D4BA8A]" />}
                    </div>
                    <h3
                      className={`font-display text-lg font-bold mb-1 ${
                        selected ? 'text-[#F0E8EE]' : 'text-[#2A1E26]'
                      }`}
                    >
                      {th.name}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        selected ? 'text-[#D4C8D0]' : 'text-[#8A7380]'
                      }`}
                    >
                      {th.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(185,154,101,0.18)]">
            <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-3">
              Wedding Service Tier & Package
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PACKAGE_OPTIONS.map((pkg) => {
                const selected = formData.package === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => updateField('package', pkg.id)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                      selected
                        ? 'bg-[#493044] text-[#F0E8EE] border-[#B99A65] ring-2 ring-[#B99A65] shadow-lg'
                        : 'bg-[#FFFCF8] text-[#2A1E26] border-[rgba(185,154,101,0.2)] hover:border-[#B99A65]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-base">{pkg.name}</span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                          selected ? 'bg-[#B99A65] text-[#2A1E26]' : 'bg-[#FAF5F0] text-[#B99A65]'
                        }`}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                    <p className={`text-xs mb-3 ${selected ? 'text-[#D4C8D0]' : 'text-[#8A7380]'}`}>
                      {pkg.subtitle}
                    </p>
                    <div className="text-xs font-semibold text-[#B99A65] mb-3">
                      Est. {pkg.priceEstimate}
                    </div>
                    <div className="space-y-1">
                      {pkg.included.map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] opacity-80">
                          <CheckCircle2 className="w-3 h-3 text-[#B99A65]" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Step 3: Bespoke Services */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#493044]">
                  Selected Service Modules
                </h3>
                <p className="text-xs text-[#8A7380]">
                  Our Rule-Based Customisation engine automatically creates dependent tasks and vendor scopes for each active service.
                </p>
              </div>
              <span className="badge-gold">
                {formData.selected_services.length} Active Services
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {SERVICE_OPTIONS.map((svc) => {
                const active = formData.selected_services.includes(svc.id);
                return (
                  <div
                    key={svc.id}
                    onClick={() => toggleService(svc.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                      active
                        ? 'bg-[#493044] text-[#F0E8EE] border-[#B99A65] shadow-md'
                        : 'bg-[#FFFCF8] text-[#2A1E26] border-[rgba(185,154,101,0.2)] hover:border-[#B99A65]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{svc.icon}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          active ? 'bg-[rgba(185,154,101,0.3)] text-[#D4BA8A]' : 'bg-[#FAF5F0] text-[#8A7380]'
                        }`}
                      >
                        {svc.cat}
                      </span>
                    </div>
                    <div className="text-xs font-semibold leading-snug">{svc.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[#493044] mb-2">
              VIP & Planner Notes (Custom Directives)
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B99A65]"
              placeholder="e.g. Special family traditions, dietary mandates, artist rider specifics..."
            />
          </div>
        </motion.div>
      )}

      {/* Step 4: Event Schedule Rundown */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#493044]">
                Wedding Event Rundown & Ceremonies
              </h3>
              <p className="text-xs text-[#8A7380]">
                Configure distinct functions across your wedding duration.
              </p>
            </div>
            <button
              type="button"
              onClick={addEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF5F0] text-[#493044] hover:bg-[#F2E8DF] border border-[rgba(185,154,101,0.3)] text-xs font-bold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#B99A65]" /> Add Ceremony
            </button>
          </div>

          <div className="space-y-4">
            {events.map((ev, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-[#FFFCF8] border border-[rgba(185,154,101,0.25)] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(185,154,101,0.1)]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#493044] text-[#D4BA8A] text-xs font-bold flex items-center justify-center">
                      {ev.event_order}
                    </span>
                    <input
                      type="text"
                      value={ev.name}
                      onChange={(e) => updateEventField(index, 'name', e.target.value)}
                      className="font-display font-bold text-lg text-[#2A1E26] bg-transparent border-b border-transparent hover:border-[#B99A65] focus:outline-none focus:border-[#B99A65] px-1"
                      placeholder="Ceremony Name"
                    />
                  </div>

                  {events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEvent(index)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[#8A7380] block mb-1">
                      <Calendar className="w-3 h-3 inline mr-1 text-[#B99A65]" /> Date
                    </label>
                    <input
                      type="date"
                      value={ev.date}
                      min={formData.start_date}
                      max={formData.end_date}
                      onChange={(e) => updateEventField(index, 'date', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[#8A7380] block mb-1">
                      <Clock className="w-3 h-3 inline mr-1 text-[#B99A65]" /> Timing
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="time"
                        value={ev.start_time || ''}
                        onChange={(e) => updateEventField(index, 'start_time', e.target.value)}
                        className="w-full px-1.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={ev.end_time || ''}
                        onChange={(e) => updateEventField(index, 'end_time', e.target.value)}
                        className="w-full px-1.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#8A7380] block mb-1">
                      <MapPin className="w-3 h-3 inline mr-1 text-[#B99A65]" /> Space / Courtyard
                    </label>
                    <input
                      type="text"
                      value={ev.venue_space}
                      onChange={(e) => updateEventField(index, 'venue_space', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                      placeholder="Ballroom or Lawn"
                    />
                  </div>

                  <div>
                    <label className="text-[#8A7380] block mb-1">
                      <UserCheck className="w-3 h-3 inline mr-1 text-[#B99A65]" /> Lead Coordinator
                    </label>
                    <input
                      type="text"
                      value={ev.coordinator_name}
                      onChange={(e) => updateEventField(index, 'coordinator_name', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                      placeholder="Coordinator Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[#8A7380] block mb-1">
                      <Shirt className="w-3 h-3 inline mr-1 text-[#B99A65]" /> Dress Code / Palette
                    </label>
                    <input
                      type="text"
                      value={ev.dress_code}
                      onChange={(e) => updateEventField(index, 'dress_code', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                      placeholder="e.g. Plum Velvet & Antique Gold Royal"
                    />
                  </div>
                  <div>
                    <label className="text-[#8A7380] block mb-1">Ceremony Specific Notes</label>
                    <input
                      type="text"
                      value={ev.notes || ''}
                      onChange={(e) => updateEventField(index, 'notes', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[rgba(185,154,101,0.2)] bg-white text-xs"
                      placeholder="e.g. Acoustics requirements, fireworks clearance"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-[rgba(185,154,101,0.18)]">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[rgba(185,154,101,0.3)] bg-white text-[#493044] hover:bg-[#FAF5F0] text-xs font-bold cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider"
          >
            Continue to Step 0{step + 1} <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="btn-gold flex items-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Synthesizing Setup...
              </>
            ) : (
              <>
                <Crown className="w-4 h-4" /> Finalize Setup & Generate Blueprint
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
