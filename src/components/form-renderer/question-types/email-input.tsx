"use client";

import { useEffect, useRef, useState } from "react";
import type { TextProperties } from "@/types/form";

interface EmailInputProps {
  title: string;
  description: string | null;
  properties: TextProperties;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  questionNumber: number;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailInput({
  title,
  description,
  properties,
  value,
  onChange,
  onSubmit,
  questionNumber,
}: EmailInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!EMAIL_REGEX.test(value)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    onSubmit();
  };

  return (
    <div className="w-full max-w-xl">
      <label className="block">
        <span className="text-sm text-muted-foreground">{questionNumber}.</span>
        <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
        {description && <p className="mt-2 text-muted-foreground">{description}</p>}
      </label>
      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (error) setError("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) handleSubmit();
        }}
        placeholder={properties.placeholder || "name@example.com"}
        className="mt-6 w-full border-b-2 border-muted bg-transparent py-2 text-2xl outline-none transition-colors focus:border-primary"
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <p className="mt-4 text-sm text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to continue
      </p>
    </div>
  );
}
