import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-helpers";
import { createFormSchema } from "@/lib/validations";

export async function GET() {
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const forms = await prisma.form.findMany({
    where: { userId: result.userId },
    include: {
      _count: { select: { questions: true, responses: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ forms });
}

export async function POST(request: Request) {
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  let body: { title?: string; description?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Use defaults
  }

  const validated = createFormSchema.safeParse({
    title: body.title || "Untitled Form",
    description: body.description,
  });

  const title = validated.success ? validated.data.title : "Untitled Form";
  const description = validated.success ? validated.data.description : undefined;

  const form = await prisma.form.create({
    data: {
      userId: result.userId,
      title,
      description,
      questions: {
        create: [
          {
            type: "welcome_screen",
            title: "Welcome!",
            description: "Please take a moment to fill out this form.",
            order: 0,
            properties: JSON.stringify({ buttonText: "Start", showButton: true }),
          },
          {
            type: "thank_you_screen",
            title: "Thank you!",
            description: "Your response has been recorded.",
            order: 1,
            properties: JSON.stringify({ showButton: false }),
          },
        ],
      },
    },
  });

  return NextResponse.json({ form }, { status: 201 });
}
