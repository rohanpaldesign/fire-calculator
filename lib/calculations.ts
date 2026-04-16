import type { FireProfile, FireNumbers, FireProgress, FireTimeline, FireResults, PortfolioDataPoint, StateColData, RelocationOpportunity, WhatIfOverrides, ExpenseCategories } from "@/types/fire";

export const NATIONAL_COMFORT_RETIREMENT_BASELINE = 60000;

export const RETIREMENT_CATEGORY_MULTIPLIERS: Record<keyof ExpenseCategories, { multiplier: number; label: string }> = {
  housing:         { multiplier: 0.80, label: "Possible downsize or mortgage payoff" },
  utilities:       { multiplier: 1.10, label: "More time at home" },
  groceries:       { multiplier: 1.05, label: "Cook more at home" },
  dining:          { multiplier: 1.30, label: "More time to eat out" },
  healthcare:      { multiplier: 1.80, label: "Large increase pre-Medicare" },
  medications:     { multiplier: 1.50, label: "Tends to increase with age" },
  transport:       { multiplier: 0.55, label: "No commute, fewer work trips" },
  travel:          { multiplier: 1.50, label: "Finally time to explore" },
  hobbies:         { multiplier: 1.30, label: "More leisure time" },
  clothing:        { multiplier: 0.65, label: "No work attire needed" },
  personalCare:    { multiplier: 0.90, label: "Similar" },
  subscriptions:   { multiplier: 0.85, label: "Drop work tools" },
  gifts:           { multiplier: 1.10, label: "More time to be generous" },
  homeMaintenance: { multiplier: 1.20, label: "More time at home" },
  other:           { multiplier: 0.85, label: "No work-related costs" },
};

export function calcAutoRetirementExpenses(profile: FireProfile): number {
  const { annualExpenses, expenseCategories, retirementLifestyleFactor } = profile;
  if (expenseCategories) {
    const catTotal = Object.values(expenseCategories).reduce((s, v) => s + (v ?? 0), 0);
    if (catTotal > 100) {
      let retirementCatTotal = 0;
      for (const [key, { multiplier }] of Object.entries(RETIREMENT_CATEGORY_MULTIPLIERS)) {
        const cat = expenseCategories[key as keyof ExpenseCategories] ?? 0;
        retirementCatTotal += cat * multiplier;
      }
      const uncategorized = Math.max(0, annualExpenses - catTotal);
      return Math.round(retirementCatTotal + uncategorized * retirementLifestyleFactor);
    }
  }
  return Math.round(annualExpenses * retirementLifestyleFactor);
}

export function calcLocationComfortEstimate(colIndex: number): number {
  return Math.round((NATIONAL_COMFORT_RETIREMENT_BASELINE * colIndex) / 100);
}

export function calcFireNumber(annualExpenses: number, swr: number): number {
  if (swr <= 0) return Infinity;
  return annualExpenses / swr;
}

export function calcCoastFireNumber(fireNumber: number, realReturn: number, currentAge: number, retirementAge: number): number {
  const years = retirementAge - currentAge;
  if (years <= 0) return fireNumber;
  return fireNumber / Math.pow(1 + realReturn, years);
}

export function futureValue(presentValue: number, monthlyContrib: number, annualReturn: number, years: number): number {
  const r = annualReturn / 12;
  const n = Math.round(years * 12);
  if (r === 0) return presentValue + monthlyContrib * n;
  return presentValue * Math.pow(1 + r, n) + monthlyContrib * ((Math.pow(1 + r, n) - 1) / r);
}

export function calcYearsToFire(currentAssets: number, monthlyContrib: number, annualReturn: number, target: number): number | null {
  if (currentAssets >= target) return 0;
  if (futureValue(currentAssets, monthlyContrib, annualReturn, 100) < target) return null;
  let lo = 0, hi = 100;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    futureValue(currentAssets, monthlyContrib, annualReturn, mid) < target ? (lo = mid) : (hi = mid);
  }
  return (lo + hi) / 2;
}

export function buildPortfolioTimeline(profile: FireProfile, fireNumber: number, coastFireNumber: number, monthlyContrib: number): PortfolioDataPoint[] {
  const currentYear = new Date().getFullYear();
  const maxYears = Math.max(profile.retirementAge - profile.currentAge + 5, 40);
  const points: PortfolioDataPoint[] = [];
  for (let y = 0; y <= maxYears; y++) {
    points.push({
      age: profile.currentAge + y, year: currentYear + y,
      portfolioValue: Math.round(futureValue(profile.currentAssets, monthlyContrib, profile.nominalReturn, y)),
      fireTarget: Math.round(fireNumber), coastFireTarget: Math.round(coastFireNumber),
    });
  }
  return points;
}

export function findCoastFireAge(timeline: PortfolioDataPoint[], coastFireNumber: number): number | null {
  for (const pt of timeline) { if (pt.portfolioValue >= coastFireNumber) return pt.age; }
  return null;
}

export function calcMonthlyContribNeeded(currentAssets: number, annualReturn: number, target: number, yearsAvailable: number): number {
  const r = annualReturn / 12;
  const n = yearsAvailable * 12;
  const fvOfPV = currentAssets * Math.pow(1 + r, n);
  const remaining = target - fvOfPV;
  if (remaining <= 0) return 0;
  if (r === 0) return remaining / n;
  return (remaining * r) / (Math.pow(1 + r, n) - 1);
}

