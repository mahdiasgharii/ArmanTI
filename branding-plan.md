# ArmanCTI UI Rebranding & Feature Integration Plan

## Overview

This plan covers rebranding the OpenCTI frontend to "ArmanCTI" using the Ravin Style design system from Figma, adding a Twitter Monitoring dashboard (both as a dedicated sidebar section and Home dashboard widgets), and rebranding + extending the existing chatbot.

---

## Phase 1: Theme & Brand Colors

### 1.1 Update `ThemeDark.ts` — ArmanCTI Dark Theme

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/components/ThemeDark.ts`

Map the Ravin Style design system colors to OpenCTI's MUI theme structure:

| Token | Current OpenCTI | ArmanCTI (Ravin Style) |
|---|---|---|
| `THEME_DARK_DEFAULT_BACKGROUND` | `#070d19` | `#0a0a0a` (Black) |
| `THEME_DARK_DEFAULT_PAPER` | `#09101e` | `#141414` (Black scale) |
| `THEME_DARK_DEFAULT_PRIMARY` | `#0fbcff` | `#019BE5` (Blue) |
| `THEME_DARK_DEFAULT_SECONDARY` | `#00f18d` | `#F20F0F` (Red) |
| `THEME_DARK_DEFAULT_ACCENT` | `#0f1e38` | `#1a1a1a` (Grey scale) |
| `THEME_DARK_DEFAULT_TEXT` | `#F2F2F3` | `#FFFFFF` |
| `THEME_DARK_DEFAULT_NAV` | `#070d19` | `#0a0a0a` |

Update the `designSystem` palette:
- `primary.main` → `#019BE5`, `primary.light` → `#66B8F0`, `primary.dark` → `#006699`
- `secondary.main` → `#F20F0F`, `secondary.light` → `#FF6B6B`, `secondary.dark` → `#990000`
- `background.main` → `#0A0A0A`, `bg1` → `#141414`, `bg2` → `#1A1A1A`, `bg3` → `#262626`, `bg4` → `#333333`
- `border.main` → `#262626`, `border1` → `#404040`, `border2` → `#1A1A1A`
- `gradient.focus` → `linear-gradient(90deg, #019BE5 0%, #860EFE 100%)` (blue→purple)
- `gradient.ia` → `linear-gradient(90deg, #860EFE 0%, #F20F0F 100%)` (purple→red)
- Add purple accent: `tertiary.purple: { main: '#860EFE', light: '#B266FF', dark: '#4D0099' }`

Update typography:
- `fontFamily` → Keep `"IBM Plex Sans", sans-serif` (or switch to Ravin Style font if specified)
- Heading font family → Keep `"Geologica"` or update to match Ravin Style

Update component overrides:
- `MuiToggleButtonGroup` border colors → `#262626`
- `MuiDialog` paper background → `#141414`
- `MuiCssBaseline` scrollbar and gradient colors

### 1.2 Update `ThemeLight.ts` — ArmanCTI Light Theme

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/components/ThemeLight.ts`

Apply the same Ravin Style color mapping for light mode:
- Background → `#FFFFFF` / `#F5F5F5`
- Paper → `#FFFFFF`
- Primary → `#019BE5`
- Secondary → `#F20F0F`
- Text → `#0A0A0A`
- Nav → `#FFFFFF`
- Borders → `#E5E5E5` / `#D4D4D4`

### 1.3 Update Default Theme Constants

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/components/AppThemeProvider.tsx`

Update `defaultTheme` object to use the new ArmanCTI color constants.

---

## Phase 2: Logo & Brand Assets

### 2.1 Replace Logo Images

**Directory:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/static/images/`

Replace or add:
- `logo_text_dark.svg` → ArmanCTI logo (dark mode)
- `logo_dark.svg` → ArmanCTI collapsed logo (dark mode)
- `logo_text_light.png` → ArmanCTI logo (light mode)
- `logo_text_light.svg` → ArmanCTI logo (light mode)
- `logo_filigran_baseline_dark.svg` → Remove or replace with "Powered by ArmanCTI"
- `logo_filigran_gradient_dark.svg` → ArmanCTI brand image for login aside
- `embleme_filigran_white.png` → ArmanCTI emblem

