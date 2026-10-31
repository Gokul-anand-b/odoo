# WedPilot AI — System Architecture

## Overview

WedPilot AI follows a **modular monolithic architecture** with clear frontend/backend separation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                         │
│          Next.js (React + TypeScript)            │
│     ┌──────────────────────────────────┐        │
│     │  App Router (Pages & Layouts)     │        │
│     │  Components (UI, Layout, Charts)  │        │
│     │  Features (Module-specific)       │        │
│     │  Services (API Client Layer)      │        │
│     └──────────────────────────────────┘        │
└─────────────────────┬───────────────────────────┘
                      │ REST API (JSON)
                      │ http://localhost:8000/api/v1/
┌─────────────────────▼───────────────────────────┐
│                   SERVER                         │
│           Django + DRF (Python)                  │
│     ┌──────────────────────────────────┐        │
│     │  API Layer (Views, Serializers)   │        │
│     │  Business Logic (Services)        │        │
│     │  Data Layer (Models, Managers)    │        │
│     │  Common (Utils, Base Classes)     │        │
│     └──────────────────────────────────┘        │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│              PostgreSQL Database                 │
└─────────────────────────────────────────────────┘
```

## Design Principles

1. **Separation of Concerns** — Frontend and backend are independently deployable
2. **Module Independence** — Each feature module is self-contained
3. **Shared Foundation** — Common utilities, base models, and UI components are reusable
4. **API-First** — All data flows through the REST API
5. **Convention over Configuration** — Consistent patterns across all modules

## Technology Decisions

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend Framework | Next.js | SSR, App Router, performance |
| Language | TypeScript | Type safety, developer experience |
| Styling | Tailwind CSS | Rapid development, design system |
| Animation | Framer Motion | Production-quality animations |
| 3D Visuals | Three.js / R3F | Premium visual effects |
| Charts | Recharts | Composable chart components |
| Icons | Lucide React | Consistent, lightweight icons |
| Backend | Django + DRF | Rapid API development, ORM |
| Database | PostgreSQL | Relational data, JSONB support |
| API Docs | drf-spectacular | Auto-generated OpenAPI schema |

## Module Integration Guide

When adding a new feature module:

### Frontend Module Structure
```
src/features/<module-name>/
├── components/     → Module-specific components
├── hooks/          → Module-specific hooks
├── types/          → Module-specific types
├── services/       → API calls for this module
└── index.ts        → Public exports
```

### Backend Module Structure
```
api/<module-name>/
├── __init__.py
├── models.py       → Django models (inherit from common.models)
├── serializers.py  → DRF serializers
├── views.py        → DRF viewsets/views
├── urls.py         → URL patterns
├── services.py     → Business logic
└── tests.py        → Unit tests
```
