import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoMeta, demoResult } from "@/data/demo-content";

const analyzeJobCraftor = vi.fn();

vi.mock("@/lib/jobcraftor-analysis", () => ({
  analyzeJobCraftor,
}));

function buildAnalyzeRequest(body: Record<string, unknown>, contentType = "application/json") {
  return new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "content-type": contentType },
    body: JSON.stringify(body),
  });
}

describe("POST /api/analyze", () => {
  beforeEach(() => {
    analyzeJobCraftor.mockReset();
  });

  it("returns JSON for a valid analyze request without a file upload", async () => {
    analyzeJobCraftor.mockResolvedValue({
      result: demoResult,
      meta: demoMeta,
    });

    const { POST } = await import("@/app/api/analyze/route");
    const request = buildAnalyzeRequest({
      jobPostingText: "Software Engineering Intern",
      resumeText: "Built a React dashboard and shipped an API integration.",
      resumeFileName: null,
      jobPostingUrl: "",
      targetRole: "",
      deadline: "",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toEqual({
      result: demoResult,
      meta: demoMeta,
    });
  });

  it("returns JSON validation errors for malformed requests", async () => {
    const { POST } = await import("@/app/api/analyze/route");
    const request = buildAnalyzeRequest({
      jobPostingText: "",
      jobPostingUrl: "",
      resumeText: "",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toMatchObject({
      success: false,
      code: "ANALYZE_VALIDATION_ERROR",
    });
  });
});
