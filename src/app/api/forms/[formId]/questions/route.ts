import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-helpers";
import { createQuestionSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const questions = await prisma.question.findMany({
    where: { formId },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ questions });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validated = createQuestionSchema.parse(body);

    // Get the max order, insert before the thank you screen
    const questions = await prisma.question.findMany({
      where: { formId },
      orderBy: { order: "asc" },
    });

    const thankYouIndex = questions.findIndex((q) => q.type === "thank_you_screen");
    const insertOrder = thankYouIndex >= 0 ? thankYouIndex : questions.length;

    // Shift thank you screen and anything after it (sequential updates)
    if (thankYouIndex >= 0) {
      const toShift = questions.slice(thankYouIndex);
      for (let i = 0; i < toShift.length; i++) {
        await prisma.question.update({
          where: { id: toShift[i].id },
          data: { order: insertOrder + 1 + i },
        });
      }
    }

    const question = await prisma.question.create({
      data: {
        formId,
        type: validated.type,
        title: validated.title || "",
        description: validated.description || null,
        required: validated.required || false,
        properties: JSON.stringify(validated.properties || {}),
        order: insertOrder,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to create question", details: message }, { status: 500 });
  }
}
