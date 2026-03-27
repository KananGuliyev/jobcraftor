"use client";

import { useEffect, useState, useTransition } from "react";
import { demoHighlights, demoInput, demoMeta, demoResult } from "@/data/demo-content";
import { JobCraftorApiError, readJsonApiResponse } from "@/lib/api-client";
import {
  clearJobCraftorDebugEvents,
  clearJobCraftorSavedHistory,
  loadJobCraftorLocalPersistence,
  recordJobCraftorLocalEvent,
  saveJobCraftorLocalAnalysis,
  type JobCraftorTelemetryEvent,
} from "@/lib/jobcraftor-local-persistence";
import {
  buildAnalyzePayload,
  buildParsedResumeUploadState,
  buildSampleUploadState,
  buildSavedAnalysisUploadState,
  buildWorkspaceFormValues,
  defaultWorkspaceUploadState,
  emptyWorkspaceFormValues,
  getWorkspaceFieldErrors,
  isSupportedResumeUpload,
  unsupportedResumeFileError,
  type WorkspaceFieldErrors,
  type WorkspaceFormField,
  type WorkspaceFormValues,
  type WorkspaceUploadState,
} from "@/lib/jobcraftor-workspace";
import type {
  JobCraftorAnalysisMeta,
  JobCraftorHistoryEntry,
  JobCraftorResult,
} from "@/types/jobcraftor";
import { jobCraftorAnalysisResponseSchema, parseResumeSuccessSchema } from "@/types/jobcraftor";
import { AppHeader } from "./app-header";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { HistoryPanel } from "./history-panel";
import { Hero } from "./hero";
import { InputPanel } from "./input-panel";
import { ResultsEmptyState } from "./results-empty-state";
import { ResultsExperience } from "./results-experience";
import { SectionHeading } from "./section-heading";

