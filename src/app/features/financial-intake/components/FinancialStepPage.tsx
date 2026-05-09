"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, PencilLine, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FinancialStepData } from "../types/financialIntake.types";
import ProgressBar from "./ProgressBar";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

type Props = {
  data: FinancialStepData;
};

const steps = [
  { title: "Income", progress: 16 },
  { title: "Essentials", progress: 32 },
  { title: "Committed Money", progress: 50 },
  { title: "Irregular Expenses", progress: 66 },
  { title: "Net Position", progress: 83 },
  { title: "Complete", progress: 100 },
];

export default function FinancialStepPage({ data }: Props) {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: data.questions[0].id,
      role: "assistant",
      text: data.questions[0].question,
    },
  ]);

  const currentQuestion = data.questions[currentQuestionIndex];
  const totalQuestions = data.questions.length;
  const currentStep = currentQuestionIndex + 1;

  const progress = Math.round((currentStep / totalQuestions) * 100);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: inputValue,
    };

    const nextQuestionIndex = currentQuestionIndex + 1;
    const nextQuestion = data.questions[nextQuestionIndex];

    if (nextQuestion) {
      setMessages((prev) => [
        ...prev,
        userMessage,
        {
          id: nextQuestion.id,
          role: "assistant",
          text: nextQuestion.question,
        },
      ]);

      setCurrentQuestionIndex(nextQuestionIndex);
      setInputValue("");
    } else {
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      router.push(data.nextPath);
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
    <main className="h-screen overflow-hidden bg-[#777675] px-4 py-8">
      <section className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-5xl flex-col overflow-hidden bg-[#f3eee8] shadow-sm">
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            <p className="text-base font-medium uppercase leading-[100%] text-[#8B4A3A]">
              THE FREEDOM BUDGET METHOD <sup>TM</sup>
            </p>

            <h1 className="mt-2 text-[40px] font-bold text-[#2C2C2C] leading-[100%]">
              Financial Intake
            </h1>
            <p className="text-[#999999] text-base leading-[100%] font-normal mt-2">
              A guided conversation - one question at a time
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(data.nextPath)}
              className="bg-[#9b5948] w-24.75 h-12.75 text-base text-white hover:bg-[#874b3d]"
            >
              Next
            </button>

            <button className="border w-24.75 h-12.75 border-[#d8ccc3] px-4 py-1.5 text-base text-[#9b5948]">
              Exit
            </button>
          </div>
        </div>

        <div className="px-4">
          <ProgressBar
            step={currentStep}
            id={currentQuestion.id}
            progress={progress}
            totalSteps={totalQuestions}
          />
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
                    <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8f513f] text-[13px] font-medium text-white">
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
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5dfd8] text-[13px] font-medium text-[#9b5948]">
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
              placeholder={
                currentQuestion?.placeholder ?? "Type your answer here"
              }
              className="h-10 flex-1 border border-[#d6c8bc] bg-[#fbf8f5] px-4 text-xs text-[#4b342d] outline-none placeholder:text-[#b9a89c] focus:border-[#9b5948]"
            />

            <button
              onClick={handleSend}
              className="flex h-10 w-10 items-center justify-center bg-[#9b5948] text-white hover:bg-[#874b3d]"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        <p className="pb-2 text-center text-[10px] text-[#a15b48]">
          Structure below kicks — the FREEDOM BUDGET METHOD™ — UFYALL.COM
        </p>
      </section>
    </main>
  );
}
