'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, Radio, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    title: 'Intelligent Wedding Blueprint',
    desc: 'Personalised wedding planning and task organisation with AI-powered timeline management.',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80',
    accent: 'var(--gold)',
  },
  {
    title: 'Smart Vendor Intelligence',
    desc: 'Vendor comparison, quotation analysis, and intelligent selection recommendations.',
    icon: Brain,
    image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=500&q=80',
    accent: 'var(--rose)',
  },
  {
    title: 'Dynamic Command Centre',
    desc: 'Live wedding schedules, real-time coordination, and full operational visibility.',
    icon: Radio,
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&q=80',
    accent: 'var(--gold)',
  },
  {
    title: 'Disruption & Recovery',
    desc: 'Identify operational disruptions and explore AI-powered recovery strategies instantly.',
    icon: ShieldAlert,
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500&q=80',
    accent: 'var(--rose)',
  },
];

export default function FeaturesSection() {
  return (
    <section className="dashboard-section">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-14" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: 'var(--gold-muted)' }}>
            Intelligent Modules
          </span>
          <div className="h-px w-14" style={{ background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
        </div>
        <h2 className="section-title mb-3 text-center !text-3xl md:!text-4xl">
          Core Feature <span className="text-gold">Highlights</span>
        </h2>
        <p className="section-subtitle mx-auto max-w-lg leading-relaxed text-center">
          Purpose-built intelligence for every dimension of luxury wedding management.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card group flex h-full cursor-pointer flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-40 shrink-0 overflow-hidden">
                <Image src={f.image} alt={f.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="card-image h-full w-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--warm-white) 5%, transparent 60%)' }} />
                <div className="absolute inset-0" style={{ background: 'rgba(73,48,68,0.30)' }} />

                {/* Icon */}
                <div className="absolute bottom-4 left-4">
                  <motion.div
                    whileHover={{ rotate: -8 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(145deg, var(--gold), var(--gold-light))',
                      boxShadow: 'var(--shadow-gold)',
                    }}>
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>

                {/* Arrow on hover */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 glass-dark">
                  <ArrowUpRight className="w-4 h-4" style={{ color: '#D4BA8A' }} />
                </div>
              </div>

              {/* Text */}
              <div className="flex-1 p-5 pt-4">
                <h3 className="mb-2 text-base font-semibold leading-snug group-hover:text-gold-muted transition-colors"
                  style={{ color: 'var(--text-ink)' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {f.desc}
                </p>
              </div>

              {/* Bottom gold line */}
              <div className="mx-5 mb-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)' }} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
