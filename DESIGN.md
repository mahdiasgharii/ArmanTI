---
name: ArmanCTI
description: Cyber threat intelligence platform with Ravin Style design system — bold, precise, modern.
colors:
  electric-blue: "#29CCB1"
  electric-blue-light: "#7FE0CC"
  electric-blue-dark: "#1A8A73"
  signal-red: "#F20F0F"
  signal-red-light: "#FF6B6B"
  signal-red-dark: "#881106"
  violet-accent: "#860EFE"
  violet-accent-light: "#B88DFF"
  violet-accent-dark: "#4A08A0"
  black-canvas: "#0a0a0a"
  dark-surface: "#0a0a0a"
  dark-elevated: "#171717"
  dark-surface-2: "#27272A"
  dark-border: "#27272A"
  dark-border-strong: "#3F3F46"
  dark-text-muted: "#A1A1AA"
  dark-text-light: "#A1A1AA"
  light-canvas: "#FFFFFF"
  light-surface: "#FFFFFF"
  light-elevated: "#FAFAFA"
  light-surface-2: "#F4F4F5"
  light-text: "#09090B"
  light-text-muted: "#71717A"
  light-text-light: "#71717A"
  light-border: "#E4E4E7"
  light-border-strong: "#D4D4D8"
  white-text: "#FAFAFA"
  error: "#F20F0F"
  error-dark: "#881106"
  success: "#17AB1F"
  success-light: "#4ADE80"
  success-dark: "#094E0B"
  warning: "#E6700F"
  severity-critical: "#EE3838"
  severity-high: "#E6700F"
  severity-medium: "#E1B823"
  severity-low: "#16AD34"
typography:
  display:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "22px"
    fontWeight: 600
    lineHeight: "1.3"
    letterSpacing: "normal"
  headline:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "1.4"
    letterSpacing: "normal"
  title:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "1.4"
    letterSpacing: "normal"
  body:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "normal"
  body-small:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: "1.2rem"
    letterSpacing: "normal"
  label:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "1.4"
    letterSpacing: "normal"
  metric:
    fontFamily: '"Peyda", sans-serif'
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "1"
    letterSpacing: "normal"
  mono:
    fontFamily: "Consolas, monaco, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "4px"
  container: "8px"
  shell: "0.625rem"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.electric-blue}"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.electric-blue-dark}"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.electric-blue}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.electric-blue}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  button-destructive:
    backgroundColor: "{colors.error}"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    height: "36px"
  input-field:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "36px"
  chip-default:
    backgroundColor: "transparent"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  nav-item-hover:
    backgroundColor: "{colors.dark-elevated}"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  nav-item-active:
    backgroundColor: "{colors.dark-border}"
    textColor: "{colors.electric-blue}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  card-surface:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.white-text}"
    rounded: "{rounded.sm}"
    padding: "16px"
---

# Design System: ArmanCTI

## 1. Overview

**Creative North Star: "The Instrument Panel"**

ArmanCTI is a precision instrument panel for cyber threat intelligence. Every element is calibrated — dark surfaces with electric accents, where blue is the operational frequency, red is the threat indicator, and purple is the intelligence layer. The interface speaks with expert confidence: no hand-holding, no decorative softness, no ornamentation without purpose.

The system is dark-first. The canvas (`#0a0a0a`) is not a background — it is the instrument's housing. Surfaces layer upward through a tight grey scale (`#171717` → `#27272A`), each step a deliberate elevation. Borders are thin and functional (`#27272A` → `#3F3F46`), never decorative. The Ravin Style palette — electric blue, signal red, violet accent — carries the brand through conviction, not coverage. Accents are used surgically: blue for action and focus, red for danger and alert, purple for AI and intelligence features.