export function adjustedExpensesForState(baseExpenses: number, fromIndex: number, toIndex: number): number {
  return baseExpenses * (toIndex / fromIndex);
}

export function calcRelocationOpportunities(profile: FireProfile, colData: StateColData[], baseYearsToFire: number | null): RelocationOpportunity[] {
  const currentStateData = colData.find((s) => s.state === profile.location);
  if (!currentStateData) return [];
  const baseRetirementExpenses = profile.retirementExpensesMode === "auto"
    ? calcAutoRetirementExpenses(profile)
    : profile.retirementExpenses;
  return colData
    .filter((s) => s.state !== profile.location)
    .map((s) => {
      const adjExpenses = adjustedExpensesForState(baseRetirementExpenses, currentStateData.colIndex, s.colIndex);
      const adjFireNumber = calcFireNumber(adjExpenses, profile.safeWithdrawalRate);
      const adjYears = calcYearsToFire(profile.currentAssets, profile.monthlyContribution, profile.realReturn, adjFireNumber);
      return {
        targetState: s.state, targetStateName: s.name, colIndex: s.colIndex,
        adjustedExpenses: adjExpenses,
        expenseSavingsPerYear: baseRetirementExpenses - adjExpenses,
        yearsToFireDelta: (adjYears ?? 100) - (baseYearsToFire ?? 100),
        yearsToFire: adjYears,
      };
    })
    .sort((a, b) => a.yearsToFireDelta - b.yearsToFireDelta);
}

export function calcFireResults(profile: FireProfile, overrides?: WhatIfOverrides): FireResults {
  const effectiveRetirementExpenses = profile.retirementExpensesMode === "auto"
    ? calcAutoRetirementExpenses(profile)
    : profile.retirementExpenses;

  const expenses = overrides?.retirementExpenses ?? effectiveRetirementExpenses;
  const monthlyContrib = overrides?.monthlyContribution ?? profile.monthlyContribution;
  const realReturn = overrides?.realReturn ?? profile.realReturn;
  const swr = profile.safeWithdrawalRate;

  const fireNumber = calcFireNumber(expenses, swr);
  const leanFireNumber = calcFireNumber(expenses, 0.05);
  const fatFireNumber = calcFireNumber(expenses, 0.03);
  const baristaExpenses = expenses - (profile.baristaPartTimeIncome ?? 0);
  const baristaFireNumber = baristaExpenses > 0 ? calcFireNumber(baristaExpenses, swr) : 0;
  const coastFireNumber = calcCoastFireNumber(fireNumber, realReturn, profile.currentAge, profile.retirementAge);

  const yearsToFire = calcYearsToFire(profile.currentAssets, monthlyContrib, realReturn, fireNumber);
  const fireDate = yearsToFire != null ? new Date(new Date().getFullYear() + Math.ceil(yearsToFire), 0, 1) : null;
  const fireAge = yearsToFire !== null ? Math.round(profile.currentAge + yearsToFire) : null;

  const yearsUntilFire = yearsToFire ?? Math.max(0, profile.retirementAge - profile.currentAge);
  const nominalFireNumber = Math.round(fireNumber * Math.pow(1 + profile.inflationRate, yearsUntilFire));
  const yearsToRetirement = Math.max(0, profile.retirementAge - profile.currentAge);
  const portfolioAtRetirementAge = Math.round(futureValue(profile.currentAssets, monthlyContrib, profile.nominalReturn, yearsToRetirement));
  const portfolioAtFireDate = yearsToFire !== null
    ? Math.round(futureValue(profile.currentAssets, monthlyContrib, profile.nominalReturn, yearsToFire))
    : null;

  const timeline = buildPortfolioTimeline(profile, fireNumber, coastFireNumber, monthlyContrib);
  const coastFireAchievedAge = findCoastFireAge(timeline, coastFireNumber);
  const yearsAvailable = profile.retirementAge - profile.currentAge;
  const monthlyContribNeeded = yearsToFire === null
    ? calcMonthlyContribNeeded(profile.currentAssets, realReturn, fireNumber, yearsAvailable)
    : null;
  const expenseReductionNeeded = yearsToFire === null ? (() => {
    let lo = 0, hi = expenses;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const fn = calcFireNumber(mid, swr);
      const y = calcYearsToFire(profile.currentAssets, monthlyContrib, realReturn, fn);
      y === null ? (hi = mid) : (lo = mid);
    }
    return expenses - (lo + hi) / 2;
  })() : null;

  return {
    numbers: { fireNumber, coastFireNumber, leanFireNumber, fatFireNumber, baristaFireNumber, nominalFireNumber, portfolioAtRetirementAge, portfolioAtFireDate },
    progress: {
      fireProgress: profile.currentAssets / fireNumber,
      coastFireProgress: profile.currentAssets / coastFireNumber,
      leanFireProgress: profile.currentAssets / leanFireNumber,
      fatFireProgress: profile.currentAssets / fatFireNumber,
    },
    timeline: {
      yearsToFire,
      fireDate,
      fireAge,
      coastFireAchievedAge,
      projectedPortfolioByYear: timeline,
      monthlyContribNeeded,
      expenseReductionNeeded,
    },
  };
}
