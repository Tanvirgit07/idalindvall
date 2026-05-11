import { FINANCIAL_INTAKE_ROUTES } from "../constants/routes";
import type { FinancialStepData } from "../types/financialIntake.types";

export const step1Data: FinancialStepData = {
  pageStep: 1,
  pageTitle: "Income",
  financialSection: "income",
  progress: 13,
  nextPath: FINANCIAL_INTAKE_ROUTES.step2,

  questions: [
    {
      id: "income-1",
      question:
        "Welcome! I'm here to help you build your Freedom Budget. Let's start with your income what's your net monthly income after tax?",
      placeholder: "Example: 45000",
    },
    {
      id: "income-2",
      question: "Do you have any secondary income?",
      placeholder: "Example: 5000 or No secondary income",
    },
    {
      id: "income-3",
      question: "Do you receive any bonus, commission, or irregular income?",
      placeholder: "Example: yearly bonus 30000",
    },
  ],
};