This system explicitly rejects the original OpenCTI aesthetic (dark navy `#070d19` with cyan/teal accents). The departure must be unmistakable. It also rejects generic SaaS dashboards — bland blue/gray, cookie-cutter card grids, no personality. It rejects the AI-generated aesthetic — purple gradients everywhere, glassmorphism as default, emoji icons in rounded cards, "powered by AI" badges. ArmanCTI uses AI features (Ask Arman, Twitter Monitor) but they must feel like professional instruments, not novelty demos. ArmanCTI is not a template; it is an instrument.

**Key Characteristics:**
- Dark-first, black canvas with tight grey-scale tonal layering
- Three accent colors with surgical application (blue = action, red = alert, purple = intelligence)
- Peyda for all typography — clean, technical, no-nonsense
- 4px border radius for components (buttons, chips, inputs, nav items); 8px for cards and widgets; 0.625rem (10px) for shell containers (sidebar, header, page content) — sharp but with a subtle frame separation
- Lowercase typography with first-letter uppercase as a signature voice
- Gradient borders for premium/feature actions (blue→purple, purple→red)
- Flat by default with subtle ambient shadows on elevated/floating elements only
- Dual register: brand identity is the primary lens, but product UI (dashboards, tables, forms) receives equal craft
- AI features feel like professional instruments, not novelty demos — no gradient-washed AI badges
- Subtle edge-fade blur at the content container bottom — a functional scroll boundary cue, not decorative glassmorphism

## 2. Colors: The Instrument Panel Palette

The palette operates as a precision instrument: a black housing, a tight grey scale for depth, and three electric accents that function as signal indicators.

