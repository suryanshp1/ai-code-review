# Design System Specification: CodeAIReview

## Overview

**CodeAIReview** (`ai-code-review`) is an automated AI-powered GitHub PR & code review SaaS platform engineered for high-velocity software engineering teams. Its interface functions as an **Engineering Command Center**: an ultra-precise, information-dense, dark-first workspace designed to evaluate pull requests, analyze multi-file unified git diffs, diagnose AST & architectural regressions, and post surgical inline review comments back to GitHub.

Where consumer SaaS relies on expressive illustrations and vibrant pastel gradients, CodeAIReview operates on an **instrumentation aesthetic**. The canvas is built from deep obsidian zinc tones (`{colors.canvas}` — `#09090b`), structured entirely by a ladder of razor-sharp 1px hairlines (`{colors.hairline}`) and disciplined luminance steps rather than decorative drop shadows. Color is never decorative; it is strictly semantic. Every hue maps to code state: **Terminal Emerald** (`{colors.diff.add}` — `#10b981`) for additions and verified checks, **Critical Rose** (`{colors.diff.delete}` / `{colors.status.error}` — `#f43f5e`) for deletions, vulnerabilities, and failed reviews, **Diagnostic Amber** (`{colors.status.warning}` — `#f59e0b`) for performance advisories and pending webhooks, and **Electric Indigo** (`{colors.accent}` — `#6366f1`) reserved exclusively for the autonomous AI review agent's synthesis and suggested diff replacements.

The typography embodies technical rigor: **Geist Mono** anchors all code diffs, line numbers, commit SHAs, file paths, and AST tokens, while **Geist Sans** drives the structural interface copy with tight 1.1–1.25 leading and declarative weight contrast. Geometry is compact and architectural: 6px radii (`{rounded.sm}`) on interactive buttons and inputs prevent wasteful dead space, 10px (`{rounded.md}`) encloses modular diagnostic cards, while code diff hunks retain square inner bounds (`{rounded.none}`) to preserve character-cell vertical alignment.

**Key Characteristics:**
- **Dark-First Instrumentation Canvas**: Deep Obsidian (`#09090b`) base with stepped zinc luminance layers (`#121215`, `#18181c`, `#222227`) and full light-mode parity.
- **Strict Semantic Chromatic Hierarchy**: Zero decorative color. Emerald (pass/add), Rose (fail/delete), Amber (warning/pending), Indigo (AI agent intelligence).
- **Dual-Engine Typography**: `Geist Mono` for diff hunks, hashes, metrics, and line gutters; `Geist Sans` for command chrome and executive review summaries.
- **Shadow-Free Elevation Ladder**: Hierarchical depth achieved through luminance differential and 1px border hairlines (`oklch(1 0 0 / 10%)`), eliminating visual blur in dense code inspections.
- **Compact Architectural Geometry**: 4px/6px interactive radius (`{rounded.xs}` / `{rounded.sm}`) maximizing horizontal code width and vertical diff line density.
- **Unified & Split Diff Surface**: Native line-by-line inspection engine with anchored inline review threads, severity chips, and one-click patch application.
- **Command-Center App Shell**: Collapsible 64px/240px icon-rail sidebar, persistent status breadcrumb header, and keyboard-first shortcut navigation (`Cmd+K`, `j`/`k` diff jumping).

---

## Colors

Source surfaces: Dashboard Overview, Repositories Inventory, Pull Request Review Stream, Diff Inspection Viewer, GitHub App Installation, and Account Settings.

### Brand & Accent
- **Electric Indigo** (`{colors.accent}` — `#6366f1` / `oklch(0.623 0.214 275.6)`): The intelligence accent. Represents the autonomous AI agent. Used on active review run indicators, "Generate AI Review" CTAs, agentic synthesis cards, and diff suggestion replacement bars.
- **Indigo Soft** (`{colors.accent-soft}` — `oklch(0.623 0.214 275.6 / 15%)`): Translucent wash behind AI badge indicators, active sidebar navigation pills, and AI comment thread anchors.
- **Obsidian Dark** (`{colors.canvas}` — `#09090b` / `oklch(0.148 0.004 228.8)`): Default dark canvas background across all dashboard views.
- **Studio White** (`{colors.canvas-light}` — `#ffffff` / `oklch(1 0 0)`): Default light canvas background for light mode.

