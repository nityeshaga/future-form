"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsesTable } from "./responses-table";
import { ResponseDetail } from "./response-detail";

interface Question {
  id: string;
  title: string;
  type: string;
}

interface Answer {
  questionId: string;
  value: string;
}

interface ResponseData {
  id: string;
  startedAt: string;
  completedAt: string | null;
  answers: Answer[];
}

interface ResponsesViewProps {
  form: { id: string; title: string; questions: Question[] };
  responses: ResponseData[];
}

export function ResponsesView({ form, responses }: ResponsesViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = responses.find((r) => r.id === selectedId);

  function exportCSV() {
    const headers = ["#", "Submitted", ...form.questions.map((q) => q.title || q.type)];
    const rows = responses.map((r, i) => [
      String(responses.length - i),
      r.completedAt ? new Date(r.completedAt).toLocaleString() : "Incomplete",
      ...form.questions.map((q) => {
        const a = r.answers.find((a) => a.questionId === q.id);
        return a?.value || "";
      }),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{form.title}</h1>
            <p className="text-sm text-muted-foreground">
              {responses.length} response{responses.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/forms/${form.id}/edit`}>
            <Button variant="outline" size="sm">
              Edit Form
            </Button>
          </Link>
          {responses.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-1 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">No responses yet</h2>
          <p className="mt-1 text-muted-foreground">
            Share your form link to start collecting responses.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/f/${form.id}`
              );
            }}
          >
            Copy Form Link
          </Button>
        </div>
      ) : selected ? (
        <ResponseDetail
          response={selected}
          questions={form.questions}
          index={responses.length - responses.indexOf(selected)}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <ResponsesTable
          responses={responses}
          questions={form.questions}
          onSelect={setSelectedId}
        />
      )}
    </div>
  );
}
