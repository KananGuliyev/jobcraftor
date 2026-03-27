"use client";

import { useId } from "react";

interface InputPanelProps {
  jobPostingText: string;
  jobPostingUrl: string;
  resumeText: string;
  resumeFileName: string | null;
  isLoading: boolean;
  error: string | null;
  onJobPostingTextChange: (value: string) => void;
  onJobPostingUrlChange: (value: string) => void;
  onResumeTextChange: (value: string) => void;
  onAnalyze: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
  onUpload: (file: File) => void;
}

export function InputPanel({
  jobPostingText,
  jobPostingUrl,
  resumeText,
  resumeFileName,
  isLoading,
  error,
  onJobPostingTextChange,
  onJobPostingUrlChange,
  onResumeTextChange,
  onAnalyze,
  onLoadDemo,
  onReset,
  onUpload,
}: InputPanelProps) {
  const inputId = useId();

  return (
    <section className="panel-surface p-5 sm:p-6" id="workflow">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.28em] text-sky/80">Input workspace</p>
          <h2 className="font-display text-2xl font-semibold text-sand">Build one strong application strategy</h2>
          <p className="section-copy">
            Paste the posting or drop in the URL, then add the resume. The first pass runs on mock server analysis
            so the whole workflow works before AI integration.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" id="demo">
          <button
            type="button"
            onClick={onLoadDemo}
            className="rounded-full border border-sky/20 bg-sky/10 px-4 py-2 text-sm font-medium text-sand transition hover:-translate-y-0.5"
          >
            Try demo
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-mist/80 transition hover:-translate-y-0.5"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5">
        <label className="grid gap-3">
          <span className="text-sm font-semibold text-sand">1. Job posting text</span>
          <textarea
            value={jobPostingText}
            onChange={(event) => onJobPostingTextChange(event.target.value)}
            className="field-area"
            placeholder="Paste the full posting here. Responsibilities, mission, requirements, and preferred qualifications all help."
          />
        </label>

        <label className="grid gap-3">
          <span className="text-sm font-semibold text-sand">Or add a job posting URL</span>
          <input
            type="url"
            value={jobPostingUrl}
            onChange={(event) => onJobPostingUrlChange(event.target.value)}
            className="field-input"
            placeholder="https://company.com/jobs/product-operations-intern"
          />
          <span className="text-sm text-mist/60">
            In this mock-first scaffold, the URL is stored and used as source context until live fetching is added.
          </span>
        </label>

        <div className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-sand">2. Resume</span>
            <label
              htmlFor={inputId}
              className="inline-flex w-fit cursor-pointer rounded-full border border-sky/20 bg-sky/10 px-4 py-2 text-sm font-medium text-sand transition hover:-translate-y-0.5"
            >
              Upload plain-text resume
            </label>
            <input
              id={inputId}
              type="file"
              accept=".txt,.md,.rtf,text/plain,text/markdown,application/rtf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onUpload(file);
                }
              }}
            />
          </div>
          <textarea
            value={resumeText}
            onChange={(event) => onResumeTextChange(event.target.value)}
            className="field-area"
            placeholder="Paste your resume text, or upload a plain-text file for the demo."
          />
          <div className="flex flex-col gap-1 text-sm text-mist/65 sm:flex-row sm:items-center sm:justify-between">
            <span>{resumeFileName ? `Loaded: ${resumeFileName}` : "No file uploaded yet"}</span>
            <span>Tip: include projects, leadership, metrics, and concrete outcomes.</span>
          </div>
        </div>

        {error ? (
          <div className="rounded-[20px] border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-orange-100">
            {error}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading}
          className="rounded-full bg-gradient-to-r from-sunrise to-ember px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {isLoading ? "Generating your plan..." : "Analyze role and generate plan"}
        </button>
      </div>
    </section>
  );
}