### Surface Ladder (Dark Mode / Default)
- **Canvas** (`{colors.canvas}` — `#09090b`): Page base canvas, viewport background, and main layout backdrop.
- **Surface 1** (`{colors.surface-1}` — `#121215` / `oklch(0.18 0.006 230)`): Primary card container, table headers, sticky control bars, and sidebar surface.
- **Surface 2** (`{colors.surface-2}` — `#18181c` / `oklch(0.22 0.008 230)`): Hover state for interactive rows, secondary button fills, and popover menus.
- **Surface Field** (`{colors.surface-field}` — `#0d0d10` / `oklch(0.16 0.005 230)`): Inset form fields, search inputs, code editor line gutters, and terminal console viewports.
- **Surface Code** (`{colors.surface-code}` — `#050507` / `oklch(0.11 0.003 230)`): Diff hunk body canvas; engineered ultra-dark for maximum code syntax contrast.
- **Hairline Soft** (`{colors.hairline-soft}` — `oklch(1 0 0 / 8%)`): 1px structural dividers between card sections and code diff lines.
- **Hairline** (`{colors.hairline}` — `#27272a` / `oklch(1 0 0 / 14%)`): Standard border for cards, inputs, buttons, and table rows.
- **Hairline Active** (`{colors.hairline-active}` — `oklch(1 0 0 / 28%)`): Focus rings, active tabs, and highlighted diff hunks.

### Surface Ladder (Light Mode)
- **Canvas** (`{colors.canvas-light}` — `#ffffff`): Main page canvas.
- **Surface 1** (`{colors.surface-1-light}` — `#f8fafc`): Card backgrounds and sidebar fill.
- **Surface 2** (`{colors.surface-2-light}` — `#f1f5f9`): Hover states and button backgrounds.
- **Surface Field** (`{colors.surface-field-light}` — `#f1f5f9`): Inset input field backgrounds.
- **Surface Code** (`{colors.surface-code-light}` — `#f8fafc`): Diff viewer background.
- **Hairline** (`{colors.hairline-light}` — `#e2e8f0`): 1px card boundaries and table borders.

### Text & Ink
- **Foreground High** (`{colors.text-high}` — `#fafafa` dark / `#09090b` light): Page titles, headings, active code tokens, and primary CTA labels.
- **Foreground Regular** (`{colors.text-base}` — `#e4e4e7` dark / `#27272a` light): Default body text, review markdown comments, and diff code text.
- **Muted** (`{colors.text-muted}` — `#a1a1aa` dark / `#71717a` light): Metadata, commit timestamps, file paths, and table column headers.
- **Faint** (`{colors.text-faint}` — `#52525b` dark / `#a1a1aa` light): Diff line numbers, inactive tab labels, keyboard shortcut badges, and placeholders.

### Semantic Triage & Code Diffs
- **Diff Addition Background** (`{colors.diff.add-bg}` — `rgba(16, 185, 129, 0.12)`): Diff line added wash.
- **Diff Addition Text** (`{colors.diff.add-text}` — `#34d399`): Diff line added syntax text (`+`).
- **Diff Addition Gutter** (`{colors.diff.add-gutter}` — `#10b981`): 3px solid emerald vertical edge indicator.
- **Diff Deletion Background** (`{colors.diff.delete-bg}` — `rgba(244, 63, 94, 0.12)`): Diff line deleted wash.
- **Diff Deletion Text** (`{colors.diff.delete-text}` — `#fb7185`): Diff line deleted syntax text (`-`).
- **Diff Deletion Gutter** (`{colors.diff.delete-gutter}` — `#f43f5e`): 3px solid rose vertical edge indicator.
- **Status Success / Pass** (`{colors.status.success}` — `#10b981`): Passing GitHub checks, clean PR quality score (80–100), active repo sync.
- **Status Warning / Advisory** (`{colors.status.warning}` — `#f59e0b`): Code smell notices, pending check runs, review warnings, moderate score (50–79).
- **Status Critical / Error** (`{colors.status.error}` — `#f43f5e`): CVE vulnerabilities, breaking type regressions, failing checks, low score (<50).
- **Status Neutral / Info** (`{colors.status.info}` — `#38bdf8`): Architectural notes, AST refactor suggestions, informational messages.

