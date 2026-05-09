import type { Message } from "./FinancialIntakeShell";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8f513f] text-[12px] font-medium text-white">
          FBM
        </div>
      )}

      <div className="flex max-w-[86%] flex-col">
        <div
          className={`rounded-2xl px-4 py-3 text-[16px] leading-snug shadow-sm ${
            isUser
              ? "bg-[#9b5948] text-white"
              : "bg-white text-[#2f2926]"
          }`}
        >
          {message.text}
        </div>

        <div
          className={`mt-1 text-[16px] text-[#9f9f9f] ${
            isUser ? "self-start" : "self-end"
          }`}
        >
          12:45
        </div>
      </div>
    </div>
  );
}