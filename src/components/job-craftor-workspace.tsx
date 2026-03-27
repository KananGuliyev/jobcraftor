"use client";

import { useEffect, useState, useTransition } from "react";
import { demoHighlights, demoInput, demoMeta, demoResult } from "@/data/demo-content";
import { clearJobCraftorHistory, loadJobCraftorHistory, saveJobCraftorHistoryEntry } from "@/lib/jobcraftor-history";
import { normalizeResumeText } from "@/lib/resume-text";
import {
  clearJobCraftorTelemetry,
  loadJobCraftorTelemetry,
  trackJobCraftorEvent,
  type JobCraftorTelemetryEvent,
} from "@/lib/jobcraftor-telemetry";
import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorAnalysisResponse,
  JobCraftorHistoryEntry,
  JobCraftorResult,
  ParseResumeSuccess,
  ResumeUploadFormat,
} from "@/types/jobcraftor";
import { AppHeader } from "./app-header";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { HistoryPanel } from "./history-panel";
import { Hero } from "./hero";
import { InputPanel } from "./input-panel";
import { ResultsEmptyState } from "./results-empty-state";
import { ResultsExperience } from "./results-experience";
import { SectionHeading } from "./section-heading";

type FormField = "jobPostingText" | "jobPostingUrl" | "resumeText" | "targetRole" | "deadline";

interface FormValues {
  jobPostingText: string;
  jobPostingUrl: string;
  resumeText: string;
  targetRole: string;
  deadline: string;
}

interface UploadState {
  fileName: string | null;
  format: ResumeUploadFormat | null;
  sourceLabel: string | null;
  helperText: string;
}

interface FieldErrors {
  jobPostingText?: string;
  jobPostingUrl?: string;
  resumeText?: string;
  targetRole?: string;
  deadline?: string;
}

const emptyForm: FormValues = {
  jobPostingText: "",
  jobPostingUrl: "",
  resumeText: "",
  targetRole: "",
  deadline: "",
};

const defaultUploadState: UploadState = {
  fileName: null,
  format: null,
  sourceLabel: null,
  helperText: "No file uploaded yet.",
};

const unsupportedFileError =
  "Upload a `.txt`, `.md`, `.rtf`, `.pdf`, or `.docx` resume file, or paste the resume directly into the field.";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getFieldErrors(values: FormValues, uploadState: UploadState): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.jobPostingText.trim() && !values.jobPostingUrl.trim()) {
    errors.jobPostingText = "Paste the job description or provide a job URL so JobCraftor has a role to analyze.";
  }

  if (values.jobPostingUrl.trim() && !isValidUrl(values.jobPostingUrl.trim())) {
    errors.jobPostingUrl = "Enter a valid URL, including the `https://` prefix.";
  }

  if (!values.resumeText.trim() && !uploadState.fileName) {
    errors.resumeText = "Paste your resume text or upload a supported file so JobCraftor has evidence to compare.";
  }

  return errors;
}

