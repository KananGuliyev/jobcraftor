import { describe, expect, it } from "vitest";
import { JobCraftorApiError, readJsonApiResponse } from "@/lib/api-client";
import { parseResumeSuccessSchema } from "@/types/jobcraftor";

describe("readJsonApiResponse", () => {
  it("parses a valid JSON response", async () => {
    const response = new Response(
      JSON.stringify({
        text: "Aria Kim\nBuilt a dashboard",
        meta: {
          fileName: "resume.txt",
          format: "txt",
          sourceLabel: "Parsed text resume",
          helperText: "Ready to review.",
        },
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );

    await expect(
      readJsonApiResponse(
        response,
        parseResumeSuccessSchema,
        "We couldn't process that file or request. Please try again or paste your resume text directly.",
      ),
    ).resolves.toMatchObject({
      text: "Aria Kim\nBuilt a dashboard",
    });
  });

  it("returns a friendly error when the response is HTML", async () => {
    const response = new Response("<!DOCTYPE html><html><body>Server error</body></html>", {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });

    await expect(
      readJsonApiResponse(
        response,
        parseResumeSuccessSchema,
        "We couldn't process that file or request. Please try again or paste your resume text directly.",
      ),
    ).rejects.toEqual(
      expect.objectContaining<JobCraftorApiError>({
        message: "We couldn't process that file or request. Please try again or paste your resume text directly.",
      }),
    );
  });

  it("returns the server error message from a JSON error payload", async () => {
    const response = new Response(
      JSON.stringify({
        success: false,
        error: "Upload a resume file so JobCraftor can extract the text.",
      }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );

    await expect(
      readJsonApiResponse(
        response,
        parseResumeSuccessSchema,
        "We couldn't process that file or request. Please try again or paste your resume text directly.",
      ),
    ).rejects.toEqual(
      expect.objectContaining<JobCraftorApiError>({
        message: "Upload a resume file so JobCraftor can extract the text.",
      }),
    );
  });
});
