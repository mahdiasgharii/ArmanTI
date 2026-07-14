---
name: ArmanCTI
description: Cyber threat intelligence platform — professional instrument, not SaaS product.
colors:
  canvas: "#0A0A0A"
  surface: "#141414"
  elevated: "#1A1A1A"
  surface-2: "#262626"
  border-default: "#262626"
  border-strong: "#404040"
  primary: "#019BE5"
  primary-light: "#66C4F5"
  primary-dark: "#0073A8"
  secondary: "#860EFE"
  secondary-light: "#B88DFF"
  secondary-dark: "#4A08A0"
  danger: "#F20F0F"
  danger-light: "#FF6B6B"
  danger-dark: "#881106"
  success: "#17AB1F"
  success-dark: "#094E0B"
  warning: "#E6700F"
  text: "#FFFFFF"
  text-muted: "#848592"
  text-light: "#AFB0B6"
  light-canvas: "#F5F5F5"
  light-surface: "#FFFFFF"
  light-text: "#0A0A0A"
  light-text-muted: "#666666"
  light-text-light: "#999999"
typography:
  display:
    fontFamily: "Peyda, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Peyda, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "Consolas, monaco, monospace"
    fontWeight: 400
  metric:
    fontFamily: "Peyda, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1
rounded:
  default: "4px"
  container: "12px"
spacing:
  default: "4px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.default}"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.default}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "#FFFFFF"
    rounded: "{rounded.default}"
  input-default:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.default}"
    borderColor: "{colors.border-default}"
  input-focus:
    borderColor: "{colors.primary}"
  card-surface:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.default}"
  card-elevated:
    backgroundColor: "{colors.elevated}"
    rounded: "{rounded.default}"
  chip-default:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.default}"
---

# Design System: ArmanCTI

## 1. Overview

**Creative North Star: "The Instrument Panel"**

ArmanCTI is a cyber threat intelligence platform built for security analysts who need precision, density, and speed. The interface feels like a professional instrument — a dark control panel where every pixel earns its place. The black canvas is the housing; tonal greys create depth without shadows; accent colors appear surgically, never decoratively.

The system rejects the SaaS aesthetic entirely. No cream backgrounds, no card shadows, no gradient hero metrics, no emoji icons. The departure from default OpenCTI cyan/teal is intentional — Electric Blue (`#019BE5`) replaces it as the single primary accent, used on ≤15% of any screen. Violet (`#860EFE`) marks AI features exclusively. The grey scale carries 85%+ of visual weight.

Typography uses a single family — **Peyda** — across all roles. Weight and size create hierarchy, not font pairing. The signature voice pattern is lowercase with first-letter uppercase on headings, chips, tabs, and tooltips.

**Key Characteristics:**
- Black canvas (`#0A0A0A`) as the dominant surface; tonal layering for depth
- Surgical accent usage (≤15% of screen); grey scale carries the rest
- Single-font system (Peyda) with weight-based hierarchy
- 4px border radius throughout — sharp, precise, not soft
- Flat by default; shadows only on floating elements and state responses
- Dual theme support (dark default, light available) via CSS variables

## 2. Colors

The palette is a tonal grey scale with three surgical accents. Dark mode is the default and primary theme; light mode mirrors the same accent values on inverted neutrals.

### Primary
- **Electric Blue** (`#019BE5`): Primary actions, focus rings, interactive emphasis, links. The single most-used accent. Light variant `#66C4F5` for hover/active states; dark variant `#0073A8` for pressed/disabled.
- **Primary Light** (`#66C4F5`): Hover states on primary buttons, focus-adjacent highlights.

### Secondary
- **Violet Accent** (`#860EFE`): AI features and intelligence analysis highlights only. Never used for standard UI actions. Light variant `#B88DFF`; dark variant `#4A08A0`.

### Tertiary
- **Signal Red** (`#F20F0F`): Destructive actions, danger zones, critical severity. Light variant `#FF6B6B`; dark variant `#881106`.
- **Success Green** (`#17AB1F`): Positive status, boolean true, confirmation. Dark variant `#094E0B`.
- **Warning Orange** (`#E6700F`): Caution states, pending operations, severity warnings.

