import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { AnalyzeJobCraftorInput, JobCraftorResult } from "@/types/jobcraftor";
import { jobCraftorResultSchema } from "@/types/jobcraftor";

const DEFAULT_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `You are JobCraftor, a focused analysis engine for students and early-career job seekers.

Your job is to read one job posting and one resume, then produce a practical execution plan for that specific application.

Output style requirements:
- Be concise, specific, and action-oriented.
- Do not give generic career advice.
- Tailor every section to the supplied posting and resume.
- Prioritize recruiter-relevant proof, resume gaps, blockers, and concrete next actions.
- Make the response feel like a product feature, not a chatbot.
- Keep networking and interview prep realistic and usable right away.

Content requirements:
- Role Breakdown: summarize the real work, key skills, and what matters most.
- Fit Analysis: include a believable score, strengths, and genuine gaps.
- Top 3 Blockers: prioritize the biggest reasons this application could stall, and explain why each matters.
- 7-Day Action Plan: make each day concrete, concise, and sequential.
- Resume Improvements: rewrite bullets to sound stronger and recommend role-specific keywords.
- Networking Message: write a short outreach draft tailored to the role/company context.
- Interview Prep: produce likely questions and what the interviewer is actually testing.

Be grounded in the provided materials. If evidence is weak or missing, say so through blockers, gaps, and plan items rather than inventing achievements.`;

let cachedClient: OpenAI | null = null;

function getModelName() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey,
      timeout: 30_000,
    });
  }

  return cachedClient;
}

function buildUserPrompt(input: AnalyzeJobCraftorInput) {
  return [
    "Analyze this application package and return the structured JobCraftor result.",
    "",
    "Job posting text:",
    input.jobPostingText || "(not provided)",
    "",
    "Job posting URL:",
    input.jobPostingUrl || "(not provided)",
    "",
    "Resume text:",
    input.resumeText,
    "",
    "Target role:",
    input.targetRole || "(not provided)",
    "",
    "Deadline:",
    input.deadline || "(not provided)",
  ].join("\n");
}

export async function generateAiJobCraftorAnalysis(
  input: AnalyzeJobCraftorInput,
): Promise<{ result: JobCraftorResult; model: string }> {
  const model = getModelName();
  const client = getOpenAIClient();

  const response = await client.responses.parse({
    model,
    input: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
    text: {
      format: zodTextFormat(jobCraftorResultSchema, "jobcraftor_result"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI did not return structured analysis output.");
  }

  return {
    result: jobCraftorResultSchema.parse(response.output_parsed),
    model,
  };
}
