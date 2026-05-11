export type MessageRole = "assistant" | "user";

export type FinancialSection =
  | "income"
  | "essentials"
  | "committed_money"
  | "irregular_expense"
  | "net_position";

export type IntakeQuestion = {
  id: string;
  question: string;
  placeholder: string;
};

export type FinancialStepData = {
  pageStep: number;
  pageTitle: string;
  financialSection: FinancialSection;
  progress: number;
  nextPath: string;
  questions: IntakeQuestion[];
};

export type ChatHistoryItem = {
  ai_question: string;
  user_answer: string;
};

export type FinancialIntakeChatRequest = {
  financial_section: FinancialSection;
  chat_history: ChatHistoryItem[];
};

export type FinancialIntakeChatResponseMessage = {
  ai_question: string;
  progress: number;
  complete: boolean;
  data?: unknown;
};

export type FinancialIntakeChatResponse = {
  status: boolean;
  status_code: number;
  message: FinancialIntakeChatResponseMessage;
};

export type BudgetMethodResponse = {
  status: boolean;
  status_code: number;
  message: string;
};
