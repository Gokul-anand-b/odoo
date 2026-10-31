# WedPilot AI

> **Beyond Wedding Planning. Intelligent Wedding Resilience.**

WedPilot AI is an intelligent wedding planning and operations management platform designed for luxury wedding planning agencies. It helps wedding planners manage operations, coordinate vendors, monitor schedules, track guests, manage finances, and respond intelligently to unexpected disruptions.

---

## 🏗️ Project Architecture

```
wedpilot-ai/
├── backend/
│   ├── api/                    # Versioned API root and shared endpoints
│   ├── common/                 # Shared Django models and API response helpers
│   ├── config/                 # Main Django settings, URLs, ASGI and WSGI
│   ├── disruption_engine/      # Incidents, schedule recovery and validation
│   ├── vendor_intelligence/    # Vendor and quotation APIs
│   ├── wedding_blueprint/      # Wedding setup, schedule and blueprint APIs
│   ├── demo_config/            # Local SQLite settings and routes for demo seeds
│   └── manage.py               # Main backend entry point (config.settings)
├── frontend/
│   ├── public/                 # Static images and assets
│   └── src/
│       ├── app/                # Next.js routes and page composition
│       ├── components/         # Shared layout and UI components
│       ├── features/           # Feature-owned components, services and types
│       ├── hooks/              # Shared React hooks
│       ├── lib/                # Shared utilities
│       ├── services/           # Shared API clients
│       ├── styles/             # Global styles and design tokens
│       └── types/              # Shared TypeScript types
├── docs/                       # Project and architecture documentation
└── README.md                   # Setup instructions and project overview
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

The standard backend entry point is `backend/manage.py` and it uses
`backend/config/settings.py`. The `demo_config.settings` module reuses the main
settings but selects local SQLite for isolated demo seed scripts.

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
| Wedding Blueprint | Wedding setup, event schedule and blueprint | Implemented |
| Vendor Intelligence | Vendor directory, quotation comparison and cost insights | Implemented |
| Disruption & Recovery | Incident analysis and deterministic recovery plans | Implemented |
| Financial & Guest Intelligence | Budget, payments, guest and RSVP management | Planned |

## 🛠️ Adding a New Feature Module

### Frontend

1. Create a new directory in `frontend/src/features/<module-name>/`
2. Add your components, hooks, and types inside
3. Create the page in `frontend/src/app/<route>/page.tsx`
4. Add navigation entry in the sidebar constants

### Backend

1. Create a new Django app in `backend/<module-name>/`
2. Define models inheriting from `common.models.TimeStampedModel`
3. Create serializers, views, and URLs
4. Include your URLs in `backend/api/urls.py`
5. Use `common.utils.success_response` / `error_response` for consistent API responses

## 📄 License

Proprietary — WedPilot AI © 2026