### Neutral
- **Black Canvas** (`#0A0A0A`): Primary background — the instrument's housing. Covers 60%+ of any screen.
- **Surface** (`#141414`): Cards on canvas. The default container background.
- **Elevated** (`#1A1A1A`): Cards on surfaces, hover states, secondary layering.
- **Surface-2** (`#262626`): Inputs, active states, tonal depth. Also serves as the default border color.
- **Border Strong** (`#404040`): Emphasized borders, focus-adjacent separators.
- **Text** (`#FFFFFF`): Primary text in dark mode.
- **Text Muted** (`#848592`): Secondary text, labels, metadata.
- **Text Light** (`#AFB0B6`): Tertiary text, placeholders, disabled labels.

### Light Theme Neutrals
- **Light Canvas** (`#F5F5F5`): Light mode background.
- **Light Surface** (`#FFFFFF`): Light mode cards.
- **Light Text** (`#0A0A0A`): Light mode primary text.
- **Light Text Muted** (`#666666`): Light mode secondary text.
- **Light Text Light** (`#999999`): Light mode tertiary text.

### Named Rules
**The Surgical Accent Rule.** Accent colors appear on ≤15% of any screen. The black canvas and grey scale carry 85%+ of visual weight. If an accent feels decorative, remove it.

**The No-Teal Rule.** Original OpenCTI cyan/teal palette is prohibited. Electric Blue (`#019BE5`) is the replacement. No exceptions.

**The Gradient Border Rule.** Gradient borders (blue→purple) are reserved for premium feature actions and AI elements only. Never on standard UI.

## 3. Typography

**Display Font:** Peyda (with `sans-serif` fallback)
**Body Font:** Peyda (with `sans-serif` fallback)
**Mono Font:** Consolas, monaco, monospace

**Character:** A single geometric sans-serif carries the entire system. Peyda replaces the previous Geologica + IBM Plex Sans pairing — one family, weight-based hierarchy, no exceptions. The lowercase voice pattern (`text-transform: lowercase` with `&::first-letter { text-transform: uppercase }`) is the signature typographic signal on headings, chips, tabs, and tooltips.

### Hierarchy
- **Display/Metric** (Peyda, 600, 32px, line-height 1): Dashboard numbers, KPI values, headline metrics.
- **Headline** (Peyda, 600, 20-24px, line-height 1.2): Page titles, section headers.
- **Title** (Peyda, 500, 16px, line-height 1.3): Card titles, list item headers, dialog titles.
- **Body** (Peyda, 400, 14px, line-height 1.5): Default text, descriptions, form labels, UI text.
- **Label** (Peyda, 500, 12px, letter-spacing 0.02em): Chips, tags, status labels, tab labels. Lowercase with first-letter uppercase.
- **Mono** (Consolas, 400, 13px): Code snippets, IDs, technical values.

### Named Rules
**The One-Font Rule.** Peyda is the only family. No Geologica, no IBM Plex Sans, no third family. Weight and size create hierarchy; font pairing does not.

**The Lowercase Voice Rule.** `text-transform: lowercase` with `&::first-letter { text-transform: uppercase }` on headings, chips, tabs, and tooltips. This is the signature voice pattern — not optional.

## 4. Elevation

The system is flat by default. No shadows on static cards, surfaces, or containers. Depth is conveyed through the tonal background scale: `#0A0A0A → #141414 → #1A1A1A → #262626`. Each step reads as a layer without any shadow.

Shadows appear only on:
- Floating elements: menus, dialogs, popovers, tooltips
- State responses: hover lift on interactive cards, focus glow on inputs

### Named Rules
**The Flat-By-Default Rule.** No `box-shadow` on static cards or surfaces. Use the tonal scale (`--ravin-bg` → `--ravin-surface` → `--ravin-elevated` → `--ravin-surface-2`) for depth.

