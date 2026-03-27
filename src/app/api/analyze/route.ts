import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { analyzeJobCraftor } from "@/lib/jobcraftor-analysis";
import {
  analyzeJobCraftorInputSchema,
  jobCraftorAnalysisResponseSchema,
} from "@/types/jobcraftor";

function getValidationMessage(error: ZodError) {
  return error.issues[0]?.message ?? "Please review the input fields and try again.";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsedInput = analyzeJobCraftorInputSchema.safeParse(payload);

    if (!parsedInput.success) {
      console.warn("[JobCraftor][analyze] validation failed:", getValidationMessage(parsedInput.error));
      return NextResponse.json({ error: getValidationMessage(parsedInput.error) }, { status: 400 });
    }

    const responseBody = jobCraftorAnalysisResponseSchema.parse(await analyzeJobCraftor(parsedInput.data));

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error("[JobCraftor][analyze] request failed:", error);
    return NextResponse.json(
      { error: "JobCraftor could not process the request. Please try again with the sample demo or refreshed input." },
      { status: 500 },
    );
  }
}
