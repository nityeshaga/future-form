"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import FormCard from "@/components/dashboard/form-card";

interface FormData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  updatedAt: string;
  _count: { questions: number; responses: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    const res = await fetch("/api/forms");
    if (res.ok) {
      const data = await res.json();
      setForms(data.forms);
    }
    setIsLoading(false);
  }

  async function handleCreateForm() {
    const res = await fetch("/api/forms", { method: "POST" });
    if (res.ok) {
      const { form } = await res.json();
      router.push(`/forms/${form.id}/edit`);
    }
  }

  function handleDelete(formId: string) {
    setForms((prev) => prev.filter((f) => f.id !== formId));
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">No forms yet</h2>
        <p className="mt-1 text-muted-foreground">
          Create your first form and start collecting responses.
        </p>
        <Button onClick={handleCreateForm} className="mt-6">
          <Plus className="mr-1 h-4 w-4" />
          Create your first form
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Forms</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <FormCard key={form.id} form={form} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
