import MessageBubble from "./MessageBubble";
import type { Message } from "./FinancialIntakeShell";

type Props = {
  messages: Message[];
};

export default function ChatWindow({ messages }: Props) {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
}