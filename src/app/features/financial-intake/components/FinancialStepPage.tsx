"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  BudgetMethodResponse,
  ChatHistoryItem,
  FinancialSection,
  FinancialIntakeChatRequest,
  FinancialIntakeChatResponse,
  FinancialStepData,
} from "../types/financialIntake.types";
import ProgressBar from "./ProgressBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveBudgetFileUrl } from "../utils/financialIntakeStorage";
import { FINANCIAL_INTAKE_ROUTES } from "../constants/routes";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Props = {
  data: FinancialStepData;
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

function TypingIndicator() {
  return (
    <div className="flex items-start justify-start">
      <div className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8f513f] px-2 py-2 text-xs font-normal leading-1.7 text-[#2C2C2C] md:mr-3 md:h-15 md:w-15 md:px-4 md:py-3 md:text-base">
        FBM
      </div>

      <div className="flex flex-col items-start">
        <div className="rounded-tr-3xl rounded-bl-3xl rounded-br-3xl bg-white px-4 py-3 text-[#2C2C2C] md:px-5 md:py-4">
          <div className="flex items-center gap-1.5" aria-label="FBM is typing">
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B4A3A] [animation-delay:-0.24s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B4A3A] [animation-delay:-0.12s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-[#8B4A3A]" />
          </div>
        </div>

        <div className="mt-2 px-1 text-xs text-[#9d9d9d] md:text-[14px]">
          Typing...
        </div>
      </div>
    </div>
  );
}

export default function FinancialStepPage({ data }: Props) {
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<FinancialSection>(
    data.financialSection,
  );
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: data.questions[0].id,
      role: "assistant",
      text: data.questions[0].question,
    },
  ]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: inputValue,
    };
    const nextMessages = [...messages, userMessage];
    const requestBody: FinancialIntakeChatRequest = {
      financial_section: currentSection,
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
      setCurrentProgress(responseData.message.current_progress ?? 0);
      setCurrentSection(
        responseData.message.current_section ?? currentSection,
      );
      setMessages((prev) => [...prev, assistantMessage]);

      if (responseData.message.complete) {
        if (responseData.message.data === undefined) {
          throw new Error("Financial intake completed without data.");
        }

        setIsGeneratingBudget(true);

        const budgetResponse = await fetch(
          "/api/financial-intake/budget-method",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(responseData.message.data),
          },
        );

        const budgetData =
          (await budgetResponse.json()) as BudgetMethodResponse;

        if (!budgetResponse.ok || !budgetData.status) {
          throw new Error("Budget method API request failed.");
        }

        saveBudgetFileUrl(budgetData.message);
        router.push(FINANCIAL_INTAKE_ROUTES.complete);
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

  const handleCopyMessage = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isSending]);

  return (
    <main className="h-dvh overflow-hidden bg-[#EAE5DF] md:h-screen md:px-4 md:py-8">
      <section className="relative mx-auto flex h-dvh w-full max-w-5xl flex-col overflow-hidden bg-[#f3eee8] md:h-[calc(100vh-64px)] md:shadow-sm">
        {isGeneratingBudget && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#f3eee8]/90 text-[#8B4A3A]">
            <Loader2 className="mb-3 animate-spin" size={34} />
            <p className="text-base font-medium">
              Generating your budget file...
            </p>
          </div>
        )}

        <div className="shrink-0 bg-[#DDD7D0]">
          <div className="flex items-start justify-between px-4 pt-4 md:px-6 md:pt-5">
            <div>
              <p className="text-xs font-medium uppercase leading-[100%] text-[#8B4A3A] md:text-base">
                THE FREEDOM BUDGET METHOD <sup>TM</sup>
              </p>

              <h1 className="mt-2 text-[28px] font-bold leading-[100%] text-[#2C2C2C] md:text-[40px]">
                Financial Intake
              </h1>
              <p className="mt-2 text-[12px] font-light leading-[100%] text-[#686560] md:text-[13px]">
                A guided conversation - one question at a time
              </p>
            </div>
          </div>

          <div className="px-3 md:px-4">
            <ProgressBar
              progress={progress}
              currentSection={currentSection}
              currentProgress={currentProgress}
            />
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1 px-3 py-4 [&_[data-slot=scroll-area-scrollbar]]:hidden md:px-6 md:py-6 md:[&_[data-slot=scroll-area-scrollbar]]:flex">
          <div className="space-y-4 md:space-y-6 md:pr-4">
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
                    <div className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8f513f] px-2 py-2 text-xs font-normal leading-1.7 text-[#2C2C2C] md:mr-3 md:h-15 md:w-15 md:px-4 md:py-3 md:text-base">
                      FBM
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div className="flex items-start gap-2 md:gap-3">
                      <div
                        className={`max-w-[calc(100vw-88px)] overflow-hidden px-4 py-3 text-[14px] leading-[1.45] break-words md:max-w-130 md:px-5 md:text-[16px] ${
                          isUser
                            ? "rounded-tl-3xl rounded-bl-3xl rounded-br-3xl bg-[#8B4A3A] text-white"
                            : "rounded-tr-3xl rounded-bl-3xl rounded-br-3xl bg-white text-[#2C2C2C]"
                        }`}
                        dangerouslySetInnerHTML={
                          isUser ? undefined : { __html: message.text }
                        }
                      >
                        {isUser ? message.text : null}
                      </div>

                      {isUser && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDD7D0] text-xs font-normal text-[#8B4A3A] md:h-15 md:w-15 md:text-base">
                          You
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2 px-1 text-xs text-[#9d9d9d] md:text-[14px]">
                      <span>12:45</span>

                      {isUser && (
                        <>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(message.text)}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[#e7ded6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B4A3A]"
                            aria-label="Copy message"
                            title="Copy message"
                          >
                            <Copy size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isSending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="shrink-0 border-t border-[#ddd4cc] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-5 md:py-4">
          <div className="flex items-center gap-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={isSending}
              placeholder="Type your answer here..."
              className="h-10 min-w-0 flex-1 rounded-[10px] border border-[#C8C2BB] bg-[#FFFFFF] px-3.5 py-2.5 text-[14px] font-normal text-[#2C2C2C] placeholder:text-[#b9a89c] outline-none focus:border-[#8B4A3A]"
            />

            <button
              onClick={handleSend}
              disabled={isSending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#8B4A3A] text-[13px] font-bold text-white transition-colors hover:bg-[#7A3F30] md:h-10.5 md:w-auto md:px-4.5 md:py-2.5"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        <p className="shrink-0 px-2 pb-2 text-center text-[9px] font-light italic text-[#9B918A] md:text-[10px]">
          Structure before scale — the FREEDOM BUDGET METHOD™ — LILYVALL.COM
        </p>
      </section>
    </main>
  );
}
