"use client";

import { useEffect, useMemo } from "react";
import type { MultipleChoiceProperties } from "@/types/form";

interface MultipleChoiceProps {
  title: string;
  description: string | null;
  properties: MultipleChoiceProperties;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  questionNumber: number;
}

const KEYS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export function MultipleChoice({
  title,
  description,
  properties,
  value,
  onChange,
  onSubmit,
  questionNumber,
}: MultipleChoiceProps) {
  const choices = useMemo(() => properties.choices || [], [properties.choices]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const index = KEYS.indexOf(key);
      if (index >= 0 && index < choices.length) {
        onChange(choices[index].label);
        setTimeout(onSubmit, 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [choices, onChange, onSubmit]);

  return (
    <div className="w-full max-w-xl">
      <span className="text-sm text-muted-foreground">{questionNumber}.</span>
      <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}

      <div className="mt-6 space-y-3">
        {choices.map((choice, i) => (
          <button
            key={choice.id}
            onClick={() => {
              onChange(choice.label);
              setTimeout(onSubmit, 300);
            }}
            className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-colors ${
              value === choice.label
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            }`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border text-sm font-medium">
              {KEYS[i]}
            </span>
            <span className="text-lg">{choice.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