export function JobCraftorWorkspace() {
  const [formValues, setFormValues] = useState<FormValues>(emptyForm);
  const [uploadState, setUploadState] = useState<UploadState>(defaultUploadState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [result, setResult] = useState<JobCraftorResult | null>(null);
  const [analysisMeta, setAnalysisMeta] = useState<JobCraftorAnalysisMeta | null>(null);
  const [historyEntries, setHistoryEntries] = useState<JobCraftorHistoryEntry[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<JobCraftorTelemetryEvent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeView, setActiveView] = useState<"workspace" | "results">("workspace");

  useEffect(() => {
    setHistoryEntries(loadJobCraftorHistory());
    setTelemetryEvents(loadJobCraftorTelemetry());
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

  function updateField(field: FormField, value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setSubmissionError(null);
  }

  function handleLoadDemo() {
    setFormValues({
      jobPostingText: demoInput.jobPostingText ?? "",
      jobPostingUrl: demoInput.jobPostingUrl ?? "",
      resumeText: demoInput.resumeText,
      targetRole: demoInput.targetRole ?? "",
      deadline: demoInput.deadline ?? "",
    });
    setUploadState({
      fileName: demoInput.resumeFileName ?? null,
      format: "txt",
      sourceLabel: "Sample dataset",
      helperText: "Sample software engineering internship content has been loaded for the contest demo.",
    });
    setFieldErrors({});
    setSubmissionError(null);
    setAnalysisMeta(null);
  }

  function hydrateAnalysisFromHistory(entry: JobCraftorHistoryEntry) {
    setFormValues({
      jobPostingText: entry.input.jobPostingText ?? "",
      jobPostingUrl: entry.input.jobPostingUrl ?? "",
      resumeText: entry.input.resumeText,
      targetRole: entry.input.targetRole ?? "",
      deadline: entry.input.deadline ?? "",
    });
    setUploadState({
      fileName: entry.input.resumeFileName ?? null,
      format: entry.input.resumeFileName ? "txt" : null,
      sourceLabel: "Saved analysis",
      helperText: `Saved locally on ${new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(entry.createdAt))}.`,
    });
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
    const nextInput: AnalyzeJobCraftorInput = {
      jobPostingText: demoInput.jobPostingText ?? "",
      jobPostingUrl: demoInput.jobPostingUrl ?? "",
      resumeText: demoInput.resumeText,
      resumeFileName: demoInput.resumeFileName ?? null,
      targetRole: demoInput.targetRole ?? "",
      deadline: demoInput.deadline ?? "",
    };

    setFormValues({
      jobPostingText: nextInput.jobPostingText ?? "",
      jobPostingUrl: nextInput.jobPostingUrl ?? "",
      resumeText: nextInput.resumeText,
      targetRole: nextInput.targetRole ?? "",
      deadline: nextInput.deadline ?? "",
    });
    setUploadState({
      fileName: nextInput.resumeFileName ?? null,
      format: "txt",
      sourceLabel: "Instant demo dataset",
      helperText: "This sample software engineering internship package is ready to explore immediately.",
    });
    setFieldErrors({});
    setSubmissionError(null);
    setResult(demoResult);
    setAnalysisMeta(demoMeta);
    setIsGenerating(false);
    setIsUploading(false);
    setHistoryEntries(saveJobCraftorHistoryEntry(nextInput, demoResult, demoMeta));
    setTelemetryEvents(
      trackJobCraftorEvent(
        "demo_mode_used",
        `Instant demo opened for ${demoResult.roleTitle} at ${demoResult.companyHint}.`,
      ),
    );
    setActiveView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setFormValues(emptyForm);
    setUploadState(defaultUploadState);
    setResult(null);
    setAnalysisMeta(null);
    setFieldErrors({});
    setSubmissionError(null);
    setIsGenerating(false);
    setActiveView("workspace");
  }

  async function handleAnalyze() {
    setTelemetryEvents(
      trackJobCraftorEvent(
        "generate_plan_clicked",
        `Generate Plan clicked with ${formValues.jobPostingText.trim() ? "job text" : "job URL"} and ${formValues.resumeText.trim() ? "resume text" : "resume upload"}.`,
      ),
    );

    const nextErrors = getFieldErrors(formValues, uploadState);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmissionError(null);
      return;
    }

    const payload: AnalyzeJobCraftorInput = {
      jobPostingText: formValues.jobPostingText.trim(),
      jobPostingUrl: formValues.jobPostingUrl.trim(),
      resumeText: normalizeResumeText(formValues.resumeText),
      resumeFileName: uploadState.fileName,
      targetRole: formValues.targetRole.trim(),
      deadline: formValues.deadline.trim(),
    };

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

      const body = (await response.json()) as Partial<JobCraftorAnalysisResponse> & { error?: string };

      if (!response.ok || !body.result || !body.meta) {
        throw new Error(body.error ?? "JobCraftor could not generate a result.");
      }

      setHistoryEntries(saveJobCraftorHistoryEntry(payload, body.result, body.meta));

      startTransition(() => {
        setResult(body.result ?? null);
        setAnalysisMeta(body.meta ?? null);
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Something went wrong while analyzing the role.";
      setTelemetryEvents(trackJobCraftorEvent("analysis_failed", message));
      setSubmissionError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    const fallbackExtension = file.name.toLowerCase().split(".").pop() ?? "";
    const supported = ["txt", "md", "rtf", "pdf", "docx", "doc"].includes(fallbackExtension);

    if (!supported) {
      setTelemetryEvents(trackJobCraftorEvent("parsing_failed", unsupportedFileError));
      setSubmissionError(unsupportedFileError);
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

      const body = (await response.json()) as Partial<ParseResumeSuccess> & { error?: string };

      if (!response.ok || !body.text || !body.meta) {
        throw new Error(body.error ?? "JobCraftor could not parse that resume file.");
      }

      setFormValues((current) => ({
        ...current,
        resumeText: body.text ?? current.resumeText,
      }));
      setUploadState({
        fileName: body.meta.fileName,
        format: body.meta.format,
        sourceLabel: body.meta.sourceLabel,
        helperText: body.meta.helperText,
      });
      setFieldErrors((current) => ({ ...current, resumeText: undefined }));
      setSubmissionError(null);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "JobCraftor could not parse that resume file.";
      setTelemetryEvents(trackJobCraftorEvent("parsing_failed", message));
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
    clearJobCraftorHistory();
    setHistoryEntries([]);
  }

  function handleClearTelemetry() {
    clearJobCraftorTelemetry();
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
                      eyebrow="Workflow progress"
                      title={`${completion}% complete`}
                      description="Add the role, your resume, and optional application context, then generate a structured dashboard built for fast decisions and stronger applications."
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
                      {result ? (
                        <button type="button" onClick={() => setActiveView("results")} className="button-secondary w-full">
                          Open latest dashboard
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
                <HistoryPanel entries={historyEntries} onOpen={hydrateAnalysisFromHistory} onClear={handleClearHistory} />
                <DiagnosticsPanel events={telemetryEvents} onClear={handleClearTelemetry} />
                <section className="premium-card p-5 sm:p-6">
                  <ResultsEmptyState />
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
