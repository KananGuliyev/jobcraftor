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

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadJobCraftorTelemetry() {
  if (!canUseStorage()) {
    return [] as JobCraftorTelemetryEvent[];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

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
  if (!canUseStorage()) {
    return [] as JobCraftorTelemetryEvent[];
  }

  const nextEvent: JobCraftorTelemetryEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    type,
    detail,
  };

  const nextEvents = [nextEvent, ...loadJobCraftorTelemetry()].slice(0, MAX_EVENTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));

  return nextEvents;
}

export function clearJobCraftorTelemetry() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
