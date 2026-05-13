import { FINANCIAL_INTAKE_ROUTES } from "../constants/routes";
import type { FinancialStepData } from "../types/financialIntake.types";

export const step4Data: FinancialStepData = {
  pageStep: 4,
  pageTitle: "Irregular Expenses",
  financialSection: "irregular_expense",
  progress: 65,
  nextPath: FINANCIAL_INTAKE_ROUTES.step5,

  questions: [
    {
      id: "irregular-1",
      question:
        "Welcome! I'm here to help you build your Freedom Budget. Next, let's look at your irregular expenses. What non-monthly or occasional expenses do you usually have?",
      placeholder: "Example: yearly service 12000",
    },

    {
      id: "irregular-2",
      question:
        "Do you spend money yearly on travel or vacations?",
      placeholder: "Example: yearly travel 30000",
    },

    {
      id: "irregular-3",
      question:
        "Do you have medical, dental, or health-related annual expenses?",
      placeholder: "Example: medical 10000",
    },

    {
      id: "irregular-4",
      question:
        "Do you buy gifts during holidays, birthdays, or special occasions?",
      placeholder: "Example: gifts 15000 yearly",
    },

    {
      id: "irregular-5",
      question:
        "Do you have any subscriptions, renewals, or annual memberships?",
      placeholder: "Example: yearly subscriptions 5000",
    },
  ],
};