---

## Typography

### Font Families

1. **Geist Sans** (`var(--font-geist-sans)`, system fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`):
   - Used for all interface chrome, headers, navigation elements, metrics titles, and review commentary.
2. **Geist Mono** (`var(--font-geist-mono)`, fallback: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`):
   - Used for all git diff code hunks, line numbers, file paths, commit SHAs, AST symbols, API payloads, and keyboard shortcut tokens.

### Hierarchy & Token Scale

| Token | Size | Weight | Line Height | Tracking | Font | Role & Usage |
|---|---|---|---|---|---|---|
| `{typography.display}` | 48px | 650 | 1.05 | -0.02em | Geist Sans | Landing page hero statements & major metrics counters |
| `{typography.heading-1}` | 32px | 650 | 1.15 | -0.02em | Geist Sans | Primary dashboard view titles ("Pull Request Review #142") |
| `{typography.heading-2}` | 24px | 600 | 1.20 | -0.015em | Geist Sans | Section headers, modal dialog titles, quality score headers |
| `{typography.heading-3}` | 18px | 600 | 1.25 | -0.01em | Geist Sans | Card titles, repository names, review group headings |
| `{typography.heading-4}` | 15px | 600 | 1.30 | 0 | Geist Sans | Sub-section titles, drawer headers, file name breadcrumbs |
| `{typography.title}` | 14px | 500 | 1.35 | 0 | Geist Sans | Navigation labels, table headers, filter triggers |
| `{typography.body-lg}` | 16px | 400 | 1.45 | 0 | Geist Sans | Lead paragraphs, AI review executive summary body |
| `{typography.body}` | 14px | 400 | 1.40 | 0 | Geist Sans | Default body copy, inline comments, description text |
| `{typography.body-sm}` | 13px | 400 | 1.40 | 0 | Geist Sans | Secondary metadata, helper text, commit authors |
| `{typography.code}` | 13px | 400 | 1.45 | 0 | Geist Mono | Diff code lines, syntax-highlighted statements |
| `{typography.code-sm}` | 12px | 500 | 1.35 | 0 | Geist Mono | Line numbers, commit SHA tags, AST node labels |
| `{typography.label}` | 11px | 600 | 1.20 | +0.04em | Geist Mono | Uppercase severity chips (`CRITICAL`, `WARN`, `PASS`) |
| `{typography.caption}` | 11px | 400 | 1.25 | 0 | Geist Sans | Timestamps, relative time ("2m ago"), copyright |

### Typographic Principles

- **Rigid Monospace Boundaries**: Monospace code and proportional interface copy never mix within the same visual container without explicit font declarations. Git hashes, branch names, and diff metrics are strictly `Geist Mono`.
- **Negative Tracking on Display Headings**: Display and Heading-1 scale use `-0.02em` letter-spacing to enforce tight, compact presence without loose whitespace.
- **Monospace Uppercase for Machine States**: Badges that represent system states (`CRITICAL`, `WARNING`, `PASS`, `SYNCED`, `MERGED`) are rendered in uppercase `Geist Mono` at 11px with `+0.04em` tracking for instant visual scanning.
- **Tight Vertical Rhythm**: Display line-heights sit between 1.05 and 1.25. Code line-height sits at a mathematically balanced 1.45 (18.85px on 13px font), allowing line numbers and inline comment expansion arrows to align perfectly.

---

## Layout

### Spacing System

- **Base Grid**: 4px standard engineering grid with 8px rhythm blocks.
- **Spacing Tokens**:
  - `{spacing.xxs}`: 2px (Micro dividers, nested borders)
  - `{spacing.xs}`: 4px (Tag padding, icon-text gap, badge vertical pad)
  - `{spacing.sm}`: 8px (Button vertical padding, compact row spacing, list item gaps)
  - `{spacing.md}`: 12px (Standard card internal padding, toolbar gaps)
  - `{spacing.lg}`: 16px (Card outer padding, section component gaps)
  - `{spacing.xl}`: 24px (Dashboard grid gap, panel margins)
  - `{spacing.xxl}`: 32px (Page container side padding)
  - `{spacing.section}`: 48px (Major view separation)
  - `{spacing.section-lg}`: 64px (Landing page feature blocks)

