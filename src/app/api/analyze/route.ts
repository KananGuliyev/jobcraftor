import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { analyzeJobCraftor } from "@/lib/jobcraftor-analysis";
import {
  analyzeJobCraftorInputSchema,
  jobCraftorAnalysisResponseSchema,
} from "@/types/jobcraftor";

export const runtime = "nodejs";
export const maxDuration = 60;

function getValidationMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Please review the input fields and try again.";
}

function createErrorResponse(status: number, error: string, code: string) {
  return NextResponse.json({ success: false, error, code }, { status });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

    if (!contentType.includes("application/json")) {
      console.warn("[JobCraftor][analyze] invalid content type:", contentType || "<missing>");
      return createErrorResponse(
        400,
        "JobCraftor expected a JSON analysis request. Please refresh and try generating the plan again.",
        "ANALYZE_INVALID_REQUEST",
      );
    }

    const payload = await request.json();
    const parsedInput = analyzeJobCraftorInputSchema.safeParse(payload);

    if (!parsedInput.success) {
      console.warn("[JobCraftor][analyze] validation failed:", getValidationMessage(parsedInput.error));
      return createErrorResponse(400, getValidationMessage(parsedInput.error), "ANALYZE_VALIDATION_ERROR");
    }

    const responseBody = jobCraftorAnalysisResponseSchema.parse(await analyzeJobCraftor(parsedInput.data));

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("[JobCraftor][analyze] request failed:", error);
    return createErrorResponse(
      500,
      "JobCraftor could not process that request. Please try again or refresh the sample/demo input.",
      "ANALYZE_UNEXPECTED_ERROR",
    );
  }
}