**The No-Card-Shadow Rule.** Cards convey depth through background color, not shadows. A card on canvas is `#141414`; a card on a surface is `#1A1A1A`. That's the entire elevation system.

## 5. Components

### Buttons
- **Shape:** 4px radius throughout (`--ravin-border-radius` or `rounded` token)
- **Primary:** Electric Blue (`#019BE5`) background, white text. Hover darkens to `#0073A8`. Focus ring is `#019BE5`.
- **Secondary/Ghost:** Surface-2 (`#262626`) background or transparent with border. Text in `--ravin-text`. Hover elevates to `#1A1A1A`.
- **Danger:** Signal Red (`#F20F0F`) background, white text. Hover darkens to `#881106`.
- **Disabled:** Surface-2 background, text-muted color, no hover state.

### Chips / Tags
- **Style:** Surface-2 (`#262626`) background, text-muted (`#848592`) text, 4px radius.
- **State:** Selected chips use primary or secondary accent background with white text. Filter variants maintain the same shape.
- **Voice:** Lowercase with first-letter uppercase.

### Cards / Containers
- **Corner Style:** 4px radius.
- **Background:** Surface (`#141414`) on canvas. Elevated (`#1A1A1A`) on surfaces.
- **Shadow Strategy:** None. See Elevation section — tonal layering only.
- **Border:** Default border `#262626` (barely visible). Strong border `#404040` for emphasis.
- **Internal Padding:** Consistent spacing scale, typically 16-24px.

### Inputs / Fields
- **Style:** Surface-2 (`#262626`) background, text (`#FFFFFF`) text, 4px radius, default border `#262626`.
- **Focus:** Border shifts to Electric Blue (`#019BE5`). No glow — border color change only.
- **Error:** Border shifts to Signal Red (`#F20F0F`).
- **Disabled:** Surface-2 background, text-light (`#AFB0B6`) text, no border change.

### Navigation
- **Sidebar:** Canvas (`#0A0A0A`) background. Active items use Surface-2 (`#262626`) or Elevated (`#1A1A1A`). Active item accent is Electric Blue.
- **Top Bar:** Surface (`#141414`) background. Border-bottom `#262626`.
- **Tabs:** Lowercase with first-letter uppercase. Active tab has primary accent underline or background tint.

## 6. App Shell Layout

The app shell follows an inset sidebar pattern. The sidebar is visually recessed (canvas background), while the content area sits on a slightly elevated surface with a subtle gradient. A progressive blur footer at the bottom of the scrollable content area provides a smooth visual fade-off, signaling scroll boundary without a hard line.

### Structure
- **Sidebar (LeftBar):** Fixed-width, canvas background (`--ravin-bg`). Collapsible: 180px open, 55px collapsed. Active items use Surface-2 background with Electric Blue inset shadow. Contains logo at top, navigation groups with separators, and collapse toggle.
- **Top Bar:** Fixed, surface background (`--ravin-surface`) with transparent gradient overlay and `backdrop-filter: blur(4px)`. Contains global search (command-style input), AI actions (Ask Arman, CTEM), import, triggers, notifications with badge, and profile menu.
- **Content Area:** Scrollable, padded (24px horizontal). Sits on the body gradient (`--ravin-bg` → next tonal step). Contains the dashboard or page content.
- **Progressive Blur Footer:** A fixed-position gradient overlay at the bottom of the content area. Uses `mask-image: linear-gradient(to bottom, transparent 0%, var(--ravin-bg) 100%)` to create a smooth fade. Height: 32px. Non-interactive (pointer-events: none).

### Dashboard Grid
- **12-column grid** with 16px gap (`gap-4`).
- **Metric cards:** 4 columns on desktop (`col-span-3`), 6 on tablet, 12 on mobile.
- **Chart cards:** Variable span (3, 6, or 8 columns) depending on data density.
- **Section headers:** Full-width, with lowercase title + time-range chip badge.
- **Section separators:** `border-top` using `--ravin-border` with 32px top padding.

