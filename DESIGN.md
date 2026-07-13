---
name: ArmanCTI
description: Cyber threat intelligence platform with Ravin Style design system — bold, precise, modern.
colors:
  electric-blue: "#019BE5"
  electric-blue-light: "#66B8F0"
  electric-blue-dark: "#006699"
  signal-red: "#F20F0F"
  signal-red-light: "#FF6B6B"
  signal-red-dark: "#990000"
  violet-accent: "#860EFE"
  violet-accent-light: "#B266FF"
  violet-accent-dark: "#4D0099"
  black-canvas: "#0A0A0A"
  dark-surface: "#141414"
  dark-elevated: "#1A1A1A"
  dark-border: "#262626"
  dark-border-strong: "#404040"
  light-canvas: "#F5F5F5"
  light-surface: "#FFFFFF"
  light-text: "#0A0A0A"
  light-border: "#E5E5E5"
  light-border-strong: "#D4D4D4"
  white-text: "#FFFFFF"
  error: "#F14337"
  error-dark: "#881106"
  success: "#17AB1F"
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
  mono:
    fontFamily: "Consolas, monaco, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "4px"
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

The system is dark-first. The black canvas (`#0A0A0A`) is not a background — it is the instrument's housing. Surfaces layer upward through a tight grey scale (`#141414` → `#1A1A1A` → `#262626` → `#333333`), each step a deliberate elevation. Borders are thin and functional (`#262626` → `#404040`), never decorative. The Ravin Style palette — electric blue, signal red, violet accent — carries the brand through conviction, not coverage. Accents are used surgically: blue for action and focus, red for danger and alert, purple for AI and intelligence features.

This system explicitly rejects the original OpenCTI aesthetic (dark navy `#070d19` with cyan/teal accents). The departure must be unmistakable. It also rejects generic SaaS dashboards — bland blue/gray, cookie-cutter card grids, no personality. It rejects the AI-generated aesthetic — purple gradients everywhere, glassmorphism as default, emoji icons in rounded cards, "powered by AI" badges. ArmanCTI uses AI features (Ask Arman, Twitter Monitor) but they must feel like professional instruments, not novelty demos. ArmanCTI is not a template; it is an instrument.

**Key Characteristics:**
- Dark-first, black canvas with tight grey-scale tonal layering
- Three accent colors with surgical application (blue = action, red = alert, purple = intelligence)
- Peyda for all typography — clean, technical, no-nonsense
- 4px border radius throughout — sharp, not rounded; precise, not soft
- Lowercase typography with first-letter uppercase as a signature voice
- Gradient borders for premium/feature actions (blue→purple, purple→red)
- Flat by default with subtle ambient shadows on elevated/floating elements only
- Dual register: brand identity is the primary lens, but product UI (dashboards, tables, forms) receives equal craft
- AI features feel like professional instruments, not novelty demos — no gradient-washed AI badges or glassmorphism

## 2. Colors: The Instrument Panel Palette

The palette operates as a precision instrument: a black housing, a tight grey scale for depth, and three electric accents that function as signal indicators.

