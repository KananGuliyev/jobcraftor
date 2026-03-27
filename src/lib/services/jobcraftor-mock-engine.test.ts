import { describe, expect, it } from "vitest";
import { demoInput } from "@/data/demo-content";
import { generateMockJobCraftorAnalysis } from "@/lib/services/jobcraftor-mock-engine";
import { jobCraftorResultSchema } from "@/types/jobcraftor";

describe("generateMockJobCraftorAnalysis", () => {
  it("returns a schema-valid result for the demo scenario", () => {
    const result = generateMockJobCraftorAnalysis(demoInput);

    expect(() => jobCraftorResultSchema.parse(result)).not.toThrow();
    expect(result.blockers).toHaveLength(3);
    expect(result.sevenDayPlan).toHaveLength(7);
    expect(result.interviewPrep.length).toBeGreaterThan(0);
  });

  it("is deterministic for the same input", () => {
    const first = generateMockJobCraftorAnalysis(demoInput);
    const second = generateMockJobCraftorAnalysis(demoInput);

    expect(first).toEqual(second);
  });

  it("uses role, company, and deadline context in the output", () => {
    const result = generateMockJobCraftorAnalysis({
      jobPostingText: "Platform Engineer Intern\n- Build internal tooling\n- Improve CI reliability",
      jobPostingUrl: "https://careers.acme.dev/platform-engineering-intern",
      resumeText: "- Built a React dashboard\n- Worked with APIs",
      targetRole: "Platform Engineering Intern",
      deadline: "2026-05-01",
    });

    expect(result.roleTitle).toBe("Platform Engineering Intern");
    expect(result.companyHint).toBe("Careers");
    expect(result.summary).toContain("Platform Engineering Intern");
    expect(result.summary).toContain("May 1, 2026");
  });
});
