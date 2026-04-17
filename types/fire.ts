export type USState = "AL"|"AK"|"AZ"|"AR"|"CA"|"CO"|"CT"|"DE"|"FL"|"GA"|"HI"|"ID"|"IL"|"IN"|"IA"|"KS"|"KY"|"LA"|"ME"|"MD"|"MA"|"MI"|"MN"|"MS"|"MO"|"MT"|"NE"|"NV"|"NH"|"NJ"|"NM"|"NY"|"NC"|"ND"|"OH"|"OK"|"OR"|"PA"|"RI"|"SC"|"SD"|"TN"|"TX"|"UT"|"VT"|"VA"|"WA"|"WV"|"WI"|"WY"|"DC";

export interface ExpenseCategories {
  housing: number;
  utilities: number;
  groceries: number;
  dining: number;
  healthcare: number;
  medications: number;
  transport: number;
  travel: number;
  hobbies: number;
  clothing: number;
  personalCare: number;
  subscriptions: number;
  gifts: number;
  homeMaintenance: number;
  other: number;
}
// Backward compat alias -- both current and retirement expenses use the same 15 categories
export type RetirementExpenseCategories = ExpenseCategories;

export interface FireProfile {
  currentAge: number;
  retirementAge: number;
  targetCoastAge: number;
  location: USState;
  grossIncome: number;
  netIncome: number;
  filingStatus: "single" | "married";
  autoTakeHome: boolean;
  annualExpenses: number;
  expenseCategories?: Partial<ExpenseCategories>;
  retirementExpenses: number;
  retirementExpensesMode: "auto" | "manual";
  retirementLifestyleFactor: number;
  retirementExpenseCategories?: Partial<ExpenseCategories>;
  netWorth?: number;
  currentAssets: number;
  monthlyContribution: number;
  nominalReturn: number;
  realReturn: number;
  inflationRate: number;
  safeWithdrawalRate: number;
  baristaPartTimeIncome?: number;
}

export interface CoastAgePoint {
  age: number;
  coastTarget: number;   // coast FIRE target if you stop contributing at this exact age
  portfolio: number;     // projected portfolio at this age (real terms, with current contributions)
  canCoast: boolean;     // portfolio >= coastTarget (could stop contributing at this age)
  monthlyNeeded: number; // monthly contribution needed from this age to hit coastFireAtTargetAge by targetCoastAge; 0 if already past coast target; -1 if not achievable (no years remaining)
}

export interface FireNumbers {
  fireNumber: number;
  coastFireNumber: number;
  coastFireAtTargetAge: number;
  leanFireNumber: number;
  fatFireNumber: number;
  baristaFireNumber: number;
  nominalFireNumber: number;
  portfolioAtRetirementAge: number;
  portfolioAtFireDate: number | null;
}
export interface FireProgress {
  fireProgress: number;
  coastFireProgress: number;
  leanFireProgress: number;
  fatFireProgress: number;
}
export interface PortfolioDataPoint {
  age: number;
  year: number;
  portfolioValue: number;
  fireTarget: number;
  coastFireTarget: number;
}
export interface FireTimeline {
  yearsToFire: number | null;
  fireDate: Date | null;
  fireAge: number | null;
  coastFireAchievedAge: number | null;
  predictedCoastAge: number | null;
  coastByAge: CoastAgePoint[];
  projectedPortfolioByYear: PortfolioDataPoint[];
  monthlyContribNeeded: number | null;
  expenseReductionNeeded: number | null;
}
export interface FireResults {
  numbers: FireNumbers;
  progress: FireProgress;
  timeline: FireTimeline;
}
export interface StateColData { state: USState; name: string; colIndex: number; }
export interface RelocationOpportunity {
  targetState: USState;
  targetStateName: string;
  colIndex: number;
  adjustedExpenses: number;
  expenseSavingsPerYear: number;
  yearsToFireDelta: number;
  yearsToFire: number | null;
}
export interface WhatIfOverrides {
  monthlyContribution?: number;
  retirementExpenses?: number;
  realReturn?: number;
}
