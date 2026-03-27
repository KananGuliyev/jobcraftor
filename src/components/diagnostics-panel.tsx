"use client";

import type { JobCraftorTelemetryEvent } from "@/lib/jobcraftor-telemetry";

interface DiagnosticsPanelProps {
  events: JobCraftorTelemetryEvent[];
  onClear: () => void;
}

function formatTimestamp(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function labelForType(type: JobCraftorTelemetryEvent["type"]) {
  if (type === "generate_plan_clicked") return "Generate click";
  if (type === "analysis_failed") return "Analysis failure";
  if (type === "parsing_failed") return "Parsing failure";
  return "Demo mode";
}

function badgeClass(type: JobCraftorTelemetryEvent["type"]) {
  if (type === "analysis_failed" || type === "parsing_failed") {
    return "status-badge-danger";
  }

  if (type === "demo_mode_used") {
    return "status-badge-success";
  }

  return "status-badge-neutral";
}

export function DiagnosticsPanel({ events, onClear }: DiagnosticsPanelProps) {
  return (
    <section className="premium-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <p className="eyebrow-label">Internal visibility</p>
          <h2 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-sand">
            Recent debug events
          </h2>
          <p className="section-subtitle max-w-2xl">
            Lightweight local logging for demo reliability. This tracks generate clicks, demo launches, and recent
            analysis or parsing failures in this browser only.
          </p>
        </div>
        {events.length > 0 ? (
          <button type="button" onClick={onClear} className="button-secondary self-start">
            Clear log
          </button>
        ) : null}
      </div>

      {events.length === 0 ? (
        <div className="mt-6 surface-subtle p-5">
          <p className="font-display text-xl font-semibold text-sand">No debug events yet</p>
          <p className="mt-2 text-sm leading-7 text-mist/68">
            Generate a plan, try the demo, or upload a file and JobCraftor will log the latest internal events here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {events.map((event) => (
            <article key={event.id} className="surface-subtle p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <span className={badgeClass(event.type)}>{labelForType(event.type)}</span>
                  <p className="text-sm leading-7 text-mist/72">{event.detail}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.16em] text-mist/55">{formatTimestamp(event.timestamp)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
