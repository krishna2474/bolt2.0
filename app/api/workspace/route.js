import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const id = request.nextUrl.searchParams.get("id");
  const workspace = await prisma.workspace.findUnique({
    where: {
      id,
    },
  });
  if (!workspace) {
    return new Response("Workspace not found", { status: 404 });
  }
  return new Response(JSON.stringify(workspace), {
    status: 200,
  });
}

export async function POST(request) {
  try {
    const { email, message } = await request.json();
    if (!email || !message) {
      return new Response("Email and message are required", { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    const workspace = await prisma.workspace.create({
      data: {
        user: {
          connect: { id: user.id }, // Connect user via their ID
        },
        message,
      },
    });
    return new Response(JSON.stringify(workspace), {
      status: 201,
    });
  } catch (error) {
    console.error("Error in POST /workspace:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, message } = await request.json();
    if (!id || !message) {
      return new Response("ID and message are required", { status: 400 });
    }
    const workspace = await prisma.workspace.update({
      where: { id },
      data: { message },
    });
    return new Response(JSON.stringify(workspace), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in PATCH /workspace:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
