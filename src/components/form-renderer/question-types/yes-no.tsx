"use client";

import { useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface YesNoProps {
  title: string;
  description: string | null;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  questionNumber: number;
}

export function YesNo({
  title,
  description,
  value,
  onChange,
  onSubmit,
  questionNumber,
}: YesNoProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === "Y") {
        onChange("Yes");
        setTimeout(onSubmit, 300);
      } else if (e.key.toUpperCase() === "N") {
        onChange("No");
        setTimeout(onSubmit, 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onChange, onSubmit]);

  const select = (val: string) => {
    onChange(val);
    setTimeout(onSubmit, 300);
  };

  return (
    <div className="w-full max-w-xl">
      <span className="text-sm text-muted-foreground">{questionNumber}.</span>
      <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => select("Yes")}
          className={`flex flex-1 items-center justify-center gap-3 rounded-lg border-2 px-6 py-4 text-lg transition-colors ${
            value === "Yes"
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-primary/50"
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
          <span className="font-medium">Yes</span>
          <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Y</kbd>
        </button>
        <button
          onClick={() => select("No")}
          className={`flex flex-1 items-center justify-center gap-3 rounded-lg border-2 px-6 py-4 text-lg transition-colors ${
            value === "No"
              ? "border-primary bg-primary/5"
              : "border-muted hover:border-primary/50"
          }`}
        >
          <ThumbsDown className="h-5 w-5" />
          <span className="font-medium">No</span>
          <kbd className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">N</kbd>
        </button>
      </div>
    </div>
  );
}
