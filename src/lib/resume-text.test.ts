import { describe, expect, it } from "vitest";
import { normalizeResumeText } from "@/lib/resume-text";

describe("normalizeResumeText", () => {
  it("normalizes whitespace while preserving readable line breaks", () => {
    const normalized = normalizeResumeText(
      "  Aria\u00a0Kim\r\n\tFrontend Intern\r\n\r\n\r\nBuilt   React components \r\nImproved latency\t\tby 20%  ",
    );

    expect(normalized).toBe("Aria Kim\nFrontend Intern\n\nBuilt React components\nImproved latency by 20%");
  });

  it("trims surrounding noise from already structured text", () => {
    const normalized = normalizeResumeText("\n\n  Skills  \nTypeScript   React   APIs \n\n");

    expect(normalized).toBe("Skills\nTypeScript React APIs");
  });
});
