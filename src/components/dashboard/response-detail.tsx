"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ResponseDetailProps {
  response: ResponseData;
  questions: Question[];
  index: number;
  onBack: () => void;
}

export function ResponseDetail({ response, questions, index, onBack }: ResponseDetailProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Response #{index}</h2>
          <p className="text-sm text-muted-foreground">
            {response.completedAt
              ? `Completed on ${new Date(response.completedAt).toLocaleString()}`
              : `Started on ${new Date(response.startedAt).toLocaleString()}`}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q) => {
          const answer = response.answers.find((a) => a.questionId === q.id);
          return (
            <div key={q.id} className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">
                {q.title || q.type}
              </p>
              <p className="mt-1 text-lg">
                {answer?.value || (
                  <span className="text-muted-foreground italic">No answer</span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
