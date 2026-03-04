"use client";

import { useState } from "react";
import type {
  QuestionWithParsedProperties,
  MultipleChoiceProperties,
  RatingProperties,
  TextProperties,
  WelcomeScreenProperties,
  ThankYouScreenProperties,
  ChoiceOption,
} from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { nanoid } from "nanoid";

interface QuestionPropertiesProps {
  question: QuestionWithParsedProperties;
  onUpdate: (updates: Partial<QuestionWithParsedProperties>) => void;
}

export function QuestionProperties({
  question,
  onUpdate,
}: QuestionPropertiesProps) {
  function updateProperties(updates: Record<string, unknown>) {
    onUpdate({
      properties: { ...(question.properties as Record<string, unknown>), ...updates },
    });
  }

  switch (question.type) {
    case "welcome_screen":
      return (
        <WelcomeScreenProps
          properties={question.properties as WelcomeScreenProperties}
          onUpdate={updateProperties}
        />
      );
    case "short_text":
    case "long_text":
    case "email":
      return (
        <TextProps
          properties={question.properties as TextProperties}
          onUpdate={updateProperties}
        />
      );
    case "multiple_choice":
      return (
        <MultipleChoiceProps
          properties={question.properties as MultipleChoiceProperties}
          onUpdate={updateProperties}
        />
      );
    case "rating":
      return (
        <RatingProps
          properties={question.properties as RatingProperties}
          onUpdate={updateProperties}
        />
      );
    case "yes_no":
      return (
        <div className="text-sm text-muted-foreground">
          <h3 className="mb-4 font-medium text-foreground">Properties</h3>
          <p>No additional settings for Yes/No questions.</p>
        </div>
      );
    case "thank_you_screen":
      return (
        <ThankYouScreenProps
          properties={question.properties as ThankYouScreenProperties}
          onUpdate={updateProperties}
        />
      );
    default:
      return null;
  }
}

function WelcomeScreenProps({
  properties,
  onUpdate,
}: {
  properties: WelcomeScreenProperties;
  onUpdate: (updates: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Properties</h3>
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={properties.buttonText || "Start"}
          onChange={(e) => onUpdate({ buttonText: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          checked={properties.showButton !== false}
          onCheckedChange={(checked) => onUpdate({ showButton: checked })}
        />
        <Label>Show Button</Label>
      </div>
    </div>
  );
}

function TextProps({
  properties,
  onUpdate,
}: {
  properties: TextProperties;
  onUpdate: (updates: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Properties</h3>
      <div className="space-y-2">
        <Label>Placeholder</Label>
        <Input
          value={properties.placeholder || ""}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder="Placeholder text..."
        />
      </div>
    </div>
  );
}

function MultipleChoiceProps({
  properties,
  onUpdate,
}: {
  properties: MultipleChoiceProperties;
  onUpdate: (updates: Record<string, unknown>) => void;
}) {
  const choices = properties.choices || [];
  const [newChoice, setNewChoice] = useState("");

  function addChoice() {
    const label = newChoice.trim() || `Option ${choices.length + 1}`;
    const updated: ChoiceOption[] = [...choices, { id: nanoid(6), label }];
    onUpdate({ choices: updated });
    setNewChoice("");
  }

  function removeChoice(id: string) {
    onUpdate({ choices: choices.filter((c) => c.id !== id) });
  }

  function updateChoiceLabel(id: string, label: string) {
    onUpdate({
      choices: choices.map((c) => (c.id === id ? { ...c, label } : c)),
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Choices</h3>
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <div key={choice.id} className="flex items-center gap-2">
            <span className="w-5 text-center text-xs text-muted-foreground">
              {String.fromCharCode(65 + index)}
            </span>
            <Input
              value={choice.label}
              onChange={(e) => updateChoiceLabel(choice.id, e.target.value)}
              className="h-8 text-sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => removeChoice(choice.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newChoice}
          onChange={(e) => setNewChoice(e.target.value)}
          placeholder="New option..."
          className="h-8 text-sm"
          onKeyDown={(e) => e.key === "Enter" && addChoice()}
        />
        <Button variant="outline" size="sm" onClick={addChoice}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function RatingProps({
  properties,
  onUpdate,
}: {
  properties: RatingProperties;
  onUpdate: (updates: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Properties</h3>
      <div className="space-y-2">
        <Label>Number of Stars</Label>
        <div className="flex gap-2">
          {[3, 5, 7, 10].map((n) => (
            <Button
              key={n}
              variant={properties.steps === n ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate({ steps: n })}
            >
              {n}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThankYouScreenProps({
  properties,
  onUpdate,
}: {
  properties: ThankYouScreenProperties;
  onUpdate: (updates: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Properties</h3>
      <div className="flex items-center gap-3">
        <Switch
          checked={properties.showButton === true}
          onCheckedChange={(checked) => onUpdate({ showButton: checked })}
        />
        <Label>Show redirect button</Label>
      </div>
      {properties.showButton && (
        <>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input
              value={properties.buttonText || ""}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
              placeholder="Visit our website"
            />
          </div>
          <div className="space-y-2">
            <Label>Button URL</Label>
            <Input
              value={properties.buttonUrl || ""}
              onChange={(e) => onUpdate({ buttonUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </>
      )}
    </div>
  );
}
