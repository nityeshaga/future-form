import { describe, it, expect } from "vitest";
import { getDefaultProperties } from "./form";

describe("getDefaultProperties", () => {
  it("returns start button for welcome_screen", () => {
    const props = getDefaultProperties("welcome_screen");
    expect(props).toEqual({ buttonText: "Start", showButton: true });
  });

  it("returns 3 choices for multiple_choice", () => {
    const props = getDefaultProperties("multiple_choice") as {
      choices: { id: string; label: string }[];
      allowOther: boolean;
    };
    expect(props.choices).toHaveLength(3);
    expect(props.allowOther).toBe(false);
  });

  it("returns 5-star rating defaults", () => {
    const props = getDefaultProperties("rating") as {
      steps: number;
      shape: string;
    };
    expect(props.steps).toBe(5);
    expect(props.shape).toBe("star");
  });
});
