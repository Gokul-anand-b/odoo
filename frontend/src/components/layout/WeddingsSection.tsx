'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';

const weddings = [
  {
    id: '1', couple: 'Arjun & Priya Sharma', date: '15 November 2026',
    venue: 'The Leela Palace, Udaipur', guests: 450, theme: 'Royal Heritage', progress: 78,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
  },
  {
    id: '2', couple: 'Vikram & Ananya Mehta', date: '28 November 2026',
    venue: 'Taj Falaknuma Palace, Hyderabad', guests: 320, theme: 'Garden Elegance', progress: 62,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  },
  {
    id: '3', couple: 'Rohit & Kavya Kapoor', date: '12 December 2026',
    venue: 'Umaid Bhawan Palace, Jodhpur', guests: 580, theme: 'Mughal Grandeur', progress: 45,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
];

export default function WeddingsSection() {
  return (
    <section className="dashboard-section">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-5"
      >
        <div>
          <h2 className="section-title">
            Upcoming Weddings
          </h2>
          <p className="section-subtitle mt-1">Your next celebrations</p>
        </div>
        <motion.button whileHover={{ x: 4 }} className="flex items-center gap-2 text-sm font-semibold cursor-pointer" style={{ color: 'var(--gold-muted)' }}>
          View all <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {weddings.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -7 }}
            className="card group flex h-full cursor-pointer flex-col overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-52 shrink-0 overflow-hidden">
              <img src={w.image} alt={w.couple}
                className="card-image h-full w-full object-cover"
                loading="lazy" />
              <div className="absolute inset-0 img-overlay" />

              {/* Theme badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-semibold"
                style={{ color: 'var(--plum)' }}>
                <Sparkles className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                {w.theme}
              </div>

              {/* Progress badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: 'rgba(185,154,101,0.90)', color: 'var(--plum-deep)' }}>
                {w.progress}%
              </div>

              {/* Couple name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display text-xl font-bold text-white leading-tight drop-shadow-lg">
                  {w.couple}
                </h3>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-5">
              <div className="space-y-2.5 mb-5">
                {[
                  { icon: Calendar, text: w.date },
                  { icon: MapPin, text: w.venue },
                  { icon: Users, text: `${w.guests.toLocaleString('en-IN')} Guests` },
                ].map((d, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    <d.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                    <span className="min-w-0 truncate text-sm" style={{ color: 'var(--text-body)' }}>{d.text}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Planning Progress</span>
                </div>
                <div className="progress-track h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${w.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.2 }}
                    className="progress-fill"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
