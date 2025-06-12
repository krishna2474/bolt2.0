import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { id, files } = await request.json();
  if (!id || !files) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
  const res = await prisma.workspace.update({
    where: { id },
    data: {
      filedata: files,
    },
  });
  if (!res) {
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { message: "Workspace updated successfully" },
    { status: 200 }
  );
}
