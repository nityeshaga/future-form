"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QUESTION_TYPE_LABELS, type QuestionType } from "@/types/form";
import {
  Type,
  AlignLeft,
  Mail,
  List,
  ToggleLeft,
  Star,
} from "lucide-react";

const ADDABLE_TYPES: { type: QuestionType; icon: React.ReactNode }[] = [
  { type: "short_text", icon: <Type className="h-5 w-5" /> },
  { type: "long_text", icon: <AlignLeft className="h-5 w-5" /> },
  { type: "email", icon: <Mail className="h-5 w-5" /> },
  { type: "multiple_choice", icon: <List className="h-5 w-5" /> },
  { type: "yes_no", icon: <ToggleLeft className="h-5 w-5" /> },
  { type: "rating", icon: <Star className="h-5 w-5" /> },
];

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: QuestionType) => void;
}

export function AddQuestionDialog({
  open,
  onClose,
  onAdd,
}: AddQuestionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          {ADDABLE_TYPES.map(({ type, icon }) => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-gray-50 hover:border-primary"
            >
              <div className="text-muted-foreground">{icon}</div>
              <span className="text-sm font-medium">
                {QUESTION_TYPE_LABELS[type]}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
