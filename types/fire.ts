export type USState = "AL"|"AK"|"AZ"|"AR"|"CA"|"CO"|"CT"|"DE"|"FL"|"GA"|"HI"|"ID"|"IL"|"IN"|"IA"|"KS"|"KY"|"LA"|"ME"|"MD"|"MA"|"MI"|"MN"|"MS"|"MO"|"MT"|"NE"|"NV"|"NH"|"NJ"|"NM"|"NY"|"NC"|"ND"|"OH"|"OK"|"OR"|"PA"|"RI"|"SC"|"SD"|"TN"|"TX"|"UT"|"VT"|"VA"|"WA"|"WV"|"WI"|"WY"|"DC";
export interface ExpenseCategories { housing:number; food:number; transport:number; healthcare:number; entertainment:number; other:number; }
export interface FireProfile {
  currentAge:number; retirementAge:number; location:USState;
  grossIncome:number; netIncome:number;
  filingStatus:"single"|"married";
  autoTakeHome:boolean;
  annualExpenses:number; expenseCategories?:Partial<ExpenseCategories>;
  currentAssets:number; monthlyContribution:number;
  nominalReturn:number; realReturn:number; inflationRate:number; safeWithdrawalRate:number;
  baristaPartTimeIncome?:number;
}
export interface FireNumbers { fireNumber:number; coastFireNumber:number; leanFireNumber:number; fatFireNumber:number; baristaFireNumber:number; }
export interface FireProgress { fireProgress:number; coastFireProgress:number; leanFireProgress:number; fatFireProgress:number; }
export interface PortfolioDataPoint { age:number; year:number; portfolioValue:number; fireTarget:number; coastFireTarget:number; }
export interface FireTimeline { yearsToFire:number|null; fireDate:Date|null; coastFireAchievedAge:number|null; projectedPortfolioByYear:PortfolioDataPoint[]; monthlyContribNeeded:number|null; expenseReductionNeeded:number|null; }
export interface FireResults { numbers:FireNumbers; progress:FireProgress; timeline:FireTimeline; }
export interface StateColData { state:USState; name:string; colIndex:number; }
export interface RelocationOpportunity { targetState:USState; targetStateName:string; colIndex:number; adjustedExpenses:number; expenseSavingsPerYear:number; yearsToFireDelta:number; yearsToFire:number|null; }
export interface WhatIfOverrides { monthlyContribution?:number; annualExpenses?:number; realReturn?:number; }
