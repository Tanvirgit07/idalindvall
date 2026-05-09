import { FINANCIAL_INTAKE_ROUTES } from "../constants/routes";
import type { FinancialStepData } from "../types/financialIntake.types";

export const step2Data: FinancialStepData = {
  pageStep: 2,
  pageTitle: "Essentials",
  progress: 32,
  nextPath: FINANCIAL_INTAKE_ROUTES.step3,

  questions: [
    {
      id: "essential-1",
      question: "What is your monthly housing cost?",
      placeholder: "Example: Rent 15000",
    },
    {
      id: "essential-2",
      question: "What is your monthly food/grocery cost?",
      placeholder: "Example: 8000",
    },
    {
      id: "essential-3",
      question: "What is your monthly transport cost?",
      placeholder: "Example: 3000",
    },
    {
      id: "essential-4",
      question: "What are your phone, internet, and utility costs?",
      placeholder: "Example: internet 1200, phone 800",
    },
    {
      id: "essential-5",
      question: "Do you have any insurance, loan, or other essential payments?",
      placeholder: "Example: loan 5000 or No",
    },
  ],
};