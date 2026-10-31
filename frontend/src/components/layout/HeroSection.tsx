'use client';

import { motion } from 'framer-motion';
import { Plus, Compass, ArrowRight, Star } from 'lucide-react';
import dynamic from 'next/dynamic';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="dashboard-section relative isolate min-h-[440px] overflow-hidden rounded-[24px] sm:rounded-[28px] lg:min-h-[480px]"
      style={{ minHeight: 'clamp(440px, 42vw, 560px)' }}
    >
      {/* ─── Background Image ─── */}
      <div className="hero-backdrop absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85"
          alt="Luxury wedding venue"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ─── Cinematic Overlays ─── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(46,31,42,0.92) 0%, rgba(73,48,68,0.78) 40%, rgba(93,63,88,0.65) 70%, rgba(73,48,68,0.80) 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(28,16,24,0.70) 0%, transparent 50%)',
      }} />

      {/* ─── Animated Ambient Orbs ─── */}
      <div className="absolute top-10 right-20 w-80 h-80 orb animate-float opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(185,154,101,0.6), transparent 70%)' }} />
      <div className="absolute bottom-10 left-10 w-60 h-60 orb animate-float-delay opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(201,166,178,0.5), transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] orb opacity-10 animate-spin-slow"
        style={{ background: 'conic-gradient(from 0deg, transparent, rgba(185,154,101,0.3), transparent, rgba(201,166,178,0.2), transparent)' }} />

      {/* ─── Three.js Scene ─── */}
      <HeroScene />

      {/* ─── Decorative Corner Frames ─── */}
      <svg className="absolute top-6 left-6 opacity-30" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 28 L2 2 L28 2" stroke="url(#g1)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="2" cy="2" r="2.5" fill="#B99A65" opacity="0.5" />
        <defs><linearGradient id="g1" x1="0" y1="0" x2="28" y2="28"><stop stopColor="#D4BA8A" /><stop offset="1" stopColor="#B99A65" stopOpacity="0.3" /></linearGradient></defs>
      </svg>
      <svg className="absolute top-6 right-6 opacity-30 rotate-90" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 28 L2 2 L28 2" stroke="#B99A65" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-6 left-6 opacity-20 -rotate-90" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 28 L2 2 L28 2" stroke="#B99A65" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="absolute bottom-6 right-6 opacity-20 rotate-180" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 28 L2 2 L28 2" stroke="#B99A65" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* ─── Gold line accent ─── */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(185,154,101,0.6), rgba(212,186,138,0.8), rgba(185,154,101,0.6), transparent)' }} />

      {/* ═══════ HERO CONTENT ═══════ */}
      <div className="hero-content relative z-10 flex max-w-4xl flex-col justify-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full glass-dark">
            <Star className="w-3.5 h-3.5" style={{ color: '#D4BA8A' }} />
            <span className="text-[11px] tracking-[0.25em] uppercase font-semibold" style={{ color: '#D4BA8A' }}>
              WedPilot AI Platform
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hero-title font-display mb-6"
          style={{ color: '#F0E8EE' }}
        >
          Every Grand Celebration,
          <br />
          <span className="text-gold" style={{
            background: 'linear-gradient(90deg, #9A7E50, #B99A65, #D4BA8A, #CDB07A, #B99A65)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer-sweep 4s ease-in-out infinite',
          }}>
            Perfectly Orchestrated.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="hero-copy mb-8 sm:mb-10"
          style={{ color: 'rgba(240,232,238,0.82)', fontWeight: 400 }}
        >
          Plan beautifully. Coordinate intelligently.
          <br className="hidden sm:block" />
          Stay prepared for every moment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hero-actions"
        >
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold flex items-center gap-2.5 text-[15px] px-7 py-3.5"
          >
            <Plus className="w-4.5 h-4.5" />
            Create New Wedding
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="btn-ghost flex items-center gap-2.5 text-[15px] px-7 py-3.5"
          >
            <Compass className="w-4.5 h-4.5" style={{ color: '#D4BA8A' }} />
            Explore Command Centre
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </motion.button>
        </motion.div>

        {/* Trust Numbers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-6 sm:mt-10 sm:pt-7"
        >
          {[
            { value: '240+', label: 'Weddings Managed' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '32', label: 'Cities Covered' },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
            >
              <span className="font-display text-2xl font-bold" style={{ color: '#D4BA8A' }}>{s.value}</span>
              <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(240,232,238,0.45)' }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
