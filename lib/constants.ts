import type { FireProfile } from "@/types/fire";

export const DEFAULT_PROFILE: FireProfile = {
  currentAge: 30,
  retirementAge: 55,
  targetCoastAge: 45,
  location: "CA",
  grossIncome: 120000,
  netIncome: 85000,
  filingStatus: "single",
  autoTakeHome: true,
  annualExpenses: 60000,
  retirementExpenses: 48000,
  retirementExpensesMode: "auto",
  retirementLifestyleFactor: 0.80,
  currentAssets: 50000,
  monthlyContribution: 2000,
  nominalReturn: 0.10,
  realReturn: 0.07,
  inflationRate: 0.03,
  safeWithdrawalRate: 0.04,
  baristaPartTimeIncome: 0,
};

export const STORAGE_KEY = "fire-calculator-profile-v4";
