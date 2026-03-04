"use client";

import type { QuestionWithParsedProperties } from "@/types/form";
import { QUESTION_TYPE_LABELS } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface QuestionEditorProps {
  question: QuestionWithParsedProperties;
  onUpdate: (updates: Partial<QuestionWithParsedProperties>) => void;
}

export function QuestionEditor({ question, onUpdate }: QuestionEditorProps) {
  const isScreen =
    question.type === "welcome_screen" || question.type === "thank_you_screen";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Badge variant="secondary">{QUESTION_TYPE_LABELS[question.type]}</Badge>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="question-title">
            {isScreen ? "Title" : "Question"}
          </Label>
          <Input
            id="question-title"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder={isScreen ? "Enter title..." : "Enter your question..."}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-description">Description (optional)</Label>
          <Textarea
            id="question-description"
            value={question.description || ""}
            onChange={(e) =>
              onUpdate({ description: e.target.value || null })
            }
            placeholder="Add a description or instructions..."
            rows={3}
          />
        </div>

        {!isScreen && (
          <div className="flex items-center gap-3">
            <Switch
              id="required"
              checked={question.required}
              onCheckedChange={(checked) => onUpdate({ required: checked })}
            />
            <Label htmlFor="required">Required</Label>
          </div>
        )}
      </div>
    </div>
  );
}
