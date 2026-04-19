# FIRE Calculator

**Plan your path to Financial Independence, Retire Early — entirely in your browser.**

FIRE Calculator is a personal finance tool that models your FIRE and Coast FIRE timelines based on your real income, expenses, investments, and location. No accounts, no servers, no data leaving your device.

---

## What it does

Enter your financial profile once and get a real-time dashboard showing:

- **When you can retire** — exact year and age based on your current savings rate
- **Your FIRE number** — portfolio size needed to sustain your retirement expenses
- **Coast FIRE progress** — when you can stop contributing and let compound growth do the rest
- **What-If scenarios** — model changes to contributions, expenses, or return assumptions
- **Relocation analysis** — compare cost-of-living across all 50 US states to see how moving accelerates your timeline

---

## Key Features

**Results Dashboard**
- Retirement goal card with inline-editable target age
- FIRE number and progress ring (% of FIRE number reached today)
- Coast FIRE today — current coast number with progress percentage
- Coast Goals — target coasting age with progress ring
- Time to FIRE and predicted coast age with year/age sub-labels
- Coast FIRE by Age table — per-year glide path with on-track benchmarks and annual growth needed

**What-If Panel**
- Sliders for monthly contribution, retirement expenses, and real return rate
- Live re-calculation of FIRE year, FIRE number, and years saved/lost vs. baseline

**Relocate Panel**
- State selector to set your current location
- Cost-of-living adjusted expense comparison across all US states
- Ranked list of states with years-to-FIRE delta and projected savings

**Setup Wizard**
- 3-step onboarding: Personal → Finances → Assumptions
- Expense breakdown by 15 categories with auto-calculated retirement estimate
- Inline editable values on the results dashboard for quick updates

**UX**
- Dark / light mode toggle
- Animated sliding tab navigation
- All data persisted in localStorage — works offline, no login required
- Methodology modal explaining FIRE and Coast FIRE concepts

---

## Calculation Approach

All projections use **real (inflation-adjusted) returns**. Portfolio growth, FIRE number, and Coast FIRE number are all expressed in today's dollars.

- **FIRE Number** = Annual Retirement Expenses ÷ Safe Withdrawal Rate
- **Coast FIRE Number** = FIRE Number ÷ (1 + real return) ^ years to retirement
- **Years to FIRE** = binary search over compound growth function to find when portfolio crosses FIRE number
- **Retirement expenses** default to 80% of current expenses, adjustable by lifestyle factor or per-category multipliers

---

## Version

**v0.1.0** — Initial release  
Calculator · What-If · Relocate tabs  
All 50 US states supported  
No backend, no tracking

---

*Not financial advice. All projections are estimates based on the assumptions you provide.*
