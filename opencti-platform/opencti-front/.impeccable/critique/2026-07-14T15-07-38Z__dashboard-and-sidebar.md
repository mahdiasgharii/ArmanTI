---
target: dashboard-and-sidebar
total_score: 22
p0_count: 0
p1_count: 3
timestamp: 2026-07-14T15-07-38Z
slug: dashboard-and-sidebar
---
## Design Critique: Dashboard & Sidebar

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Live/auto-refresh indicators present; no loading skeleton for dashboard widgets |
| 2 | Match System / Real World | 3 | CTI domain language is appropriate; lowercase-first-letter pattern is consistent |
| 3 | User Control and Freedom | 2 | No undo for sidebar collapse state; no "back to dashboard" from deep routes |
| 4 | Consistency and Standards | 2 | Mixed design systems: Tailwind classes on dashboard, MUI JSS on sidebar |
| 5 | Error Prevention | 2 | No empty states for dashboard widgets when data is unavailable |
| 6 | Recognition Rather Than Recall | 3 | Icons + labels when sidebar open; tooltips when collapsed |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; no command palette |
| 8 | Aesthetic and Minimalist Design | 2 | Too many cards in a flat grid, no hierarchy |
| 9 | Error Recovery | 2 | Relay Suspense fallback is a generic Loader, no error boundary with retry |
| 10 | Help and Documentation | 1 | No contextual help, no tooltips on dashboard headers, no onboarding |
| **Total** | | **22/40** | **Acceptable** |

### Anti-Patterns Verdict

LLM assessment: Template dashboard with no personality. Wall of equally-weighted cards.

Deterministic scan: 4 findings — 2 layout-transition warnings (width/margin animation), 2 design-system-radius advisories (12px outside DESIGN.md scale).

### Priority Issues

1. [P1] Dashboard card grid has zero hierarchy — 11 widgets with equal visual weight
2. [P1] Mixed styling systems: Tailwind vs MUI JSS — sidebar and dashboard can drift
3. [P1] Dashboard cards use bg-canvas (#0a0a0a) instead of card surface token — cards darker than container
4. [P2] No loading skeletons for dashboard widgets — generic Loader spinner
5. [P2] Sidebar width animation causes layout thrash

### Persona Red Flags

Alex: No keyboard shortcuts, no command palette, no bulk actions.
Jordan: Raw entity type names with no explanation, no empty states, overwhelming sidebar.
Sam: Icon-only collapsed sidebar without aria-labels, pulse-dot conveys status through color alone, no heading structure on dashboard widgets.
