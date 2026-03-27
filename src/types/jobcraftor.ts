import { z } from "zod";

function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function optionalTrimmedString() {
  return z.preprocess((value) => {
    const trimmed = trimString(value);
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional());
}

// The API accepts strings from both form submissions and future server callers, so
// these helpers normalize empty form values into `undefined` before validation.
const optionalUrlSchema = z.preprocess((value) => {
  const trimmed = trimString(value);
  return trimmed === "" ? undefined : trimmed;
}, z.string().url("Add a valid job URL or leave that field empty.").optional());

const optionalDateSchema = z.preprocess((value) => {
  const trimmed = trimString(value);
  return trimmed === "" ? undefined : trimmed;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must use YYYY-MM-DD format.").optional());

export const gapStrengthSchema = z.enum(["high", "medium", "low"]);

export const gapItemSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  strength: gapStrengthSchema,
});

export const resumeRewriteSchema = z.object({
  before: z.string().min(1),
  after: z.string().min(1),
  why: z.string().min(1),
});

export const planDaySchema = z.object({
  day: z.number().int().min(1).max(7),
  title: z.string().min(1),
  goal: z.string().min(1),
  tasks: z.array(z.string().min(1)).min(1),
});

export const roleBreakdownSchema = z.object({
  responsibilities: z.array(z.string().min(1)).min(1),
  keySkills: z.array(z.string().min(1)).min(1),
  whatMattersMost: z.array(z.string().min(1)).min(1),
});

export const fitAnalysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  verdict: z.string().min(1),
  strengths: z.array(z.string().min(1)).min(1),
  gaps: z.array(z.string().min(1)).min(1),
});

export const blockerSchema = z.object({
  title: z.string().min(1),
  whyItMatters: z.string().min(1),
  priority: gapStrengthSchema,
});

export const resumeImprovementsSchema = z.object({
  rewrites: z.array(resumeRewriteSchema).min(1),
  keywordRecommendations: z.array(z.string().min(1)).min(1),
});

export const networkingMessageSchema = z.string().min(1);

export const interviewPrepItemSchema = z.object({
  question: z.string().min(1),
  whatTheyAreTesting: z.string().min(1),
});

export const analysisSourceSchema = z.enum(["ai", "mock_fallback", "demo"]);
export const resumeUploadFormatSchema = z.enum(["txt", "md", "rtf", "pdf", "docx"]);

export const jobCraftorAnalysisMetaSchema = z.object({
  source: analysisSourceSchema,
  notice: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
});

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

export const parseResumeErrorSchema = z.object({
  error: z.string().min(1),
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

export const jobCraftorResultSchema = z.object({
  roleTitle: z.string().min(1),
  companyHint: z.string().min(1),
  summary: z.string().min(1),
  roleBreakdown: roleBreakdownSchema,
  fitAnalysis: fitAnalysisSchema,
  blockers: z.array(blockerSchema).length(3),
  sevenDayPlan: z.array(planDaySchema).length(7),
  resumeImprovements: resumeImprovementsSchema,
  networkingMessage: networkingMessageSchema,
  interviewPrep: z.array(interviewPrepItemSchema).min(1),
});

export const jobCraftorAnalysisResponseSchema = z.object({
  result: jobCraftorResultSchema,
  meta: jobCraftorAnalysisMetaSchema,
});

export const jobCraftorHistoryEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  input: analyzeJobCraftorInputSchema,
  result: jobCraftorResultSchema,
  meta: jobCraftorAnalysisMetaSchema,
});

export const jobCraftorHistorySchema = z.array(jobCraftorHistoryEntrySchema);

export type GapStrength = z.infer<typeof gapStrengthSchema>;
export type GapItem = z.infer<typeof gapItemSchema>;
export type ResumeRewrite = z.infer<typeof resumeRewriteSchema>;
export type PlanDay = z.infer<typeof planDaySchema>;
export type RoleBreakdownSection = z.infer<typeof roleBreakdownSchema>;
export type FitAnalysis = z.infer<typeof fitAnalysisSchema>;
export type BlockerItem = z.infer<typeof blockerSchema>;
export type ResumeImprovements = z.infer<typeof resumeImprovementsSchema>;
export type InterviewPrepItem = z.infer<typeof interviewPrepItemSchema>;
export type AnalysisSource = z.infer<typeof analysisSourceSchema>;
export type ResumeUploadFormat = z.infer<typeof resumeUploadFormatSchema>;
export type JobInput = z.infer<typeof jobInputSchema>;
export type ResumeInput = z.infer<typeof resumeInputSchema>;
export type AnalyzeJobCraftorInput = z.infer<typeof analyzeJobCraftorInputSchema>;
export type JobCraftorAnalysisMeta = z.infer<typeof jobCraftorAnalysisMetaSchema>;
export type JobCraftorResult = z.infer<typeof jobCraftorResultSchema>;
export type JobCraftorAnalysisResponse = z.infer<typeof jobCraftorAnalysisResponseSchema>;
export type JobCraftorHistoryEntry = z.infer<typeof jobCraftorHistoryEntrySchema>;
export type ParseResumeMeta = z.infer<typeof parseResumeMetaSchema>;
export type ParseResumeSuccess = z.infer<typeof parseResumeSuccessSchema>;
export type ParseResumeError = z.infer<typeof parseResumeErrorSchema>;
