'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Crown,
  Sparkles,
  LayoutDashboard,
  BookOpen,
  Brain,
  Radio,
  ShieldAlert,
  Wallet,
  Settings,
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Overview', icon: LayoutDashboard, href: '/' },
  { id: 'blueprint', label: 'Wedding Blueprint', icon: BookOpen, href: '/wedding-blueprint' },
  { id: 'vendor', label: 'Vendor Intelligence', icon: Brain, badge: 'AI', href: '/vendor-intelligence' },
  { id: 'command', label: 'Command Centre', icon: Radio, href: '/command-centre' },
  { id: 'disruption', label: 'Disruption & Recovery', icon: ShieldAlert, href: '/disruption-engine' },
  { id: 'finance', label: 'Financial & Guest', icon: Wallet, href: '#' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const w = collapsed ? 76 : 290;

  return (
    <>
      <motion.aside
        animate={{ width: w }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 select-none"
        style={{
          background: 'linear-gradient(175deg, #493044 0%, #3A2536 40%, #2B1B28 75%, #1C1018 100%)',
        }}
      >
        {/* Ambient glow orb */}
        <div className="absolute -top-20 -left-20 w-60 h-60 orb opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(185,154,101,0.35), transparent 70%)' }} />

        {/* ─── Logo ─── */}
        <div className="flex items-center gap-3 px-5 pt-7 pb-5">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{
              background: 'linear-gradient(145deg, #B99A65, #D4BA8A, #C8AA76)',
              boxShadow: '0 6px 20px rgba(185,154,101,0.45)',
            }}
          >
            <Crown className="w-5 h-5 text-white drop-shadow-sm" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="font-display text-xl font-bold tracking-wide" style={{ color: '#F0E8EE' }}>
                  Wed<span className="text-gold">Pilot</span>
                  <span className="text-gold text-xs ml-0.5 font-sans font-bold tracking-widest"> AI</span>
                </h1>
                <p className="text-[9px] tracking-[0.28em] uppercase font-semibold mt-0.5" style={{ color: 'rgba(185,154,101,0.55)' }}>
                  Luxury Operations
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Divider ─── */}
        <div className="mx-5 mb-3 gold-line opacity-50" />

        {/* ─── Navigation ─── */}
        <nav className="flex-1 px-3 py-1 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === pathname || (item.href === '/' && pathname === '/');
            const isHov = hovered === item.id;
            const Icon = item.icon;

            return (
              <Link key={item.id} href={item.href || '#'}>
                <motion.div
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  whileTap={{ scale: 0.96 }}
                  className={`relative w-full flex items-center gap-3 rounded-[14px] cursor-pointer overflow-hidden
                    ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}
                    ${isActive ? 'nav-item-active' : 'nav-item'}`}
                >
                {/* Active glow bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-glow"
                    className="absolute left-0 top-[15%] bottom-[15%] w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #D4BA8A, #B99A65)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className="w-[19px] h-[19px] flex-shrink-0 transition-colors duration-200"
                  style={{ color: isActive ? '#D4BA8A' : isHov ? '#C9A6B2' : '#8A7380' }}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                      style={{ color: isActive ? '#F0E8EE' : isHov ? '#D4C8D0' : '#9B8A92' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!collapsed && item.badge && (
                  <span className="ml-auto badge-gold">{item.badge}</span>
                )}

                {/* Tooltip for collapsed */}
                {collapsed && isHov && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap z-[60]"
                    style={{ background: '#493044', color: '#F0E8EE', boxShadow: '0 6px 20px rgba(0,0,0,0.4)', border: '1px solid rgba(185,154,101,0.25)' }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </motion.div>
            </Link>
          );
          })}

          {/* Settings */}
          <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(185,154,101,0.12)' }}>
            <button
              onMouseEnter={() => setHovered('settings')}
              onMouseLeave={() => setHovered(null)}
              className={`nav-item w-full flex items-center gap-3 rounded-[14px] cursor-pointer ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'}`}
            >
              <Settings className="w-[19px] h-[19px] flex-shrink-0 transition-colors" style={{ color: hovered === 'settings' ? '#C9A6B2' : '#8A7380' }} />
              {!collapsed && <span className="text-[13px] font-medium" style={{ color: hovered === 'settings' ? '#D4C8D0' : '#9B8A92' }}>Settings</span>}
            </button>
          </div>
        </nav>

        {/* ─── User Profile ─── */}
        <div className="p-3">
          <div className="gold-line opacity-30 mb-3" />
          <div className={`flex items-center gap-3 p-3 rounded-2xl ${collapsed ? 'justify-center' : ''}`}
            style={{ background: 'linear-gradient(135deg, rgba(185,154,101,0.10), rgba(185,154,101,0.04))' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(145deg, #B99A65, #D4BA8A)', color: '#2E1F2A' }}>
              AV
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-sm font-semibold" style={{ color: '#F0E8EE' }}>Ananya Verma</p>
                  <p className="text-[10px] font-medium" style={{ color: '#8A7380' }}>Lead Planner</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Collapse ─── */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-8 -right-3.5 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer z-50 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #493044, #3A2536)',
            border: '1.5px solid rgba(185,154,101,0.50)',
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: '#D4BA8A' }} />
          </motion.div>
        </motion.button>

        {/* Decorative sparkle */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 opacity-15">
          <Sparkles className="w-4 h-4 animate-float" style={{ color: '#B99A65' }} />
        </div>
      </motion.aside>

      {/* Spacer */}
      <motion.div
        animate={{ width: w }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block flex-shrink-0"
      />
    </>
  );
}
