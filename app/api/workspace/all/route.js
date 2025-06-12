import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    console.log("Fetching workspaces for user email:", email);
    const res = await prisma.workspace.findMany({
      where: {
        user: {
          email,
        },
      },
    });
    if (res.length == 0) {
      return NextResponse.json(
        {
          error: "No workspaces found for this user",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({
      workspaces: res,
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
