# WedPilot AI — Frontend Architecture

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **3D Graphics:** Three.js / React Three Fiber
- **Icons:** Lucide React
- **Charts:** Recharts

## Directory Structure

```
frontend/src/
├── app/                    → Next.js App Router
│   ├── layout.tsx          → Root layout (fonts, metadata)
│   ├── page.tsx            → Homepage
│   └── globals.css         → Global styles & design tokens
│
├── components/
│   ├── layout/             → Sidebar, TopNav, Footer
│   ├── navigation/         → Nav items, mobile menu
│   ├── ui/                 → Reusable UI primitives (Button, Card, Badge)
│   └── charts/             → Chart wrappers (Recharts)
│
├── features/               → Feature modules (future development)
│   ├── wedding-blueprint/
│   ├── vendor-intelligence/
│   ├── command-centre/
│   ├── disruption-engine/
│   └── financial-guest-intelligence/
│
├── lib/                    → Utility functions
├── hooks/                  → Custom React hooks
├── services/               → API client and service layer
├── types/                  → Shared TypeScript types
└── constants/              → Mock data, navigation config
```

## Design System

### Colour Tokens

All colours are defined as CSS custom properties in `globals.css` and mapped to Tailwind via configuration.

### Typography Scale

| Use Case | Font | Weight |
|----------|------|--------|
| Display headings | Cormorant Garamond | 600–700 |
| Section headings | Cormorant Garamond | 500–600 |
| Body text | Inter | 400 |
| Labels & captions | Inter | 500 |
| Numbers/stats | Inter | 600–700 |

### Animation Guidelines

- Use Framer Motion for all component animations
- Respect `prefers-reduced-motion`
- Keep animations under 500ms for interactions
- Use `staggerChildren` for card grids
- Avoid simultaneous animations on more than 3 elements

## Adding a New Feature Page

1. Create feature directory: `src/features/<name>/`
2. Build components inside the feature directory
3. Create page: `src/app/<route>/page.tsx`
4. Add navigation entry in `src/constants/navigation.ts`
5. Import and use shared components from `src/components/ui/`
