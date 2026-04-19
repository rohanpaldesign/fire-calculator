# FIRE Calculator — Product & Design Reference

Internal reference document. Covers product requirements, feature design, technical architecture, and key decisions.

---

## Product Overview

**Goal:** A self-contained, privacy-first FIRE planning tool that runs entirely in the browser. No accounts, no server, no analytics.

**Target user:** Someone who is aware of FIRE concepts and wants a single tool to track their progress, model scenarios, and understand how location and lifestyle choices affect their timeline.

**Non-goals:**
- Real brokerage/portfolio integration
- Multi-user / account sync
- Tax filing or legal advice
- Mobile app (web-responsive only)

---

## Feature Set (PRD)

### F1 — Setup Wizard
3-step modal that captures the user's financial profile on first visit. Reopenable from the "Edit All Inputs" button on the results dashboard.

**Step 1 — Personal**
- Current age, target retirement age, target coast age
- Editable: currentAge, retirementAge, targetCoastAge

**Step 2 — Finances**
- Current portfolio (currentAssets)
- Gross income + filing status → auto-estimated net take-home (autoTakeHome flag)
- Annual expenses with optional 15-category breakdown
- Retirement expenses: auto mode (lifestyle factor × current) or manual override
- Monthly investment contribution

**Step 3 — Assumptions**
- Real return rate (default 7%)
- Inflation rate (default 3%)
- Safe withdrawal rate (default 4%)
- State/location (used for COL-adjusted relocation analysis)

**Persistence:** Profile stored in localStorage under key `fire-calculator-profile-v4`. `isSetupComplete` flag also stored. On reset, both are cleared and the wizard re-appears.

---

### F2 — Results Dashboard

The primary view after setup. Three sections:

#### Quick Inputs Bar
Inline-editable fields at the top of the dashboard for the most-changed values:
- Portfolio (currentAssets)
- Current Annual Expenses (annualExpenses)
- Retirement Expenses (retirementExpenses) — shows "auto" badge when in auto mode; editing switches to manual

