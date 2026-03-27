import { z } from "zod";
import { optionalTrimmedString, trimString } from "./shared";

const optionalUrlSchema = z.preprocess((value) => {
  const trimmed = trimString(value);
  return trimmed === "" ? undefined : trimmed;
}, z.string().url("Add a valid job URL or leave that field empty.").optional());

const optionalDateSchema = z.preprocess((value) => {
  const trimmed = trimString(value);
  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must use YYYY-MM-DD format.").optional());

export const resumeUploadFormatSchema = z.enum(["txt", "md", "rtf", "pdf", "docx"]);

export const parseResumeMetaSchema = z.object({
  fileName: z.string().min(1),
  format: resumeUploadFormatSchema,
  sourceLabel: z.string().min(1),
  helperText: z.string().min(1),
});

export const parseResumeSuccessSchema = z.object({
  text: z.string().min(1),
  meta: parseResumeMetaSchema,
});

export const jobInputSchema = z
  .object({
    jobPostingText: optionalTrimmedString(),
    jobPostingUrl: optionalUrlSchema,
    targetRole: optionalTrimmedString(),
    deadline: optionalDateSchema,
  })
  .superRefine((value, ctx) => {
    if (!value.jobPostingText && !value.jobPostingUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a job posting or URL so JobCraftor has a target role to analyze.",
        path: ["jobPostingText"],
      });
    }
  });

export const resumeInputSchema = z.object({
  resumeText: z.preprocess(
    trimString,
    z.string().min(1, "Paste your resume or upload a plain-text file so JobCraftor has evidence to compare."),
  ),
  resumeFileName: z.preprocess((value) => {
    if (value === null) {
      return null;
    }

    const trimmed = trimString(value);
    return trimmed === "" ? null : trimmed;
  }, z.string().nullable().optional()),
});

export const analyzeJobCraftorInputSchema = jobInputSchema.and(resumeInputSchema);

export type ResumeUploadFormat = z.infer<typeof resumeUploadFormatSchema>;
export type JobInput = z.infer<typeof jobInputSchema>;
export type ResumeInput = z.infer<typeof resumeInputSchema>;
export type AnalyzeJobCraftorInput = z.infer<typeof analyzeJobCraftorInputSchema>;
export type ParseResumeMeta = z.infer<typeof parseResumeMetaSchema>;
export type ParseResumeSuccess = z.infer<typeof parseResumeSuccessSchema>;
