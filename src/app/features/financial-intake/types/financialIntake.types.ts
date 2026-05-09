export type MessageRole = "assistant" | "user";

export type IntakeQuestion = {
  id: string;
  question: string;
  placeholder: string;
};

export type FinancialStepData = {
  pageStep: number;
  pageTitle: string;
  progress: number;
  nextPath: string;
  questions: IntakeQuestion[];
};