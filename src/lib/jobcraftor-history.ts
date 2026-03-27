import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorHistoryEntry,
  JobCraftorResult,
} from "@/types/jobcraftor";
import { jobCraftorHistorySchema } from "@/types/jobcraftor";
import {
  canUseBrowserStorage,
  clearStoredJson,
  createLocalRecordId,
  readStoredJson,
  writeStoredJson,
} from "./jobcraftor-browser-storage";

const STORAGE_KEY = "jobcraftor.history.v1";
const MAX_HISTORY_ITEMS = 6;

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
  if (!canUseBrowserStorage()) {
    return [];
  }

  const raw = readStoredJson(STORAGE_KEY);

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
  if (!canUseBrowserStorage()) {
    return;
  }

  writeStoredJson(STORAGE_KEY, entries);
}

export function saveJobCraftorHistoryEntry(
  input: AnalyzeJobCraftorInput,
  result: JobCraftorResult,
  meta: JobCraftorAnalysisMeta,
) {
  if (!canUseBrowserStorage()) {
    return [];
  }

  const nextEntry: JobCraftorHistoryEntry = {
    id: createLocalRecordId(),
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
  if (!canUseBrowserStorage()) {
    return;
  }

  clearStoredJson(STORAGE_KEY);
}
