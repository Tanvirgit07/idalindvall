import { FINANCIAL_INTAKE_ROUTES } from "../constants/routes";
import type { FinancialStepData } from "../types/financialIntake.types";

export const step3Data: FinancialStepData = {
  pageStep: 3,
  pageTitle: "Committed Money",
  progress: 52,
  nextPath: FINANCIAL_INTAKE_ROUTES.step4,

  questions: [
    {
      id: "committed-1",
      question:
        "Now let’s cover committed money. How much do you save every month?",
      placeholder: "Example: 5000",
    },

    {
      id: "committed-2",
      question:
        "Do you invest money monthly into retirement, stocks, or business?",
      placeholder: "Example: investment 3000",
    },

    {
      id: "committed-3",
      question:
        "Are you making any additional debt payments outside minimum payments?",
      placeholder: "Example: extra debt payment 2000",
    },

    {
      id: "committed-4",
      question:
        "Do you contribute to any emergency fund or future savings account?",
      placeholder: "Example: emergency fund 4000",
    },
  ],
};