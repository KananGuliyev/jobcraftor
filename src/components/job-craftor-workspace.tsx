"use client";

import { useState, useTransition } from "react";
import { demoInput } from "@/data/demo-content";
import type { AnalyzeJobCraftorInput, JobCraftorResult } from "@/types/jobcraftor";
import { AppHeader } from "./app-header";
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
  sourceLabel: null,
  helperText: "No file uploaded yet.",
};

const unsupportedFileError =
  "Upload a `.txt`, `.md`, `.rtf`, or `.pdf` resume file, or paste the resume directly into the field.";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeView, setActiveView] = useState<"workspace" | "results">("workspace");

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
      jobPostingText: demoInput.jobPostingText,
      jobPostingUrl: demoInput.jobPostingUrl ?? "",
      resumeText: demoInput.resumeText,
      targetRole: demoInput.targetRole ?? "",
      deadline: demoInput.deadline ?? "",
    });
    setUploadState({
      fileName: demoInput.resumeFileName ?? null,
      sourceLabel: "Sample dataset",
      helperText: "Sample resume content has been loaded so the demo can run immediately.",
    });
    setFieldErrors({});
    setSubmissionError(null);
  }

  function handleReset() {
    setFormValues(emptyForm);
    setUploadState(defaultUploadState);
    setResult(null);
    setFieldErrors({});
    setSubmissionError(null);
    setIsGenerating(false);
    setActiveView("workspace");
  }

  async function handleAnalyze() {
    const nextErrors = getFieldErrors(formValues, uploadState);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmissionError(null);
      return;
    }

    const payload: AnalyzeJobCraftorInput = {
      jobPostingText: formValues.jobPostingText.trim(),
      jobPostingUrl: formValues.jobPostingUrl.trim(),
      resumeText: formValues.resumeText.trim(),
      resumeFileName: uploadState.fileName,
      targetRole: formValues.targetRole.trim(),
      deadline: formValues.deadline.trim(),
    };

    setFieldErrors({});
    setSubmissionError(null);
    setResult(null);
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

      const body = (await response.json()) as { error?: string; result?: JobCraftorResult };

      if (!response.ok || !body.result) {
        throw new Error(body.error ?? "JobCraftor could not generate a result.");
      }

      startTransition(() => {
        setResult(body.result ?? null);
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Something went wrong while analyzing the role.";
      setSubmissionError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split(".").pop() ?? "";
    const supportedTextTypes = ["txt", "md", "rtf"];
    const supported = [...supportedTextTypes, "pdf"].includes(fileExtension);

    if (!supported) {
      setSubmissionError(unsupportedFileError);
      setFieldErrors((current) => ({
        ...current,
        resumeText: "Use a supported file type or paste your resume directly.",
      }));
      return;
    }

    if (fileExtension === "pdf") {
      const placeholderText = `[PDF resume uploaded: ${file.name}]
PDF parsing is not wired yet, so JobCraftor is storing this upload as placeholder evidence for the mock workflow.`;

      setFormValues((current) => ({
        ...current,
        resumeText: current.resumeText.trim() ? current.resumeText : placeholderText,
      }));
      setUploadState({
        fileName: file.name,
        sourceLabel: "PDF placeholder",
        helperText: "PDF uploaded successfully. Full text extraction can be added later without changing this form.",
      });
    } else {
      const text = await file.text();

      setFormValues((current) => ({
        ...current,
        resumeText: text,
      }));
      setUploadState({
        fileName: file.name,
        sourceLabel: "Resume file",
        helperText: "Text content loaded from the uploaded file. You can still edit the resume text below.",
      });
    }

    setFieldErrors((current) => ({ ...current, resumeText: undefined }));
    setSubmissionError(null);
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
    handleLoadDemo();
    window.setTimeout(() => {
      scrollToWorkflow();
    }, 40);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute left-[-10rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-sunrise/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-[12rem] h-[36rem] w-[36rem] rounded-full bg-sky/20 blur-3xl" />

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
                      description="Add the role, your resume, and optional application context, then generate a structured dashboard from the mock analysis route."
                    />
                    <div className="w-full max-w-xs space-y-3">
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sunrise to-sky transition-all"
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
                  isLoading={isGenerating || isPending}
                  submissionError={submissionError}
                  fieldErrors={fieldErrors}
                  onChange={updateField}
                  onAnalyze={handleAnalyze}
                  onLoadDemo={handleLoadDemo}
                  onReset={handleReset}
                  onUpload={handleUpload}
                />
              </div>

              <section className="premium-card p-5 sm:p-6">
                <ResultsEmptyState />
              </section>
            </section>
          </>
        ) : (
          <ResultsExperience
            isLoading={isGenerating || isPending}
            result={result}
            error={submissionError}
            onBackToWorkflow={handleBackToWorkflow}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
