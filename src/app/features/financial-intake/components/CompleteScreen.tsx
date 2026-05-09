"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompleteScreen() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#777675] px-6 py-10">
      <section className="w-full max-w-xl bg-[#f3eee8] px-10 py-14 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#9b5948] text-white">
          <CheckCircle size={28} />
        </div>

        <p className="text-[10px] font-medium uppercase tracking-wide text-[#a15b48]">
          Steps of a Successful Plan
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[#2f2926]">
          Your file is ready
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#8a746c]">
          Your financial intake has been completed successfully. You can now
          continue with the next process.
        </p>

        <button
          onClick={() => router.push("/financial-intake/step-1")}
          className="mt-6 bg-[#9b5948] px-8 py-3 text-sm font-medium text-white hover:bg-[#874b3d]"
        >
          Start Again
        </button>
      </section>
    </main>
  );
}