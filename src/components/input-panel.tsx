"use client";

import { useId, useState, type DragEvent } from "react";
import type {
  WorkspaceFieldErrors,
  WorkspaceFormField,
  WorkspaceFormValues,
  WorkspaceUploadState,
} from "@/lib/jobcraftor-workspace";

interface InputPanelProps {
  values: WorkspaceFormValues;
  uploadState: WorkspaceUploadState;
  isLoading: boolean;
  isUploading: boolean;
  submissionError: string | null;
  fieldErrors: WorkspaceFieldErrors;
  onChange: (field: WorkspaceFormField, value: string) => void;
  onAnalyze: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
  onUpload: (file: File) => void;
}

function fieldClass(hasError: boolean) {
  return hasError ? "field-input field-input-error" : "field-input";
}

function areaClass(hasError: boolean) {
  return hasError ? "field-area field-input-error" : "field-area";
}

function FieldMessage({ error, help }: { error?: string; help: string }) {
  return <p className={`text-sm leading-6 ${error ? "text-orange-100" : "text-mist/58"}`}>{error ?? help}</p>;
}

export function InputPanel({
  values,
  uploadState,
  isLoading,
  isUploading,
  submissionError,
  fieldErrors,
  onChange,
  onAnalyze,
  onLoadDemo,
  onReset,
  onUpload,
}: InputPanelProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      onUpload(file);
    }
  }

  return (
    <section className="premium-card p-5 sm:p-6" id="workflow">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <p className="eyebrow-label">Input workspace</p>
          <h2 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-sand">
            Generate a stronger application plan
          </h2>
          <p className="section-subtitle max-w-2xl">
            Paste the role, add your resume, and optionally include a target role or deadline. JobCraftor will turn
            typed or uploaded resume content into clean text before sending it to the analysis engine.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start" id="demo">
          <button type="button" onClick={onLoadDemo} className="button-secondary">
            Autofill sample data
          </button>
          <button type="button" onClick={onReset} className="button-secondary">
            Clear form
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-7">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <label className="grid gap-3">
            <span className="text-sm font-semibold text-sand">Job description</span>
            <textarea
              value={values.jobPostingText}
              onChange={(event) => onChange("jobPostingText", event.target.value)}
              className={areaClass(Boolean(fieldErrors.jobPostingText))}
              placeholder={`Example:\nProduct Marketing Intern\nResponsibilities include owning campaign research, supporting launch briefs, and analyzing conversion performance for student-facing products.`}
            />
            <FieldMessage
              error={fieldErrors.jobPostingText}
              help="Paste the role text here. Responsibilities, requirements, and preferred qualifications all help."
            />
          </label>

          <div className="grid gap-5">
            <label className="grid gap-3">
              <span className="text-sm font-semibold text-sand">Job URL</span>
              <input
                type="url"
                value={values.jobPostingUrl}
                onChange={(event) => onChange("jobPostingUrl", event.target.value)}
                className={fieldClass(Boolean(fieldErrors.jobPostingUrl))}
                placeholder="https://company.com/careers/software-engineering-intern"
              />
              <FieldMessage
                error={fieldErrors.jobPostingUrl}
                help="Optional for now. If present, it must be a valid URL."
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-3">
                <span className="text-sm font-semibold text-sand">Target role</span>
                <input
                  type="text"
                  value={values.targetRole}
                  onChange={(event) => onChange("targetRole", event.target.value)}
                  className={fieldClass(Boolean(fieldErrors.targetRole))}
                  placeholder="Software Engineering Intern"
                />
                <FieldMessage
                  error={fieldErrors.targetRole}
                  help="Optional. Use this if you want the plan framed around a specific role title."
                />
              </label>

              <label className="grid gap-3">
                <span className="text-sm font-semibold text-sand">Deadline</span>
                <input
                  type="date"
                  value={values.deadline}
                  onChange={(event) => onChange("deadline", event.target.value)}
                  className={fieldClass(Boolean(fieldErrors.deadline))}
                />
                <FieldMessage
                  error={fieldErrors.deadline}
                  help="Optional. Adds urgency and timing cues to the mock 7-day plan."
                />
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-sand">Resume upload</span>
              <span className="text-sm leading-6 text-mist/58">
                Supports `.txt`, `.md`, `.rtf`, `.pdf`, and `.docx` with server-side text extraction.
              </span>
            </div>

            <label
              htmlFor={inputId}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`dropzone-surface cursor-pointer ${isDragging ? "border-sky/45 bg-sky/10" : ""} ${
                fieldErrors.resumeText ? "border-ember/45 bg-ember/5" : ""
              }`}
            >
              <div className="flex h-full flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-lg text-sand">
                    +
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-sand">Drop your resume here</h3>
                    <p className="text-sm leading-7 text-mist/68">
                      Drag and drop a file, or click to browse. JobCraftor will extract clean text from supported
                      resumes and place it into the editable field on the right.
                    </p>
                  </div>
                </div>

                <div className="surface-subtle px-4 py-3 text-sm text-mist/68">
                  {isUploading ? (
                    "Parsing your resume and normalizing the extracted text..."
                  ) : uploadState.fileName ? (
                    <>
                      {uploadState.sourceLabel ? (
                        <span className="status-badge-info mb-2 w-fit">{uploadState.sourceLabel}</span>
                      ) : null}
                      <span className="font-semibold text-sand">{uploadState.fileName}</span>
                      <span className="mt-1 block">{uploadState.helperText}</span>
                    </>
                  ) : (
                    "No file uploaded yet. Text pasting still works, even if you upload a file."
                  )}
                </div>
              </div>
            </label>

            <input
              id={inputId}
              type="file"
              accept=".txt,.md,.rtf,.pdf,.doc,.docx,text/plain,text/markdown,application/rtf,text/rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onUpload(file);
                }
                event.currentTarget.value = "";
              }}
            />
          </div>

          <label className="grid gap-3">
            <span className="text-sm font-semibold text-sand">Resume text</span>
            <textarea
              value={values.resumeText}
              onChange={(event) => onChange("resumeText", event.target.value)}
              className={areaClass(Boolean(fieldErrors.resumeText))}
              placeholder={`Example:\nAva Patel\nEconomics and Information Science student\n- Product intern who improved onboarding completion by 18%\n- Built dashboards to track conversion and weekly engagement`}
            />
            <FieldMessage
              error={fieldErrors.resumeText}
              help="Paste resume text directly, or let an uploaded file extract and populate clean text automatically."
            />
          </label>
        </div>

        {submissionError ? (
          <div className="rounded-[20px] border border-ember/30 bg-ember/10 px-4 py-3 text-sm leading-7 text-orange-100">
            {submissionError}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-mist/60">
            JobCraftor turns uploaded resumes into normalized plain text before analysis. Review the extracted text and
            edit it if anything looks off.
          </p>
          <button type="button" onClick={onAnalyze} disabled={isLoading} className="button-primary min-w-[220px]">
            {isUploading ? "Parsing resume..." : isLoading ? "Generating your plan..." : "Generate Plan"}
          </button>
        </div>
      </div>
    </section>
  );
}
