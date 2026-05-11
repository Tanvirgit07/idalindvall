import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const body = await request.json();

  if (!baseUrl) {
    return NextResponse.json(
      {
        status: false,
        status_code: 500,
        message: "NEXT_PUBLIC_BACKEND_API_URL is missing.",
      },
      { status: 500 },
    );
  }

  const response = await fetch(`${baseUrl}/incomebudget-method`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
