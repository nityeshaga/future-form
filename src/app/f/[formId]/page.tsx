import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import { parseFormData } from "@/lib/form-utils";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ formId: string }>;
}): Promise<Metadata> {
  const { formId } = await params;
  const form = await prisma.form.findUnique({
    where: { id: formId, status: "published" },
    select: { title: true, description: true },
  });

  return {
    title: form?.title ?? "Form Not Found",
    description: form?.description ?? "",
  };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const form = await prisma.form.findUnique({
    where: { id: formId, status: "published" },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!form) notFound();

  return <FormRenderer form={parseFormData(form)} />;
}
