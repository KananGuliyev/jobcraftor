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

        <div className="print-hidden flex flex-wrap gap-3">
          {result ? (
            <>
              <button type="button" onClick={handlePrint} className="button-secondary">
                Print or save PDF
              </button>
              <button type="button" onClick={handleDownloadSummary} className="button-secondary">
                Export prep summary
              </button>
            </>
          ) : null}
          <button type="button" onClick={onBackToWorkflow} className="button-secondary">
            Back to inputs
          </button>
          <button type="button" onClick={onReset} className="button-secondary">
            Start over
          </button>
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