### Grid & Viewport Layout Architecture

1. **App Shell**:
   - **Sidebar**: Fixed 240px width (expanded) or 64px (collapsed icon-rail). Left-anchored with zero elevation, separated by a 1px `{colors.hairline}` vertical border.
   - **Command Header**: Sticky 56px height bar detached or pinned to the top viewport edge. Contains breadcrumbs, active repository switcher, PR search bar (`Cmd+K`), and user status avatar.
   - **Main Canvas**: Fluid responsive container with `max-w-7xl` constraint on analytics and repository views; switches to `max-w-full` full-bleed mode on the Pull Request Diff Viewer.
2. **Pull Request Diff Viewport Layout**:
   - **Left File Tree Sidebar**: 280px width containing changed files list, addition/deletion counters (`+14 -3`), and review status check icons.
   - **Center Code Diff Panel**: Unified or Split 2-pane code inspection area with sticky file header bar.
   - **Right AI Diagnostic Drawer**: 360px collapsible panel detailing the AI Review Run summary, architectural impact score, security checklist, and token consumption metrics.

### Responsive Breakpoints

| Name | Min Width | Layout Adaptation |
|---|---|---|
| `2xl` | 1536px | Full 3-pane diff view active (File Tree + Side-by-Side Diff + AI Summary Drawer) |
| `xl` | 1280px | Standard desktop dashboard; AI Summary Drawer collapses to drawer trigger |
| `lg` | 1024px | Diff viewer automatically collapses from 2-pane Split to Unified single-column |
| `md` | 768px | App Shell sidebar collapses to 64px icon-rail; repository table converts to stacked cards |
| `sm` | 640px | Mobile navigation drawer; diff view provides horizontal code scroll with fixed line gutter |
| `xs` | 480px | Compact mobile view; header condenses to repository name and PR badge |

---

## Elevation & Depth

CodeAIReview strictly rejects arbitrary drop shadows. Elevation is conveyed through **surface luminance hierarchy** and **1px hairline edges**, preventing blur artifacts from interfering with dense code diff reading.

| Level | Fill Surface | Border Treatment | Box Shadow | Usage |
|---|---|---|---|---|
| **Level 0 (Base)** | `{colors.canvas}` (`#09090b`) | None | None | Root page canvas, background behind panels |
| **Level 1 (Card)** | `{colors.surface-1}` (`#121215`) | 1px `{colors.hairline}` (`#27272a`) | None | Metric cards, repo list rows, diff file frames |
| **Level 2 (Active/Hover)** | `{colors.surface-2}` (`#18181c`) | 1px `{colors.hairline-active}` | None | Hovered table rows, active tab containers, secondary buttons |
| **Level 3 (Popout/Modal)** | `{colors.surface-1}` (`#121215`) | 1px `{colors.hairline-active}` | `0 12px 32px -4px rgba(0, 0, 0, 0.6)` | Dropdown menus, Command Bar (`Cmd+K`), Dialogs, Tooltips |
| **Inset (Input/Diff)** | `{colors.surface-field}` (`#0d0d10`) | 1px `{colors.hairline}` | Inset `0 1px 2px rgba(0,0,0,0.4)` | Text inputs, code gutter area, search bars |
| **AI Intelligent Scrim** | `oklch(0.623 0.214 275.6 / 6%)` | 1px `oklch(0.623 0.214 275.6 / 35%)` | None | AI review synthesis container & suggestion replacement blocks |

---

## Shapes & Geometry

### Border Radius Scale

| Token | Value | Applied UI Primitives |
|---|---|---|
| `{rounded.none}` | `0px` | Code diff line blocks, split-pane dividers, full-bleed table cells, line gutters |
| `{rounded.xs}` | `4px` | Inline `code` spans, commit SHA badges, keyboard shortcuts (`kbd`), diff gutter tags |
| `{rounded.sm}` | `6px` | Action buttons, text inputs, severity chips, dropdown items, filter tabs |
| `{rounded.md}` | `10px` | Metric stat cards, repository cards, modal windows, review summary containers |
| `{rounded.lg}` | `14px` | Major dashboard diagnostic panels, diff file outer headers |
| `{rounded.full}` | `9999px` | User avatars, status ping dots, toggle switch knobs, branch indicators |

