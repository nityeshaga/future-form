"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { RatingProperties } from "@/types/form";

interface RatingProps {
  title: string;
  description: string | null;
  properties: RatingProperties;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  questionNumber: number;
}

export function Rating({
  title,
  description,
  properties,
  value,
  onChange,
  onSubmit,
  questionNumber,
}: RatingProps) {
  const steps = properties.steps || 5;
  const currentRating = value ? parseInt(value, 10) : 0;
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= steps) {
        onChange(String(num));
        setTimeout(onSubmit, 400);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [steps, onChange, onSubmit]);

  return (
    <div className="w-full max-w-xl">
      <span className="text-sm text-muted-foreground">{questionNumber}.</span>
      <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}

      <div className="mt-6 flex gap-2">
        {Array.from({ length: steps }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => {
              onChange(String(n));
              setTimeout(onSubmit, 400);
            }}
            onMouseEnter={() => setHoveredRating(n)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`h-10 w-10 transition-colors ${
                n <= (hoveredRating || currentRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">1</kbd>-
        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{steps}</kbd> to rate
      </p>
    </div>
  );
}
