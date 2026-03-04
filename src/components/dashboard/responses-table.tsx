"use client";

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

interface ResponsesTableProps {
  responses: ResponseData[];
  questions: Question[];
  onSelect: (id: string) => void;
}

export function ResponsesTable({ responses, questions, onSelect }: ResponsesTableProps) {
  // Show up to 3 question columns
  const displayQuestions = questions.slice(0, 3);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">#</th>
            <th className="px-4 py-3 text-left font-medium">Submitted</th>
            {displayQuestions.map((q) => (
              <th key={q.id} className="px-4 py-3 text-left font-medium">
                {q.title || q.type}
              </th>
            ))}
            <th className="px-4 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response, i) => (
            <tr
              key={response.id}
              onClick={() => onSelect(response.id)}
              className="cursor-pointer border-b transition-colors hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-medium">{responses.length - i}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {response.completedAt
                  ? new Date(response.completedAt).toLocaleDateString()
                  : new Date(response.startedAt).toLocaleDateString()}
              </td>
              {displayQuestions.map((q) => {
                const answer = response.answers.find((a) => a.questionId === q.id);
                return (
                  <td key={q.id} className="max-w-[200px] truncate px-4 py-3">
                    {answer?.value || <span className="text-muted-foreground">—</span>}
                  </td>
                );
              })}
              <td className="px-4 py-3">
                {response.completedAt ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    Partial
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
