"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NavigationFooterProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  isSubmitting?: boolean;
  isLastQuestion?: boolean;
}

export function NavigationFooter({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  isSubmitting,
  isLastQuestion,
}: NavigationFooterProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex items-center gap-2 p-4">
      {isLastQuestion ? (
        <Button onClick={onNext} disabled={!canGoNext || isSubmitting} size="lg">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={!canGoNext} size="sm" variant="outline">
          OK
        </Button>
      )}
      <div className="flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onPrev}
          disabled={!canGoPrev}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onNext}
          disabled={!canGoNext}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
