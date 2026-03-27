import { NextResponse } from "next/server";
import { analyzeJobCraftor } from "@/lib/jobcraftor-analysis";
import type { AnalyzeJobCraftorInput } from "@/types/jobcraftor";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<AnalyzeJobCraftorInput>;
    const input: AnalyzeJobCraftorInput = {
      jobPostingText: payload.jobPostingText?.trim() ?? "",
      jobPostingUrl: payload.jobPostingUrl?.trim() ?? "",
      resumeText: payload.resumeText?.trim() ?? "",
      resumeFileName: payload.resumeFileName?.trim() ?? null,
    };

    if (!input.jobPostingText && !input.jobPostingUrl) {
      return NextResponse.json(
        { error: "Add a job posting or URL so JobCraftor has a target role to analyze." },
        { status: 400 },
      );
    }

    if (!input.resumeText) {
      return NextResponse.json(
        { error: "Paste your resume or upload a plain-text file so JobCraftor has evidence to compare." },
        { status: 400 },
      );
    }

    const result = analyzeJobCraftor(input);

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json(
      { error: "JobCraftor could not process the request. Please try again with the sample demo or refreshed input." },
      { status: 500 },
    );
  }
}
