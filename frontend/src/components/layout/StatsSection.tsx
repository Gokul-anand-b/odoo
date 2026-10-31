'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeart, Users, Store, IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';

const stats = [
  { id: 'weddings', label: 'Active Weddings', value: 12, icon: CalendarHeart, change: '+3 this month', positive: true, suffix: '' },
  { id: 'guests', label: 'Total Guests', value: 4850, icon: Users, change: '↑ 12% from last quarter', positive: true, suffix: '' },
  { id: 'vendors', label: 'Active Vendors', value: 86, icon: Store, change: '14 new this month', positive: true, suffix: '' },
  { id: 'payments', label: 'Pending Payments', value: 18.5, icon: IndianRupee, change: '4 invoices due', positive: false, prefix: '₹', suffix: 'L' },
];

function AnimatedNumber({ end, prefix = '', suffix = '', decimals = 0 }: { end: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) {
        ran.current = true;
        const dur = 2000;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          setVal(end * (1 - Math.pow(1 - p, 4)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString('en-IN');
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="dashboard-section">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-5"
      >
        <h2 className="section-title">
          Wedding Overview
        </h2>
        <div className="flex-1 gold-line opacity-40" />
        <span className="badge-gold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#4ade80' }} />
          Live Data
        </span>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="stat-card p-5 sm:p-6 cursor-default"
              style={{ boxShadow: 'var(--shadow-sm)', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease' }}
            >
              {/* Top shimmer */}
              <div className="absolute top-0 inset-x-6 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(185,154,101,0.5), transparent)' }} />

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 animate-glow"
                style={{
                  background: s.positive
                    ? 'linear-gradient(135deg, rgba(185,154,101,0.14), rgba(212,186,138,0.06))'
                    : 'linear-gradient(135deg, rgba(201,166,178,0.18), rgba(160,120,132,0.06))',
                  border: `1px solid ${s.positive ? 'rgba(185,154,101,0.25)' : 'rgba(201,166,178,0.30)'}`,
                }}>
                <Icon className="w-5.5 h-5.5" style={{ color: s.positive ? 'var(--gold)' : 'var(--rose-deep)' }} />
              </div>

              {/* Value */}
              <div className="font-display text-[2.1rem] font-bold leading-none mb-1"
                style={{ color: 'var(--text-ink)' }}>
                <AnimatedNumber end={s.value} prefix={s.prefix ?? ''} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
              </div>

              {/* Label */}
              <p className="text-xs font-bold uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-muted)' }}>
                {s.label}
              </p>

              {/* Change */}
              <div className="flex items-center gap-1.5">
                {s.positive
                  ? <TrendingUp className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                  : <AlertCircle className="w-3 h-3" style={{ color: 'var(--rose-deep)' }} />}
                <span className="text-xs font-medium leading-snug" style={{ color: s.positive ? 'var(--gold-muted)' : 'var(--rose-deep)' }}>
                  {s.change}
                </span>
              </div>

              {/* Corner orb */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-[0.04]"
                style={{ background: s.positive ? 'var(--gold)' : 'var(--rose)' }} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
