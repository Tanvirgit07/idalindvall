"use client";

import { CheckCircle, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getBudgetFileUrl } from "../utils/financialIntakeStorage";

export default function CompleteScreen() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFileUrl(getBudgetFileUrl());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const fileName = useMemo(() => {
    if (!fileUrl) return "";

    const urlFileName = fileUrl.split("/").pop() ?? "FreedomBudget.xlsx";

    return decodeURIComponent(urlFileName);
  }, [fileUrl]);

  if (!fileUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#e8e3dc] px-6 py-10">
        <section className="w-full max-w-xl px-10 py-14 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#9b5948] text-white">
            <Loader2 className="animate-spin" size={30} />
          </div>

          <p className="text-base font-medium text-[#9b5948]">
            Generating your budget file...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8e3dc] px-6 py-10">
      <section className="w-full max-w-xl px-10 py-14 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#9b5948] text-white">
          <CheckCircle size={34} strokeWidth={2.5} />
        </div>

        <p className="text-[18px] font-medium text-[#9b5948]">
          Step 6 of 6 - Complete
        </p>

        <h1 className="mt-2 text-[34px] font-bold leading-none text-[#2f2926]">
          Your file is ready
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-sm leading-tight text-[#9f9f9f]">
          Your Freedom Budget has been generated and is ready to download.
        </p>

        <div className="mx-auto mt-8 flex max-w-sm items-center rounded-md bg-white px-4 py-3 text-left shadow-sm">
          <div className="mr-3 flex h-10 w-10 items-center justify-center bg-[#2f8f5b] text-white">
            <FileSpreadsheet size={28} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#3c3c3c]">
              {fileName}
            </p>
            <p className="mt-1 text-[11px] text-[#9f9f9f]">
              Branded template
            </p>
          </div>
        </div>

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-5 flex h-12 max-w-sm items-center justify-center gap-2 bg-[#9b5948] text-sm font-medium text-white hover:bg-[#874b3d]"
        >
          <Download size={17} />
          Download
        </a>

        <button
          onClick={() => router.push("/financial-intake/step-1")}
          className="mt-5 text-sm font-medium text-[#9b5948] hover:underline"
        >
          Start Again
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#b2aaa5]">Structure before scale.</p>
          <p className="mt-2 text-sm font-medium text-[#9b5948]">
            THE FREEDOM BUDGET METHOD <sup>TM</sup>
          </p>
          <p className="mt-2 text-sm text-[#aaa19d] underline">lilyvall.com</p>
        </div>
      </section>
    </main>
  );
}
