"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildApplicationPrepSummary,
  buildInterviewQuestionsCopy,
  buildNetworkingMessageCopy,
} from "@/lib/jobcraftor-export";
import type { JobCraftorAnalysisMeta, JobCraftorResult } from "@/types/jobcraftor";
import { ResultsEmptyState } from "./results-empty-state";
import { ResultsLoadingState } from "./results-loading-state";
import { ResultsPanel } from "./results-panel";

interface DemoHighlights {
  badge: string;
  subtitle: string;
}

interface FeedbackState {
  tone: "success" | "error";
  message: string;
}

function metaBadge(meta: JobCraftorAnalysisMeta | null) {
  if (!meta) {
    return null;
  }

  if (meta.source === "demo") {
    return { label: "Demo mode", className: "status-badge-success" };
  }

  if (meta.source === "mock_fallback") {
    return { label: "Validated fallback", className: "status-badge-warning" };
  }

  return { label: "Live AI analysis", className: "status-badge-info" };
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
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const feedbackTimer = useRef<number | null>(null);
  const sourceBadge = metaBadge(meta);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        window.clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  function showFeedback(tone: FeedbackState["tone"], message: string) {
    setFeedback({ tone, message });

    if (feedbackTimer.current) {
      window.clearTimeout(feedbackTimer.current);
    }

    feedbackTimer.current = window.setTimeout(() => {
      setFeedback(null);
    }, 2600);
  }

  async function copyText(label: string, value: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.setAttribute("readonly", "true");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      showFeedback("success", `${label} copied.`);
    } catch {
      showFeedback("error", `JobCraftor could not copy the ${label.toLowerCase()}.`);
    }
  }

  function handlePrint() {
    try {
      window.print();
      showFeedback("success", "Print dialog opened. You can save the dashboard as a PDF.");
    } catch {
      showFeedback("error", "JobCraftor could not open the print dialog.");
    }
  }

  function handleDownloadSummary() {
    if (!result) {
      return;
    }

    try {
      const text = buildApplicationPrepSummary(result);
      const fileName = `${result.roleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "jobcraftor"}-prep-summary.txt`;
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);

      showFeedback("success", "Application prep summary downloaded.");
    } catch {
      showFeedback("error", "JobCraftor could not export the prep summary.");
    }
  }

  return (
    <section className="grid gap-6" id="results-experience">
      <div className="premium-card overflow-hidden p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr] xl:items-end">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow-label">Personalized results</p>
              {demoHighlights ? <span className="status-badge-success">{demoHighlights.badge}</span> : null}
              {sourceBadge && meta?.source !== "demo" ? <span className={sourceBadge.className}>{sourceBadge.label}</span> : null}
            </div>

            <div className="space-y-3">
              <h1 className="max-w-[14ch] font-display text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.04em] text-sand sm:text-[3.5rem]">
                {result
                  ? `Your clearest path to becoming competitive for ${result.roleTitle}${result.companyHint ? ` at ${result.companyHint}` : ""}.`
                  : "Your clearest path to becoming competitive for the role."}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-mist/72">
                {demoHighlights
                  ? `This instant walkthrough shows how JobCraftor turns a realistic ${demoHighlights.subtitle} into a sharper application story, a clearer priority order, and a plan you can act on immediately.`
                  : result
                    ? `This dashboard turns the ${result.roleTitle} posting into a focused decision layer: where you already look credible, what still weakens the application, and what closes the gap fastest.`
                    : "This dashboard turns the job posting into a focused decision layer: where you already look credible, what still weakens the application, and what closes the gap fastest."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface-muted px-4 py-4">
                <p className="section-label">Outcome</p>
                <p className="mt-2 text-sm leading-7 text-mist/74">Know your fit, your blockers, and the highest-leverage next steps.</p>
              </div>
              <div className="surface-muted px-4 py-4">
                <p className="section-label">What stands out</p>
                <p className="mt-2 text-sm leading-7 text-mist/74">Resume upgrades, outreach help, and interview prep in one story.</p>
              </div>
              <div className="surface-muted px-4 py-4">
                <p className="section-label">Best use</p>
                <p className="mt-2 text-sm leading-7 text-mist/74">Scan the summary first, then move through blockers and the 7-day plan.</p>
              </div>
            </div>
          </div>

          <div className="print-hidden flex flex-wrap gap-3 xl:justify-end">
            {result ? (
              <>
                <button type="button" onClick={handlePrint} className="button-secondary">
                  Save as PDF
                </button>
                <button type="button" onClick={handleDownloadSummary} className="button-secondary">
                  Download summary
                </button>
              </>
            ) : null}
            <button type="button" onClick={onBackToWorkflow} className="button-secondary">
              Edit inputs
            </button>
            <button type="button" onClick={onReset} className="button-secondary">
              Start new plan
            </button>
          </div>
        </div>
      </div>

      <div className="premium-card flex flex-col gap-4 p-5 sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow-label">Results dashboard</p>
          </div>
          <h2 className="font-display text-[2rem] font-semibold tracking-[-0.03em] text-sand sm:text-[2.4rem]">
            A sharper application story, organized for fast decisions
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-mist/68 sm:text-[15px]">
            {demoHighlights
              ? `Use this demo to show the full product narrative quickly: fit, blockers, rewrites, outreach help, and the action plan that turns insight into momentum.`
              : "Start with the summary band below, then move through fit, blockers, resume upgrades, and interview prep in that order for the fastest read."}
          </p>
        </div>
      </div>

      {feedback ? (
        <div
          className={`print-hidden rounded-[20px] px-4 py-3 text-sm leading-7 ${
            feedback.tone === "success"
              ? "border border-mint/25 bg-mint/10 text-sand"
              : "border border-ember/30 bg-ember/10 text-orange-100"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

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
        {!isLoading && result ? (
          <ResultsPanel
            result={result}
            onCopyNetworking={() => copyText("Networking message", buildNetworkingMessageCopy(result))}
            onCopyInterviewPrep={() => copyText("Interview questions", buildInterviewQuestionsCopy(result))}
          />
        ) : null}
        {!isLoading && !result ? <ResultsEmptyState /> : null}
      </div>
    </section>
  );
}
