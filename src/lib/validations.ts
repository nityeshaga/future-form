import { z } from "zod";

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(256),
  description: z.string().max(1024).optional(),
});

export const updateFormSchema = z.object({
  title: z.string().min(1).max(256).optional(),
  description: z.string().max(1024).optional().nullable(),
  status: z.enum(["draft", "published", "closed"]).optional(),
  theme: z.string().optional(),
  settings: z.string().optional(),
});

export const createQuestionSchema = z.object({
  type: z.enum([
    "welcome_screen",
    "short_text",
    "long_text",
    "email",
    "multiple_choice",
    "yes_no",
    "rating",
    "thank_you_screen",
  ]),
  title: z.string().max(1024).optional(),
  description: z.string().max(2048).optional().nullable(),
  required: z.boolean().optional(),
  properties: z.record(z.string(), z.any()).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateQuestionSchema = createQuestionSchema.partial();

export const reorderQuestionsSchema = z.object({
  questionIds: z.array(z.string()),
});

export const submitResponseSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      value: z.string(),
    })
  ),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