#### Summary Cards (Row 1)
**Retirement Goal card**
- Editable target retirement age
- FIRE number (today's dollars at configured SWR)
- Progress ring: currentAssets / fireNumber

**Current Monthly Investment card**
- Editable monthly contribution
- Time to FIRE: year (~2064) + "X years left" sub-label
- Predicted Coast Age: age + "Y yrs from retirement" sub-label (or "Can coast now" / "at retirement")

#### Summary Cards (Row 2)
**Coast Goals card**
- Target coasting age (editable)
- Coast target at that age (portfolio needed)
- Progress ring: currentAssets / coastFireAtTargetAge

**Coast FIRE Today card**
- Coast FIRE number as of today
- Text: "You are at X% of this target today. Reach 100% to stop contributing and still retire on time."

#### Coast FIRE by Age Table
Per-year breakdown from currentAge to targetCoastAge:
- Age
- Coast Target (stop contributing at this age to coast to FIRE by retirement)
- Portfolio (projected at current contribution rate, real terms)
- On-Track Goal (glide path benchmark to reach coast target by targetCoastAge)
- Annual Growth (incremental benchmark step year-over-year)

Rows highlighted green when portfolio >= coastTarget for that age.

---

### F3 — What-If Panel

Three sliders with live recalculation against baseline results:
- Monthly contribution (0 → 2× baseline)
- Retirement expenses (50% → 150% of baseline)
- Real return rate (3% → 12%)

Each change re-runs `calcFireResults` with overrides. Displays: FIRE year, FIRE number, years vs baseline.

---

### F4 — Relocate Panel

State selector sets current location. Remaining states shown ranked by years-to-FIRE impact.

For each state:
- COL index (national baseline = 100)
- Adjusted annual expenses = currentExpenses × (targetCOL / currentCOL)
- Years to FIRE with adjusted expenses
- Delta vs current state (highlighted green = faster, red = slower)

Data source: `lib/cost-of-living.ts` — static COL indices for all 50 states + DC.

---

### F5 — Navigation & Header

Sticky header with:
- "FIRE Calculator" title (emerald)
- ⓘ info button → opens Methodology Modal
- Sliding pill tab group: Calculator · What-If · Relocate (CSS grid, equal columns, animated translateX pill)
- Theme toggle (dark/light)
- Reset button (clears localStorage, returns to landing)
- Profile button (disabled, placeholder for future auth)

Tabs only shown after setup is complete. Landing page shows "Get Started" + "Learn about FIRE" button.

---

### F6 — Methodology Modal

Triggered by ⓘ button or "Learn about FIRE" link on landing. Explains:
- FIRE: concept, FIRE number formula, 4% rule example
- Coast FIRE: concept, Coast FIRE number formula, compounding rationale

---

## Data Model

### FireProfile (input)

```typescript
interface FireProfile {
  currentAge: number;
  retirementAge: number;
  targetCoastAge: number;
  location: USState;                        // all 50 states + DC
  grossIncome: number;
  netIncome: number;
  filingStatus: "single" | "married";
  autoTakeHome: boolean;                    // if true, netIncome is computed from grossIncome
  annualExpenses: number;
  expenseCategories?: Partial<ExpenseCategories>;  // 15 categories, optional
  retirementExpenses: number;
  retirementExpensesMode: "auto" | "manual";
  retirementLifestyleFactor: number;        // multiplier, default 0.80
  retirementExpenseCategories?: Partial<ExpenseCategories>;
  currentAssets: number;
  monthlyContribution: number;
  nominalReturn: number;                    // stored but unused in main calcs
  realReturn: number;                       // used for all projections
  inflationRate: number;
  safeWithdrawalRate: number;
  baristaPartTimeIncome?: number;           // reduces effective FIRE number
}
```

### FireResults (output of calcFireResults)

```typescript
interface FireResults {
  numbers: {
    fireNumber: number;                     // target portfolio in today's dollars
    coastFireNumber: number;               // coast number as of today
    coastFireAtTargetAge: number;          // coast number at targetCoastAge
    leanFireNumber: number;                // at 5% SWR
    fatFireNumber: number;                 // at 3% SWR
    baristaFireNumber: number;             // reduced by part-time income
    nominalFireNumber: number;             // fireNumber in future dollars
    portfolioAtRetirementAge: number;
    portfolioAtFireDate: number | null;
  };
  progress: {
    fireProgress: number;                  // currentAssets / fireNumber
    coastFireProgress: number;             // currentAssets / coastFireNumber
    leanFireProgress: number;
    fatFireProgress: number;
  };
  timeline: {
    yearsToFire: number | null;
    fireDate: Date | null;
    fireAge: number | null;
    coastFireAchievedAge: number | null;
    predictedCoastAge: number | null;
    coastByAge: CoastAgePoint[];
    projectedPortfolioByYear: PortfolioDataPoint[];
    monthlyContribNeeded: number | null;
    expenseReductionNeeded: number | null;
  };
}
```

---

## Calculation Design (`lib/calculations.ts`)

### Core functions

**`futureValue(pv, monthlyContrib, annualReturn, years)`**
- Converts years → integer months: `n = Math.round(years * 12)`
- Standard future value of growing annuity formula
- Discrete monthly step function — intentional for precision

**`calcYearsToFire(currentAssets, monthlyContrib, annualReturn, target)`**
- Binary search (60 iterations) over `futureValue` to find fractional years
- Returns null if portfolio never reaches target within 100 years

**`calcCoastFireNumber(fireNumber, realReturn, fromAge, retirementAge)`**
- `fireNumber / (1 + realReturn)^(retirementAge - fromAge)`
- Returns `fireNumber` when `fromAge >= retirementAge` (years ≤ 0)

**`calcFireResults(profile, overrides?)`**
Main orchestrator. Key computed values in order:
1. Effective retirement expenses (auto or manual)
2. fireNumber, lean/fat/barista variants
3. coastFireNumber (today), coastFireAtTargetAge
4. recommendedMonthly (contribution needed to hit coast target by targetCoastAge)
5. coastByAge table (currentAge → targetCoastAge)
6. predictedCoastAge loop (integer ages 0–100, first age where portfolio ≥ coast target)
7. yearsToFire (binary search)
8. **Cap**: `predictedCoastAge = min(predictedCoastAge, ceil(currentAge + yearsToFire))` — prevents rounding mismatch between Math.round (fireAge display) and the integer loop
9. fireDate, fireAge
10. portfolioTimeline for chart

### Rounding conventions

- `fireAge` display: `Math.round(currentAge + yearsToFire)` — nearest integer age
- `fireDate` display: `Math.ceil(yearsToFire)` — first full year when FIRE is reachable
- `predictedCoastAge` cap: `Math.ceil(currentAge + yearsToFire)` — consistent with fireDate
- All portfolio values: `Math.round()` before display

### Real vs nominal

- **All projections use `realReturn`** — results are in today's purchasing power
- `nominalReturn` field is stored but only used for the legacy `portfolioAtRetirementAge` field (nominal future value for reference)
- `nominalFireNumber` = fireNumber × (1 + inflationRate)^yearsToFire, shown as a reference figure only

---

## Component Architecture

```
app/page.tsx
├── Header (sticky, tabs, theme, reset)
├── SetupWizard (modal, shown on first visit or "Edit All")
├── ResultsDashboard
│   ├── Quick Inputs bar (inline editable: portfolio, expenses)
│   ├── FireSummaryCards
│   │   ├── Row 1: RetirementGoalCard + MonthlyInvestmentCard
│   │   └── Row 2: CoastGoalsCard + CoastFireTodayCard
│   │       └── Coast FIRE by Age table
│   ├── PortfolioChart (line chart, portfolio vs FIRE target over time)
│   └── ExpensePieChart
├── WhatIfPanel (sliders, delta vs baseline)
├── RelocationPanel (state selector, ranked state table)
└── MethodologyModal (FIRE + Coast FIRE explainer)
```

### Key shared components (`components/ui/`)
- `Card` — rounded-xl, border, bg-card, no shadow
- `EditableValue` — click-to-edit inline field with pencil icon, blur/Enter commits, Escape cancels
- `ProgressRing` — SVG circle, percentage label, configurable size and color
- `MethodologyModal` — modal overlay with scrollable content

---

## State Management

**No global state library.** State is managed at the `app/page.tsx` level and passed down as props.

- `useFireProfile` hook: reads/writes `FireProfile` to localStorage, exposes `updateProfile(patch)`, `resetProfile()`, `isSetupComplete`, `markSetupComplete`, `hydrate()`
- `useFireCalculations(profile)` hook: memoized call to `calcFireResults`, re-runs on any profile change
- Results flow: `profile` → `calcFireResults` → `results` → passed as props to all panels

---

## Styling System

Tailwind CSS v4 with CSS custom properties for theming. All colors use `var(--token)`:

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#ffffff` | `#0f172a` |
| `--bg-card` | `#f8fafc` | `#1e293b` |
| `--bg-input` | `#f1f5f9` | `#334155` |
| `--fg` | `#0f172a` | `#f8fafc` |
| `--fg-muted` | `#64748b` | `#94a3b8` |
| `--border` | `#e2e8f0` | `#334155` |

Dark mode applied via `.dark` class on `<html>` (next-themes). Custom variant: `@custom-variant dark (&:where(.dark, .dark *))`.

Cards have no shadow — differentiated by border color and `--bg-card` background.

---

## Key Design Decisions

**Privacy-first, no backend:** All data in localStorage. No telemetry, no accounts, no server. Static export to GitHub Pages. Future auth (profile icon placeholder) deferred.

**Real-terms projections only:** Using `realReturn` throughout eliminates the need to show inflation-adjusted vs nominal comparisons to users. "Today's dollars" framing is simpler and more actionable.

**Inline editing on dashboard:** Rather than a settings page, values can be tweaked directly on the results cards (EditableValue component). Setup wizard is for full re-configuration only.

**CSS Grid for tab pill:** `flex-1` without a fixed container width causes unequal tab widths due to each button collapsing to min-content. CSS Grid with `1fr` columns guarantees equal widths regardless of label length.

**predictedCoastAge cap:** The integer-year loop can produce a coast age higher than the displayed fireAge because `fireAge` uses `Math.round` (which can round down). The cap at `Math.ceil(currentAge + yearsToFire)` ensures consistency with how `fireDate` is displayed.

**No Lean/Fat FIRE UI:** Numbers computed internally (for potential future use) but not surfaced in the current UI — user feedback indicated they added noise.

**Coast by Age table bounded at targetCoastAge:** Only shows years up to the user's target coast age, not all the way to retirement. Keeps the table focused and actionable.

---

## File Structure

```
app/
  globals.css          CSS custom properties, dark mode variant
  layout.tsx           Font loading, ThemeProvider
  page.tsx             App root, state orchestration

components/
  layout/
    Header.tsx         Sticky header, tab group, theme/reset/profile buttons
  results/
    ResultsDashboard.tsx  Quick inputs bar, "Edit All" button
    FireSummaryCards.tsx  4 summary cards + coast-by-age table
    PortfolioChart.tsx    Recharts line chart
    ExpensePieChart.tsx   Expense category breakdown
    ProgressRing.tsx      SVG ring component
  setup/
    SetupWizard.tsx    3-step onboarding modal
  whatif/
    WhatIfPanel.tsx    Slider-based scenario panel
  location/
    RelocationPanel.tsx  State selector + COL comparison table
  ui/
    card.tsx           Card, CardTitle, CardValue, CardDescription
    editable-value.tsx Inline click-to-edit component
    MethodologyModal.tsx FIRE concept explainer modal

lib/
  calculations.ts      All FIRE math: futureValue, calcFireResults, etc.
  constants.ts         DEFAULT_PROFILE, STORAGE_KEY
  cost-of-living.ts    COL indices for all 50 states + DC
  formatters.ts        formatCurrency, formatPct helpers
  tax-estimates.ts     Gross → net income estimation
  utils.ts             cn() class merge utility

hooks/
  useFireProfile.ts    localStorage read/write, hydration, isSetupComplete
  useFireCalculations.ts Memoized wrapper around calcFireResults

types/
  fire.ts              FireProfile, FireResults, all sub-types
```

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 0.1.0 | 2026-04 | Initial release — Calculator, What-If, Relocate tabs; all 50 states; Coast FIRE by age table; sliding pill nav; dark/light mode |
