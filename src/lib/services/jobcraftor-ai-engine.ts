import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { AnalyzeJobCraftorInput, JobCraftorResult } from "@/types/jobcraftor";
import { buildJobCraftorPromptMessages } from "@/lib/prompts/jobcraftor-analysis-prompt";
import { jobCraftorResultSchema } from "@/types/jobcraftor";

const DEFAULT_MODEL = "gpt-4o-mini";

let cachedClient: OpenAI | null = null;

export class MissingOpenAiApiKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY is not configured.");
    this.name = "MissingOpenAiApiKeyError";
  }
}

function previewText(value?: string, limit = 160) {
  if (!value) {
    return null;
  }

  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit)}...` : normalized;
}

function buildRequestLogPayload(input: AnalyzeJobCraftorInput) {
  return {
    jobPostingUrl: input.jobPostingUrl ?? null,
    targetRole: input.targetRole ?? null,
    deadline: input.deadline ?? null,
    jobPostingTextLength: input.jobPostingText?.length ?? 0,
    resumeTextLength: input.resumeText.length,
    jobPostingPreview: previewText(input.jobPostingText),
    resumePreview: previewText(input.resumeText),
  };
}

function serializeAiError(error: unknown) {
  if (error instanceof Error) {
    const withDetails = error as Error & {
      status?: number;
      code?: string;
      type?: string;
      param?: string;
      cause?: unknown;
    };

    return {
      name: withDetails.name,
      message: withDetails.message,
      status: withDetails.status ?? null,
      code: withDetails.code ?? null,
      type: withDetails.type ?? null,
      param: withDetails.param ?? null,
      cause:
        withDetails.cause instanceof Error
          ? {
              name: withDetails.cause.name,
              message: withDetails.cause.message,
            }
          : withDetails.cause ?? null,
    };
  }

  return {
    value: error,
  };
}

function getModelName() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    console.error(
      "[JobCraftor][ai] OPENAI_API_KEY is missing. Create .env.local in the project root, set OPENAI_API_KEY, and restart the Next.js server.",
    );
    throw new MissingOpenAiApiKeyError();
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
  const requestPayload = buildRequestLogPayload(input);

  console.info("[JobCraftor][ai] starting OpenAI analysis", {
    model,
    payload: requestPayload,
  });

  try {
    const client = getOpenAIClient();

    const response = await client.responses.parse({
      model,
      input: buildJobCraftorPromptMessages(input),
      text: {
        format: zodTextFormat(jobCraftorResultSchema, "jobcraftor_result"),
      },
    });

    console.info("[JobCraftor][ai] OpenAI response received", {
      model,
      responseId: response.id ?? null,
      status: "status" in response ? response.status : null,
      hasParsedOutput: Boolean(response.output_parsed),
      outputItems: Array.isArray(response.output) ? response.output.length : 0,
    });

    if (!response.output_parsed) {
      throw new Error("OpenAI did not return structured analysis output.");
    }

    return {
      result: jobCraftorResultSchema.parse(response.output_parsed),
      model,
    };
  } catch (error) {
    console.error("[JobCraftor][ai] OpenAI analysis failed", {
      model,
      payload: requestPayload,
      apiKeyPresent: Boolean(process.env.OPENAI_API_KEY?.trim()),
      error: serializeAiError(error),
    });

    throw error;
  }
}