### Geometry Rationale
- **Square Code Hunks (`0px`)**: Inside code diffs, any border radius on individual line blocks creates awkward clipping on text selection and misaligns the 3px green/red gutter stripe. Gutter bars must be flush edge-to-edge.
- **Architectural Radii (`6px` / `10px`)**: Sharp, disciplined corners reinforce the feeling of a precision terminal and developer tool rather than a toy application.

---

## Components

### 1. Buttons & Triggers

**`button-primary`** — "Run AI Review", "Apply Suggestion", "Save Configuration"
- Surface: `{colors.accent}` (`#6366f1`) solid fill (or `{colors.text-high}` high-contrast white in dark mode).
- Text: `{colors.text-high}` / `{colors.canvas}` in `{typography.title}` (14px, weight 500).
- Shape: `{rounded.sm}` (6px), height 36px, horizontal padding `{spacing.md}` (12px).
- Hover: 10% brightness increase, active 2% scale depression.

**`button-secondary`** — "View Check Runs", "Sync Repositories", "Export Review"
- Surface: `{colors.surface-2}` (`#18181c`), 1px `{colors.hairline}` border.
- Text: `{colors.text-high}` (`#fafafa`).
- Shape: `{rounded.sm}` (6px), height 36px, horizontal padding `{spacing.md}` (12px).

**`button-outline`** — "Documentation", "Cancel", "View on GitHub ↗"
- Surface: Transparent, 1px `{colors.hairline}` border.
- Text: `{colors.text-muted}` (`#a1a1aa`), hovering to `{colors.text-high}`.
- Shape: `{rounded.sm}` (6px), height 36px, horizontal padding `{spacing.md}`.

**`button-ghost`** — Icon action triggers (Copy commit SHA, Expand diff hunk, Toggle split mode)
- Surface: Transparent, hovering to `{colors.surface-2}`.
- Text: `{colors.text-muted}`, hovering to `{colors.text-high}`.
- Shape: `{rounded.sm}` (6px), size 32px × 32px icon square.

**`button-danger`** — "Disconnect Installation", "Delete Review Cache"
- Surface: Transparent with 1px border `{colors.status.error}` (`#f43f5e`), hovering to `rgba(244, 63, 94, 0.15)` fill.
- Text: `{colors.status.error}` (`#f43f5e`).

---

### 2. Code Review & Diff Viewer Components

**`diff-file-header`**
- Surface: `{colors.surface-1}` (`#121215`), 1px `{colors.hairline}` border, `{rounded.lg}` top corners.
- Contents: File path in `{typography.code}` (13px, bold file name, muted directory prefix), additions pill (`+18` in emerald), deletions pill (`-4` in rose), collapse/expand chevron, and "View raw file" button.

**`diff-hunk-gutter`**
- Surface: `{colors.surface-field}` (`#0d0d10`), width 48px per line-number column.
- Text: `{typography.code-sm}` (12px) in `{colors.text-faint}`, aligned right with 8px padding.
- State: When line is added, gutter displays a 3px `{colors.diff.add-gutter}` green marker; when line is deleted, a 3px `{colors.diff.delete-gutter}` red marker.

**`diff-line-added`**
- Surface: `{colors.diff.add-bg}` (`rgba(16, 185, 129, 0.10)`), no border.
- Text: `{typography.code}` (13px), syntax-highlighted with emerald tint on modified tokens.

**`diff-line-deleted`**
- Surface: `{colors.diff.delete-bg}` (`rgba(244, 63, 94, 0.10)`), no border.
- Text: `{typography.code}` (13px), syntax-highlighted with rose tint on deleted tokens.

**`inline-ai-comment-box`**
- Position: Anchored directly below the offending diff line, spanning full diff width with 12px indent.
- Surface: `{colors.surface-1}` (`#121215`), framed by a 2px solid `{colors.accent}` (`#6366f1`) left edge and 1px `{colors.hairline}` perimeter, `{rounded.sm}` corners.
- Header: AI Agent Avatar (18px squircle), "CodeAI Reviewer" badge in `{typography.title}`, timestamp, and severity chip (`CRITICAL` / `WARNING` / `INFO`).
- Body: Markdown-formatted diagnosis explaining the security vulnerability, race condition, or architectural regression.
- Suggested Diff Replacement: Nested `{colors.surface-code}` block with syntax highlighting showing the suggested replacement code.
- Actions: "Apply Suggestion to GitHub PR" (`button-primary` compact) and "Dismiss / Mark as False Positive" (`button-ghost`).

