# CLAUDE.md — ArmanCTI Project Guide

> **Comprehensive guide for AI coding assistants (Claude, Cascade, Copilot, etc.)**
> Read this file before making any changes to the ArmanCTI codebase.

---

## 1. Project Overview

**ArmanCTI** is a rebranded fork of [OpenCTI](https://opencti.io) — an open-source cyber threat intelligence platform. It allows organizations to manage their cyber threat intelligence knowledge and observables using the [STIX2 standard](https://oasis-open.github.io/cti-documentation/).

ArmanCTI extends OpenCTI with:
- **Custom branding** (Ravin Style design system — dark/black theme with blue `#019BE5`, red `#F20F0F`, purple `#860EFE` accents)
- **Twitter Monitoring Dashboard** — a new sidebar section + Home dashboard widgets that connect to an external FastAPI backend (`arman-twitter-monitoring-engine`)
- **Rebranded Chatbot** — "Ask Arman" (formerly "Ask Ariane") with Twitter monitoring context awareness


---

## 2. Repository Structure

```
ArmanCTI/
├── .circleci/                  # CircleCI configuration
├── .github/                    # GitHub config, AI instructions, issue templates, agents
│   ├── agents/                 # AI agent definitions (codebase-analyzer, locator, pattern-finder)
│   ├── instructions/           # AI coding instructions (backend, frontend, code-review)
│   └── INSTRUCTIONS_IDEAS.md   # Ideas for new AI instructions
├── opencti-platform/           # Main platform (monorepo)
│   ├── opencti-front/          # React/TypeScript frontend (Vite + Relay + MUI)
│   ├── opencti-graphql/        # Node.js/TypeScript GraphQL API server
│   ├── opencti-dev/            # Dev environment configs (Keycloak, OpenSearch, mock-api)
│   ├── Dockerfile              # Production Docker build (multi-stage)
│   └── .yarnrc.yml             # Yarn 4 config
├── opencti-worker/             # Python worker for async connector processing
├── client-python/              # Python client library (pycti)
├── docs/                       # MkDocs documentation site
├── scripts/                    # CI/deployment helper scripts
├── branding-plan.md            # Full rebranding & feature integration plan
├── TODO.md                     # Task checklist for the rebranding plan
├── package.json                # Root monorepo scripts (nx-based)
├── nx.json                     # Nx configuration
├── .yarnrc.yml                 # Root Yarn 4 config
├── .pre-commit-config.yaml     # Pre-commit hooks config
└── .codecov.yml                # Code coverage config
```

---

## 3. Tech Stack

### Frontend (`opencti-platform/opencti-front/`)
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| TypeScript | 6.x | Type safety |
| Vite | 8.x | Build tool & dev server |
| Relay | 21.x (relay-runtime) | GraphQL data fetching/caching |
| MUI (Material UI) | 6.x | Component library & theming |
| React Router | 6.x | Client-side routing |
| Formik + Yup | 2.x / 1.x | Forms & validation |
| Recharts / ApexCharts | 3.x / 4.x | Charts |
| react-intl | 7.x | i18n |
| Playwright | 1.x | E2E tests |
| Vitest | 4.x | Unit tests |
| ESLint | 10.x | Linting |

### Backend (`opencti-platform/opencti-graphql/`)
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 20 | Runtime |
| TypeScript | 6.x | Type safety |
| Apollo Server | 5.x | GraphQL API |
| Express | 5.x | HTTP server |
| ElasticSearch / OpenSearch | 8.x / 3.x | Data persistence |
| RabbitMQ | (amqplib 2.x) | Message queuing |
| Redis | (ioredis 5.x) | Cache & pub/sub |
| MinIO / S3 | (AWS SDK 3.x) | Object storage |
| Python | 3.x | Internal logic (node-calls-python) |
| Vitest | 4.x | Testing |

### Worker (`opencti-worker/`)
| Technology | Purpose |
|---|---|
| Python 3 | Async connector message processing |
| pycti | OpenCTI Python client (includes pika for RabbitMQ) |
| OpenTelemetry | Observability & metrics |

> **Note**: The worker's `requirements.txt` only lists `pycti`, `opentelemetry-api`, `opentelemetry-sdk`, and `opentelemetry-exporter-prometheus`. `pika` (RabbitMQ client) comes as a transitive dependency of `pycti`.

### Python Client (`client-python/`)
| Technology | Purpose |
|---|---|
| Python 3 | pycti library for OpenCTI API |
| requests | HTTP client |

### External Service — Twitter Monitoring Engine
| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API for tweet ingestion, processing, and search |
| PostgreSQL | Tweet/article storage |
| STIX2 | Threat intelligence bundle generation |

---

## 4. Build & Development Commands

### Root (monorepo via Nx)
```bash
yarn install              # Install all dependencies
yarn deps                 # Same as above (nx target)
yarn dev                  # Start all dev servers
yarn build                # Production build all packages
yarn test                 # Run all tests
yarn lint                 # Lint all packages
yarn graphql              # Generate GraphQL schema & types
```

### Frontend (`opencti-platform/opencti-front/`)
```bash
yarn install              # Install frontend deps
yarn relay                # Generate Relay artifacts (run after GraphQL changes)
yarn dev                  # Start Vite dev server (port 3000)
yarn build                # Production build (relay + esbuild)
yarn build:standalone     # Build keeping source maps
yarn test                 # Run Vitest unit tests
yarn test:e2e             # Run Playwright E2E tests
yarn lint                 # ESLint
yarn check-ts             # TypeScript type checking
yarn i18n-checker         # Verify i18n translation completeness
```

### Backend (`opencti-platform/opencti-graphql/`)
```bash
yarn install              # Install backend deps
yarn install:python       # Install Python dependencies
yarn build:dev            # Dev build (generates schema)
yarn build:prod           # Production build
yarn build:schema         # Generate GraphQL schema & TypeScript types
yarn start                # Start dev server
yarn start:light          # Start without rebuild
yarn check-ts             # TypeScript type checking
yarn lint                 # ESLint
yarn test                 # Integration tests (requires running platform)
yarn test:ci-unit         # CI unit tests
yarn test:ci-integration  # CI integration tests
yarn migrate:add          # Create new database migration
```

### Worker (`opencti-worker/`)
```bash
pip install -r src/requirements.txt    # Install deps
python src/worker.py                    # Start worker
```

### Important Notes
- **Yarn 4.x** is used via corepack. Run `corepack enable` if needed.
- **Node ≥ 20** required.
- Backend requires **ElasticSearch/OpenSearch, Redis, RabbitMQ, MinIO** running.
- Use `NODE_OPTIONS=--max_old_space_size=8192` if build OOMs.
- Run `yarn relay` in frontend after any GraphQL fragment/query changes.
- Run `yarn build:schema` in backend after GraphQL schema changes.

---

## 5. Frontend Architecture

### Directory Layout
```
opencti-platform/opencti-front/src/
├── app.tsx                      # App entry point
├── front.tsx                    # Front rendering
├── components/                  # Shared components
│   ├── ThemeDark.ts             # ArmanCTI dark theme (Ravin Style colors)
│   ├── ThemeLight.ts            # ArmanCTI light theme
│   ├── AppThemeProvider.tsx     # Theme provider
│   ├── i18n.jsx                 # i18n provider & formatter
│   ├── dashboard/               # Reusable dashboard widgets
│   ├── dataGrid/                # Data table components
│   ├── graph/                   # Graph visualization
│   └── ...                      # Form fields, filters, etc.
├── private/                     # Authenticated app (behind login)
│   ├── Index.tsx                # Main router (all private routes)
│   ├── components/
│   │   ├── nav/                 # LeftBar, TopBar navigation
│   │   ├── chatbox/             # "Ask Arman" chatbot
│   │   ├── twitter-monitor/     # Twitter Monitoring dashboard (NEW)
│   │   ├── analyses/            # Reports, groupings, notes
│   │   ├── cases/               # Case management
│   │   ├── threats/             # Threat actors, intrusion sets
│   │   ├── arsenal/             # Malware, tools, channels
│   │   ├── techniques/          # Attack patterns, courses of action
│   │   ├── entities/            # Sectors, systems, events, etc.
│   │   ├── observations/        # Indicators, infrastructures
│   │   ├── data/                # Data ingestion, connectors, sharing
│   │   ├── settings/            # Platform settings
│   │   ├── workspaces/          # Custom dashboards & investigations
│   │   └── ...
│   └── __generated__/           # Relay generated artifacts (DO NOT EDIT)
├── public/                      # Public (pre-login) components
│   └── components/login/        # Login page
├── relay/                       # Relay environment setup
├── schema/                      # GraphQL schema (generated)
├── static/                      # Static assets (images, icons, logos)
└── utils/                       # Utilities & hooks
```

### Component Hierarchy Pattern
- **Root** → **List** → **Line** | **Card**
- Modern pattern: List + Line fragments are **co-located in a single file** and rendered via `<DataTable>`.
- Separate `*Lines.tsx`/`*Line.tsx` file pairs are legacy — do not create new ones.
- Each level composes Relay fragments of its children.

### Data Fetching (Relay)
- **Fragment Colocation**: Define data requirements alongside components.
- **Naming Convention**: `ComponentName_propName`.
- Use `useFragment` for fragment components.
- Use `usePreloadedQuery`, `useLazyLoadQuery`, or `usePreloadedPaginationFragment` for query roots.
- **Store Updates**: Mutations must use `updater` functions (e.g., `insertNode` from `utils/store`).
- **Always run `yarn relay` after modifying GraphQL.**

### Styling (MUI)
- Stick to the theme provided by `ThemeDark.ts` / `ThemeLight.ts`.
- **New code**: prefer `sx` prop for inline styles or `styled()` for reusable components.
- **Legacy code**: many files use `makeStyles` from `@mui/styles` — leave in place, do not migrate.
- Ensure dark mode compatibility (ArmanCTI is heavily dark-mode focused).

### Forms & Validation
- **Stack**: Formik + Yup.
- **Hooks**: `useApiMutation` for submitting.
- **UI**: Wrap forms in `Drawer` components for creation flows.

### Routing Chain
- `src/app.tsx` → `BrowserRouter` mounts `PrivateRoot` at `/dashboard/*`
- `src/private/Root.tsx` → `PrivateRoot` renders `Index.tsx` (after auth/settings checks)
- `src/private/Index.tsx` → Defines all private routes (relative to `/dashboard/`)
- Routes are lazy-loaded via `React.lazy()` + `Suspense`
- Route paths in `Index.tsx` are relative: `/analyses/*`, `/threats/*`, `/cases/*`, etc.
- Full paths become: `/dashboard/analyses/*`, `/dashboard/threats/*`, etc.
- **Twitter Monitor route (`/twitter-monitor/*`) is NOT yet registered in `Index.tsx`** — must be added

### i18n
- Uses `react-intl` with `t_i18n()` function from `src/components/i18n.jsx`.
- Translation files in `src/lang/front/`.
- New keys auto-resolve to the string if no translation exists.
- Run `yarn i18n-checker` to verify translation completeness.

### Vite Configuration
- Dev server on port 3000.
- Proxy configuration in `vite.config.mts`:
  - `/graphql` → backend GraphQL API
  - `/chatbot` → chatbot backend
  - `/twitter-api` → Twitter Monitoring FastAPI (`http://localhost:3000/api` by default, configurable via `TWITTER_API_URL` env var)
  - `/auth`, `/storage`, `/stream`, `/schema`, `/taxii2`, `/feeds` → backend
- HTML transform sets `%APP_TITLE%` → `"ArmanCTI"` and `%APP_DESCRIPTION%` → `"ArmanCTI Platform"`.

### Relay Configuration
- Relay compiler config in `relay.config.json`
- Run `yarn relay` after any GraphQL fragment/query changes
- Generated artifacts in `src/private/__generated__/` (DO NOT EDIT)
- Schema file: `src/schema/` (generated from backend)

### GraphQL Codegen (Backend)
- Config in `opencti-graphql/graphql-codegen.yml`
- Run `yarn build:schema` to generate schema + TypeScript types

---

## 6. Backend Architecture

### Directory Layout
```
opencti-platform/opencti-graphql/src/
├── back.js                     # Entry point (compiled)
├── boot.js                     # Boot sequence
├── config/                     # Configuration (NODE_ENV based)
├── schema/                     # GraphQL schema definitions
├── resolvers/                  # GraphQL resolvers
├── domain/                     # Business logic & service layer
├── modules/                    # Self-contained domain modules
│   └── <entity>/               # Each module: schema, resolvers, converter, domain
├── database/                   # Database connectors (ES, Redis, MinIO)
├── migrations/                 # Database migration scripts
├── connector/                  # Connector management
├── manager/                    # Background managers (sync, task, etc.)
├── graphql/                    # GraphQL server setup
├── http/                       # HTTP middleware & routes
├── python/                     # Python scripts (called via node-calls-python)
├── parser/                     # STIX pattern parser (ANTLR)
├── rules/                      # Business rules engine
├── stixpattern/                # STIX pattern grammar
├── types/                      # TypeScript type definitions
└── utils/                      # Utilities
```

### Module Pattern
Each domain module in `src/modules/` is self-contained:
- **Schema**: GraphQL type definitions
- **Resolvers**: GraphQL field resolvers
- **Converter**: STIX ↔ internal model conversion
- **Domain**: Business logic

### Key Dependencies
- **Apollo Server** for GraphQL API
- **ElasticSearch/OpenSearch** for data persistence
- **RabbitMQ** for message queuing (connector ingestion)
- **Redis** for caching & GraphQL subscriptions
- **MinIO/S3** for file storage
- **Python** integration via `node-calls-python` for some internal logic

---

## 7. ArmanCTI Branding & Design System

### Color Palette (Ravin Style)

#### Dark Theme (`ThemeDark.ts`)
| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Paper | `#141414` |
| Primary | `#019BE5` (Blue) |
| Secondary | `#F20F0F` (Red) |
| Accent | `#1a1a1a` |
| Text | `#FFFFFF` |
| Nav | `#0a0a0a` |
| Dialog Background | `#1A1A1A` |
| Purple Accent | `#860EFE` |
| Gradient (focus) | `linear-gradient(90deg, #019BE5 0%, #860EFE 100%)` |
| Gradient (ia) | `linear-gradient(90deg, #860EFE 0%, #F20F0F 100%)` |

Background scale: `#0A0A0A` → `#141414` → `#1A1A1A` → `#262626` → `#333333`
Border scale: `#262626` → `#404040` → `#1A1A1A`

#### Light Theme (`ThemeLight.ts`)
| Token | Value |
|---|---|
| Background | `#F5F5F5` |
| Paper | `#FFFFFF` |
| Primary | `#019BE5` |
| Secondary | `#F20F0F` |
| Text | `#0A0A0A` |
| Nav | `#FFFFFF` |
| Borders | `#E5E5E5` / `#D4D4D4` |

### Brand Assets
- Logos in `opencti-platform/opencti-front/src/static/images/`
- Favicon: `favicon.png`
- Manifest: `src/static/ext/manifest.json` (`"name": "ArmanCTI Platform"`, `"theme_color": "#019BE5"`)
- Document title: Set via `platform_title` GraphQL setting (server-side) or Vite HTML transform (dev: `"ArmanCTI"`)

### Brand Text Rules
- **Replace** "OpenCTI" → "ArmanCTI" in UI-visible strings (page titles, alt texts, labels)
- **Replace** "Filigran" → "ArmanCTI" in UI-visible footer/branding strings
- **Replace** "Ask Ariane" → "Ask Arman"
- **Do NOT replace** in: license headers, copyright notices, internal API paths (`/chatbot`, `/graphql`), GraphQL fragment/type names, NPM package names (`@filigran/chatbot` etc.)

---

## 8. Twitter Monitoring Dashboard

### Overview
A new sidebar section + Home dashboard widgets that connect to an external FastAPI backend (`arman-twitter-monitoring-engine`). This feature bypasses Relay/GraphQL entirely — it uses direct REST API calls via a Vite dev proxy.

### Architecture
```
Frontend (React)  →  Vite Proxy /twitter-api  →  FastAPI Backend (host :3000 → container :8000/api)
                                                    ↓
                                                 PostgreSQL
                                                    ↓
                                                 STIX2 Bundles → OpenCTI
```

> **Note**: The FastAPI dashboard runs on port 8000 internally, exposed as `${DASHBOARD_PORT:-3000}:8000` on the host. The Vite proxy targets `http://localhost:3000` (host-exposed port) and rewrites `/twitter-api` → `/api`.

### API Proxy
- **Dev**: Vite proxy in `vite.config.mts` — `/twitter-api` → `http://localhost:3000/api` (configurable via `TWITTER_API_URL` env var)
- **Production**: Configure nginx/reverse proxy: `location /twitter-api/ { proxy_pass http://<twitter-engine-host>:3000/api/; }`
- **CORS**: Already configured in FastAPI backend (`allow_origins=["*"]`)

### Frontend Components
**Directory**: `opencti-platform/opencti-front/src/private/components/twitter-monitor/`

| File | Purpose |
|---|---|
| `Root.tsx` | Router for sub-routes (Overview, Recent, Search, Stats, Tweet Detail) |
| `TwitterMonitorApi.ts` | Type-safe REST API client (fetch wrapper with error handling) |
| `TwitterMonitorOverview.tsx` | Dashboard overview (stat cards, hourly chart, recent tweets, source distribution) |
| `RecentTweetsTable.tsx` | Paginated, filterable tweet table (tier/status/author/hashtag/date filters) |
| `TweetSearch.tsx` | Full-text search with field selector and match highlighting |
| `TwitterStatsCharts.tsx` | Statistics visualizations (hourly ingestion, processing donut, tier distribution) |
| `TweetDetail.tsx` | Single tweet detail (full text, media, articles, STIX bundle, IOCs/CVEs/TTPs) |
| `TwitterStatsCard.tsx` | Reusable stat card widget (icon + label + value, loading skeleton) |

### API Endpoints (via `/twitter-api` proxy)
| Endpoint | Method | Returns |
|---|---|---|
| `/recent-tweets` | GET | `RecentTweetsResponse` (paginated, filterable) |
| `/stats` | GET | `TwitterStats` (aggregate counters) |
| `/hourly-stats?hours=N` | GET | `HourlyStat[]` (ingestion timeline) |
| `/search?q=...&field=...` | GET | `SearchResponse` (full-text search) |
| `/tweets/{tweet_id}` | GET | `TweetDetail` (extended fields) |
| `/articles/by-tweet/{tweet_id}` | GET | `Article[]` (enriched articles) |
| `/articles/{article_id}` | GET | `Article` (single article) |
| `/tweet-media/by-tweet/{tweet_id}` | GET | `TweetMedia[]` (media attachments) |
| `/stix-bundle/{tweet_id}` | GET | STIX bundle JSON |
| `/tweet-sources` | GET | `string[]` (source list) |
| `/tweet-hashtags` | GET | `string[]` (hashtag list) |
| `/article-categories` | GET | `string[]` (category list) |

### TypeScript Interfaces
Key types defined in `TwitterMonitorApi.ts`:
- `Tweet` — basic tweet data
- `TweetDetail` — extends Tweet with media_urls, urls, raw_envelope, report_title, created_at
- `RecentTweetsResponse` — { total, items }
- `TwitterStats` — 12 aggregate counters (total, processed, recent, dead letters, bundles, suspended)
- `HourlyStat` — { hour, count }
- `SearchResponse` — { total, items (with match_hint), query, field }
- `Article` — enriched article with CVEs, TTPs, IOCs, malware_names, actor_names, key_findings
- `TweetMedia` — { id, tweet_id, media_url, media_type }

### Routes
Defined in `Root.tsx` (but **NOT reachable** until parent route is registered in `Index.tsx`):

| Path | Component |
|---|---|
| `/dashboard/twitter-monitor` | `TwitterMonitorOverview` |
| `/dashboard/twitter-monitor/recent` | `RecentTweetsTable` |
| `/dashboard/twitter-monitor/search` | `TweetSearch` |
| `/dashboard/twitter-monitor/stats` | `TwitterStatsCharts` |
| `/dashboard/twitter-monitor/tweet/:tweetId` | `TweetDetail` |

### Navigation (planned — NOT yet implemented)
- LeftBar entry to be added after "Investigations" with sub-items: Overview, Recent Tweets, Search, Statistics
- Wrapped in `<Security needs={[KNOWLEDGE]}>` for access control
- Icon: Use `RssFeedOutlined` from `@mui/icons-material` (MUI `Twitter` icon removed in v6+)

### Home Dashboard Widgets (planned — NOT yet implemented)
To be added to `HomeDashboard.jsx`:
1. **Twitter Stats Card Row** — 4 stat cards (Total Tweets, Processed 24h, Recent 1h, Dead Letters)
2. **Recent Tweets Mini Table** — Latest 5 tweets
3. **Hourly Ingestion Mini Chart** — Compact 24h area chart

### Charting Dependency Warning
The Twitter Monitor components (`TwitterMonitorOverview.tsx`, `TwitterStatsCharts.tsx`) import from `chart.js` and `react-chartjs-2`, but **these packages are NOT declared in `package.json`**. They must be added before the components will compile:
```bash
cd opencti-platform/opencti-front
yarn add chart.js react-chartjs-2
```
Alternatively, refactor components to use the existing `recharts` or `apexcharts` libraries already in the project.

### Error Handling
- All API functions use `safeFetch()` wrapper that catches errors and returns empty defaults
- Components should display loading skeletons and handle API-unreachable states gracefully
- FastAPI returns empty arrays/objects when PostgreSQL is unavailable
- `TwitterMonitorOverview.tsx` auto-refreshes data every 30 seconds via `setInterval`

---

## 9. Chatbot ("Ask Arman")

### Files
| File | Purpose |
|---|---|
| `src/private/components/chatbox/AskArianeButton.tsx` | Floating action button (rebranded "Ask Arman") |
| `src/private/components/chatbox/AskArianePanel.tsx` | Side panel with chat UI + Twitter monitoring context |
| `src/private/components/chatbox/ChatbotManager.ts` | Chatbot configuration (title, avatar, colors, welcome message) |
| `src/private/components/chatbox/ChatbotContext.tsx` | React context + localStorage state management |
| `src/private/components/chatbox/CtemCommandCenterButton.tsx` | CTEM button (rebrand or remove) |
| `src/private/components/nav/TopBar.tsx` | Renders chatbot buttons in top bar |

### Rebranding Changes
- "Ask Ariane" → "Ask Arman" in all UI strings
- `LogoXtmOneIcon` → ArmanCTI emblem
- `accentColor` → `theme.palette.primary.main` (`#019BE5`)
- `titleBackgroundColor` → `linear-gradient(90deg, #019BE5 0%, #860EFE 100%)`
- `footer.company` → "ArmanCTI"
- localStorage keys: `arianeChat*` → `armanChat*` (with migration logic)
- Prompt suggestions: Twitter monitoring-focused ("Show me recent threat tweets", "What are the latest IOCs?", etc.)

### Twitter Monitoring Context
When user is on `/dashboard/twitter-monitor`, the chatbot panel includes Twitter stats in `pageContext` for AI awareness.

---

## 10. Features to Implement

### Completed / In Progress
Refer to `TODO.md` for the detailed checklist. Summary of phases:

### Phase 1: Theme & Brand Colors (done)
- `ThemeDark.ts` updated with Ravin Style colors ✅
- `ThemeLight.ts` updated with ArmanCTI colors ✅
- `AppThemeProvider.tsx` default theme constants — verify if needed

### Phase 2: Logo & Brand Assets
- Replace all logo SVGs/PNGs in `src/static/images/`
- Update login page (`LoginLayout.tsx`, `LoginLogo.tsx`)
- Update LeftBar footer (`LeftBar.jsx`)
- Update favicon, manifest, Vite HTML transform

### Phase 3: Chatbot Rebranding + Extension
- Rebrand "Ask Ariane" → "Ask Arman" across all chatbox components
- Add Twitter monitoring context to chatbot panel
- Migrate localStorage keys with backward compatibility

### Phase 4: Twitter Monitoring Dashboard (partially done)
- API service layer (`TwitterMonitorApi.ts`) ✅
- Root component with routing ✅
- All 6 UI components created ✅ (Overview, RecentTweetsTable, TweetSearch, TwitterStatsCharts, TweetDetail, TwitterStatsCard)
- **`chart.js` / `react-chartjs-2` NOT in `package.json`** — components won't compile without adding deps
- Route NOT registered in `Index.tsx` — **must add** `<Route path="/twitter-monitor/*" element={boundaryWrapper(RootTwitterMonitor)} />`
- LeftBar navigation entry NOT added — **must add** to `LeftBar.jsx`
- Home dashboard widgets NOT added — **must add** to `HomeDashboard.jsx`

### Phase 5: Remove/Hide Unwanted UI Components
- Remove Filigran branding from LeftBar footer
- Optionally remove XTM Hub, PIR navigation entries
- Remove/rebrand "Filigran Experience" from Settings

### Phase 6: Global Brand Text Updates
- Search & replace "OpenCTI" → "ArmanCTI" in UI strings
- Search & replace "Filigran" → "ArmanCTI" in UI footer/branding
- Update `manifest.json`, `vite.config.mts` HTML transform

### Implementation Order
1. Phase 1 — Theme colors (foundation)
2. Phase 2 — Logo & brand assets (visual identity)
3. Phase 6 — Global brand text (quick wins)
4. Phase 5 — Remove unwanted components (cleanup)
5. Phase 4 — Twitter Monitoring dashboard (largest effort)
6. Phase 3 — Chatbot rebranding + extension (final polish)

---

## 11. Code Conventions

### General
- **No comments or documentation** unless explicitly requested by the user.
- Prefer minimal, focused edits. Follow existing code style.
- Do not invent new top-level deps, services, or schema fields without asking the user first.
- Do not over-engineer — use single-line changes when sufficient.

### Frontend
- **File naming**: PascalCase for components (`.tsx`/`.jsx`), camelCase for utilities
- **Imports**: Use `@components/` path alias for shared components, relative paths for local
- **Components**: Functional components with hooks only (no class components)
- **Do not** wrap list row (`*Line`) components in `React.memo`
- **Relay**: Always run `yarn relay` after GraphQL changes. Never edit `__generated__/` files.
- **Styling**: Use `sx` prop or `styled()`. Do not introduce new `makeStyles`.
- **i18n**: All UI strings must use `t_i18n()` from `useFormatter()`
- **Types**: Strict TypeScript. Interfaces for API responses, types for unions.

### Backend
- **Modules**: Self-contained in `src/modules/<entity>/` with schema, resolvers, converter, domain
- **Migrations**: Use `yarn migrate:add` to create new migrations
- **Schema**: Run `yarn build:schema` after GraphQL schema changes
- **Python**: Some internal logic uses Python via `node-calls-python` — run `yarn install:python`

### Testing
- **Frontend**: Vitest for unit tests, Playwright for E2E
- **Backend**: Vitest with multiple config files (unit, integration, CI)
- Design tests before major implementation work
- Never delete or weaken tests without explicit direction

---

## 12. Key Files Reference

| File | Purpose |
|---|---|
| `opencti-platform/opencti-front/src/components/ThemeDark.ts` | ArmanCTI dark theme definition |
| `opencti-platform/opencti-front/src/components/ThemeLight.ts` | ArmanCTI light theme definition |
| `opencti-platform/opencti-front/src/components/Theme.d.ts` | Theme type definitions (`ExtendedThemeOptions`) |
| `opencti-platform/opencti-front/src/components/AppThemeProvider.tsx` | Theme provider & defaults |
| `opencti-platform/opencti-front/src/app.tsx` | Top-level router (`/dashboard/*` → PrivateRoot) |
| `opencti-platform/opencti-front/src/private/Index.tsx` | Main router (all private routes) |
| `opencti-platform/opencti-front/src/private/components/nav/LeftBar.jsx` | Sidebar navigation |
| `opencti-platform/opencti-front/src/private/components/nav/TopBar.tsx` | Top navigation bar |
| `opencti-platform/opencti-front/src/private/components/HomeDashboard.jsx` | Home dashboard with widgets |
| `opencti-platform/opencti-front/src/private/components/chatbox/` | Chatbot components |
| `opencti-platform/opencti-front/src/private/components/twitter-monitor/` | Twitter Monitoring dashboard |
| `opencti-platform/opencti-front/vite.config.mts` | Vite config (proxy, HTML transform) |
| `opencti-platform/opencti-front/src/static/ext/manifest.json` | PWA manifest |
| `opencti-platform/opencti-graphql/src/schema/` | GraphQL schema definitions |
| `opencti-platform/opencti-graphql/src/resolvers/` | GraphQL resolvers |
| `opencti-platform/opencti-graphql/src/modules/` | Domain modules |
| `opencti-platform/opencti-graphql/config/` | Server configuration |
| `opencti-platform/opencti-front/relay.config.json` | Relay compiler configuration |
| `opencti-platform/opencti-graphql/graphql-codegen.yml` | GraphQL codegen configuration |
| `branding-plan.md` | Full rebranding & feature plan |
| `TODO.md` | Implementation task checklist |

---

## 13. Technical Considerations

- **API CORS**: Already configured in Twitter Monitoring FastAPI backend (`allow_origins=["*"]`). No backend change needed.
- **API URL**: Vite proxy handles dev. For production, configure nginx reverse proxy.
- **Relay/GraphQL**: Twitter Monitoring bypasses Relay entirely — direct REST calls via `fetch()`. No GraphQL schema changes needed.
- **Authentication**: Twitter Monitoring API currently has no auth. Consider adding API key or JWT for production.
- **Error Handling**: All Twitter Monitor components handle API unreachable states with error boundaries, loading skeletons, and `safeFetch()` fallbacks.
- **Security**: Twitter Monitor wrapped in `<Security needs={[KNOWLEDGE]}>` — all authenticated users with KNOWLEDGE access can view it.
- **MUI Icons**: `Twitter` icon removed in MUI v6+. Use `RssFeedOutlined` or custom SVG.
- **Environment Variables**: `TWITTER_API_URL` for Vite proxy target (server-side only, not exposed to client).
- **Testing**: Verify theme in both dark/light modes. Test Twitter Monitor with API running and down.

---

## 14. AI Instruction Files

The project includes structured AI instructions in `.github/instructions/`:

| File | Scope |
|---|---|
| `.github/instructions/ai-instructions-architecture.md` | Instruction system architecture guide |
| `.github/instructions/backend.instructions.md` | Backend patterns (`opencti-graphql/**`) |
| `.github/instructions/frontend/patterns/component-structure.md` | Frontend component hierarchy |
| `.github/instructions/frontend/patterns/components.md` | Component conventions |
| `.github/instructions/frontend/patterns/forms-validation.md` | Formik + Yup patterns |
| `.github/instructions/frontend/patterns/relay-data-fetching.md` | Relay data fetching patterns |
| `.github/instructions/frontend/patterns/styling-mui.md` | MUI styling conventions |
| `.github/instructions/code-review.instructions.md` | Code review checklist |

**Read the relevant instruction file before touching related code.**

---

## 15. CI/CD & Tooling

### CI/CD
- **CircleCI**: `.circleci/config.yml` — primary CI pipeline
- **GitHub Actions**: `.github/workflows/` — additional workflows (CodeQL, etc.)
- **Code Coverage**: `.codecov.yml` — Codecov configuration

### Pre-commit Hooks
- `.pre-commit-config.yaml` at root — runs on commit
- Includes linting, formatting checks

### GitHub AI Agents
`.github/agents/` contains AI agent definitions:
- `codebase-analyzer.agent.md` — analyzes codebase structure
- `codebase-locator.agent.md` — locates code in codebase
- `codebase-pattern-finder.agent.md` — finds patterns in codebase

### Renovate
- `renovate.json5` — automated dependency update configuration

---

## 16. Docker & Deployment

### Docker Build
```bash
docker build -t armancti/platform -f opencti-platform/Dockerfile .
```

Multi-stage build:
1. `graphql-deps-builder` — Install backend dependencies
2. `graphql-builder` — Build backend
3. `front-builder` — Build frontend
4. `app` — Final image (Node.js + Python)

### Runtime Requirements
- Node.js ≥ 20
- Python 3
- ElasticSearch or OpenSearch
- Redis
- RabbitMQ
- MinIO (or S3-compatible storage)

### Dev Environment
Docker Compose configs in `opencti-platform/opencti-dev/`:
- Keycloak for auth
- OpenSearch for search
- Mock API for testing

---

## 17. Common Issues & Solutions

| Issue | Solution |
|---|---|
| Missing Python deps | Run `yarn install:python` in `opencti-graphql/` |
| Build OOM | `NODE_OPTIONS=--max_old_space_size=8192` |
| GraphQL schema mismatch | Run `yarn build:schema` in backend |
| Relay artifacts stale | Run `yarn relay` in frontend |
| Twitter Monitor API unreachable | Check FastAPI backend running on host port 3000 (container port 8000), Vite proxy config |
| Twitter Monitor won't compile | `chart.js` and `react-chartjs-2` not in package.json — run `yarn add chart.js react-chartjs-2` |
| Twitter Monitor route 404 | Route `/twitter-monitor/*` not registered in `Index.tsx` — must add lazy import + `<Route>` |
| Twitter Monitor not in sidebar | LeftBar entry not added to `LeftBar.jsx` — must add `<LeftBarItem>` |
| Twitter Monitor not on Home | Widgets not added to `HomeDashboard.jsx` — must implement |
| MUI Twitter icon missing | Use `RssFeedOutlined` or custom SVG (MUI v6+ removed Twitter icon) |
| localStorage migration | Chatbot keys `arianeChat*` → `armanChat*` with migration logic |
| Brand text in wrong places | Do NOT replace in license headers, API paths, GraphQL types, NPM package names |

---

## Design Context

This project has an Impeccable design system. Two root-level files govern all visual and strategic decisions:

- **`PRODUCT.md`** — Strategic context: register (brand, dual with product), target users, product purpose, brand personality (bold, precise, modern), anti-references (generic SaaS, original OpenCTI look, AI-generated aesthetic), design principles, current state (rebranding in progress), and accessibility target (WCAG 2.1 AA).
- **`DESIGN.md`** — Visual system: Ravin Style color palette (Electric Blue `#019BE5`, Signal Red `#F20F0F`, Violet Accent `#860EFE`), typography (Geologica headings, IBM Plex Sans body), elevation (flat + tonal layering), component specs, and Do's/Don'ts. Includes machine-readable YAML frontmatter with design tokens. Note: the Ravin Style palette is the target spec — theme files still contain original OpenCTI colors and must be updated.

When making UI changes, consult these files first. `DESIGN.md` wins on visual decisions; `PRODUCT.md` wins on strategic/voice decisions. Run `/impeccable live` to iterate visually in the browser.
