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
      return NextResponse.json({ error: getValidationMessage(parsedInput.error) }, { status: 400 });
    }

    const result = analyzeJobCraftor(parsedInput.data);
    const responseBody = jobCraftorAnalysisResponseSchema.parse({ result });

    return NextResponse.json(responseBody);
  } catch {
    return NextResponse.json(
      { error: "JobCraftor could not process the request. Please try again with the sample demo or refreshed input." },
      { status: 500 },
    );
  }
}
