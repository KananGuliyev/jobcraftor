import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorAnalysisResponse,
} from "@/types/jobcraftor";
import {
  generateAiJobCraftorAnalysis,
  MissingOpenAiApiKeyError,
} from "@/lib/services/jobcraftor-ai-engine";
import { generateMockJobCraftorAnalysis } from "@/lib/services/jobcraftor-mock-engine";

const fallbackNotice =
  "Live AI analysis was unavailable for this run, so JobCraftor used its validated fallback engine to keep your plan ready.";
const missingApiKeyFallbackNotice =
  "Live AI is not configured yet. Add OPENAI_API_KEY to .env.local, restart the dev server, and JobCraftor will use live AI instead of the fallback engine.";

function buildFallbackResponse(input: AnalyzeJobCraftorInput, notice = fallbackNotice): JobCraftorAnalysisResponse {
  return {
    result: generateMockJobCraftorAnalysis(input),
    meta: {
      source: "mock_fallback",
      notice,
    },
  };
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown AI analysis error.";
}

function serializeAnalysisError(error: unknown) {
  if (error instanceof Error) {
    const withDetails = error as Error & {
      status?: number;
      code?: string;
      type?: string;
      cause?: unknown;
    };

    return {
      name: withDetails.name,
      message: withDetails.message,
      status: withDetails.status ?? null,
      code: withDetails.code ?? null,
      type: withDetails.type ?? null,
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

function logFallback(error: unknown, meta: JobCraftorAnalysisMeta) {
  console.warn("[jobcraftor] falling back to mock analysis", {
    reason: summarizeError(error),
    error: serializeAnalysisError(error),
    source: meta.source,
    model: meta.model,
  });
}

export async function analyzeJobCraftor(input: AnalyzeJobCraftorInput): Promise<JobCraftorAnalysisResponse> {
  try {
    const aiResponse = await generateAiJobCraftorAnalysis(input);

    return {
      result: aiResponse.result,
      meta: {
        source: "ai",
        model: aiResponse.model,
      },
    };
  } catch (error) {
    const fallbackResponse = buildFallbackResponse(
      input,
      error instanceof MissingOpenAiApiKeyError ? missingApiKeyFallbackNotice : fallbackNotice,
    );

    logFallback(error, fallbackResponse.meta);

    return fallbackResponse;
  }
}
