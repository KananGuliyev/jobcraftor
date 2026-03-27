import { describe, expect, it } from "vitest";
import {
  buildAnalyzePayload,
  defaultWorkspaceUploadState,
  emptyWorkspaceFormValues,
  getWorkspaceFieldErrors,
  isSupportedResumeUpload,
} from "@/lib/jobcraftor-workspace";

describe("getWorkspaceFieldErrors", () => {
  it("requires both role input and resume evidence", () => {
    const errors = getWorkspaceFieldErrors(emptyWorkspaceFormValues, defaultWorkspaceUploadState);

    expect(errors.jobPostingText).toContain("Paste the job description");
    expect(errors.resumeText).toContain("Paste your resume text");
  });

  it("flags invalid job URLs inline", () => {
    const errors = getWorkspaceFieldErrors(
      {
        ...emptyWorkspaceFormValues,
        jobPostingUrl: "invalid-url",
        resumeText: "Built a dashboard in React",
      },
      defaultWorkspaceUploadState,
    );

    expect(errors.jobPostingUrl).toContain("https://");
    expect(errors.jobPostingText).toBeUndefined();
    expect(errors.resumeText).toBeUndefined();
  });

  it("returns no errors when the form is ready to submit", () => {
    const errors = getWorkspaceFieldErrors(
      {
        ...emptyWorkspaceFormValues,
        jobPostingText: "Software Engineering Intern",
        resumeText: "Built a dashboard in React",
        targetRole: "Software Engineering Intern",
      },
      defaultWorkspaceUploadState,
    );

    expect(errors).toEqual({});
  });
});

describe("buildAnalyzePayload", () => {
  it("trims strings and normalizes resume text", () => {
    const payload = buildAnalyzePayload(
      {
        jobPostingText: "  Software Engineering Intern  ",
        jobPostingUrl: "  https://example.com/role  ",
        resumeText: "  Built\t a React dashboard.\r\n\r\n\r\nImproved latency.  ",
        targetRole: "  Frontend Intern ",
        deadline: " 2026-04-10 ",
      },
      {
        ...defaultWorkspaceUploadState,
        fileName: "resume.pdf",
      },
    );

    expect(payload).toEqual({
      jobPostingText: "Software Engineering Intern",
      jobPostingUrl: "https://example.com/role",
      resumeText: "Built a React dashboard.\n\nImproved latency.",
      resumeFileName: "resume.pdf",
      targetRole: "Frontend Intern",
      deadline: "2026-04-10",
    });
  });
});

describe("isSupportedResumeUpload", () => {
  it("accepts supported resume extensions", () => {
    expect(isSupportedResumeUpload("resume.txt")).toBe(true);
    expect(isSupportedResumeUpload("resume.md")).toBe(true);
    expect(isSupportedResumeUpload("resume.rtf")).toBe(true);
    expect(isSupportedResumeUpload("resume.pdf")).toBe(true);
    expect(isSupportedResumeUpload("resume.docx")).toBe(true);
    expect(isSupportedResumeUpload("resume.doc")).toBe(true);
  });

  it("rejects unsupported extensions", () => {
    expect(isSupportedResumeUpload("resume.png")).toBe(false);
    expect(isSupportedResumeUpload("resume")).toBe(false);
  });
});
