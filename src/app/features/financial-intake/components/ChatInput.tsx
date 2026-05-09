"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Props = {
  onSend: (value: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    onSend(value);
    setValue("");
  };

  return (
    <div className="flex items-center gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Type your answer here"
        className="h-11 flex-1 rounded-sm border border-[#d6c8bc] bg-[#fdfaf7] px-4 text-sm text-[#4b342d] outline-none placeholder:text-[#b9a89c] focus:border-[#a75d49]"
      />

      <button
        onClick={handleSubmit}
        className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#9b5948] text-white transition hover:bg-[#874b3d]"
      >
        <Send size={17} />
      </button>
    </div>
  );
}