---

### 3. Triage & Diagnostic Indicators

**`severity-chip`**
- Compact status token: height 20px, `{rounded.xs}` (4px), padding `2px 6px`.
- **`CRITICAL`**: Fill `rgba(244, 63, 94, 0.15)`, border `1px solid rgba(244, 63, 94, 0.40)`, text `{colors.status.error}` (`#f43f5e`), font `{typography.label}`.
- **`WARNING`**: Fill `rgba(245, 158, 11, 0.15)`, border `1px solid rgba(245, 158, 11, 0.40)`, text `{colors.status.warning}` (`#f59e0b`), font `{typography.label}`.
- **`INFO`**: Fill `rgba(56, 189, 248, 0.15)`, border `1px solid rgba(56, 189, 248, 0.40)`, text `{colors.status.info}` (`#38bdf8`), font `{typography.label}`.

**`check-run-badge`**
- Displays current GitHub Check Run status:
  - **In Progress**: Pulsing amber circle dot with animated spinner + "Reviewing AST...".
  - **Completed / Passed**: Solid emerald checkmark + "Checks Passed (Score 94/100)".
  - **Action Required**: Solid rose exclamation + "2 Security Flaws Detected".

**`quality-score-gauge`**
- Circular or bar gauge representing overall PR code health (0–100):
  - `80–100`: Emerald (`#10b981`) — Clean, production-ready.
  - `50–79`: Amber (`#f59e0b`) — Needs minor revisions/tests.
  - `0–49`: Rose (`#f43f5e`) — Blocking architectural or security defects.

---

### 4. Navigation & App Shell Components

**`app-sidebar`**
- Fixed left column (`#121215`), 1px `{colors.hairline}` right border.
- Header: CodeAIReview logomark + active organization dropdown.
- Navigation Rows: 36px height items with Remix Icon (e.g., `RiGitPullRequestLine`, `RiFolderGitLine`, `RiGithubFill`, `RiSettings3Line`), active state highlighted via `{colors.accent-soft}` fill and `{colors.accent}` text.
- Footer: User profile button, Plan badge ("PRO"), and theme toggle.

**`header-command-bar`**
- Detached top bar with breadcrumb trail (`org / repo / PR #142`), fast commit switcher dropdown, and global search trigger displaying `Cmd+K`.

**`repo-sync-card`**
- Repository row displaying GitHub repo name in `{typography.code}`, private/public badge, default branch (`main`), automatic PR review switch toggle, and sync status timestamp.

---

## Examples (Illustrative)

### `ex-pr-review-summary`
The executive summary card mounted at the top of a Pull Request review page.
- **Surface**: `{colors.surface-1}` (`#121215`), border 1px `{colors.hairline}`, `{rounded.md}` (10px), padding `{spacing.lg}` (16px).
- **Layout**: 3-column header:
  - Column 1: Overall Quality Score Gauge (e.g. `92/100` in `{colors.status.success}`).
  - Column 2: Triage counts (0 Critical, 2 Warnings, 5 Informational).
  - Column 3: Review Execution Metrics (Execution time: `1.8s`, Tokens consumed: `4,210`, Model: `DeepSeek-Coder-V2`).
- **Body**: 3-bullet executive markdown summary summarizing architectural impact and risk factors.

### `ex-diff-hunk-viewer`
A syntax-highlighted code hunk exhibiting an addition and a deletion with inline review comment anchor.
- **Container**: `{colors.surface-code}` (`#050507`), `{rounded.none}` inside a `{rounded.md}` file card.
- **Line 41 (Context)**: Gutter `41 | 41`, surface neutral, text `{colors.text-base}`.
- **Line 42 (Deleted)**: Gutter `42 |   `, surface `{colors.diff.delete-bg}`, 3px red gutter, text `const rawQuery = req.query.id;` in `{colors.diff.delete-text}`.
- **Line 43 (Added)**: Gutter `   | 42`, surface `{colors.diff.add-bg}`, 3px green gutter, text `const id = z.string().parse(req.query.id);` in `{colors.diff.add-text}`.

