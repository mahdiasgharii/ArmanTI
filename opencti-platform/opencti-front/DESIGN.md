# Ravin Style Design System

## Colors

### Canvas & Surfaces
- **Black Canvas**: `#0A0A0A` — primary background, the instrument's housing
- **Surface**: `#141414` — cards on canvas
- **Elevated**: `#1A1A1A` — cards on surfaces, hover states
- **Surface-2**: `#262626` — inputs, active states, tonal depth

### Accents (surgical, ≤15% of screen)
- **Electric Blue**: `#019BE5` — primary actions, focus, interactive emphasis
- **Signal Red**: `#F20F0F` — destructive actions, danger, critical severity
- **Violet Accent**: `#860EFE` — AI features, intelligence analysis highlights
- **Success Green**: `#17AB1F` — positive status, boolean true

### Borders
- **Default**: `#262626` — tonal border, barely visible
- **Strong**: `#404040` — emphasized border, focus-adjacent

## Typography
- **Geologica** — headings, display numbers, metrics
- **IBM Plex Sans** — body, labels, UI text
- **Lowercase + first-letter uppercase** — signature voice pattern for headings, chips, tabs, tooltips
- No third font family. Weight and size create hierarchy.

## Elevation
- Flat by default. No shadows on static cards or surfaces.
- Depth through tonal background scale: `#0A0A0A → #141414 → #1A1A1A → #262626`
- Shadows only on floating elements (menus, dialogs, popovers) and as response to state (hover, focus)

## Border Radius
- 4px throughout — sharp, precise, not soft

## Rules
1. **Surgical Accent Rule**: Accent colors on ≤15% of any screen. Black canvas and grey scale carry 85%+ of visual weight.
2. **No-Teal Rule**: Original OpenCTI cyan/teal palette prohibited.
3. **Gradient Border Rule**: Gradient borders (blue→purple) reserved for premium feature actions and AI elements only.
4. **Lowercase Voice Rule**: `text-transform: lowercase` with `&::first-letter { text-transform: uppercase }` on headings.
5. **Two-Font Rule**: Geologica + IBM Plex Sans. No exceptions.
6. **Flat-By-Default Rule**: No box-shadow on static cards. Use tonal scale for depth.
7. **No-Card-Shadow Rule**: Cards convey depth through background color, not shadows.
