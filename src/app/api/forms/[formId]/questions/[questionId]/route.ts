import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-helpers";
import { updateQuestionSchema } from "@/lib/validations";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ formId: string; questionId: string }> }
) {
  const { formId, questionId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await request.json();
  const validated = updateQuestionSchema.parse(body);

  const updateData: Record<string, unknown> = {};
  if (validated.title !== undefined) updateData.title = validated.title;
  if (validated.description !== undefined) updateData.description = validated.description;
  if (validated.required !== undefined) updateData.required = validated.required;
  if (validated.properties !== undefined)
    updateData.properties = JSON.stringify(validated.properties);
  if (validated.order !== undefined) updateData.order = validated.order;

  const question = await prisma.question.update({
    where: { id: questionId },
    data: updateData,
  });

  return NextResponse.json({ question });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ formId: string; questionId: string }> }
) {
  const { formId, questionId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  await prisma.question.delete({ where: { id: questionId } });

  // Recompute order for remaining questions
  const remaining = await prisma.question.findMany({
    where: { formId },
    orderBy: { order: "asc" },
  });

  for (let i = 0; i < remaining.length; i++) {
    await prisma.question.update({
      where: { id: remaining[i].id },
      data: { order: i },
    });
  }

  return NextResponse.json({ success: true });
}
