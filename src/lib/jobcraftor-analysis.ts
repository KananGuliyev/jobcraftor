import type { AnalyzeJobCraftorInput, JobCraftorResult } from "@/types/jobcraftor";
import { generateMockJobCraftorAnalysis } from "@/lib/services/jobcraftor-mock-engine";

// This wrapper preserves the app-facing analysis entrypoint while the underlying
// implementation remains a deterministic mock service until real AI is wired in.
export function analyzeJobCraftor(input: AnalyzeJobCraftorInput): JobCraftorResult {
  return generateMockJobCraftorAnalysis(input);
}
