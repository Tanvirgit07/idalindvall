"use client";

import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import StepHeader from "./StepHeader";
import ProgressBar from "./ProgressBar";

const steps = [
  { title: "Income", section: "income", progress: 16 },
  { title: "Essentials", section: "essentials", progress: 32 },
  { title: "Committed Money", section: "committed_money", progress: 50 },
  { title: "Irregular Expenses", section: "irregular_expense", progress: 66 },
  { title: "Net Position", section: "net_position", progress: 83 },
] as const;

export type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

export default function FinancialIntakeShell() {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Welcome! I am here to help you build your Freedom Budget. Let’s start with your income. What is your net monthly income after tax?",
    },
  ]);

  const handleSendMessage = (value: string) => {
    if (!value.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: value,
      },
      {
        id: Date.now() + 1,
        role: "assistant",
        text:
          currentStep < steps.length - 1
            ? "Perfect. Now let’s continue to the next section."
            : "Great! Your financial intake is now ready.",
      },
    ]);

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9e1d8] px-4 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-5xl flex-col rounded-sm border border-[#d3c8bc] bg-[#f7f1eb] shadow-sm">
        <StepHeader
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          title={steps[currentStep].title}
        />

        <div className="px-6">
          <ProgressBar
            progress={steps[currentStep].progress}
            currentSection={steps[currentStep].section}
            currentProgress={steps[currentStep].progress}
          />
        </div>

        <ChatWindow messages={messages} />

        <div className="border-t border-[#d8cfc6] px-5 py-4">
          <ChatInput onSend={handleSendMessage} />
        </div>

        <div className="pb-2 text-center text-[11px] text-[#9d6b59]">
          Structure before scale — the FREEDOM BUDGET METHOD™ — LILYVALL.COM
        </div>
      </div>
    </div>
  );
}
