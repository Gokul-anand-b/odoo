'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const monthly = [
  { month: 'Jun', amount: 320000 },
  { month: 'Jul', amount: 450000 },
  { month: 'Aug', amount: 380000 },
  { month: 'Sep', amount: 520000 },
  { month: 'Oct', amount: 680000 },
  { month: 'Nov', amount: 525000 },
];

const categories = [
  { name: 'Venue & Decor', amount: '₹12.0L', pct: 42 },
  { name: 'Catering', amount: '₹7.5L', pct: 26 },
  { name: 'Photography', amount: '₹4.5L', pct: 16 },
  { name: 'Entertainment', amount: '₹2.75L', pct: 10 },
  { name: 'Others', amount: '₹2.0L', pct: 6 },
];

function Tip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3.5 py-2 rounded-xl text-sm"
      style={{ background: 'var(--plum)', color: '#F0E8EE', boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(185,154,101,0.3)' }}>
      <p className="font-semibold">{label}</p>
      <p style={{ color: '#D4BA8A' }}>₹{((payload[0].value) / 100000).toFixed(1)}L</p>
    </div>
  );
}

export default function FinancialSection() {
  const pct = 64;
  const R = 42;
  const C = 2 * Math.PI * R;
  const off = C * (1 - pct / 100);

  return (
    <section className="dashboard-section">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5"
      >
        <h2 className="section-title">
          Financial Snapshot
        </h2>
        <div className="flex-1 gold-line opacity-40" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Budget Ring */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card h-full p-5 sm:p-6"
        >
          <h3 className="mb-6 text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Budget Overview</h3>

          <div className="flex items-center justify-center mb-6">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(185,154,101,0.12)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r={R} fill="none" stroke="url(#goldRing)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  whileInView={{ strokeDashoffset: off }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9A7E50" />
                    <stop offset="50%" stopColor="#CDB07A" />
                    <stop offset="100%" stopColor="#D4BA8A" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-bold" style={{ color: 'var(--text-ink)' }}>{pct}%</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>spent</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Total Budget', val: '₹45.0L', color: 'var(--text-ink)' },
              { label: 'Expenses', val: '₹28.75L', color: 'var(--gold-muted)' },
              { label: 'Remaining', val: '₹16.25L', color: '#4ade80' },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span className="text-sm font-bold" style={{ color: r.color }}>{r.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="card h-full p-5 sm:p-6"
        >
          <h3 className="mb-5 text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Monthly Expenditure</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} barSize={28} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip content={<Tip />} cursor={{ fill: 'rgba(185,154,101,0.05)', radius: 8 }} />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {monthly.map((_, i) => (
                    <Cell key={i}
                      fill={i === monthly.length - 2 ? 'url(#barActive)' : 'url(#barNorm)'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barNorm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B99A65" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#B99A65" stopOpacity={0.12} />
                  </linearGradient>
                  <linearGradient id="barActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4BA8A" stopOpacity={1} />
                    <stop offset="100%" stopColor="#9A7E50" stopOpacity={0.65} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="card h-full p-5 sm:p-6"
        >
          <h3 className="mb-5 text-base font-semibold" style={{ color: 'var(--text-ink)' }}>Category Breakdown</h3>
          <div className="space-y-4">
            {categories.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>{c.name}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-ink)' }}>{c.amount}</span>
                </div>
                <div className="progress-track h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.15 + i * 0.08 }}
                    className="progress-fill"
                    style={{ opacity: 1 - i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