export function JobCraftorWorkspace() {
  const genericRequestError =
    "We couldn't process that file or request. Please try again or paste your resume text directly.";
  const [formValues, setFormValues] = useState<WorkspaceFormValues>(emptyWorkspaceFormValues);
  const [uploadState, setUploadState] = useState<WorkspaceUploadState>(defaultWorkspaceUploadState);
  const [fieldErrors, setFieldErrors] = useState<WorkspaceFieldErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [result, setResult] = useState<JobCraftorResult | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<JobCraftorAnalysisMeta | null>(null);
  const [historyEntries, setHistoryEntries] = useState<JobCraftorHistoryEntry[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<JobCraftorTelemetryEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeView, setActiveView] = useState<"workspace" | "results">("workspace");

  useEffect(() => {
    const localState = loadJobCraftorLocalPersistence();
    setHistoryEntries(localState.historyEntries);
    setTelemetryEvents(localState.telemetryEvents);
  }, []);

  const completion = Math.round(
    ([
      formValues.jobPostingText.trim().length > 80 || formValues.jobPostingUrl.trim().length > 8,
      formValues.resumeText.trim().length > 80 || uploadState.fileName !== null,
      result !== null,
    ].filter(Boolean).length /
      3) *
      100,
  );

  function updateField(field: WorkspaceFormField, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionError(null);
  }

  function handleLoadDemo() {
    setFormValues(buildWorkspaceFormValues(demoInput));
    setUploadState(
      buildSampleUploadState(
        demoInput.resumeFileName ?? null,
        "Sample dataset",
        "Sample software engineering internship inputs are loaded. Generate the plan or launch the instant demo for the fastest walkthrough.",
      ),
    );
    setFieldErrors({});
    setSubmissionError(null);
    setAnalysisMeta(null);
  }

  function hydrateAnalysisFromHistory(entry: JobCraftorHistoryEntry) {
    setFormValues(buildWorkspaceFormValues(entry.input));
    setUploadState(buildSavedAnalysisUploadState(entry));
    setFieldErrors({});
    setSubmissionError(null);
    setResult(entry.result);
    setAnalysisMeta(entry.meta);
    setIsGenerating(false);
    setIsUploading(false);
    setActiveView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function launchInstantDemo() {
    setFormValues(buildWorkspaceFormValues(demoInput));
    setUploadState(
      buildSampleUploadState(
        demoInput.resumeFileName ?? null,
        "Instant demo dataset",
        "This sample software engineering internship package is ready to explore immediately.",
      ),
    );
    setFieldErrors({});
    setSubmissionError(null);
    setResult(demoResult);
    setAnalysisMeta(demoMeta);
    setIsGenerating(false);
    setIsUploading(false);
    setHistoryEntries(saveJobCraftorLocalAnalysis(demoInput, demoResult, demoMeta));
    setTelemetryEvents(
      recordJobCraftorLocalEvent(
        "demo_mode_used",
        `Instant demo opened for ${demoResult.roleTitle} at ${demoResult.companyHint}.`,
      ),
    );
    setActiveView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setFormValues(emptyWorkspaceFormValues);
    setUploadState(defaultWorkspaceUploadState);
    setResult(null);
    setAnalysisMeta(null);
    setFieldErrors({});
    setSubmissionError(null);
    setIsGenerating(false);
    setActiveView("workspace");
  }

  async function handleAnalyze() {
    setTelemetryEvents(
      recordJobCraftorLocalEvent(
        "generate_plan_clicked",
        `Generate Plan clicked with ${formValues.jobPostingText.trim() ? "job text" : "job URL"} and ${formValues.resumeText.trim() ? "resume text" : "resume upload"}.`,
      ),
    );

    const nextErrors = getWorkspaceFieldErrors(formValues, uploadState);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmissionError(null);
      return;
    }

    const payload = buildAnalyzePayload(formValues, uploadState);

    setFieldErrors({});
    setSubmissionError(null);
    setResult(null);
    setAnalysisMeta(null);
    setIsGenerating(true);
    setActiveView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await readJsonApiResponse(
        response,
        jobCraftorAnalysisResponseSchema,
        "We couldn't process that request. Please try again or refresh the sample/demo input.",
      );

      setHistoryEntries(saveJobCraftorLocalAnalysis(payload, body.result, body.meta));

      startTransition(() => {
        setResult(body.result ?? null);
        setAnalysisMeta(body.meta ?? null);
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof JobCraftorApiError || caughtError instanceof Error
          ? caughtError.message
          : "We couldn't process that request. Please try again or refresh the sample/demo input.";
      setTelemetryEvents(recordJobCraftorLocalEvent("analysis_failed", message));
      setSubmissionError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    if (!isSupportedResumeUpload(file.name)) {
      setTelemetryEvents(recordJobCraftorLocalEvent("parsing_failed", unsupportedResumeFileError));
      setSubmissionError(unsupportedResumeFileError);
      setFieldErrors((current) => ({
        ...current,
        resumeText: "Use a supported resume file or paste your resume directly.",
      }));
      return;
    }

    setIsUploading(true);
    setSubmissionError(null);
    setFieldErrors((current) => ({ ...current, resumeText: undefined }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const body = await readJsonApiResponse(response, parseResumeSuccessSchema, genericRequestError);

      setFormValues((current) => ({
        ...current,
        resumeText: body.text ?? current.resumeText,
      }));
      setUploadState(buildParsedResumeUploadState(body.meta));
      setFieldErrors((current) => ({ ...current, resumeText: undefined }));
      setSubmissionError(null);
    } catch (caughtError) {
      const message =
        caughtError instanceof JobCraftorApiError || caughtError instanceof Error
          ? caughtError.message
          : genericRequestError;
      setTelemetryEvents(recordJobCraftorLocalEvent("parsing_failed", message));
      setSubmissionError(message);
      setFieldErrors((current) => ({
        ...current,
        resumeText: "Upload a readable file or paste your resume directly.",
      }));
    } finally {
      setIsUploading(false);
    }
  }

  function scrollToWorkflow() {
    document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleBackToWorkflow() {
    setActiveView("workspace");
    window.setTimeout(() => {
      scrollToWorkflow();
    }, 40);
  }

  function handleTryDemo() {
    launchInstantDemo();
  }

  function handleClearHistory() {
    clearJobCraftorSavedHistory();
    setHistoryEntries([]);
  }

  function handleClearTelemetry() {
    clearJobCraftorDebugEvents();
    setTelemetryEvents([]);
  }

  return (
    <main className="page-shell">
      <div className="ambient-orb left-[-10rem] top-[-8rem] h-[34rem] w-[34rem] bg-sunrise/12" />
      <div className="ambient-orb right-[-10rem] top-[12rem] h-[36rem] w-[36rem] bg-sky/10" />

      <AppHeader />

      <div className="landing-shell">
        {activeView === "workspace" ? (
          <>
            <Hero onPrimaryCta={scrollToWorkflow} onSecondaryCta={handleTryDemo} />

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div className="premium-card p-5 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                      eyebrow="Start here"
                      title={`${completion}% complete`}
                      description="Add the posting and your resume, then generate a focused dashboard with fit, blockers, resume upgrades, and next steps."
                    />
                    <div className="w-full max-w-xs space-y-3">
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sunrise via-[#f2bb76] to-sky transition-all"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-mist/60">
                        <span>Inputs</span>
                        <span>Analysis</span>
                        <span>Plan</span>
                      </div>
                      <p className="text-xs leading-6 text-mist/58">
                        Fastest path for judges: use the instant demo from the top of the page.
                      </p>
                      {result ? (
                        <button type="button" onClick={() => setActiveView("results")} className="button-secondary w-full">
                          Open current dashboard
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <InputPanel
                  values={formValues}
                  uploadState={uploadState}
                  isLoading={isGenerating || isPending || isUploading}
                  isUploading={isUploading}
                  submissionError={submissionError}
                  fieldErrors={fieldErrors}
                  onChange={updateField}
                  onAnalyze={handleAnalyze}
                  onLoadDemo={handleLoadDemo}
                  onReset={handleReset}
                  onUpload={handleUpload}
                />
              </div>

              <div className="space-y-6">
                <section className="premium-card p-5 sm:p-6">
                  <ResultsEmptyState />
                </section>
                <HistoryPanel entries={historyEntries} onOpen={hydrateAnalysisFromHistory} onClear={handleClearHistory} />
                <section className="premium-card p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <p className="eyebrow-label">Debug visibility</p>
                      <h2 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-sand">
                        Demo diagnostics
                      </h2>
                      <p className="section-subtitle max-w-2xl">
                        Internal logging is available if you need it during rehearsals, but it stays hidden by default
                        so the judge-facing flow stays clean.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDiagnostics((current) => !current)}
                      className="button-secondary self-start"
                    >
                      {showDiagnostics ? "Hide diagnostics" : "Show diagnostics"}
                    </button>
                  </div>

                  {showDiagnostics ? (
                    <div className="mt-6">
                      <DiagnosticsPanel events={telemetryEvents} onClear={handleClearTelemetry} />
                    </div>
                  ) : (
                    <div className="mt-6 surface-subtle p-5">
                      <p className="font-display text-xl font-semibold text-sand">Hidden by default for judging</p>
                      <p className="mt-2 text-sm leading-7 text-mist/68">
                        Open this only if you want local visibility into generate clicks, demo launches, or recent
                        parsing and analysis failures.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </section>
          </>
        ) : (
          <ResultsExperience
            isLoading={isGenerating || isPending}
            result={result}
            meta={analysisMeta}
            error={submissionError}
            demoHighlights={analysisMeta?.source === "demo" ? demoHighlights : null}
            onBackToWorkflow={handleBackToWorkflow}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
