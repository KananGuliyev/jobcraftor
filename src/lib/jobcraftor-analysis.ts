import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorAnalysisResponse,
} from "@/types/jobcraftor";
import { generateAiJobCraftorAnalysis } from "@/lib/services/jobcraftor-ai-engine";
import { generateMockJobCraftorAnalysis } from "@/lib/services/jobcraftor-mock-engine";

const fallbackNotice =
  "Live AI analysis was unavailable for this run, so JobCraftor used its validated fallback engine to keep your plan ready.";

function buildFallbackResponse(input: AnalyzeJobCraftorInput): JobCraftorAnalysisResponse {
  return {
    result: generateMockJobCraftorAnalysis(input),
    meta: {
      source: "mock_fallback",
      notice: fallbackNotice,
    },
  };
}

function summarizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown AI analysis error.";
}

function logFallback(reason: string, meta: JobCraftorAnalysisMeta) {
  console.warn("[jobcraftor] falling back to mock analysis", {
    reason,
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
    const fallbackResponse = buildFallbackResponse(input);

    logFallback(summarizeError(error), fallbackResponse.meta);

    return fallbackResponse;
  }
}
