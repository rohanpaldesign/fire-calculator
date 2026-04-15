import type { FireProfile, FireNumbers, FireProgress, FireTimeline, FireResults, PortfolioDataPoint, StateColData, RelocationOpportunity, WhatIfOverrides } from "@/types/fire";

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
  return colData
    .filter((s) => s.state !== profile.location)
    .map((s) => {
      const adjExpenses = adjustedExpensesForState(profile.annualExpenses, currentStateData.colIndex, s.colIndex);
      const adjFireNumber = calcFireNumber(adjExpenses, profile.safeWithdrawalRate);
      const adjYears = calcYearsToFire(profile.currentAssets, profile.monthlyContribution, profile.realReturn, adjFireNumber);
      return { targetState: s.state, targetStateName: s.name, colIndex: s.colIndex, adjustedExpenses: adjExpenses, expenseSavingsPerYear: profile.annualExpenses - adjExpenses, yearsToFireDelta: (adjYears ?? 100) - (baseYearsToFire ?? 100), yearsToFire: adjYears };
    })
    .sort((a, b) => a.yearsToFireDelta - b.yearsToFireDelta);
}

export function calcFireResults(profile: FireProfile, overrides?: WhatIfOverrides): FireResults {
  const expenses = overrides?.annualExpenses ?? profile.annualExpenses;
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
  const timeline = buildPortfolioTimeline(profile, fireNumber, coastFireNumber, monthlyContrib);
  const coastFireAchievedAge = findCoastFireAge(timeline, coastFireNumber);

  const yearsAvailable = profile.retirementAge - profile.currentAge;
  const monthlyContribNeeded = yearsToFire === null ? calcMonthlyContribNeeded(profile.currentAssets, realReturn, fireNumber, yearsAvailable) : null;

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
    numbers: { fireNumber, coastFireNumber, leanFireNumber, fatFireNumber, baristaFireNumber },
    progress: { fireProgress: profile.currentAssets / fireNumber, coastFireProgress: profile.currentAssets / coastFireNumber, leanFireProgress: profile.currentAssets / leanFireNumber, fatFireProgress: profile.currentAssets / fatFireNumber },
    timeline: { yearsToFire, fireDate: yearsToFire != null ? new Date(new Date().getFullYear() + Math.ceil(yearsToFire), 0, 1) : null, coastFireAchievedAge, projectedPortfolioByYear: timeline, monthlyContribNeeded, expenseReductionNeeded },
  };
}
