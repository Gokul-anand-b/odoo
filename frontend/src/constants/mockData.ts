// ═══════════════════════════════════════════════════
// WEDPILOT AI — MOCK DATA FOR HOMEPAGE
// ═══════════════════════════════════════════════════

export const statsData = [
  {
    id: 'active-weddings',
    label: 'Active Weddings',
    value: 12,
    suffix: '',
    change: '+3 this month',
    changeType: 'positive' as const,
    icon: 'calendar-heart',
  },
  {
    id: 'total-guests',
    label: 'Total Guests',
    value: 4850,
    suffix: '',
    change: '↑ 12% from last quarter',
    changeType: 'positive' as const,
    icon: 'users',
  },
  {
    id: 'active-vendors',
    label: 'Active Vendors',
    value: 86,
    suffix: '',
    change: '14 new this month',
    changeType: 'positive' as const,
    icon: 'store',
  },
  {
    id: 'pending-payments',
    label: 'Pending Payments',
    value: 18.5,
    suffix: 'L',
    prefix: '₹',
    change: '4 invoices due',
    changeType: 'warning' as const,
    icon: 'indian-rupee',
  },
];

export const upcomingWeddings = [
  {
    id: '1',
    couple: 'Arjun & Priya Sharma',
    date: '15 November 2026',
    venue: 'The Leela Palace, Udaipur',
    guests: 450,
    theme: 'Royal Heritage',
    progress: 78,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
    color: '#493044',
  },
  {
    id: '2',
    couple: 'Vikram & Ananya Mehta',
    date: '28 November 2026',
    venue: 'Taj Falaknuma Palace, Hyderabad',
    guests: 320,
    theme: 'Garden Elegance',
    progress: 62,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
    color: '#5D4157',
  },
  {
    id: '3',
    couple: 'Rohit & Kavya Kapoor',
    date: '12 December 2026',
    venue: 'Umaid Bhawan Palace, Jodhpur',
    guests: 580,
    theme: 'Mughal Grandeur',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    color: '#3D2839',
  },
];

export const featureHighlights = [
  {
    id: 'blueprint',
    title: 'Intelligent Wedding Blueprint',
    description: 'Personalised wedding planning and task organisation with AI-powered timeline management.',
    icon: 'book-open',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80',
    gradient: 'from-plum/10 to-rose/10',
  },
  {
    id: 'vendor',
    title: 'Smart Vendor Intelligence',
    description: 'Vendor comparison, quotation analysis, and intelligent selection recommendations.',
    icon: 'brain',
    image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=500&q=80',
    gradient: 'from-gold/10 to-ivory-dark/50',
  },
  {
    id: 'command',
    title: 'Dynamic Wedding Command Centre',
    description: 'Live wedding schedules, real-time coordination, and operational visibility.',
    icon: 'radio',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&q=80',
    gradient: 'from-plum/10 to-gold/5',
  },
  {
    id: 'disruption',
    title: 'Disruption & Recovery Intelligence',
    description: 'Identify operational disruptions and explore AI-powered recovery strategies.',
    icon: 'shield-alert',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=500&q=80',
    gradient: 'from-rose/10 to-plum/5',
  },
];

export const operationsData = {
  timeline: [
    { time: '09:00 AM', event: 'Venue Setup Begins', status: 'completed' as const },
    { time: '11:30 AM', event: 'Florist Arrangement Delivery', status: 'completed' as const },
    { time: '02:00 PM', event: 'Catering Team Arrival', status: 'in-progress' as const },
    { time: '04:00 PM', event: 'Sound & Lighting Check', status: 'upcoming' as const },
    { time: '06:00 PM', event: 'Guest Registration Opens', status: 'upcoming' as const },
  ],
  vendorStatus: [
    { name: 'Floral Decorations', vendor: 'Royal Blooms', status: 'Arrived', statusColor: '#4CAF50' },
    { name: 'Catering', vendor: 'Grand Feast Co.', status: 'En Route', statusColor: '#B99A65' },
    { name: 'Photography', vendor: 'Luxe Captures', status: 'Confirmed', statusColor: '#4CAF50' },
    { name: 'Music & DJ', vendor: 'Rhythm Masters', status: 'Pending', statusColor: '#C9A6B2' },
  ],
  taskProgress: {
    completed: 24,
    total: 32,
    percentage: 75,
  },
  alert: {
    type: 'warning' as const,
    title: 'Weather Advisory',
    message: 'Light rain expected between 5-7 PM. Backup indoor arrangement activated.',
    time: '15 min ago',
  },
};

export const financialData = {
  totalBudget: 4500000,
  expenses: 2875000,
  remaining: 1625000,
  paymentProgress: 64,
  monthlyExpenses: [
    { month: 'Jun', amount: 320000 },
    { month: 'Jul', amount: 450000 },
    { month: 'Aug', amount: 380000 },
    { month: 'Sep', amount: 520000 },
    { month: 'Oct', amount: 680000 },
    { month: 'Nov', amount: 525000 },
  ],
  categories: [
    { name: 'Venue & Decor', amount: 1200000, percentage: 42 },
    { name: 'Catering', amount: 750000, percentage: 26 },
    { name: 'Photography', amount: 450000, percentage: 16 },
    { name: 'Entertainment', amount: 275000, percentage: 10 },
    { name: 'Others', amount: 200000, percentage: 6 },
  ],
};

export const userData = {
  name: 'Ananya Verma',
  role: 'Lead Wedding Planner',
  avatar: 'AV',
  agency: 'WedPilot Luxury Weddings',
};