### Primary
- **Electric Blue** (#019BE5): The operational frequency. Used for primary actions, focus rings, links, active navigation states, and interactive element emphasis. This is the brand's signature color — confident, technical, never decorative. Light variant `#66B8F0` for hover/focus glows; dark variant `#006699` for pressed/active states.

### Secondary
- **Signal Red** (#F20F0F): The threat indicator. Used for destructive actions, danger zones, severity-critical indicators, and error states. Never used for decoration or general emphasis. Light variant `#FF6B6B` for hover; dark variant `#990000` for pressed.

### Tertiary
- **Violet Accent** (#860EFE): The intelligence layer. Used for AI features ("Ask Arman"), intelligence analysis highlights, and gradient accents. Light variant `#B266FF` for hover; dark variant `#4D0099` for pressed. Appears in gradient borders (blue→purple for focus, purple→red for intelligence analysis).

### Neutral
- **Black Canvas** (#0A0A0A): The primary background — the instrument's housing. Pure, confident, not navy, not charcoal.
- **Dark Surface** (#141414): Paper/card background. One step up from canvas.
- **Dark Elevated** (#1A1A1A): Elevated surfaces, dialog backgrounds, hover states.
- **Dark Border** (#262626): Default borders and dividers. Functional, not decorative.
- **Dark Border Strong** (#404040): Emphasized borders, toggle groups, input outlines on focus.
- **White Text** (#FFFFFF): Primary text color. Maximum contrast on black canvas.
- **Muted Text** (#848592 / #AFB0B6): Secondary and tertiary text. Must maintain ≥4.5:1 contrast on dark surfaces.

### Light Theme Neutrals
- **Light Canvas** (#F5F5F5): Light mode background.
- **Light Surface** (#FFFFFF): Light mode paper/cards.
- **Light Text** (#0A0A0A): Light mode primary text.
- **Light Border** (#E5E5E5) / **Light Border Strong** (#D4D4D4): Light mode borders.

### Severity Scale
- **Critical** (#EE3838): Critical severity indicators.
- **High** (#E6700F): High severity.
- **Medium** (#E1B823): Medium severity.
- **Low** (#16AD34): Low severity.

### Named Rules
**The Surgical Accent Rule.** Accent colors (blue, red, purple) are used on ≤15% of any given screen. Their rarity is their power. The black canvas and grey scale carry 85%+ of the visual weight.

**The No-Teal Rule.** The original OpenCTI cyan/teal palette (`#0fbcff`, `#00f18d`, `#00F1BD`) is prohibited. If a color reads as "OpenCTI with a paint job," it's wrong. The departure is the point.

**The Gradient Border Rule.** Gradient borders (`linear-gradient(90deg, #019BE5 0%, #860EFE 100%)` for focus, `linear-gradient(90deg, #860EFE 0%, #F20F0F 100%)` for intelligence analysis) are reserved for premium feature actions and AI-related elements. Never use gradients on standard buttons or surfaces.

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
- **Mono** (400, 12px, 1.5): Code blocks, STIX bundles, technical identifiers. Consolas/monaco/monospace.

### Named Rules
**The Lowercase Voice Rule.** Headings (h1–h6), chips, tabs, and tooltips use `text-transform: lowercase` with `&::first-letter { text-transform: uppercase }`. This is a signature brand voice element — never override it with uppercase or all-lowercase without the first-letter correction.

**The One-Font Rule.** Peyda for everything — headings and body alike. No second or third font. No exceptions. If a new context needs a different feel, use weight and size, not a new family.

## 4. Elevation

The system uses a hybrid approach: tonal layering as the primary depth mechanism, with subtle ambient shadows reserved for floating elements (menus, dialogs, popovers, tooltips). Cards and surfaces are flat at rest — depth comes from the background scale (`#0A0A0A` → `#141414` → `#1A1A1A` → `#262626`), not from shadows.

### Shadow Vocabulary
- **Floating Shadow** (`rgba(200, 200, 200, 0.15)`): Applied to dialogs, menus, popovers. Subtle, ambient, never sharp. The shadow is functional — it tells the user "this is above the surface" — not decorative.
- **Focus Glow** (`0 0 0 2px {color}`): Focus rings on interactive elements. Uses the element's accent color at full opacity. Sharp, precise, never blurred.
- **Gradient Glow** (`1px 0px 6px -1px {start}, -1px 0px 6px -1px {end}`): Applied on hover/active to gradient-bordered buttons. A subtle dual-color glow that signals interactivity on premium elements.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only on floating elements (menus, dialogs, popovers) and as response to state (hover, focus). Never apply shadows to cards, list items, or static surfaces to "elevate" them — use the tonal background scale instead.

**The No-Card-Shadow Rule.** Cards and containers convey depth through background color, not shadows. A card on the canvas uses `#141414`; a card on a surface uses `#1A1A1A`. No `box-shadow` on static cards.

## 5. Components

### Buttons
- **Shape:** Sharp 4px radius (`theme.shape.borderRadius`)
- **Primary:** Solid Electric Blue (`#019BE5`) background, white text. Hover → dark blue (`#006699`). Focus → 2px blue glow ring. Disabled → grey background, muted text.
- **Secondary:** Transparent background, blue text, 1px blue border. Hover → 15% blue tint background. Active → 25% blue tint.
- **Tertiary:** Transparent background, blue text, no border. Hover → 15% blue tint. Active → 15% tint + focus ring.
- **Destructive:** Solid error red (`#F14337`) background, white text. Hover → dark red (`#881106`).
- **Gradient (Extra):** Transparent background with 2px gradient border (blue→purple or custom). Text uses gradient clip. Hover → gradient glow shadow. Reserved for premium/AI features.
- **Sizes:** Default (36px height, 8px 16px padding, 14px font, 600 weight). Small (26px height, 4px 12px padding, 13px font, 600 weight).
- **Transition:** `all 0.2s ease-in-out` for solid variants; `box-shadow 0.3s ease-out` for gradient variants.

### Chips
- **Style:** Transparent or tonal background, white text, 4px radius. Lowercase with first-letter uppercase.
- **State:** Selected chips use accent color at 15-25% opacity background. Filter chips, status chips, and category chips follow the same pattern.

### Cards / Containers
- **Corner Style:** 4px radius
- **Background:** Dark Surface (`#141414`) on canvas, Dark Elevated (`#1A1A1A`) on surfaces
- **Shadow Strategy:** None at rest (see Elevation: The No-Card-Shadow Rule)
- **Border:** 1px Dark Border (`#262626`) when separation is needed; no border when tonal layering is sufficient
- **Internal Padding:** 16px default (`spacing.md`)

### Inputs / Fields
- **Style:** Standard variant (underline) by default. Outlined variant uses Dark Surface (`#141414`) background with transparent border. 4px radius.
- **Focus:** Bottom border shifts to Electric Blue (`#019BE5`). 2px solid blue underline.
- **Error:** Bottom border shifts to Error Red (`#F14337`). 2px solid red underline.
- **Disabled:** Grey background (`#363B46`), muted text.
- **Placeholder:** Must maintain ≥4.5:1 contrast. Use `#AFB0B6` on dark surfaces, not pure grey.

### Navigation (LeftBar)
- **Style:** Transparent background on canvas (`#0A0A0A`). White text. 4px radius.
- **Hover:** Dark Elevated (`#1A1A1A`) background.
- **Active/Selected:** Left inset shadow (2px Electric Blue) + 24% blue tint background.
- **Sub-items:** Indented, same hover/active pattern.
- **Footer:** Brand text, no external logos.

### Toggle Button Groups
- **Style:** 36px height, 1px Dark Border Strong (`#404040`) border between buttons.
- **Selected:** 25% blue tint background.
- **Hover (unselected):** 15% blue tint background.
- **Focus:** 2px light blue glow ring.

### Dialogs
- **Background:** Dark Elevated (`#1A1A1A`) — not paper, not canvas. One step above.
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
- **Do** use the black canvas (`#0A0A0A`) as the primary background. It is the instrument's housing.
- **Do** layer surfaces through the tonal scale (`#0A0A0A` → `#141414` → `#1A1A1A` → `#262626`) for depth, not shadows.
- **Do** use Electric Blue (`#019BE5`) for primary actions, focus, and interactive emphasis.
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
- **Don't** use glassmorphism — blurs and glass cards as decoration. The instrument is solid, not translucent.
- **Don't** introduce rounded corners beyond 4px. The system is sharp and precise, not soft.
- **Don't** use generic SaaS patterns — cookie-cutter card grids, hero-metric templates, identical icon+heading+text cards repeated endlessly.
- **Don't** use tiny uppercase tracked eyebrows above every section. The lowercase + first-letter uppercase pattern is the voice; all-caps eyebrows are a different, rejected aesthetic.
- **Don't** apply shadows to cards to "elevate" them. Use the background tonal scale.
- **Don't** use a second or third font family. Weight and size create hierarchy, not new fonts.
- **Don't** use accent colors for decoration. Blue is action, red is danger, purple is intelligence — each has a job.
- **Don't** use the AI-generated aesthetic — purple gradients everywhere, glassmorphism as default, rounded cards with emoji icons, "powered by AI" badges. AI features (Ask Arman, Twitter Monitor) must feel like professional instruments, not novelty demos.
- **Don't** ship the Ravin Style as a paint job over OpenCTI defaults. The theme files must be fully updated — no residual OpenCTI color DNA in any token.
