import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorHistoryEntry,
  JobCraftorResult,
} from "@/types/jobcraftor";
import { clearJobCraftorHistory, loadJobCraftorHistory, saveJobCraftorHistoryEntry } from "./jobcraftor-history";
import {
  clearJobCraftorTelemetry,
  loadJobCraftorTelemetry,
  trackJobCraftorEvent,
  type JobCraftorTelemetryEvent,
  type JobCraftorTelemetryEventType,
} from "./jobcraftor-telemetry";

export function loadJobCraftorLocalPersistence() {
  return {
    historyEntries: loadJobCraftorHistory(),
    telemetryEvents: loadJobCraftorTelemetry(),
  };
}

export function saveJobCraftorLocalAnalysis(
  input: AnalyzeJobCraftorInput,
  result: JobCraftorResult,
  meta: JobCraftorAnalysisMeta,
) {
  return saveJobCraftorHistoryEntry(input, result, meta);
}

export function recordJobCraftorLocalEvent(type: JobCraftorTelemetryEventType, detail: string) {
  return trackJobCraftorEvent(type, detail);
}

export function clearJobCraftorSavedHistory() {
  clearJobCraftorHistory();
}

export function clearJobCraftorDebugEvents() {
  clearJobCraftorTelemetry();
}

export type { JobCraftorHistoryEntry, JobCraftorTelemetryEvent, JobCraftorTelemetryEventType };
