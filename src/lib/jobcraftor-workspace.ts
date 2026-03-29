import { normalizeResumeText } from "@/lib/resume-text";
import type {
  AnalyzeJobCraftorInput,
  JobCraftorHistoryEntry,
  ParseResumeMeta,
  ResumeUploadFormat,
} from "@/types/jobcraftor";

export type WorkspaceFormField = "jobPostingText" | "jobPostingUrl" | "resumeText" | "targetRole" | "deadline";

export interface WorkspaceFormValues {
  jobPostingText: string;
  jobPostingUrl: string;
  resumeText: string;
  targetRole: string;
  deadline: string;
}

export interface WorkspaceUploadState {
  fileName: string | null;
  format: ResumeUploadFormat | null;
  sourceLabel: string | null;
  helperText: string;
}

export interface WorkspaceFieldErrors {
  jobPostingText?: string;
  jobPostingUrl?: string;
  resumeText?: string;
  targetRole?: string;
  deadline?: string;
}

export const emptyWorkspaceFormValues: WorkspaceFormValues = {
  jobPostingText: "",
  jobPostingUrl: "",
  resumeText: "",
  targetRole: "",
  deadline: "",
};

export const defaultWorkspaceUploadState: WorkspaceUploadState = {
  fileName: null,
  format: null,
  sourceLabel: null,
  helperText: "No file uploaded yet. Pasted resume text is the safest path for live demos.",
};

export const unsupportedResumeFileError =
  "That file type is not supported here. For the safest demo, paste your resume text or upload a `.docx` file.";

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function buildUploadState(overrides: Partial<WorkspaceUploadState> = {}): WorkspaceUploadState {
  return {
    ...defaultWorkspaceUploadState,
    ...overrides,
  };
}

export function buildWorkspaceFormValues(input: AnalyzeJobCraftorInput): WorkspaceFormValues {
  return {
    jobPostingText: input.jobPostingText ?? "",
    jobPostingUrl: input.jobPostingUrl ?? "",
    resumeText: input.resumeText,
    targetRole: input.targetRole ?? "",
    deadline: input.deadline ?? "",
  };
}

export function buildSampleUploadState(fileName: string | null, sourceLabel: string, helperText: string) {
  return buildUploadState({
    fileName,
    format: fileName ? "txt" : null,
    sourceLabel,
    helperText,
  });
}

export function buildSavedAnalysisUploadState(entry: JobCraftorHistoryEntry): WorkspaceUploadState {
  return buildUploadState({
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
}

export function buildParsedResumeUploadState(meta: ParseResumeMeta): WorkspaceUploadState {
  return buildUploadState({
    fileName: meta.fileName,
    format: meta.format,
    sourceLabel: meta.sourceLabel,
    helperText: meta.helperText,
  });
}

export function isSupportedResumeUpload(fileName: string) {
  const extension = fileName.toLowerCase().split(".").pop() ?? "";
  return ["txt", "md", "rtf", "pdf", "docx"].includes(extension);
}

export function getWorkspaceFieldErrors(
  values: WorkspaceFormValues,
  uploadState: WorkspaceUploadState,
): WorkspaceFieldErrors {
  const errors: WorkspaceFieldErrors = {};

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

export function buildAnalyzePayload(
  values: WorkspaceFormValues,
  uploadState: WorkspaceUploadState,
): AnalyzeJobCraftorInput {
  return {
    jobPostingText: values.jobPostingText.trim(),
    jobPostingUrl: values.jobPostingUrl.trim(),
    resumeText: normalizeResumeText(values.resumeText),
    resumeFileName: uploadState.fileName,
    targetRole: values.targetRole.trim(),
    deadline: values.deadline.trim(),
  };
}
