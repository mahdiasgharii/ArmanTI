# Product

## Register

brand

> **Dual register note:** This project operates across two registers. The Ravin Style brand identity is the primary lens (default), but the product UI — dashboards, data tables, forms, navigation — is an equally important surface. Brand work reinforces identity; product work serves analyst workflows. Override per task as needed.

## Users

Cyber threat intelligence analysts and security operations teams who spend extended sessions in a data-heavy platform — correlating threat actors, observables, TTPs, and IOCs. They work under time pressure, often in SOC or incident-response contexts, scanning tables, graphs, and dashboards for actionable signals. The interface must support rapid triage and deep investigation without visual fatigue. Secondary users include team leads who configure data sources (connectors, Twitter monitoring) and managers who review aggregated intelligence. The Twitter Monitoring dashboard extends the analyst workflow with real-time OSINT ingestion from curated threat-intelligence sources, tweet search, and STIX2 bundle generation.

## Product Purpose

ArmanCTI is a rebranded fork of OpenCTI — an open-source cyber threat intelligence platform built on the STIX2 standard. It exists to give organizations a powerful, visually distinctive tool for structuring, storing, and visualizing cyber threat knowledge. The Ravin Style design system is not a reskin; it is a core part of the product identity, signaling a deliberate departure from generic security-tool aesthetics. The Twitter Monitoring dashboard adds real-time OSINT capabilities via an external FastAPI backend, extending the platform beyond OpenCTI's original scope. Success looks like: analysts prefer ArmanCTI over vanilla OpenCTI because the interface feels sharper, more confident, and more modern — while retaining full functional parity and gaining new threat-intelligence workflows.

## Brand Personality

Bold, precise, modern. The interface speaks with expert confidence — no hand-holding, no decorative softness. Every element earns its place through function or identity. The Ravin Style palette (black canvas, electric blue, signal red, violet accent) conveys command-center authority without military cliché. Typography is clean and direct (IBM Plex Sans body, Geologica headings). The brand is carried through color conviction, typographic clarity, and deliberate contrast — not through ornamentation.

## Anti-references

- **Generic SaaS dashboards** — bland blue/gray palettes, cookie-cutter card grids, no personality. ArmanCTI must never feel like a template.
- **Original OpenCTI look** — dark navy (#070d19) with cyan/teal accents. The departure must be unmistakable; no residual OpenCTI color DNA.
- **Cluttered enterprise security tools** — dense toolbars, tiny fonts, no breathing room, 2000s-era UI patterns. ArmanCTI is spacious and confident.
- **Playful / consumer aesthetics** — rounded corners, pastel colors, casual tone. This is a professional intelligence platform, not a lifestyle app.
- **AI-generated aesthetic** — purple gradients everywhere, glassmorphism as default, rounded cards with emoji icons, "powered by AI" badges, the saturated 2026 AI-tool template. ArmanCTI uses AI features (Ask Arman, Twitter Monitor) but they must feel like professional instruments, not novelty demos.

## Design Principles

1. **Brand IS the product** — the Ravin Style design system is identity, not decoration. Color conviction, typographic clarity, and dark-first theming are the product's signature, not an afterthought layer.
2. **Departure, not iteration** — every visual choice should reinforce that ArmanCTI is its own thing, not a themed OpenCTI. If a color, shape, or pattern reads as "OpenCTI with a paint job," rethink it.
3. **Expert confidence** — the interface assumes competence. No excessive tooltips, no hand-holding copy, no decorative empty states. Show the data; let the analyst work.
4. **Dark by default, light as equal citizen** — the dark theme is the primary experience and must feel fully realized. The light theme is not a fallback; it gets the same craft.
5. **Spacious authority** — breathing room conveys control. Density is for data tables, not for chrome. Navigation, headers, and action areas should feel expansive, not cramped.

## Accessibility & Inclusion

WCAG 2.1 AA compliance. Body text must hit ≥4.5:1 contrast against background in both dark and light themes. The black-canvas dark theme with white text naturally supports this, but accent colors (blue #019BE5, red #F20F0F, purple #860EFE) must be verified for contrast when used as text or on interactive elements. Keyboard navigation, screen reader support, and reduced-motion alternatives are required for all interactive components. Color blindness: never rely on color alone to convey severity or status — pair with icons, labels, or patterns.

## Current State

The Ravin Style rebranding is actively in progress. The theme files (`ThemeDark.ts`, `ThemeLight.ts`) still contain original OpenCTI color values — the Ravin Style palette (black canvas `#0A0A0A`, electric blue `#019BE5`, signal red `#F20F0F`, violet accent `#860EFE`) has not yet been applied to the codebase. The Twitter Monitoring dashboard components exist and are functional, with routing, API integration, and UI components in place. The chatbot has been rebranded to "Ask Arman" with Twitter monitoring context awareness. Logo assets, navigation entries, and home dashboard widgets are partially implemented.
