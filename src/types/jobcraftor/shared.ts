import { z } from "zod";

export function trimString(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

export function optionalTrimmedString() {
  return z.preprocess((value) => {
    const trimmed = trimString(value);
    return trimmed === "" ? undefined : trimmed;
  }, z.string().optional());
}

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

export const analysisSourceSchema = z.enum(["ai", "mock_fallback", "demo"]);

export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().min(1),
  code: z.string().min(1),
});

export type GapStrength = z.infer<typeof gapStrengthSchema>;
export type GapItem = z.infer<typeof gapItemSchema>;
export type ResumeRewrite = z.infer<typeof resumeRewriteSchema>;
export type PlanDay = z.infer<typeof planDaySchema>;
export type AnalysisSource = z.infer<typeof analysisSourceSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
