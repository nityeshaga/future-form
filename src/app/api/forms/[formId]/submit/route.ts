import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitResponseSchema } from "@/lib/validations";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;

  const form = await prisma.form.findUnique({
    where: { id: formId, status: "published" },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { answers } = submitResponseSchema.parse(body);

    // Validate required questions
    const requiredQuestions = form.questions.filter((q) => q.required);
    for (const q of requiredQuestions) {
      const answer = answers.find((a) => a.questionId === q.id);
      if (!answer || !answer.value.trim()) {
        return NextResponse.json(
          { error: `Question "${q.title}" is required`, questionId: q.id },
          { status: 400 }
        );
      }
    }

    const response = await prisma.response.create({
      data: {
        formId,
        completedAt: new Date(),
      },
    });

    for (const answer of answers) {
      if (answer.value.trim()) {
        await prisma.answer.create({
          data: {
            responseId: response.id,
            questionId: answer.questionId,
            value: answer.value,
          },
        });
      }
    }

    return NextResponse.json({ response: { id: response.id } }, { status: 201 });
  } catch (error) {
    console.error("Error submitting response:", error);
    return NextResponse.json({ error: "Failed to submit response" }, { status: 500 });
  }
}
