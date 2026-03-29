import { NextResponse } from "next/server";
import { parseResumeSuccessSchema } from "@/types/jobcraftor";
import { parseResumeFile, ResumeParseError } from "@/lib/services/resume-parser";

export const runtime = "nodejs";
export const maxDuration = 60;

function createErrorResponse(status: number, error: string, code: string) {
  return NextResponse.json({ success: false, error, code }, { status });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

    if (!contentType.includes("multipart/form-data")) {
      console.warn("[JobCraftor][parse-resume] invalid content type:", contentType || "<missing>");
      return createErrorResponse(
        400,
        "We couldn't read that upload request cleanly. Please try uploading the file again, or paste your resume text directly.",
        "UPLOAD_INVALID_REQUEST",
      );
    }

    const formData = await request.formData();
    const uploaded = formData.get("file");

    if (!(uploaded instanceof File)) {
      console.warn("[JobCraftor][parse-resume] missing file upload");
      return createErrorResponse(
        400,
        "Choose a resume file so JobCraftor can turn it into editable text.",
        "UPLOAD_MISSING_FILE",
      );
    }

    console.info("[JobCraftor][parse-resume] parsing upload", {
      fileName: uploaded.name,
      fileType: uploaded.type || "<missing>",
      fileSize: uploaded.size,
    });

    const responseBody = parseResumeSuccessSchema.parse(await parseResumeFile(uploaded));
    return NextResponse.json(responseBody);
  } catch (error) {
    if (error instanceof ResumeParseError) {
      console.warn("[JobCraftor][parse-resume] parse failed:", {
        code: error.code,
        status: error.status,
        message: error.message,
      });
      return createErrorResponse(error.status, error.message, error.code);
    }

    console.error("[JobCraftor][parse-resume] unexpected failure:", error);
    return createErrorResponse(
      500,
      "We couldn't prepare that file for review. Please try another upload or paste your resume text directly.",
      "UPLOAD_UNEXPECTED_ERROR",
    );
  }
}
