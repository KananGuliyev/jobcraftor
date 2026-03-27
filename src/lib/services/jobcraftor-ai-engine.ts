import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { AnalyzeJobCraftorInput, JobCraftorResult } from "@/types/jobcraftor";
import { buildJobCraftorPromptMessages } from "@/lib/prompts/jobcraftor-analysis-prompt";
import { jobCraftorResultSchema } from "@/types/jobcraftor";

const DEFAULT_MODEL = "gpt-4o-mini";

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

export async function generateAiJobCraftorAnalysis(
  input: AnalyzeJobCraftorInput,
): Promise<{ result: JobCraftorResult; model: string }> {
  const model = getModelName();
  const client = getOpenAIClient();

  const response = await client.responses.parse({
    model,
    input: buildJobCraftorPromptMessages(input),
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
