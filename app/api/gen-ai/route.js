import { genAiCode } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { prompt } = await request.json();
  try {
    const result = await genAiCode.sendMessage(prompt);
    const res = result.response.text();
    return NextResponse.json(JSON.parse(res), {
      status: 200,
    });
  } catch (error) {
    console.error("Error generating code:", error);
    return NextResponse(JSON.stringify({ error: "Failed to generate code" }), {
      status: 500,
    });
  }
}
