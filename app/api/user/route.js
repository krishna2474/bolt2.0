import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return Response.json(
      { error: "Email parameter is required" },
      { status: 400 }
    );
  }
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json({
    message: "User found",
    user,
  });
}
