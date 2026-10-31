# WedPilot AI

> **Beyond Wedding Planning. Intelligent Wedding Resilience.**

WedPilot AI is an intelligent wedding planning and operations management platform designed for luxury wedding planning agencies. It helps wedding planners manage operations, coordinate vendors, monitor schedules, track guests, manage finances, and respond intelligently to unexpected disruptions.

---

## 🏗️ Project Architecture

```
wedpilot-ai/
│
├── frontend/          → Next.js + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/       → Next.js App Router pages
│   │   ├── components/→ Reusable UI components
│   │   ├── features/  → Feature-specific modules
│   │   ├── lib/       → Utilities and helpers
│   │   ├── hooks/     → Custom React hooks
│   │   ├── services/  → API service layer
│   │   ├── types/     → TypeScript type definitions
│   │   └── constants/ → App-wide constants and mock data
│   └── public/        → Static assets
│
├── backend/           → Django + DRF
│   ├── config/        → Django project settings
│   ├── api/           → REST API endpoints
│   └── common/        → Shared models, utilities
│
└── docs/              → Architecture documentation
```

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://localhost:8000`

## 🎨 Design System

| Purpose         | Colour            | Hex       |
|-----------------|-------------------|-----------|
| Primary Plum    | Deep Royal Plum   | `#493044` |
| Antique Gold    | Muted Antique Gold| `#B99A65` |
| Background      | Warm Ivory        | `#F7EFE8` |
| Muted Rose      | Dusty Rose        | `#C9A6B2` |
| Dark Text       | Deep Charcoal Plum| `#3D3038` |
| Card Background | Warm White        | `#FFFCF8` |
| Borders         | Soft Champagne    | `#E8DCD0` |

**Typography:**
- Headings: Cormorant Garamond
- Body: Inter

## 📋 Core Feature Modules

| Module | Description | Status |
|--------|-------------|--------|
| Wedding Blueprint | Personalised wedding planning | 🔲 Planned |
| Vendor Intelligence | Vendor comparison and selection | 🔲 Planned |
| Wedding Command Centre | Live coordination and visibility | 🔲 Planned |
| Disruption & Recovery | Operational risk management | 🔲 Planned |
| Financial & Guest Intelligence | Budget and guest management | 🔲 Planned |

## 🛠️ Adding a New Feature Module

### Frontend

1. Create a new directory in `frontend/src/features/<module-name>/`
2. Add your components, hooks, and types inside
3. Create the page in `frontend/src/app/<route>/page.tsx`
4. Add navigation entry in the sidebar constants

### Backend

1. Create a new Django app or module in `backend/api/<module-name>/`
2. Define models inheriting from `common.models.TimeStampedModel`
3. Create serializers, views, and URLs
4. Include your URLs in `backend/api/urls.py`
5. Use `common.utils.success_response` / `error_response` for consistent API responses

## 📄 License

Proprietary — WedPilot AI © 2026
