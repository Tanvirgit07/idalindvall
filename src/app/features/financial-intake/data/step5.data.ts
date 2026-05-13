import { FINANCIAL_INTAKE_ROUTES } from "../constants/routes";
import type { FinancialStepData } from "../types/financialIntake.types";

export const step5Data: FinancialStepData = {
  pageStep: 5,
  pageTitle: "Net Position",
  financialSection: "net_position",
  progress: 90,
  nextPath: FINANCIAL_INTAKE_ROUTES.complete,

  questions: [
    {
      id: "net-1",
      question:
        "Welcome! I'm here to help you build your Freedom Budget. Finally, let's calculate your net position based on your income and expenses.",
      placeholder: "Example: savings 100000",
    },

    {
      id: "net-2",
      question:
        "Do you own any assets such as property, vehicles, or investments?",
      placeholder: "Example: car worth 500000",
    },

    {
      id: "net-3",
      question:
        "How much debt or outstanding loan balance do you currently have?",
      placeholder: "Example: total debt 250000",
    },

    {
      id: "net-4",
      question:
        "Do you currently have any credit card balances?",
      placeholder: "Example: credit card 20000",
    },

    {
      id: "net-5",
      question:
        "Great. I have collected your financial information. Ready to complete your intake?",
      placeholder: "Type yes to continue",
    },
  ],
};
