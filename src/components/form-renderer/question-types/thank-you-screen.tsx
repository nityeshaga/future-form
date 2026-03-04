"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ThankYouScreenProperties } from "@/types/form";

interface ThankYouScreenProps {
  title: string;
  description: string | null;
  properties: ThankYouScreenProperties;
}

export function ThankYouScreen({ title, description, properties }: ThankYouScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
        {title || "Thank you!"}
      </h1>
      {description && (
        <p className="mt-4 max-w-md text-lg text-muted-foreground">{description}</p>
      )}
      {properties.showButton && properties.buttonUrl && (
        <Button asChild size="lg" className="mt-8">
          <a href={properties.buttonUrl}>{properties.buttonText || "Continue"}</a>
        </Button>
      )}
    </div>
  );
}
