import { afterEach, describe, expect, it, vi } from "vitest";
import { parseResumeFile, ResumeParseError } from "@/lib/services/resume-parser";

describe("parseResumeFile", () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock("pdf-parse");
  });

  it("parses and normalizes a text resume upload", async () => {
    const file = new File(["  Aria Kim\r\n\r\nBuilt a dashboard in React.  "], "resume.txt", {
      type: "text/plain",
    });

    await expect(parseResumeFile(file)).resolves.toEqual({
      text: "Aria Kim\n\nBuilt a dashboard in React.",
      meta: expect.objectContaining({
        fileName: "resume.txt",
        format: "txt",
      }),
    });
  });

  it("parses a PDF upload through the PDF parser module", async () => {
    const destroy = vi.fn().mockResolvedValue(undefined);
    const getText = vi.fn().mockResolvedValue({ text: "Aria Kim\nBuilt a React dashboard" });

    vi.doMock("pdf-parse", () => ({
      PDFParse: class MockPdfParse {
        getText = getText;
        destroy = destroy;
      },
    }));

    const { parseResumeFile: parseResumePdf } = await import("@/lib/services/resume-parser");
    const file = new File(["%PDF-1.4 mock"], "resume.pdf", {
      type: "application/pdf",
    });

    await expect(parseResumePdf(file)).resolves.toEqual({
      text: "Aria Kim\nBuilt a React dashboard",
      meta: expect.objectContaining({
        fileName: "resume.pdf",
        format: "pdf",
      }),
    });

    expect(getText).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported file types with a structured parse error", async () => {
    const file = new File(["binary"], "resume.png", { type: "image/png" });

    await expect(parseResumeFile(file)).rejects.toEqual(
      expect.objectContaining<ResumeParseError>({
        code: "UPLOAD_UNSUPPORTED_FILE_TYPE",
        status: 415,
      }),
    );
  });

  it("rejects empty uploads before attempting to parse", async () => {
    const file = new File([], "resume.txt", { type: "text/plain" });

    await expect(parseResumeFile(file)).rejects.toEqual(
      expect.objectContaining<ResumeParseError>({
        code: "UPLOAD_EMPTY_FILE",
        status: 400,
      }),
    );
  });
});