### Named Rules
**The Inset Sidebar Rule.** The sidebar is always canvas (`--ravin-bg`), never surface. The content area is always lighter (surface or gradient). This creates the inset effect — the sidebar reads as receding, the content as advancing.

**The Progressive Blur Rule.** The content area's bottom edge uses a gradient mask fade, not a hard border or shadow. This signals scroll boundary softly, consistent with the instrument aesthetic.

**The Command Search Rule.** The top bar search is the primary navigation method for power users. It supports NLQ (natural language query) in enterprise mode. The input is styled as a command palette — surface-2 background, 4px radius, Electric Blue focus border.

## 7. Light Theme Specification

The light theme is an equal citizen, not a fallback. It mirrors the dark theme's accent colors on inverted neutrals. The same design rules apply: surgical accents, tonal layering, flat surfaces, 4px radius.

### Light Theme Token Mapping
| Token | Dark Value | Light Value |
|-------|-----------|-------------|
| `--ravin-bg` | `#0A0A0A` | `#F5F5F5` |
| `--ravin-surface` | `#141414` | `#FFFFFF` |
| `--ravin-elevated` | `#1A1A1A` | `#FAFAFA` |
| `--ravin-surface-2` | `#262626` | `#EBEBEB` |
| `--ravin-border` | `#262626` | `#E0E0E0` |
| `--ravin-border-strong` | `#404040` | `#CCCCCC` |
| `--ravin-primary` | `#019BE5` | `#019BE5` |
| `--ravin-secondary` | `#860EFE` | `#860EFE` |
| `--ravin-danger` | `#F20F0F` | `#F20F0F` |
| `--ravin-text` | `#FFFFFF` | `#0A0A0A` |
| `--ravin-text-muted` | `#848592` | `#666666` |
| `--ravin-text-light` | `#AFB0B6` | `#999999` |

Accent colors (Electric Blue, Violet, Signal Red) remain identical across both themes. Only neutrals invert. This ensures brand consistency — the instrument's accent signals are the same regardless of theme.

## 8. Do's and Don'ts

### Do:
- **Do** use the tonal grey scale (`#0A0A0A → #141414 → #1A1A1A → #262626`) for all depth and layering.
- **Do** keep accent colors to ≤15% of any screen. The grey scale is the system.
- **Do** use Peyda as the single font family. Weight creates hierarchy.
- **Do** apply the lowercase voice pattern (`text-transform: lowercase` + `&::first-letter { text-transform: uppercase }`) on headings, chips, tabs, and tooltips.
- **Do** use 4px border radius everywhere. Sharp, precise, not soft.
- **Do** use Electric Blue (`#019BE5`) for primary actions and focus states only.
- **Do** use Violet (`#860EFE`) for AI features exclusively.
- **Do** support both dark (default) and light themes via the `--ravin-*` CSS variables.
- **Do** use the progressive blur footer on scrollable content areas for smooth scroll boundary signaling.
- **Do** keep accent colors identical across themes — only neutrals invert.

### Don't:
- **Don't** use the original OpenCTI cyan/teal palette. The departure is intentional.
- **Don't** add box-shadows to static cards or surfaces. Tonal layering is the elevation system.
- **Don't** use Geologica or IBM Plex Sans. Peyda is the only family.
- **Don't** use cream, sand, beige, or any warm-neutral background. The canvas is black (`#0A0A0A`).
- **Don't** use cookie-cutter card grids, hero-metric templates, or emoji icons — this is a professional instrument, not a SaaS product.
- **Don't** use purple gradients everywhere, glassmorphism, or "powered by AI" badges.
- **Don't** use gradient borders (blue→purple) outside of premium feature actions and AI elements.
- **Don't** introduce a third font family. Weight and size create hierarchy, not font pairing.
- **Don't** use different accent colors in light vs dark theme. Accents are brand constants, not theme variables.
- **Don't** use hard borders or shadows at the bottom of scroll areas. Use the progressive blur gradient mask.