### Primary
- **Electric Blue** (#29CCB1): The operational frequency. Used for primary actions, focus rings, links, active navigation states, and interactive element emphasis. This is the brand's signature color — confident, technical, never decorative. Light variant `#7FE0CC` for hover/focus glows; dark variant `#1A8A73` for pressed/active states.

### Secondary
- **Signal Red** (#F20F0F): The threat indicator. Used for destructive actions, danger zones, severity-critical indicators, and error states. Never used for decoration or general emphasis. Light variant `#FF6B6B` for hover; dark variant `#881106` for pressed.

### Tertiary
- **Violet Accent** (#860EFE): The intelligence layer. Used for AI features ("Ask Arman"), intelligence analysis highlights, and gradient accents. Light variant `#B88DFF` for hover; dark variant `#4A08A0` for pressed. Appears in gradient borders (blue→purple for focus, purple→red for intelligence analysis).

### Neutral (shadcn zinc dark)
- **Canvas** (#0a0a0a): The primary background — the instrument's housing. Pure, confident, not navy, not charcoal.
- **Surface** (#0a0a0a): Same as canvas. Cards sit on the page background — depth comes from borders, not a different fill.
- **Elevated** (#171717): Sidebar background, dialog backgrounds, popover backgrounds. One step up from canvas.
- **Surface-2** (#27272A): Hover/active states for sidebar items, sub-areas within elevated surfaces.
- **Border** (#27272A): Default borders and dividers. Functional, not decorative. Same value as surface-2.
- **Border Strong** (#3F3F46): Emphasized borders, toggle groups, input outlines on focus.
- **Foreground** (#FAFAFA): Primary text color. Maximum contrast on dark canvas.
- **Muted Text** (#A1A1AA): Secondary and tertiary text. Must maintain ≥4.5:1 contrast on dark surfaces.

### Light Theme Neutrals (shadcn zinc light)
- **Light Canvas** (#FFFFFF): Light mode background.
- **Light Surface** (#FFFFFF): Same as canvas.
- **Light Elevated** (#FAFAFA): Light mode sidebar, dialogs, popovers.
- **Light Surface-2** (#F4F4F5): Light mode hover/active states.
- **Light Border** (#E4E4E7) / **Light Border Strong** (#D4D4D8): Light mode borders.
- **Light Text** (#09090B): Light mode primary text.
- **Light Muted Text** (#71717A): Light mode secondary text.

### Severity Scale
- **Critical** (#EE3838): Critical severity indicators.
- **High** (#E6700F): High severity.
- **Medium** (#E1B823): Medium severity.
- **Low** (#16AD34): Low severity.

### Named Rules
**The Surgical Accent Rule.** Accent colors (blue, red, purple) are used on ≤15% of any given screen. Their rarity is their power. The black canvas and grey scale carry 85%+ of the visual weight.

**The No-Teal Rule.** The original OpenCTI cyan/teal palette (`#0fbcff`, `#00f18d`, `#00F1BD`) is prohibited. If a color reads as "OpenCTI with a paint job," it's wrong. The departure is the point.

**The Gradient Border Rule.** Gradient borders (`linear-gradient(90deg, #29CCB1 0%, #860EFE 100%)` for focus, `linear-gradient(90deg, #860EFE 0%, #F20F0F 100%)` for intelligence analysis) are reserved for premium feature actions and AI-related elements. Never use gradients on standard buttons or surfaces.

## 3. Typography

**Display Font:** Peyda (sans-serif fallback)
**Body Font:** Peyda (sans-serif fallback)
**Mono Font:** Consolas, monaco, monospace

**Character:** A single geometric sans — Peyda — carries the entire system. Weight and size create hierarchy, not font pairing. No serif, no display script. The system is an instrument, not a magazine.

### Hierarchy
- **Display** (600, 22px, 1.3): Page-level headings (h1). Peyda. Lowercase with first-letter uppercase — a signature voice element.
- **Headline** (600, 16px, 1.4): Section headings (h2, h5). Peyda. Lowercase with first-letter uppercase.
- **Title** (600, 14px, 1.4): Subsection headings (h6), dialog titles (h5). Peyda. Lowercase with first-letter uppercase.
- **Body** (400, 0.9rem, 1.5): Primary body text (body1). Peyda. Max line length 65–75ch for readability in data-dense contexts.
- **Body Small** (400, 0.8rem, 1.2rem): Compact body text (body2). Peyda. Used in tables, metadata, secondary information.
- **Label** (500, 12px, 1.4): Overlines, captions, small UI labels (h4). Peyda. Lowercase with first-letter uppercase.
- **Metric** (600, 28px, 1): Dashboard number widgets, KPI displays. Peyda. Uses `tabular-nums` for aligned digit columns. Lowercase with first-letter uppercase.
- **Mono** (400, 12px, 1.5): Code blocks, STIX bundles, technical identifiers. Consolas/monaco/monospace.

### Named Rules
**The Lowercase Voice Rule.** Headings (h1–h6), chips, tabs, and tooltips use `text-transform: lowercase` with `&::first-letter { text-transform: uppercase }`. This is a signature brand voice element — never override it with uppercase or all-lowercase without the first-letter correction.

**The One-Font Rule.** Peyda for everything — headings and body alike. No second or third font. No exceptions. If a new context needs a different feel, use weight and size, not a new family.

## 4. Elevation

The system uses a hybrid approach: tonal layering as the primary depth mechanism, with subtle ambient shadows reserved for floating elements (menus, dialogs, popovers, tooltips). Cards and surfaces are flat at rest — depth comes from the background scale (`#0a0a0a` → `#171717` → `#27272A`), not from shadows. In dark mode, the main content container has no border — depth comes from the tonal difference between the sidebar (`#171717`) and the canvas (`#0a0a0a`).

### Shadow Vocabulary
- **Floating Shadow** (`rgba(200, 200, 200, 0.15)`): Applied to dialogs, menus, popovers. Subtle, ambient, never sharp. The shadow is functional — it tells the user "this is above the surface" — not decorative.
- **Focus Glow** (`0 0 0 2px {color}`): Focus rings on interactive elements. Uses the element's accent color at full opacity. Sharp, precise, never blurred.
- **Gradient Glow** (`1px 0px 6px -1px {start}, -1px 0px 6px -1px {end}`): Applied on hover/active to gradient-bordered buttons. A subtle dual-color glow that signals interactivity on premium elements.
- **Edge-Fade Blur** (`backdrop-filter` with layered mask gradients): Applied to the bottom edge of the main content container as a scroll boundary cue. Uses 8 stacked layers with incremental blur (0px → 1.75px) and mask gradients to create a smooth fade. This is a functional signal — not decorative glassmorphism.
- **Header Glass** (`backdrop-filter: blur(16px) saturate(180%)`): Applied to the fixed TopBar. Content scrolling behind the header is blurred and saturated, creating depth without opacity. Background is 72% canvas color via `color-mix`. A `@supports` fallback renders solid canvas for browsers without `backdrop-filter`.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on floating elements (menus, dialogs, popovers) and as response to state (hover, focus). Never apply shadows to cards, list items, or static surfaces to "elevate" them — use the tonal background scale instead.

**The No-Card-Shadow Rule.** Cards and containers convey depth through borders, not shadows. Cards use the same background as the canvas (`#0a0a0a` in dark, `#FFFFFF` in light) with a 1px border (`#27272A` in dark, `#E4E4E7` in light). No `box-shadow` on static cards.

**The Edge-Fade Blur Exception.** The main content container may use a layered `backdrop-filter` blur at its bottom edge as a scroll boundary cue. This is a functional signal, not decoration. It must not be applied to cards or panels.

**The Header Glass Exception.** The fixed TopBar may use `backdrop-filter: blur(16px) saturate(180%)` with a 72% opaque canvas background. This is functional — content scrolls behind the header and the blur maintains legibility without full opacity. It must not be applied to cards, panels, or any other surface.

## 5. Components

### Buttons
- **Shape:** Sharp 4px radius (`theme.shape.borderRadius`)
- **Primary:** Solid Electric Blue (`#29CCB1`) background, white text. Hover → dark blue (`#1A8A73`). Focus → 2px blue glow ring. Disabled → grey background, muted text.
- **Secondary:** Transparent background, blue text, 1px blue border. Hover → 15% blue tint background. Active → 25% blue tint.
- **Tertiary:** Transparent background, blue text, no border. Hover → 15% blue tint. Active → 15% tint + focus ring.
- **Destructive:** Solid error red (`#F20F0F`) background, white text. Hover → dark red (`#881106`).
- **Gradient (Extra):** Transparent background with 2px gradient border (blue→purple or custom). Text uses gradient clip. Hover → gradient glow shadow. Reserved for premium/AI features.
- **Sizes:** Default (36px height, 8px 16px padding, 14px font, 600 weight). Small (26px height, 4px 12px padding, 13px font, 600 weight).
- **Transition:** `all 0.2s ease-in-out` for solid variants; `box-shadow 0.3s ease-out` for gradient variants.

### Chips
- **Style:** Transparent or tonal background, white text, 4px radius. Lowercase with first-letter uppercase.
- **State:** Selected chips use accent color at 15-25% opacity background. Filter chips, status chips, and category chips follow the same pattern.

### Cards / Containers
- **Corner Style:** 8px radius for cards and widgets (`rounded-lg`); 0.625rem (10px) for shell containers — sidebar, header (TopBar), and page content frame (`rounded-shell`)
- **Background:** Same as canvas (`#0a0a0a` dark / `#FFFFFF` light) — depth from borders, not fill
- **Shadow Strategy:** None at rest (see Elevation: The No-Card-Shadow Rule). Subtle tonal hover shift on interactive cards.
- **Border:** 1px `var(--ravin-border)` (`#27272A` dark / `#E4E4E7` light). The main content container has no border in dark mode, 1px border in light mode.
- **Internal Padding:** 16px default (`spacing.md`)
- **Hover:** Background transitions from transparent to `var(--ravin-surface-2)` over 150ms ease

### Inputs / Fields
- **Style:** Standard variant (underline) by default. Outlined variant uses elevated background (`var(--ravin-elevated)`) with transparent border. 4px radius.
- **Focus:** Bottom border shifts to Electric Blue (`#29CCB1`). 2px solid blue underline.
- **Error:** Bottom border shifts to Error Red (`#F20F0F`). 2px solid red underline.
- **Disabled:** Grey background (`#363B46`), muted text.
- **Placeholder:** Must maintain ≥4.5:1 contrast. Use `var(--ravin-text-muted)` (`#A1A1AA`) on dark surfaces, not pure grey.

### Navigation (LeftBar)
- **Width:** 240px expanded, 56px collapsed. Smooth width transition.
- **Background:** Elevated (`var(--ravin-elevated)`, `#171717` dark / `#FAFAFA` light) — one step above canvas for inset shell feel. 1px right border (`var(--ravin-border)`).
- **Group labels:** Peyda 11px, 600 weight, `var(--ravin-text-muted)`, lowercase first-letter uppercase. Appear above each nav section (Overview, Knowledge, Data, Settings). Hidden when collapsed.
- **Item height:** 40px. 4px border radius. No horizontal margin (flush to sidebar padding).
- **Icons:** 18px. Tertiary color when inactive, light color when active.
- **Hover:** `var(--ravin-surface-2)` (`#27272A` dark / `#F4F4F5` light) background. 0.15s ease transition.
- **Active/Selected:** Plain pill with `var(--ravin-surface-2)` (`#27272A` dark / `#F4F4F5` light) background. No colored accent stripe — matches app-shell-7's flat pill pattern.
- **Sub-menu indent guide:** Expanded sub-items sit under a 1px vertical guide line (`var(--ravin-border)`) offset 22px from the sidebar edge, aligning with the parent icon.
- **Sub-items:** 34px height, 4px radius, 1px horizontal margin. Indented with 2px left padding. Same hover/active pattern.
- **Collapsed popover:** 200px width, elevated background, 1px border, 4px radius.
- **Separators:** 1px `var(--ravin-border)`, 2px horizontal margin, 1px vertical margin.
- **Footer:** 1px top border. Collapse toggle + brand text. 8px vertical padding.

### Dashboard cards
- **Container:** `rounded-lg border border-border bg-canvas p-4` — 8px radius, 1px border, same background as canvas, 16px padding.
- **Grid:** `grid-cols-2 gap-4 p-px lg:grid-cols-4` — 2 columns on small screens, 4 on large. 16px gap. `p-px` prevents border clipping.
- **No shadows:** Depth comes from borders and tonal layering, not box-shadow.
- **Main content frame:** 0.625rem (10px) border radius (`rounded-shell`), no border in dark mode (depth from tonal difference), 1px border in light mode. Background same as canvas (`var(--ravin-bg)`).
- **Shell containers:** Sidebar, header (TopBar), and page content frame all share 0.625rem (10px) border radius for consistent visual rounding across the app shell.
- **Responsive content padding:** 8px horizontal on mobile (xs), 12px on sm+ — total offset from sidebar edge is 20px (8px main + 12px content), matching header alignment.
- **Progressive blur footer:** 32px gradient mask at the bottom of the content container, using `position: sticky` with `linear-gradient(to bottom, transparent 0%, var(--ravin-bg) 100%)`. Content bottom padding is 32px (`pb: 4`) to prevent overlap.
- **Header height:** Shared `TOP_BAR_HEIGHT` constant (60px = 8px AppBar top padding + 4px bottom padding + 48px Toolbar minHeight), imported by the content area for `paddingTop` calc.

### Toggle Button Groups
- **Style:** 36px height, 1px Border Strong (`var(--ravin-border-strong)`, `#3F3F46` dark / `#D4D4D8` light) border between buttons.
- **Selected:** 25% blue tint background.
- **Hover (unselected):** 15% blue tint background.
- **Focus:** 2px light blue glow ring.

### Dialogs
- **Background:** Elevated (`var(--ravin-elevated)`, `#171717` dark / `#FAFAFA` light) — not canvas. One step above.
- **Radius:** 4px
- **Title:** h5 variant (Peyda, 16px, 700 weight, lowercase first-letter uppercase)
- **Actions:** Right-aligned, gap 16px, no left margin. Buttons use `textTransform: none`.

### Tooltips
- **Background:** `rgba(0, 0, 0, 0.7)` — darker than canvas.
- **Text:** White. Lowercase with first-letter uppercase.

### Table Cells
- **Borders:** `1px solid rgba(255, 255, 255, 0.15)` — subtle white at 15% opacity.
- **Header:** Same border treatment. No special background.

## 6. Do's and Don'ts

### Do:
- **Do** use the black canvas (`#0a0a0a`) as the primary background. It is the instrument's housing.
- **Do** layer surfaces through the tonal scale (`#0a0a0a` → `#171717` → `#27272A`) for depth, not shadows.
- **Do** use Electric Blue (`#29CCB1`) for primary actions, focus, and interactive emphasis.
- **Do** use Signal Red (`#F20F0F`) exclusively for destructive actions, danger, and critical severity.
- **Do** use Violet Accent (`#860EFE`) for AI features and intelligence analysis highlights.
- **Do** apply the lowercase + first-letter uppercase pattern to all headings, chips, tabs, and tooltips.
- **Do** use Peyda for all typography — headings and body alike. No other font families.
- **Do** keep accent colors to ≤15% of any screen surface. The black canvas carries the design.
- **Do** verify ≥4.5:1 contrast for all text on dark surfaces, especially muted/secondary text.
- **Do** use gradient borders (blue→purple) only for premium feature actions and AI elements.
- **Do** pair severity colors with icons or labels — never rely on color alone to convey status.

### Don't:
- **Don't** use the original OpenCTI palette — navy (`#070d19`), cyan (`#0fbcff`), teal (`#00f18d`), or green (`#00F1BD`). The departure from OpenCTI must be unmistakable.
- **Don't** use shadows on static cards or surfaces. Depth comes from tonal layering, not `box-shadow`.
- **Don't** use border-left or border-right greater than 1px as a colored stripe accent on cards or list items.
- **Don't** use gradient text (`background-clip: text` with gradient) except in gradient-bordered buttons where it is the component's defining feature.
- **Don't** use glassmorphism on cards, panels, or surfaces — blurs and glass cards as decoration. The instrument is solid, not translucent. (Exceptions: the main content container's edge-fade blur and the fixed TopBar's header glass — see Elevation: Named Rules.)
- **Don't** introduce rounded corners beyond 4px on components. Cards use 8px (`rounded-lg`) and shell containers (sidebar, header, page content) use 0.625rem (`rounded-shell`) as frame separation exceptions.
- **Don't** use generic SaaS patterns — cookie-cutter card grids, hero-metric templates, identical icon+heading+text cards repeated endlessly.
- **Don't** use tiny uppercase tracked eyebrows above every section. The lowercase + first-letter uppercase pattern is the voice; all-caps eyebrows are a different, rejected aesthetic.
- **Don't** apply shadows to cards to "elevate" them. Use the background tonal scale.
- **Don't** use a second or third font family. Weight and size create hierarchy, not new fonts.
- **Don't** use accent colors for decoration. Blue is action, red is danger, purple is intelligence — each has a job.
- **Don't** use the AI-generated aesthetic — purple gradients everywhere, glassmorphism as default, rounded cards with emoji icons, "powered by AI" badges. AI features (Ask Arman, Twitter Monitor) must feel like professional instruments, not novelty demos.
- **Don't** ship the Ravin Style as a paint job over OpenCTI defaults. The theme files must be fully updated — no residual OpenCTI color DNA in any token.
