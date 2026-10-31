import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Radio,
  ShieldAlert,
  Wallet,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  isActive?: boolean;
  badge?: string;
}

export const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/',
    isActive: true,
  },
  {
    id: 'wedding-blueprint',
    label: 'Wedding Blueprint',
    icon: BookOpen,
    href: '/wedding-blueprint',
  },
  {
    id: 'vendor-intelligence',
    label: 'Vendor Intelligence',
    icon: Brain,
    href: '/vendor-intelligence',
    badge: 'AI',
  },
  {
    id: 'command-centre',
    label: 'Wedding Command Centre',
    icon: Radio,
    href: '/command-centre',
  },
  {
    id: 'disruption-recovery',
    label: 'Disruption & Recovery',
    icon: ShieldAlert,
    href: '#',
  },
  {
    id: 'financial-guest',
    label: 'Financial & Guest Intelligence',
    icon: Wallet,
    href: '#',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '#',
  },
];
