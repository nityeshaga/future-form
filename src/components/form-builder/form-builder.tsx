"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import type {
  FormWithQuestions,
  QuestionWithParsedProperties,
  QuestionType,
} from "@/types/form";
import { getDefaultProperties } from "@/types/form";
import { QuestionList } from "./question-list";
import { QuestionEditor } from "./question-editor";
import { QuestionProperties } from "./question-properties";
import { FormSettingsPanel } from "./form-settings-panel";
import { AddQuestionDialog } from "./add-question-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings } from "lucide-react";

interface FormBuilderProps {
  initialForm: FormWithQuestions;
}

export function FormBuilder({ initialForm }: FormBuilderProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [questions, setQuestions] = useState(initialForm.questions);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
  useEffect(() => { setIsMounted(true); }, []);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const saveQuestion = useCallback(
    async (question: QuestionWithParsedProperties) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        await fetch(`/api/forms/${form.id}/questions/${question.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: question.title,
            description: question.description,
            required: question.required,
            properties: question.properties,
          }),
        });
      }, 1500);
    },
    [form.id]
  );

  function updateQuestion(
    questionId: string,
    updates: Partial<QuestionWithParsedProperties>
  ) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const updated = { ...q, ...updates };
        saveQuestion(updated);
        return updated;
      })
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const newQuestions = [...questions];
    const [moved] = newQuestions.splice(oldIndex, 1);
    newQuestions.splice(newIndex, 0, moved);
    const reordered = newQuestions.map((q, i) => ({ ...q, order: i }));
    setQuestions(reordered);

    await fetch(`/api/forms/${form.id}/questions/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionIds: reordered.map((q) => q.id) }),
    });
  }

  async function handleAddQuestion(type: QuestionType) {
    setShowAddDialog(false);

    const properties = getDefaultProperties(type);
    const res = await fetch(`/api/forms/${form.id}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, properties }),
    });

    if (res.ok) {
      const { question } = await res.json();
      const parsed: QuestionWithParsedProperties = {
        ...question,
        properties: typeof question.properties === "string"
          ? JSON.parse(question.properties)
          : question.properties,
      };

      // Re-fetch all questions to get correct order
      const qRes = await fetch(`/api/forms/${form.id}/questions`);
      if (qRes.ok) {
        const { questions: allQuestions } = await qRes.json();
        setQuestions(
          allQuestions.map((q: { id: string; formId: string; type: string; title: string; description: string | null; required: boolean; properties: string; order: number }) => ({
            ...q,
            properties: typeof q.properties === "string" ? JSON.parse(q.properties) : q.properties,
          }))
        );
      }

      setSelectedQuestionId(parsed.id);
      toast.success("Question added");
    }
  }

  async function handleDeleteQuestion(questionId: string) {
    const res = await fetch(
      `/api/forms/${form.id}/questions/${questionId}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setQuestions((prev) => {
        const filtered = prev.filter((q) => q.id !== questionId);
        if (selectedQuestionId === questionId) {
          setSelectedQuestionId(filtered.length > 0 ? filtered[0].id : null);
        }
        return filtered;
      });
      toast.success("Question deleted");
    }
  }

  async function handleFormUpdate(updates: Partial<FormWithQuestions>) {
    setForm((prev) => ({ ...prev, ...updates }));

    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.theme !== undefined) payload.theme = JSON.stringify(updates.theme);
    if (updates.settings !== undefined) payload.settings = JSON.stringify(updates.settings);

    await fetch(`/api/forms/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  if (!isMounted) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleFormUpdate({ title: e.target.value })}
            className="border-none bg-transparent text-lg font-semibold outline-none focus:ring-0"
            placeholder="Untitled Form"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant={form.status === "published" ? "outline" : "default"}
            size="sm"
            onClick={() =>
              handleFormUpdate({
                status: form.status === "published" ? "draft" : "published",
              })
            }
          >
            {form.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {showSettings ? (
        <FormSettingsPanel
          form={form}
          onUpdate={handleFormUpdate}
          onClose={() => setShowSettings(false)}
        />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Question list */}
          <div className="w-72 flex-shrink-0 overflow-y-auto border-r bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Questions
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <QuestionList
                  questions={questions}
                  selectedId={selectedQuestionId}
                  onSelect={setSelectedQuestionId}
                  onDelete={handleDeleteQuestion}
                />
              </SortableContext>
            </DndContext>
          </div>

          {/* Center: Question editor */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
            {selectedQuestion ? (
              <QuestionEditor
                question={selectedQuestion}
                onUpdate={(updates) =>
                  updateQuestion(selectedQuestion.id, updates)
                }
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a question to edit
              </div>
            )}
          </div>

          {/* Right: Properties */}
          <div className="w-80 flex-shrink-0 overflow-y-auto border-l bg-white p-4">
            {selectedQuestion ? (
              <QuestionProperties
                question={selectedQuestion}
                onUpdate={(updates) =>
                  updateQuestion(selectedQuestion.id, updates)
                }
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Select a question to see properties
              </div>
            )}
          </div>
        </div>
      )}

      <AddQuestionDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddQuestion}
      />
    </div>
  );
}
