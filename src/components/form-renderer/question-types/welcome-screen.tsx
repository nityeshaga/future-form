"use client";

import { Button } from "@/components/ui/button";
import type { WelcomeScreenProperties } from "@/types/form";

interface WelcomeScreenProps {
  title: string;
  description: string | null;
  properties: WelcomeScreenProperties;
  onNext: () => void;
}

export function WelcomeScreen({ title, description, properties, onNext }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title || "Welcome"}</h1>
      {description && (
        <p className="mt-4 max-w-md text-lg text-muted-foreground">{description}</p>
      )}
      {properties.showButton !== false && (
        <Button onClick={onNext} size="lg" className="mt-8">
          {properties.buttonText || "Start"}
        </Button>
      )}
    </div>
  );
}
