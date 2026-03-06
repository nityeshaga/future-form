import { describe, it, expect } from "vitest";
import {
  createFormSchema,
  registerSchema,
  createQuestionSchema,
  submitResponseSchema,
} from "./validations";

describe("createFormSchema", () => {
  it("accepts a valid form", () => {
    const result = createFormSchema.safeParse({ title: "My Form" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = createFormSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("createQuestionSchema", () => {
  it("accepts a valid question", () => {
    const result = createQuestionSchema.safeParse({
      type: "short_text",
      title: "What is your name?",
    });
    expect(result.success).toBe(true);
  });
});

describe("submitResponseSchema", () => {
  it("accepts valid answers array", () => {
    const result = submitResponseSchema.safeParse({
      answers: [{ questionId: "q1", value: "hello" }],
    });
    expect(result.success).toBe(true);
  });
});
