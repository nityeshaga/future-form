import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-helpers";
import { updateFormSchema } from "@/lib/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  return NextResponse.json({ form });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const existing = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const body = await request.json();
  const validated = updateFormSchema.parse(body);

  const form = await prisma.form.update({
    where: { id: formId },
    data: validated,
  });

  return NextResponse.json({ form });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;
  const result = await getAuthenticatedUser();
  if ("error" in result) return result.error;

  const existing = await prisma.form.findUnique({
    where: { id: formId, userId: result.userId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  await prisma.form.delete({ where: { id: formId } });

  return NextResponse.json({ success: true });
}
