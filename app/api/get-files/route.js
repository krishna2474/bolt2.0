import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const workspace = await prisma.workspace.findUnique({
    where: {
      id,
    },
    select: { filedata: true },
  });
  if (!workspace) {
    return new Response("Workspace not found", { status: 404 });
  }
  return NextResponse.json(
    { fileData: workspace.filedata },
    {
      status: 200,
    }
  );
}
