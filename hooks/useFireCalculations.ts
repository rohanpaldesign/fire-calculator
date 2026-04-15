"use client";
import { useMemo } from "react";
import type { FireProfile, FireResults, WhatIfOverrides } from "@/types/fire";
import { calcFireResults } from "@/lib/calculations";

export function useFireCalculations(profile: FireProfile, overrides?: WhatIfOverrides): FireResults {
  return useMemo(
    () => calcFireResults(profile, overrides),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile.currentAge,profile.retirementAge,profile.location,profile.annualExpenses,profile.currentAssets,profile.monthlyContribution,profile.realReturn,profile.nominalReturn,profile.safeWithdrawalRate,profile.inflationRate,profile.baristaPartTimeIncome,overrides?.annualExpenses,overrides?.monthlyContribution,overrides?.realReturn],
  );
}
