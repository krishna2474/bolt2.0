import { chatSession } from "@/config/AiModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { prompt } = await request.json();
  try {
    const result = await chatSession.sendMessage(prompt);
    const res = result.response.text();
    return NextResponse.json({
      result: res,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
