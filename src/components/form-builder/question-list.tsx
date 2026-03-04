"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUESTION_TYPE_LABELS, type QuestionWithParsedProperties } from "@/types/form";
import { Button } from "@/components/ui/button";

interface QuestionListProps {
  questions: QuestionWithParsedProperties[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestionList({
  questions,
  selectedId,
  onSelect,
  onDelete,
}: QuestionListProps) {
  return (
    <div className="space-y-1">
      {questions.map((question) => (
        <SortableQuestionItem
          key={question.id}
          question={question}
          isSelected={question.id === selectedId}
          onSelect={() => onSelect(question.id)}
          onDelete={() => onDelete(question.id)}
        />
      ))}
    </div>
  );
}

interface SortableQuestionItemProps {
  question: QuestionWithParsedProperties;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SortableQuestionItem({
  question,
  isSelected,
  onSelect,
  onDelete,
}: SortableQuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isScreen =
    question.type === "welcome_screen" || question.type === "thank_you_screen";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-1 rounded-md border px-2 py-2 text-sm transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:bg-gray-100",
        isDragging && "z-50 shadow-lg"
      )}
      onClick={onSelect}
    >
      <button
        className="cursor-grab touch-none text-muted-foreground opacity-0 group-hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </button>

      <div className="flex-1 truncate">
        <span className="text-xs text-muted-foreground">
          {QUESTION_TYPE_LABELS[question.type]}
        </span>
        {question.title && (
          <p className="truncate text-sm">{question.title}</p>
        )}
      </div>

      {!isScreen && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
