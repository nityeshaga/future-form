import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-helpers";
import { reorderQuestionsSchema } from "@/lib/validations";

export async function PUT(
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

  const body = await request.json();
  const { questionIds } = reorderQuestionsSchema.parse(body);

  for (let i = 0; i < questionIds.length; i++) {
    await prisma.question.update({
      where: { id: questionIds[i] },
      data: { order: i },
    });
  }

  return NextResponse.json({ success: true });
}
