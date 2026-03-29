import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/parse-resume/route";

function buildUploadRequest(file?: File, contentType?: string) {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  return new Request("http://localhost/api/parse-resume", {
    method: "POST",
    headers: contentType ? { "content-type": contentType } : undefined,
    body: formData,
  });
}

describe("POST /api/parse-resume", () => {
  it("returns JSON for a valid text upload", async () => {
    const request = buildUploadRequest(new File(["Aria Kim\nBuilt a dashboard"], "resume.txt", { type: "text/plain" }));
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toMatchObject({
      text: "Aria Kim\nBuilt a dashboard",
      meta: expect.objectContaining({
        fileName: "resume.txt",
        format: "txt",
      }),
    });
  });

  it("returns a JSON error when the upload is missing", async () => {
    const request = buildUploadRequest();
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toEqual({
      success: false,
      error: "Upload a resume file so JobCraftor can extract the text.",
      code: "UPLOAD_MISSING_FILE",
    });
  });

  it("returns a JSON error for unsupported file types", async () => {
    const request = buildUploadRequest(new File(["binary"], "resume.png", { type: "image/png" }));
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(415);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toMatchObject({
      success: false,
      code: "UPLOAD_UNSUPPORTED_FILE_TYPE",
    });
  });

  it("returns a JSON error for invalid request content types", async () => {
    const request = buildUploadRequest(undefined, "application/json");
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(body).toEqual({
      success: false,
      error: "JobCraftor expected a resume upload in multipart form data. Please try uploading the file again.",
      code: "UPLOAD_INVALID_REQUEST",
    });
  });
});
