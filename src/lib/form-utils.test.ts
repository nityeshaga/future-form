import { describe, it, expect } from "vitest";
import { parseJSON, parseFormData } from "./form-utils";

describe("parseJSON", () => {
  it("parses valid JSON", () => {
    expect(parseJSON('{"a":1}', {})).toEqual({ a: 1 });
  });

  it("returns fallback for invalid JSON", () => {
    expect(parseJSON("not json", { fallback: true })).toEqual({
      fallback: true,
    });
  });

  it("returns fallback for empty string", () => {
    expect(parseJSON("", [])).toEqual([]);
  });
});

describe("parseFormData", () => {
  it("parses raw form data with default theme and settings", () => {
    const raw = {
      id: "form1",
      userId: "user1",
      title: "Test Form",
      description: null,
      status: "draft",
      theme: "{}",
      settings: "{}",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      questions: [
        {
          id: "q1",
          formId: "form1",
          type: "short_text",
          title: "Name?",
          description: null,
          required: true,
          properties: '{"placeholder":"Type here"}',
          order: 0,
        },
      ],
    };

    const result = parseFormData(raw);

    expect(result.theme.primaryColor).toBe("#2563eb");
    expect(result.settings.showProgressBar).toBe(true);
    expect(result.questions[0].properties).toEqual({
      placeholder: "Type here",
    });
    expect(result.status).toBe("draft");
  });
});
