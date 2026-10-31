'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Menu, X, Crown, LogOut, User, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/client-management/services/authService';
import type { AuthUser } from '@/features/client-management/services/authService';

export default function TopNav() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [today, setToday] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);
  const profRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setToday(new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void authApi.me().then(setUser).catch(() => setUser(null));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (profRef.current && !profRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const notifs = [
    { id: 1, text: 'Sharma Wedding — Florist confirmed delivery', time: '5 min ago', unread: true },
    { id: 2, text: 'Mehta Wedding — Budget updated by coordinator', time: '1 hour ago', unread: true },
    { id: 3, text: 'New vendor registration: Royal Caterers', time: '3 hours ago', unread: false },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 glass" style={{ height: 70, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between h-full px-5 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-ivory-warm/80 transition cursor-pointer">
              <Menu className="w-5 h-5" style={{ color: 'var(--text-ink)' }} />
            </button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-[1.35rem] font-semibold" style={{ color: 'var(--text-ink)' }}>
                  Welcome back, <span className="text-gold font-bold">{user?.name ?? 'there'}</span>
                </h2>
                <motion.div animate={{ rotate: [0, 14, -8, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }} className="text-lg">
                  ✨
                </motion.div>
              </div>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-ghost)' }}>{today}</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <motion.div animate={{ width: searchFocused ? 300 : 240 }} className="relative hidden md:flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 transition-colors" style={{ color: searchFocused ? 'var(--gold)' : 'var(--text-ghost)' }} />
              <input
                placeholder="Search weddings, vendors..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: searchFocused ? 'var(--warm-white)' : 'var(--ivory-warm)',
                  border: `1.5px solid ${searchFocused ? 'var(--gold)' : 'var(--border)'}`,
                  color: 'var(--text-ink)',
                  boxShadow: searchFocused ? 'var(--shadow-gold)' : 'none',
                }}
              />
            </motion.div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <motion.button whileTap={{ scale: 0.92 }}
                onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
                className="relative p-2.5 rounded-xl cursor-pointer transition-all"
                style={{ background: showNotif ? 'rgba(185,154,101,0.12)' : 'transparent', border: '1.5px solid transparent' }}>
                <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))' }} />
              </motion.button>
              <AnimatePresence>
                {showNotif && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-[340px] rounded-2xl overflow-hidden z-50"
                    style={{ background: 'var(--warm-white)', border: '1px solid var(--border-glow)', boxShadow: 'var(--shadow-xl)' }}>
                    <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
                      <h4 className="text-sm font-bold" style={{ color: 'var(--text-ink)' }}>Notifications</h4>
                      <span className="badge-gold">2 new</span>
                    </div>
                    {notifs.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-ivory/60 transition cursor-pointer" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? '' : 'opacity-0'}`}
                          style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold-light))' }} />
                        <div>
                          <p className="text-[13px] leading-snug" style={{ color: 'var(--text-body)' }}>{n.text}</p>
                          <p className="text-[11px] mt-1" style={{ color: 'var(--text-ghost)' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative" ref={profRef}>
              <motion.button whileTap={{ scale: 0.92 }}
                onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl cursor-pointer transition-all"
                style={{ background: showProfile ? 'rgba(185,154,101,0.12)' : 'transparent' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-md"
                  style={{ background: 'linear-gradient(145deg, var(--gold), var(--gold-light))', color: 'var(--plum-deep)' }}>{(user?.name ?? 'User').slice(0, 2).toUpperCase()}</div>
                <span className="hidden md:block text-sm font-semibold" style={{ color: 'var(--text-ink)' }}>{user?.name ?? 'User'}</span>
                <ChevronDown className="w-3.5 h-3.5 hidden md:block" style={{ color: 'var(--text-ghost)' }} />
              </motion.button>
              <AnimatePresence>
                {showProfile && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl overflow-hidden z-50"
                    style={{ background: 'var(--warm-white)', border: '1px solid var(--border-glow)', boxShadow: 'var(--shadow-xl)' }}>
                    <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
                      <p className="text-sm font-bold" style={{ color: 'var(--text-ink)' }}>{user?.name ?? 'User'}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--text-ghost)' }}>{user?.role ?? 'account'}</p>
                    </div>
                    {[{ icon: User, label: 'My Profile' }, { icon: Settings, label: 'Settings' }, { icon: LogOut, label: 'Sign Out' }].map((it) => (
                      <button key={it.label} className="flex items-center gap-3 w-full px-5 py-3 text-[13px] font-medium hover:bg-ivory/60 transition cursor-pointer"
                        onClick={() => {
                          if (it.label === 'Sign Out') {
                            void authApi.logout().finally(() => router.replace('/login'));
                          }
                        }}
                        style={{ color: 'var(--text-muted)' }}>
                        <it.icon className="w-4 h-4" /> {it.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 h-full w-72 z-50 lg:hidden flex flex-col"
              style={{ background: 'linear-gradient(175deg, #1A130D, #140E09, #080503)', borderRight: '1px solid rgba(215, 186, 120, 0.25)' }}>
              <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #B99A65, #D4BA8A)' }}>
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="font-display text-lg font-bold" style={{ color: '#F0E8EE' }}>Etern<span className="text-gold">elle</span></h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg cursor-pointer" style={{ color: '#C9A6B2' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="gold-line mx-5 opacity-40" />
              <nav className="flex-1 px-3 py-4 space-y-1">
                {[
                  { icon: '📊', label: 'Overview', active: true },
                  { icon: '📋', label: 'Wedding Blueprint' },
                  { icon: '🧠', label: 'Vendor Intelligence' },
                  { icon: '📡', label: 'Command Centre' },
                  { icon: '🛡️', label: 'Disruption & Recovery' },
                  { icon: '💰', label: 'Financial & Guest' },
                  { icon: '⚙️', label: 'Settings' },
                ].map((it) => (
                  <button key={it.label} onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition cursor-pointer ${it.active ? 'nav-item-active' : 'nav-item'}`}
                    style={{ color: it.active ? '#F0E8EE' : '#9B8A92' }}>
                    <span className="text-lg">{it.icon}</span>
                    <span className="text-sm font-medium">{it.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
