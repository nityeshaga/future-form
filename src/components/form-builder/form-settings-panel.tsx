"use client";

import type { FormWithQuestions } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormSettingsPanelProps {
  form: FormWithQuestions;
  onUpdate: (updates: Partial<FormWithQuestions>) => void;
  onClose: () => void;
}

export function FormSettingsPanel({
  form,
  onUpdate,
  onClose,
}: FormSettingsPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white p-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Form Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Form Title</Label>
            <Input
              value={form.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description || ""}
              onChange={(e) =>
                onUpdate({ description: e.target.value || null })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.theme.primaryColor}
                onChange={(e) =>
                  onUpdate({
                    theme: { ...form.theme, primaryColor: e.target.value },
                  })
                }
                className="h-10 w-10 cursor-pointer rounded border"
              />
              <Input
                value={form.theme.primaryColor}
                onChange={(e) =>
                  onUpdate({
                    theme: { ...form.theme, primaryColor: e.target.value },
                  })
                }
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={form.theme.backgroundColor}
                onChange={(e) =>
                  onUpdate({
                    theme: {
                      ...form.theme,
                      backgroundColor: e.target.value,
                    },
                  })
                }
                className="h-10 w-10 cursor-pointer rounded border"
              />
              <Input
                value={form.theme.backgroundColor}
                onChange={(e) =>
                  onUpdate({
                    theme: {
                      ...form.theme,
                      backgroundColor: e.target.value,
                    },
                  })
                }
                className="flex-1"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-gray-50 p-4 text-sm text-muted-foreground">
            <p>
              <strong>Status:</strong>{" "}
              {form.status === "published" ? "Published" : "Draft"}
            </p>
            <p className="mt-1">
              {form.status === "published"
                ? "Your form is live and accepting responses."
                : "Your form is in draft mode. Publish it to start collecting responses."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
