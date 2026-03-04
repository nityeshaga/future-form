import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ResponsesView } from "@/components/dashboard/responses-view";

export default async function ResponsesPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: session.user.id },
    select: {
      id: true,
      title: true,
      questions: {
        where: {
          type: {
            notIn: ["welcome_screen", "thank_you_screen"],
          },
        },
        orderBy: { order: "asc" },
        select: { id: true, title: true, type: true },
      },
    },
  });

  if (!form) notFound();

  const responses = await prisma.response.findMany({
    where: { formId },
    include: {
      answers: true,
    },
    orderBy: { startedAt: "desc" },
  });

  return (
    <ResponsesView
      form={form}
      responses={responses.map((r) => ({
        id: r.id,
        startedAt: r.startedAt.toISOString(),
        completedAt: r.completedAt?.toISOString() ?? null,
        answers: r.answers.map((a) => ({
          questionId: a.questionId,
          value: a.value,
        })),
      }))}
    />
  );
}
