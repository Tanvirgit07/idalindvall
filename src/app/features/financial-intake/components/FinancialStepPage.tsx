"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Loader2, PencilLine, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  BudgetMethodResponse,
  ChatHistoryItem,
  FinancialIntakeChatRequest,
  FinancialIntakeChatResponse,
  FinancialStepData,
} from "../types/financialIntake.types";
import ProgressBar from "./ProgressBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getFinancialIntakeData,
  saveBudgetFileUrl,
  saveFinancialSectionData,
} from "../utils/financialIntakeStorage";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Props = {
  data: FinancialStepData;
};

const sectionStepCounts = {
  income: 3,
  essentials: 11,
  committed_money: 3,
  irregular_expense: 2,
  net_position: 10,
};

function buildChatHistory(messages: ChatMessage[]): ChatHistoryItem[] {
  const chatHistory: ChatHistoryItem[] = [];
  let pendingQuestion = "";

  messages.forEach((message) => {
    if (message.role === "assistant") {
      pendingQuestion = message.text;
      return;
    }

    if (pendingQuestion) {
      chatHistory.push({
        ai_question: pendingQuestion,
        user_answer: message.text,
      });
      pendingQuestion = "";
    }
  });

  return chatHistory;
}

export default function FinancialStepPage({ data }: Props) {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: data.questions[0].id,
      role: "assistant",
      text: data.questions[0].question,
    },
  ]);

  const totalSectionSteps = sectionStepCounts[data.financialSection];
  const progressStep = Math.min(
    Math.max(Math.ceil((progress / 100) * totalSectionSteps), 1),
    totalSectionSteps,
  );

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: inputValue,
    };
    const nextMessages = [...messages, userMessage];
    const requestBody: FinancialIntakeChatRequest = {
      financial_section: data.financialSection,
      chat_history: buildChatHistory(nextMessages),
    };

    setMessages(nextMessages);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch("/api/financial-intake/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData =
        (await response.json()) as FinancialIntakeChatResponse;

      if (!response.ok || !responseData.status) {
        throw new Error("Financial intake API request failed.");
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: responseData.message.ai_question,
      };

      setProgress(responseData.message.progress);
      setMessages((prev) => [...prev, assistantMessage]);

      if (responseData.message.complete) {
        saveFinancialSectionData(
          data.financialSection,
          responseData.message.data,
        );

        if (data.financialSection === "net_position") {
          setIsGeneratingBudget(true);

          const budgetResponse = await fetch(
            "/api/financial-intake/budget-method",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(getFinancialIntakeData()),
            },
          );

          const budgetData =
            (await budgetResponse.json()) as BudgetMethodResponse;

          if (!budgetResponse.ok || !budgetData.status) {
            throw new Error("Budget method API request failed.");
          }

          saveBudgetFileUrl(budgetData.message);
        }

        router.push(data.nextPath);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: "Sorry, I could not save that answer right now. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
      setIsGeneratingBudget(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  return (
    <main className="h-screen overflow-hidden bg-[#EAE5DF] px-4 py-8">
      <section className="relative mx-auto flex h-[calc(100vh-64px)] w-full max-w-5xl flex-col overflow-hidden bg-[#f3eee8] shadow-sm">
        {isGeneratingBudget && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f3eee8]/90 text-[#8B4A3A]">
            <Loader2 className="mb-3 animate-spin" size={34} />
            <p className="text-base font-medium">
              Generating your budget file...
            </p>
          </div>
        )}

        <div className="bg-[#DDD7D0]">
          <div className="flex items-start justify-between px-6 pt-5 ">
            <div>
              <p className="text-base font-medium uppercase leading-[100%] text-[#8B4A3A]">
                THE FREEDOM BUDGET METHOD <sup>TM</sup>
              </p>

              <h1 className="mt-2 text-[40px] font-bold text-[#2C2C2C] leading-[100%]">
                Financial Intake
              </h1>
              <p className="text-[#686560] text-[13px] leading-[100%] font-light mt-2">
                A guided conversation - one question at a time
              </p>
            </div>
          </div>

          <div className="px-4">
            <ProgressBar
              step={progressStep}
              id={data.pageTitle}
              progress={progress}
              totalSteps={totalSectionSteps}
            />
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 px-6 py-6">
          <div className="space-y-6 pr-4">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex items-start ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="mr-3 flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-[#8f513f] text-base font-normal text-[#2C2C2C] leading-1.7 px-4 py-3">
                      FBM
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`max-w-130 px-5 py-3 text-[16px] leading-[1.45] ${
                          isUser
                            ? "rounded-tl-3xl rounded-bl-3xl rounded-br-3xl bg-[#8B4A3A] text-white"
                            : "rounded-tr-3xl rounded-bl-3xl rounded-br-3xl bg-white text-[#2C2C2C]"
                        }`}
                      >
                        {message.text}
                      </div>

                      {isUser && (
                        <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-[#DDD7D0] text-base font-normal text-[#8B4A3A]">
                          You
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2 px-1 text-[14px] text-[#9d9d9d]">
                      <span>12:45</span>

                      {isUser && (
                        <>
                          <span>•</span>
                          <PencilLine size={15} />
                          <span>•</span>
                          <Copy size={15} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="border-t border-[#ddd4cc] px-5 py-4">
          <div className="flex items-center gap-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={isSending}
              placeholder="Type your answer here..."
              className="h-10 flex-1 rounded-[10px] border border-[#C8C2BB] bg-[#FFFFFF] px-3.5 py-2.5 text-[14px] font-normal text-[#2C2C2C] placeholder:text-[#b9a89c] outline-none focus:border-[#8B4A3A]"
            />

            <button
              onClick={handleSend}
              disabled={isSending}
              className="h-10.5 rounded-[10px] bg-[#8B4A3A] px-4.5 py-2.5 text-[13px] font-bold text-white hover:bg-[#7A3F30] transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        <p className="pb-2 text-center text-[10px] font-light italic text-[#9B918A]">
          Structure below kicks — the FREEDOM BUDGET METHOD™ — UFYALL.COM
        </p>
      </section>
    </main>
  );
}
