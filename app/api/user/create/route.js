import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const body = await request.json();
  const { name, email, picture } = body;
  if (!name || !email || !picture) {
    return Response.json(
      {
        error: "Missing required fields: name, email, or picture",
      },
      { status: 400 }
    );
  }
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (userExists) {
    return Response.json(
      {
        message: "User already exists",
        user: {
          name: userExists.name,
          email: userExists.email,
          picture: userExists.picture,
        },
      },
      { status: 200 }
    );
  }
  const user = await prisma.user.create({
    data: {
      name,
      email,
      picture,
    },
  });
  if (!user) {
    return Response.json(
      {
        error: "Failed to create user",
      },
      { status: 500 }
    );
  }
  return Response.json({
    message: "User created successfully",
    user: {
      name: name,
      email: email,
      picture: picture,
    },
  });
}
