import { z } from "zod";
import {
  analysisSourceSchema,
  gapStrengthSchema,
  planDaySchema,
  resumeRewriteSchema,
} from "./shared";

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

export const jobCraftorAnalysisMetaSchema = z.object({
  source: analysisSourceSchema,
  notice: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
});

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

export type RoleBreakdownSection = z.infer<typeof roleBreakdownSchema>;
export type FitAnalysis = z.infer<typeof fitAnalysisSchema>;
export type BlockerItem = z.infer<typeof blockerSchema>;
export type ResumeImprovements = z.infer<typeof resumeImprovementsSchema>;
export type InterviewPrepItem = z.infer<typeof interviewPrepItemSchema>;
export type JobCraftorAnalysisMeta = z.infer<typeof jobCraftorAnalysisMetaSchema>;
export type JobCraftorResult = z.infer<typeof jobCraftorResultSchema>;
export type JobCraftorAnalysisResponse = z.infer<typeof jobCraftorAnalysisResponseSchema>;
