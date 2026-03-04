import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-helpers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const auth = await getAuthenticatedUser();
  if ("error" in auth) return auth.error;

  const { formId } = await params;

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: auth.userId },
    select: { id: true },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const responses = await prisma.response.findMany({
    where: { formId },
    include: {
      answers: {
        include: { question: { select: { id: true, title: true, type: true } } },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return NextResponse.json({ responses });
}
