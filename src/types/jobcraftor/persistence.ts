import { z } from "zod";
import { jobCraftorAnalysisMetaSchema, jobCraftorResultSchema } from "./analysis";
import { analyzeJobCraftorInputSchema } from "./input";

export const jobCraftorHistoryEntrySchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  input: analyzeJobCraftorInputSchema,
  result: jobCraftorResultSchema,
  meta: jobCraftorAnalysisMetaSchema,
});

export const jobCraftorHistorySchema = z.array(jobCraftorHistoryEntrySchema);

export type JobCraftorHistoryEntry = z.infer<typeof jobCraftorHistoryEntrySchema>;
