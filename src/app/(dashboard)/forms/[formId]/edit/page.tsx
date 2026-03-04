import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { parseFormData } from "@/lib/form-utils";

export default async function FormEditPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: session.user.id },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!form) notFound();

  const parsed = parseFormData(form);

  return <FormBuilder initialForm={parsed} />;
}
