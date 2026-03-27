import { describe, expect, it } from "vitest";
import { demoMeta, demoResult } from "@/data/demo-content";
import {
  analyzeJobCraftorInputSchema,
  jobCraftorAnalysisResponseSchema,
} from "@/types/jobcraftor";

describe("analyzeJobCraftorInputSchema", () => {
  it("accepts a valid payload and normalizes optional fields", () => {
    const parsed = analyzeJobCraftorInputSchema.parse({
      jobPostingText: "  Software Engineering Intern  ",
      jobPostingUrl: "  ",
      resumeText: "  Built a React dashboard.  ",
      resumeFileName: "  resume.txt  ",
      targetRole: "  Frontend Intern  ",
      deadline: "2026-04-10",
    });

    expect(parsed).toEqual({
      jobPostingText: "Software Engineering Intern",
      jobPostingUrl: undefined,
      resumeText: "Built a React dashboard.",
      resumeFileName: "resume.txt",
      targetRole: "Frontend Intern",
      deadline: "2026-04-10",
    });
  });

  it("rejects payloads without a job description or job URL", () => {
    const parsed = analyzeJobCraftorInputSchema.safeParse({
      jobPostingText: "   ",
      jobPostingUrl: "",
      resumeText: "Strong project work",
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.path).toEqual(["jobPostingText"]);
  });

  it("rejects invalid job URLs", () => {
    const parsed = analyzeJobCraftorInputSchema.safeParse({
      jobPostingText: "",
      jobPostingUrl: "not-a-url",
      resumeText: "Strong project work",
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.path).toEqual(["jobPostingUrl"]);
  });

  it("rejects empty resume text", () => {
    const parsed = analyzeJobCraftorInputSchema.safeParse({
      jobPostingText: "Software Engineering Intern",
      resumeText: "   ",
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues[0]?.path).toEqual(["resumeText"]);
  });
});

describe("jobCraftorAnalysisResponseSchema", () => {
  it("parses a valid analysis response", () => {
    const parsed = jobCraftorAnalysisResponseSchema.parse({
      result: demoResult,
      meta: demoMeta,
    });

    expect(parsed.result.roleTitle).toBe("Software Engineering Intern");
    expect(parsed.meta.source).toBe("demo");
  });

  it("rejects malformed response shapes", () => {
    const parsed = jobCraftorAnalysisResponseSchema.safeParse({
      result: {
        ...demoResult,
        blockers: demoResult.blockers.slice(0, 2),
      },
      meta: demoMeta,
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.some((issue) => issue.path.join(".") === "result.blockers")).toBe(true);
  });
});
