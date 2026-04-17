"use client";
import { useMemo } from "react";
import type { FireProfile, FireResults, WhatIfOverrides } from "@/types/fire";
import { calcFireResults } from "@/lib/calculations";

export function useFireCalculations(profile: FireProfile, overrides?: WhatIfOverrides): FireResults {
  return useMemo(
    () => calcFireResults(profile, overrides),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      profile.currentAge, profile.retirementAge, profile.targetCoastAge, profile.location,
      profile.annualExpenses, profile.retirementExpenses, profile.retirementExpensesMode,
      profile.retirementLifestyleFactor, profile.retirementExpenseCategories,
      profile.expenseCategories, profile.currentAssets, profile.monthlyContribution,
      profile.realReturn, profile.nominalReturn, profile.safeWithdrawalRate,
      profile.inflationRate, profile.baristaPartTimeIncome,
      overrides?.retirementExpenses, overrides?.monthlyContribution, overrides?.realReturn,
    ],
  );
}
