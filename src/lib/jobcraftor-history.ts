import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorHistoryEntry,
  JobCraftorResult,
} from "@/types/jobcraftor";
import { jobCraftorHistorySchema } from "@/types/jobcraftor";

const STORAGE_KEY = "jobcraftor.history.v1";
const MAX_HISTORY_ITEMS = 6;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function buildFingerprint(input: AnalyzeJobCraftorInput, result: JobCraftorResult) {
  return JSON.stringify({
    jobPostingText: input.jobPostingText ?? "",
    jobPostingUrl: input.jobPostingUrl ?? "",
    resumeText: input.resumeText,
    targetRole: input.targetRole ?? "",
    deadline: input.deadline ?? "",
    roleTitle: result.roleTitle,
    companyHint: result.companyHint,
  });
}

export function loadJobCraftorHistory() {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    const result = jobCraftorHistorySchema.safeParse(parsed);

    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: JobCraftorHistoryEntry[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveJobCraftorHistoryEntry(
  input: AnalyzeJobCraftorInput,
  result: JobCraftorResult,
  meta: JobCraftorAnalysisMeta,
) {
  if (!canUseStorage()) {
    return [];
  }

  const nextEntry: JobCraftorHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    input,
    result,
    meta,
  };

  const nextFingerprint = buildFingerprint(input, result);
  const currentEntries = loadJobCraftorHistory();
  const dedupedEntries = currentEntries.filter(
    (entry) => buildFingerprint(entry.input, entry.result) !== nextFingerprint,
  );
  const trimmedEntries = [nextEntry, ...dedupedEntries].slice(0, MAX_HISTORY_ITEMS);

  writeHistory(trimmedEntries);

  return trimmedEntries;
}

export function clearJobCraftorHistory() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
