# Copilot Instructions for SelNexa Health Website

## Project Overview
SelNexa Health combines a **hybrid architecture** serving a healthcare platform: static HTML pages handle marketing/content, while a **React SPA** (`src/`) powers interactive features (patient portals, dashboards, telemedicine). This enables SEO-friendly static content alongside modern, feature-rich applications.

## Architecture Essentials

### Dual-Stack Design
- **Static Layer** (root HTML files): Marketing, blogs, resources—no build required; edit directly
- **React SPA** (`src/main.jsx` → `src/App.jsx`): Telemedicine, appointments, patient portals, analytics—Vite bundled
- **Legacy JS** (`js/*.js`): Chatbot, calculators for static pages; keep isolated from React logic
- **Styling**: Tailwind CSS for SPA (`tailwind.config.js`), custom CSS (`css/*.css`) for static pages

### Key Directories
- `src/pages/`: Dashboard, Appointments, PatientPortal, Telemedicine, Analytics, Settings, Login
- `src/components/`: Layout (Header, Footer), Auth (ProtectedRoute), common (NotificationSystem), DashboardMockups
- `src/store/`: State management (authStore, appointmentStore) using Zustand + persist middleware
- `solutions/`, `blog/`, `resources/`: Static content directories

## Critical Workflows

### React SPA Development
```bash
npm install          # First-time setup
npm run dev         # Vite dev server (port 3000)
npm run build       # Produces dist/ for deployment
```

**Build System**: Vite (`vite.config.js`):
- React Fast Refresh enabled
- Port: 3000 (localhost)
- Build output: `dist/`
- Source maps: enabled for debugging

### Authentication & State
- **authStore** (`src/store/authStore.js`): Zustand + persist middleware → persists `isAuthenticated`, `user`, `token` to localStorage
- **ProtectedRoute** (`src/components/auth/ProtectedRoute.jsx`): Redirects unauthenticated users to `/login`
- **Login flow**: Email/password → simulated API `/api/auth/login` → stores auth state → navigates to `/dashboard`

### Routing Pattern
```jsx
// src/App.jsx establishes all routes
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// Each page lives in src/pages/PageName.jsx
```

## Design & Styling Conventions

### Tailwind Color System (`tailwind.config.js`)
- **Primary Red** (medical/healthcare): `primary-600` (#dc2626)
- **Secondary Teal** (innovation): `secondary-600` (#238a7a)
- **Accent Orange**: `accent-500` (#f77f00)
- Custom animations: `fade-in`, `slide-up`, `pulse-slow`

### Component Patterns
- **Functional Components + Hooks** only (no class components)
- **Motion Animations**: Framer Motion (`motion.div`) for page transitions and micro-interactions
- **Icon Library**: Lucide React (`lucide-react`) for consistent iconography
- **State Management**:
  - Local state: `useState()` for UI toggles (tabs, modals)
  - Global state: Zustand stores for auth, appointments
  - Server queries: React Query configured in `src/main.jsx`

### Example Component Structure
```jsx
// src/pages/PatientPortal.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, FileText } from 'lucide-react'
// Sidebar nav + tab-based content render pattern
const [activeTab, setActiveTab] = useState('overview')
const tabs = [{ id: 'overview', label: 'Overview', icon: Activity }, ...]
```

## Page-Specific Behaviors

| Page | Auth Required | Key Features |
|------|---------------|--------------|
| **Dashboard** | ✓ | Stats grid, notifications (Activity, Alert, CheckCircle), search/filter |
| **Appointments** | ✓ | React Calendar widget, list/calendar view toggle, date filtering |
| **Telemedicine** | ✓ | Video call UI (start/end), session history table, call status state |
| **PatientPortal** | ✓ | Multi-tab interface (records, medications, appointments), medical history |
| **Analytics** | ✓ | Recharts (LineChart, BarChart, PieChart), time range picker (30d, 90d, etc.) |
| **Settings** | ✓ | Profile, notifications, security, appearance tabs with form controls |
| **Home** | ✗ | Static hero, stats section, features, no auth required |
| **Login** | ✗ | Form validation, error/success messages, redirect to `/dashboard` on success |

## Embed System (Static Site Integration)

The SPA can be embedded into static pages via `embed.tsx`:
```html
<div class="selnexa-dashboard-embed" data-type="patient"></div>
<script src="dist/embed.js"></script>
```
Supported types: `patient`, `provider`, `admin` (mapped in `COMPONENT_MAP`)

## Critical Integration Points
- **Service Worker** (`sw.js`): Offline support; cache strategies for static assets
- **Manifest** (`manifest.json`): PWA metadata (name, icons, theme color)
- **SEO Files**: `sitemap.xml`, `robots.txt` in root; structured data in static HTML
- **Performance**: Core Web Vitals optimized—lazy loading, optimized animations, no render-blocking assets

## Don't Mix: Separation of Concerns
- ❌ Don't import legacy JS (`js/chatbot.js`) into React components
- ❌ Don't directly modify DOM in React (use state/refs)
- ❌ Don't add new Tailwind classes without checking `tailwind.config.js` color system
- ✓ Do create new pages in `src/pages/`, register in `src/App.jsx`
- ✓ Do add global state to `src/store/` using Zustand pattern (import { create } from 'zustand')
- ✓ Do style with Tailwind utility classes (avoid inline CSS)

## Common Patterns
- **Tab Navigation**: `activeTab` state + `renderTabContent()` switch; see Settings, PatientPortal
- **Search/Filter**: Local `useState()` for query string; filter arrays inline
- **Notifications**: NotificationSystem component globally integrated; toast-style UI
- **Loading States**: `loading` boolean in store; show spinner or skeleton during fetch
- **Animations**: Framer Motion `motion.div` with `initial`, `animate`, `transition` props for entrance effects

---
**Last Updated**: January 2026 | **Architecture**: Vite React SPA + Static HTML hybrid
