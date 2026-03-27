"use client";

import type { JobCraftorTelemetryEvent } from "@/lib/jobcraftor-telemetry";
import { CollectionPanel, CollectionPanelEmptyState } from "./collection-panel";

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
    <CollectionPanel
      eyebrow="Internal visibility"
      title="Recent debug events"
      description="Lightweight local logging for demo reliability. This tracks generate clicks, demo launches, and recent analysis or parsing failures in this browser only."
      clearLabel={events.length > 0 ? "Clear log" : undefined}
      onClear={events.length > 0 ? onClear : undefined}
    >
      {events.length === 0 ? (
        <CollectionPanelEmptyState
          title="No debug events yet"
          description="Generate a plan, try the demo, or upload a file and JobCraftor will log the latest internal events here."
        />
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
    </CollectionPanel>
  );
}
