import type { JobCraftorAnalysisMeta, JobCraftorResult } from "@/types/jobcraftor";
import { ResultsEmptyState } from "./results-empty-state";
import { ResultsLoadingState } from "./results-loading-state";
import { ResultsPanel } from "./results-panel";

interface DemoHighlights {
  badge: string;
  subtitle: string;
}

interface ResultsExperienceProps {
  isLoading: boolean;
  result: JobCraftorResult | null;
  meta: JobCraftorAnalysisMeta | null;
  error: string | null;
  demoHighlights: DemoHighlights | null;
  onBackToWorkflow: () => void;
  onReset: () => void;
}

export function ResultsExperience({
  isLoading,
  result,
  meta,
  error,
  demoHighlights,
  onBackToWorkflow,
  onReset,
}: ResultsExperienceProps) {
  return (
    <section className="grid gap-6" id="results-experience">
      <div className="premium-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow-label">Results experience</p>
            {demoHighlights ? (
              <span className="status-badge-success">
                {demoHighlights.badge}
              </span>
            ) : null}
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-sand sm:text-4xl">
            Your JobCraftor dashboard
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-mist/68">
            {demoHighlights
              ? `This instant sample walkthrough shows how JobCraftor turns a realistic ${demoHighlights.subtitle} into a focused action plan.`
              : "This is the focused, full-width readout designed for the demo moment: scan the role, understand the fit, and walk away with a concrete plan."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onBackToWorkflow} className="button-secondary">
            Back to inputs
          </button>
          <button type="button" onClick={onReset} className="button-secondary">
            Start over
          </button>
        </div>
      </div>

      <div className="premium-card p-5 sm:p-6">
        {error ? (
          <div className="mb-5 rounded-[20px] border border-ember/30 bg-ember/10 px-4 py-3 text-sm leading-7 text-orange-100">
            {error}
          </div>
        ) : null}
        {!error && !isLoading && meta?.source === "mock_fallback" && meta.notice ? (
          <div className="mb-5 rounded-[20px] border border-sunrise/30 bg-sunrise/10 px-4 py-3 text-sm leading-7 text-sand">
            {meta.notice}
          </div>
        ) : null}
        {!error && !isLoading && meta?.source === "demo" && meta.notice ? (
          <div className="mb-5 rounded-[20px] border border-mint/25 bg-mint/10 px-4 py-3 text-sm leading-7 text-sand">
            {meta.notice}
          </div>
        ) : null}
        {isLoading ? <ResultsLoadingState /> : null}
        {!isLoading && result ? <ResultsPanel result={result} /> : null}
        {!isLoading && !result ? <ResultsEmptyState /> : null}
      </div>
    </section>
  );
}