### `ex-inline-ai-comment`
The active automated review annotation inserted below Line 42.
- **Anchor**: 2px solid `{colors.accent}` (`#6366f1`) left edge.
- **Header**: AI Agent icon, "CodeAI Bot", timestamp "Just now", `{severity-chip}` = `CRITICAL`.
- **Title**: "SQL Injection & Unvalidated Input Hazard".
- **Body**: "Direct access of `req.query.id` without runtime schema validation enables parameter tampering. Use Zod schema validation before passing parameters to the database adapter."
- **Diff Suggestion**: Shows exact 2-line replacement with a one-click "Accept and Commit" button.

### `ex-repo-card`
Repository card displayed within `/dashboard/repos`.
- **Surface**: `{colors.surface-1}`, 1px `{colors.hairline}` border, `{rounded.md}`.
- **Left**: GitHub repo icon, full name `acme-corp/payment-service`, lock icon (Private).
- **Right**: Webhook sync status badge (`SYNCED`), PR Auto-Review toggle switch (`ON`), "Configure Rules" button.

### `ex-app-shell-sidebar-row`
Navigation menu row in the dashboard sidebar.
- **Resting**: `{colors.text-muted}` icon and label, transparent fill.
- **Hover**: `{colors.surface-2}` background fill, `{colors.text-high}` text.
- **Active**: `{colors.accent-soft}` background fill, 2px `{colors.accent}` vertical left active bar, `{colors.accent}` text.

### `ex-toast-notification`
Transient alert spawned when a review run completes or a webhook is ingested.
- **Surface**: `{colors.surface-1}` (`#121215`), 1px `{colors.hairline-active}`, `{rounded.sm}` (6px), shadow `0 8px 24px rgba(0,0,0,0.5)`.
- **Icon**: Emerald checkmark.
- **Content**: "Review posted to GitHub PR #84 (3 suggestions generated)".

---

## Do's and Don'ts

### Do
- **Do use Geist Mono for all machine-readable values**: Commit SHAs (`a7f83b1`), line numbers, file paths, diff code, AST tokens, and keyboard shortcuts (`Cmd+K`).
- **Do enforce high line density**: Code review is an analytical task; keep line gutters compact (13px font, 18.85px line height) without arbitrary padding.
- **Do reserve Electric Indigo (`#6366f1`) exclusively for AI intelligence signals**: Only use Indigo on autonomous AI review comments, suggestions, and synthesis cards.
- **Do render diff addition/deletion gutters with 3px solid edge bars**: Always pair the translucent line background wash with a solid vertical gutter bar for unambiguous accessibility.
- **Do maintain strict dark-mode contrast**: Ensure all code syntax colors achieve at least 4.5:1 WCAG AA contrast against `{colors.surface-code}` (`#050507`).
- **Do display keyboard shortcut hints in `kbd` pills**: Accelerate power-user navigation (`j` next diff, `k` previous diff, `a` apply suggestion).
- **Do preserve 1px hairline edges**: Frame code blocks and cards with sharp borders instead of fuzzy drop shadows.

### Don't
- **Don't use generic AI rainbow or purple gradients on code chrome**: Avoid blurry radial glow backgrounds or animated rainbow borders; they distract from syntax error detection.
- **Don't round the corners of individual diff lines**: Code selection and line numbering must align flush with 0px corner radii.
- **Don't use color as the sole indicator of review severity**: Always combine color with a textual `{severity-chip}` label (`CRITICAL`, `WARNING`, `INFO`) and corresponding Remix Icon.
- **Don't hide line numbers or git commit SHAs**: Developers need exact line references to cross-check in their local IDEs.
- **Don't use floating drop shadows on resting cards**: Elevation in CodeAIReview is built strictly from the surface luminance ladder (`#09090b` → `#121215` → `#18181c`).
- **Don't allow diff text to wrap arbitrarily**: Long lines in diff viewports should scroll horizontally or truncate cleanly to preserve column alignment in split-pane mode.
