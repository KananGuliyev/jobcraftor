"use client";

import { useState, useTransition } from "react";
import { demoInput } from "@/data/demo-content";
import type { AnalyzeJobCraftorInput, JobCraftorResult } from "@/types/jobcraftor";
import { AppHeader } from "./app-header";
import { Hero } from "./hero";
import { InputPanel } from "./input-panel";
import { ResultsEmptyState } from "./results-empty-state";
import { ResultsLoadingState } from "./results-loading-state";
import { ResultsPanel } from "./results-panel";
import { SectionHeading } from "./section-heading";

const emptyJobError = "Paste the job posting text or add a job URL so JobCraftor can target the right role.";
const emptyResumeError = "Paste your resume text or upload a plain-text resume file so the fit analysis has evidence to compare.";
const unsupportedFileError =
  "For this scaffold, upload a plain-text resume file (.txt, .md, or .rtf), or paste the resume directly into the field.";

export function JobCraftorWorkspace() {
  const [jobPostingText, setJobPostingText] = useState("");
  const [jobPostingUrl, setJobPostingUrl] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobCraftorResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const completion = Math.round(
    ([
      jobPostingText.trim().length > 80 || jobPostingUrl.trim().length > 8,
      resumeText.trim().length > 80,
      result !== null,
    ].filter(Boolean).length /
      3) *
      100,
  );

  function handleLoadDemo() {
    setJobPostingText(demoInput.jobPostingText);
    setJobPostingUrl(demoInput.jobPostingUrl ?? "");
    setResumeText(demoInput.resumeText);
    setResumeFileName(demoInput.resumeFileName ?? null);
    setError(null);
  }

  function handleReset() {
    setJobPostingText("");
    setJobPostingUrl("");
    setResumeText("");
    setResumeFileName(null);
    setResult(null);
    setError(null);
    setIsGenerating(false);
  }

  async function handleAnalyze() {
    const payload: AnalyzeJobCraftorInput = {
      jobPostingText: jobPostingText.trim(),
      jobPostingUrl: jobPostingUrl.trim(),
      resumeText: resumeText.trim(),
      resumeFileName,
    };

    if (!payload.jobPostingText && !payload.jobPostingUrl) {
      setError(emptyJobError);
      return;
    }

    if (!payload.resumeText) {
      setError(emptyResumeError);
      return;
    }

    setError(null);
    setResult(null);
    setIsGenerating(true);

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
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    const fileName = file.name.toLowerCase();
    const supported = [".txt", ".md", ".rtf"].some((extension) => fileName.endsWith(extension));

    if (!supported) {
      setError(unsupportedFileError);
      return;
    }

    const text = await file.text();
    setResumeText(text);
    setResumeFileName(file.name);
    setError(null);
  }

  function scrollToWorkflow() {
    document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <Hero onPrimaryCta={scrollToWorkflow} onSecondaryCta={handleTryDemo} />

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="premium-card p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeading
                  eyebrow="Workflow progress"
                  title={`${completion}% complete`}
                  description="Fill the role input and resume, then generate a structured dashboard from the mock analysis route."
                />
                <div className="w-full max-w-xs space-y-2">
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sunrise to-sky transition-all"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-mist/60">
                    <span>Input</span>
                    <span>Analysis</span>
                    <span>Plan</span>
                  </div>
                </div>
              </div>
            </div>

            <InputPanel
              jobPostingText={jobPostingText}
              jobPostingUrl={jobPostingUrl}
              resumeText={resumeText}
              resumeFileName={resumeFileName}
              isLoading={isGenerating || isPending}
              error={error}
              onJobPostingTextChange={setJobPostingText}
              onJobPostingUrlChange={setJobPostingUrl}
              onResumeTextChange={setResumeText}
              onAnalyze={handleAnalyze}
              onLoadDemo={handleLoadDemo}
              onReset={handleReset}
              onUpload={handleUpload}
            />
          </div>

          <section className="premium-card p-5 sm:p-6">
            {isGenerating || isPending ? <ResultsLoadingState /> : null}
            {!isGenerating && !isPending && result ? <ResultsPanel result={result} /> : null}
            {!isGenerating && !isPending && !result ? <ResultsEmptyState /> : null}
          </section>
        </section>
      </div>
    </main>
  );
}
