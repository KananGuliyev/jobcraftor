import { NextResponse } from "next/server";
import { parseResumeSuccessSchema } from "@/types/jobcraftor";
import { parseResumeFile, ResumeParseError } from "@/lib/services/resume-parser";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploaded = formData.get("file");

    if (!(uploaded instanceof File)) {
      console.warn("[JobCraftor][parse-resume] missing file upload");
      return NextResponse.json({ error: "Upload a resume file so JobCraftor can extract the text." }, { status: 400 });
    }

    const responseBody = parseResumeSuccessSchema.parse(await parseResumeFile(uploaded));
    return NextResponse.json(responseBody);
  } catch (error) {
    if (error instanceof ResumeParseError) {
      console.warn("[JobCraftor][parse-resume] parse failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("[JobCraftor][parse-resume] unexpected failure:", error);
    return NextResponse.json(
      { error: "JobCraftor could not parse that resume file. Please try another file or paste the resume text directly." },
      { status: 500 },
    );
  }
}
