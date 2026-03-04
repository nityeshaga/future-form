import {
  DEFAULT_THEME,
  DEFAULT_SETTINGS,
  type FormWithQuestions,
  type QuestionWithParsedProperties,
  type FormTheme,
  type FormSettings,
} from "@/types/form";

export function parseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function parseFormData(form: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: string;
  theme: string;
  settings: string;
  createdAt: Date;
  updatedAt: Date;
  questions: {
    id: string;
    formId: string;
    type: string;
    title: string;
    description: string | null;
    required: boolean;
    properties: string;
    order: number;
  }[];
}): FormWithQuestions {
  return {
    id: form.id,
    userId: form.userId,
    title: form.title,
    description: form.description,
    status: form.status as "draft" | "published" | "closed",
    theme: { ...DEFAULT_THEME, ...parseJSON<Partial<FormTheme>>(form.theme, {}) },
    settings: { ...DEFAULT_SETTINGS, ...parseJSON<Partial<FormSettings>>(form.settings, {}) },
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
    questions: form.questions.map(
      (q): QuestionWithParsedProperties => ({
        id: q.id,
        formId: q.formId,
        type: q.type as QuestionWithParsedProperties["type"],
        title: q.title,
        description: q.description,
        required: q.required,
        properties: parseJSON(q.properties, {}),
        order: q.order,
      })
    ),
  };
}
