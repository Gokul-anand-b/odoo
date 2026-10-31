'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertTriangle, Truck, Activity } from 'lucide-react';

const timeline = [
  { time: '09:00 AM', event: 'Venue Setup Begins', status: 'done' },
  { time: '11:30 AM', event: 'Florist Arrangement Delivery', status: 'done' },
  { time: '02:00 PM', event: 'Catering Team Arrival', status: 'live' },
  { time: '04:00 PM', event: 'Sound & Lighting Check', status: 'soon' },
  { time: '06:00 PM', event: 'Guest Registration Opens', status: 'soon' },
];

const vendors = [
  { name: 'Floral Decorations', vendor: 'Royal Blooms', status: 'Arrived', color: '#4ade80' },
  { name: 'Catering', vendor: 'Grand Feast Co.', status: 'En Route', color: '#D4BA8A' },
  { name: 'Photography', vendor: 'Luxe Captures', status: 'Confirmed', color: '#4ade80' },
  { name: 'Music & DJ', vendor: 'Rhythm Masters', status: 'Pending', color: '#C9A6B2' },
];

export default function OperationsSection() {
  return (
    <section className="dashboard-section">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5"
      >
        <h2 className="section-title">
          Operations Preview
        </h2>
        <div className="flex-1 gold-line opacity-40" />
        <span className="badge-gold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: '#4ade80' }} />
          Live — Sharma Wedding
        </span>
      </motion.div>

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card h-full p-5 sm:p-6 lg:col-span-4"
        >
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4" style={{ color: 'var(--gold)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Event Timeline</h3>
          </div>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3.5 relative">
                {/* Connector */}
                {i < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-7 w-px bottom-0"
                    style={{ background: t.status === 'done' ? 'rgba(74,222,128,0.3)' : 'var(--border-soft)' }} />
                )}
                {/* Dot */}
                <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                  ${t.status === 'done' ? 'timeline-dot-done' : t.status === 'live' ? 'timeline-dot-live' : 'timeline-dot-soon'}`}>
                  {t.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
                  {t.status === 'live' && <Clock className="w-3 h-3" style={{ color: 'var(--plum-deep)' }} />}
                </div>
                <div className="pb-5">
                  <p className="text-sm font-medium leading-snug"
                    style={{ color: t.status === 'soon' ? 'var(--text-ghost)' : 'var(--text-ink)' }}>
                    {t.event}
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-5 lg:col-span-8">

          {/* Vendor Status */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="card p-5 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4" style={{ color: 'var(--gold)' }} />
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Vendor Arrival Status</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {vendors.map((v, j) => (
                <div key={j} className="flex items-center justify-between px-4 py-3.5 rounded-2xl"
                  style={{ background: 'var(--ivory)', border: '1px solid var(--border-soft)' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-ink)' }}>{v.name}</p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{v.vendor}</p>
                  </div>
                  <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{ background: `${v.color}18`, color: v.color, border: `1px solid ${v.color}30` }}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Task + Alert */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Task */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="card p-5 sm:p-6"
            >
              <h3 className="mb-4 text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Task Completion</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="font-display text-4xl font-bold" style={{ color: 'var(--text-ink)' }}>75%</span>
                <span className="mb-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}>24/32 tasks</span>
              </div>
              <div className="progress-track h-2.5 mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '75%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.3 }}
                  className="progress-fill"
                />
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--gold-muted)' }}>8 tasks remaining for today</p>
            </motion.div>

            {/* Alert */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-[20px] p-5 sm:p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(201,166,178,0.12), rgba(160,120,132,0.06))',
                border: '1px solid rgba(201,166,178,0.30)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10" style={{ background: 'var(--rose)' }} />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(160,120,132,0.18)' }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: 'var(--rose-deep)' }} />
                </div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Operational Alert</h3>
              </div>
              <p className="mb-1 text-sm font-semibold" style={{ color: 'var(--rose-deep)' }}>Weather Advisory</p>
              <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--text-body)' }}>
                Light rain expected between 5-7 PM. Backup indoor arrangement activated.
              </p>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>15 min ago</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
