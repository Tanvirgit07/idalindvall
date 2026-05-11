import type { FinancialSection } from "../types/financialIntake.types";

export const FINANCIAL_INTAKE_STORAGE_KEY = "financial_intake_data";
export const FINANCIAL_BUDGET_FILE_URL_KEY = "financial_budget_file_url";

const initialFinancialIntakeData = {
  income: {
    net_income: 0,
    secondary_income: 0,
    other_income: 0,
  },
  essentials: {
    housing: 0,
    food: 0,
    transport: 0,
    insurance: 0,
    phone: 0,
    internet: 0,
    subscriptions: 0,
    loans: 0,
    childcare: 0,
    gym: 0,
    other_essentials: 0,
  },
  committed_money: {
    savings: 0,
    investments: 0,
    extra_debt_payments: 0,
  },
  irregular_expense: [
    {
      name: "",
      annual_cost: 0,
    },
  ],
  net_position: {
    liquidity_reserve: 0,
    investments_balance: 0,
    pension_balance: 0,
    property_equity: 0,
    other_assets: 0,
    mortgage_balance: 0,
    car_or_boat_loan: 0,
    student_loan: 0,
    credit_and_short_term: 0,
    other_liabilities: 0,
  },
};

export function saveFinancialSectionData(
  section: FinancialSection,
  data: unknown,
) {
  if (typeof window === "undefined" || data === undefined) return;

  const storedValue = window.localStorage.getItem(FINANCIAL_INTAKE_STORAGE_KEY);
  const currentData = storedValue
    ? JSON.parse(storedValue)
    : initialFinancialIntakeData;

  const nextData = {
    ...initialFinancialIntakeData,
    ...currentData,
    [section]: data,
  };

  window.localStorage.setItem(
    FINANCIAL_INTAKE_STORAGE_KEY,
    JSON.stringify(nextData),
  );
}

export function getFinancialIntakeData() {
  if (typeof window === "undefined") return initialFinancialIntakeData;

  const storedValue = window.localStorage.getItem(FINANCIAL_INTAKE_STORAGE_KEY);

  if (!storedValue) return initialFinancialIntakeData;

  try {
    return {
      ...initialFinancialIntakeData,
      ...JSON.parse(storedValue),
    };
  } catch {
    return initialFinancialIntakeData;
  }
}

export function saveBudgetFileUrl(url: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(FINANCIAL_BUDGET_FILE_URL_KEY, url);
}

export function getBudgetFileUrl() {
  if (typeof window === "undefined") return "";

  return window.localStorage.getItem(FINANCIAL_BUDGET_FILE_URL_KEY) ?? "";
}
