import {
  canUseBrowserStorage,
  clearStoredJson,
  createLocalRecordId,
  readStoredJson,
  writeStoredJson,
} from "./jobcraftor-browser-storage";

export type JobCraftorTelemetryEventType =
  | "generate_plan_clicked"
  | "analysis_failed"
  | "parsing_failed"
  | "demo_mode_used";

export interface JobCraftorTelemetryEvent {
  id: string;
  timestamp: string;
  type: JobCraftorTelemetryEventType;
  detail: string;
}

const STORAGE_KEY = "jobcraftor.telemetry.v1";
const MAX_EVENTS = 20;

export function loadJobCraftorTelemetry() {
  if (!canUseBrowserStorage()) {
    return [] as JobCraftorTelemetryEvent[];
  }

  const raw = readStoredJson(STORAGE_KEY);

  if (!raw) {
    return [] as JobCraftorTelemetryEvent[];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JobCraftorTelemetryEvent[]) : [];
  } catch {
    return [] as JobCraftorTelemetryEvent[];
  }
}

export function trackJobCraftorEvent(type: JobCraftorTelemetryEventType, detail: string) {
  if (!canUseBrowserStorage()) {
    return [] as JobCraftorTelemetryEvent[];
  }

  const nextEvent: JobCraftorTelemetryEvent = {
    id: createLocalRecordId(),
    timestamp: new Date().toISOString(),
    type,
    detail,
  };

  const nextEvents = [nextEvent, ...loadJobCraftorTelemetry()].slice(0, MAX_EVENTS);
  writeStoredJson(STORAGE_KEY, nextEvents);

  return nextEvents;
}

export function clearJobCraftorTelemetry() {
  if (!canUseBrowserStorage()) {
    return;
  }

  clearStoredJson(STORAGE_KEY);
}
