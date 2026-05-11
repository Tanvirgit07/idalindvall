import { NextResponse } from "next/server";
import type { FinancialIntakeChatRequest } from "@/app/features/financial-intake/types/financialIntake.types";

export async function POST(request: Request) {
  const apiUrl = process.env.FINANCIAL_INTAKE_API_URL;
  const body = (await request.json()) as FinancialIntakeChatRequest;

  if (!apiUrl) {
    return NextResponse.json(
      {
        status: false,
        status_code: 500,
        message: "FINANCIAL_INTAKE_API_URL is missing.",
      },
      { status: 500 },
    );
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