### 2.2 Update Login Page

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/public/components/login/LoginLayout.tsx`

- Replace `LogoFiligran` component with ArmanCTI brand image
- Replace `LogoBaseline` "Made by Filigran" with "ArmanCTI" or remove
- Update default login aside gradient to ArmanCTI brand gradient: `linear-gradient(135deg, #019BE5 0%, #860EFE 100%)`

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/public/components/login/LoginLogo.tsx`

- Update alt text from "OpenCTI Logo" to "ArmanCTI Logo"

### 2.3 Update LeftBar Footer

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/nav/LeftBar.jsx`

- Replace "Made by" + Filigran logo with "ArmanCTI" branding
- Remove or replace `logoFiligran` import and rendering at bottom of sidebar

### 2.4 Update Favicon & Document Title

- Replace favicon in `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/static/images/`
- Update `index.html` title to "ArmanCTI"

---

## Phase 3: Chatbot Rebranding + Extension

### 3.1 Rebrand Existing Chatbot UI

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/chatbox/AskArianeButton.tsx`

- Rename "Ask Ariane" → "Ask Arman" (or "Arman AI")
- Replace `LogoXtmOneIcon` with ArmanCTI icon/logo
- Update tooltip text

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/chatbox/AskArianePanel.tsx`

- Update `logoIcon` to ArmanCTI emblem
- Update `accentColor` to use `theme.palette.primary.main` (ArmanCTI blue `#019BE5`)
- Update `promptSuggestions` to ArmanCTI-specific prompts:
  - "Show me recent threat tweets"
  - "What are the latest IOCs?"
  - "Analyze recent Twitter monitoring data"

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/chatbox/ChatbotManager.ts`

- Update `titleAvatarSrc` to ArmanCTI emblem
- Update `title` from "Ask Ariane" to "Ask Arman"
- Update `footer.company` from "Filigran XTM One" to "ArmanCTI"
- Update `footer.companyLink` to ArmanCTI URL
- Update `welcomeMessage` text
- Update `button.backgroundColor` to ArmanCTI primary color
- Update `titleBackgroundColor` gradient to ArmanCTI brand gradient

### 3.2 Extend Chatbot with Twitter Monitoring Context

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/chatbox/AskArianePanel.tsx`

- Add Twitter monitoring context to `pageContext` — when user is on `/dashboard/twitter-monitor`, include recent tweet stats
- Add a new prompt suggestion: "Search recent tweets for IOCs"
- Optionally fetch summary stats from the Twitter Monitoring API and pass as context

### 3.3 Update Chatbot Context Labels

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/chatbox/ChatbotContext.tsx`

- Update localStorage key prefixes from `arianeChat` to `armanChat` (with migration logic for existing users)

---

## Phase 4: Twitter Monitoring Dashboard

### 4.1 API Proxy Configuration

The arman-twitter-monitoring-engine dashboard FastAPI runs on port 8000 internally, exposed as `${DASHBOARD_PORT:-3000}:8000` on the host. OpenCTI frontend needs to reach this API.

**Approach:** Add a configurable environment variable `REACT_APP_TWITTER_API_URL` (default: `http://localhost:3000/api`) that the frontend uses for all Twitter Monitoring API calls. For production, this would be set to the remote server URL.

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/.env` (or `.env.production`)

Add: `REACT_APP_TWITTER_API_URL=http://localhost:3000/api`

### 4.2 Create API Service Layer

**New file:** `src/private/components/twitter-monitor/TwitterMonitorApi.ts`

Type-safe API client wrapping fetch calls to the arman-twitter-monitoring-engine:

```typescript
const API_BASE = process.env.REACT_APP_TWITTER_API_URL || 'http://localhost:3000/api';

export interface Tweet {
  id: number;
  tweet_id: string;
  author_handle: string;
  text: string;
  lang: string;
  fetched_at: string;
  processed_at: string | null;
  processed: boolean;
  source_tier: string;
  stix_report_id: string | null;
}

export interface RecentTweetsResponse {
  total: number;
  items: Tweet[];
}

export interface TwitterStats {
  total_tweets: number;
  processed_tweets: number;
  unprocessed_tweets: number;
  recent_tweets_1h: number;
  recent_tweets_24h: number;
  recently_processed_1h: number;
  recently_processed_24h: number;
  dead_letters_total: number;
  dead_letters_24h: number;
  bundle_count: number;
  bundle_count_24h: number;
  suspended_accounts: number;
}

export interface HourlyStat {
  hour: string;
  count: number;
}

// API functions
export const fetchRecentTweets = (params) => fetch(`${API_BASE}/recent-tweets?...`).then(r => r.json());
export const fetchStats = () => fetch(`${API_BASE}/stats`).then(r => r.json());
export const fetchHourlyStats = (hours = 24) => fetch(`${API_BASE}/hourly-stats?hours=${hours}`).then(r => r.json());
export const searchTweets = (q, field, limit) => fetch(`${API_BASE}/search?q=...`).then(r => r.json());
export const fetchTweetSources = () => fetch(`${API_BASE}/tweet-sources`).then(r => r.json());
export const fetchTweetHashtags = () => fetch(`${API_BASE}/tweet-hashtags`).then(r => r.json());
```

### 4.3 Create Twitter Monitor Root Component

**New file:** `src/private/components/twitter-monitor/Root.tsx`

Main routing for the Twitter Monitor section with sub-routes:
- `/dashboard/twitter-monitor` → Overview (stats + recent tweets)
- `/dashboard/twitter-monitor/recent` → Recent Tweets table with filtering
- `/dashboard/twitter-monitor/search` → Full-text search interface
- `/dashboard/twitter-monitor/stats` → Detailed statistics & charts

### 4.4 Create Twitter Monitor Components

**New directory:** `src/private/components/twitter-monitor/`

Components to create:

1. **`TwitterMonitorOverview.tsx`** — Dashboard overview page
   - Stats cards (total tweets, processed, unprocessed, recent 1h/24h)
   - Hourly stats chart (area chart using existing chart components)
   - Recent tweets table (latest 10)
   - Source tier distribution

2. **`RecentTweetsTable.tsx`** — Paginated, filterable tweet table
   - Filters: tier (A/B/C), status (processed/unprocessed), author, hashtag, date range
   - Sortable columns: tweet_id, author_handle, text, fetched_at, source_tier
   - Pagination with total count
   - Each row shows: author, text preview, tier badge, processed status, timestamp
   - Click to expand tweet details or view STIX bundle

3. **`TweetSearch.tsx`** — Full-text search interface
   - Search field selector (all, tweet_id, text, author, ioc, cve, ttp, malware, actor, article, content)
   - Search input with debounced query
   - Results table with highlighted matches
   - Match hint badges per result

4. **`TwitterStatsCharts.tsx`** — Statistics visualizations
   - Hourly ingestion chart (24h/48h/72h/168h selector)
   - Processing pipeline status (processed vs unprocessed pie/donut)
   - Source tier distribution (bar chart)
   - Dead letters count
   - Bundle audit count

5. **`TweetDetail.tsx`** — Single tweet detail view
   - Full tweet text, author, metadata
   - Associated article (if enriched)
   - STIX bundle link
   - Media attachments
   - IOCs, CVEs, TTPs extracted

6. **`TwitterStatsCard.tsx`** — Reusable stat card widget
   - Icon + label + value + trend indicator
   - Styled with ArmanCTI brand colors

### 4.5 Add Route to Index.tsx

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/Index.tsx`

Add lazy import and route:

```tsx
const RootTwitterMonitor = lazy(() => import('./components/twitter-monitor/Root'));

// In <Routes>:
<Route path="/twitter-monitor/*" element={boundaryWrapper(RootTwitterMonitor)} />
```

### 4.6 Add LeftBar Navigation Entry

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/nav/LeftBar.jsx`

Add a new top-level navigation item after the "Investigations" item and before the separator:

```jsx
<LeftBarItem
  {...itemProps}
  id="twitter-monitor"
  icon={<TwitterIcon />}  // or use a suitable MUI icon
  label={t_i18n('Twitter Monitor')}
  link="/dashboard/twitter-monitor"
  subItems={[
    { link: '/dashboard/twitter-monitor', label: t_i18n('Overview'), exact: true },
    { link: '/dashboard/twitter-monitor/recent', label: t_i18n('Recent Tweets') },
    { link: '/dashboard/twitter-monitor/search', label: t_i18n('Search') },
    { link: '/dashboard/twitter-monitor/stats', label: t_i18n('Statistics') },
  ]}
/>
```

Import a Twitter/X icon (e.g., `Twitter` from `@mui/icons-material` or a custom SVG).

### 4.7 Add Home Dashboard Widgets

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/HomeDashboard.jsx`

Add Twitter Monitoring summary widgets to the Home dashboard:

1. **Twitter Stats Card Row** — 4 stat cards showing:
   - Total Tweets
   - Processed (24h)
   - Recent (1h)
   - Dead Letters

2. **Recent Tweets Mini Table** — Latest 5 tweets with author, text preview, tier badge

3. **Hourly Ingestion Mini Chart** — Compact area chart of last 24h tweet ingestion

These widgets will use the `TwitterMonitorApi` service to fetch data on mount, styled with ArmanCTI brand colors, and wrapped in `Security` components to control visibility.

---

## Phase 5: Remove/Hide Unwanted UI Components

### 5.1 Identify Components to Remove

Based on the Ravin Style design system and ArmanCTI requirements, evaluate and optionally remove/hide:

- **Filigran branding elements** — "Made by Filigran" footer, Filigran logos
- **XTM Hub navigation entry** — If not needed for ArmanCTI
- **PIR navigation entry** — If not needed
- **Filigran Experience settings** — Rename or remove from settings

### 5.2 Update LeftBar

**File:** `/home/maverik/ArmanCTI/opencti-platform/opencti-front/src/private/components/nav/LeftBar.jsx`

- Remove or comment out the "Made by" + Filigran logo footer
- Optionally remove XTM Hub, PIR entries if not needed
- Remove "Filigran Experience" from Settings sub-items

---

## Phase 6: Global Brand Text Updates

### 6.1 Update Brand Strings

Search and replace across the frontend codebase:
- "OpenCTI" → "ArmanCTI" (in UI-visible strings, page titles, alt texts)
- "Filigran" → "ArmanCTI" (in UI-visible footer/branding strings)
- "Ask Ariane" → "Ask Arman"

**Note:** Do NOT replace in license headers, copyright notices, or internal API paths.

### 6.2 Update Package.json & Index.html

- Update `index.html` `<title>` to "ArmanCTI"
- Update meta description
- Update manifest.json name/short_name

---

## Implementation Order

1. **Phase 1** — Theme colors (foundation for all other UI work)
2. **Phase 2** — Logo & brand assets (visual identity)
3. **Phase 6** — Global brand text updates (quick wins)
4. **Phase 5** — Remove unwanted components (cleanup)
5. **Phase 4** — Twitter Monitoring dashboard (new feature, largest effort)
6. **Phase 3** — Chatbot rebranding + extension (final polish)

---

## Technical Considerations

- **API CORS:** The arman-twitter-monitoring-engine FastAPI needs CORS configured to accept requests from the OpenCTI frontend origin. Add `CORSMiddleware` to `dashboard/main.py` if not already present.
- **API URL Configuration:** Use environment variable `REACT_APP_TWITTER_API_URL` for flexibility between local dev and production deployments.
- **Relay/GraphQL:** Twitter Monitoring data bypasses Relay/GraphQL entirely — it uses direct REST API calls to the FastAPI backend. This avoids needing GraphQL schema changes.
- **Authentication:** Twitter Monitoring API currently has no auth. For production, consider adding API key or JWT token validation.
- **Error Handling:** All Twitter Monitor components should gracefully handle API unreachable states with error boundaries and retry logic.
- **Testing:** Verify theme changes in both dark and light modes. Test Twitter Monitor with API running and with API down.
