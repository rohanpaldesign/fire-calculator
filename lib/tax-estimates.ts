// 2024 US tax estimates for take-home income calculation.
// Federal: actual 2024 brackets + standard deduction + FICA.
// State: effective rates calibrated for $60K–$150K income range.

export type FilingStatus = "single" | "married";

// --- Federal income tax ---

const FED_SINGLE = [
  { max: 11600, rate: 0.10 },
  { max: 47150, rate: 0.12 },
  { max: 100525, rate: 0.22 },
  { max: 191950, rate: 0.24 },
  { max: 243725, rate: 0.32 },
  { max: 609350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

const FED_MARRIED = [
  { max: 23200, rate: 0.10 },
  { max: 94300, rate: 0.12 },
  { max: 201050, rate: 0.22 },
  { max: 383900, rate: 0.24 },
  { max: 487450, rate: 0.32 },
  { max: 731200, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

const STD_DEDUCTION = { single: 14600, married: 29200 };

function calcFederalTax(income: number, status: FilingStatus): number {
  const deduction = STD_DEDUCTION[status];
  const brackets = status === "married" ? FED_MARRIED : FED_SINGLE;
  const taxable = Math.max(0, income - deduction);
  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    if (taxable <= prev) break;
    tax += (Math.min(taxable, bracket.max) - prev) * bracket.rate;
    prev = bracket.max;
  }
  return tax;
}

// --- FICA (Social Security + Medicare) ---
// Employee share only (6.2% SS up to $168,600 + 1.45% Medicare)
function calcFICA(income: number): number {
  const ss = Math.min(income, 168600) * 0.062;
  const medicare = income * 0.0145;
  const addlMedicare = Math.max(0, income - 200000) * 0.009;
  return ss + medicare + addlMedicare;
}

// --- State income tax effective rates ---
// States with NO income tax — explicitly 0
const NO_TAX_STATES = new Set(["AK", "FL", "NV", "SD", "TN", "TX", "WA", "WY", "NH"]);

// Approximate effective rates for a typical $75K–$120K income.
const STATE_RATES: Record<string, number> = {
  // Flat rate states
  CO: 0.044, IL: 0.0495, IN: 0.0305, KY: 0.040, MA: 0.050,
  MI: 0.0405, NC: 0.0475, PA: 0.0307, UT: 0.0455,
  // Graduated — corrected effective rates
  AL: 0.040, AR: 0.043, AZ: 0.025, CA: 0.082, CT: 0.055, DC: 0.072,
  DE: 0.055, GA: 0.055, HI: 0.082, IA: 0.038, ID: 0.058, KS: 0.053,
  LA: 0.042, MD: 0.055, ME: 0.063, MN: 0.058, MO: 0.042, MS: 0.047,
  MT: 0.065, ND: 0.015, NE: 0.062, NJ: 0.062, NM: 0.048, NY: 0.065,
  OH: 0.035, OK: 0.050, OR: 0.076, RI: 0.055, SC: 0.068, VA: 0.057,
  VT: 0.066, WI: 0.065, WV: 0.052,
};

export interface TaxBreakdown {
  grossIncome: number;
  federalTax: number;
  ficaTax: number;
  stateTax: number;
  stateRate: number;
  noStateTax: boolean;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
}

export function estimateTaxBreakdown(
  grossIncome: number,
  state: string,
  status: FilingStatus,
): TaxBreakdown {
  if (grossIncome <= 0) {
    return { grossIncome: 0, federalTax: 0, ficaTax: 0, stateTax: 0, stateRate: 0, noStateTax: false, totalTax: 0, netIncome: 0, effectiveRate: 0 };
  }
  const federalTax = calcFederalTax(grossIncome, status);
  const ficaTax = calcFICA(grossIncome);
  const noStateTax = NO_TAX_STATES.has(state);
  const stateRate = noStateTax ? 0 : (STATE_RATES[state] != null ? STATE_RATES[state] : 0.05);
  const stateTax = grossIncome * stateRate;
  const totalTax = federalTax + ficaTax + stateTax;
  const netIncome = Math.max(0, grossIncome - totalTax);
  return {
    grossIncome,
    federalTax: Math.round(federalTax),
    ficaTax: Math.round(ficaTax),
    stateTax: Math.round(stateTax),
    stateRate,
    noStateTax,
    totalTax: Math.round(totalTax),
    netIncome: Math.round(netIncome),
    effectiveRate: totalTax / grossIncome,
  };
}
