"use client";

import type { JobCraftorHistoryEntry } from "@/types/jobcraftor";

interface HistoryPanelProps {
  entries: JobCraftorHistoryEntry[];
  onOpen: (entry: JobCraftorHistoryEntry) => void;
  onClear: () => void;
}

function formatSavedAt(value: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function sourceLabel(source: JobCraftorHistoryEntry["meta"]["source"]) {
  if (source === "demo") return "Demo";
  if (source === "ai") return "AI";
  return "Fallback";
}

export function HistoryPanel({ entries, onOpen, onClear }: HistoryPanelProps) {
  return (
    <section className="premium-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <p className="eyebrow-label">Saved history</p>
          <h2 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-sand">
            Revisit recent analyses
          </h2>
          <p className="section-subtitle max-w-2xl">
            JobCraftor saves recent dashboards in this browser so you can reopen them quickly during a live demo or
            compare a few applications without signing in.
          </p>
        </div>
        {entries.length > 0 ? (
          <button type="button" onClick={onClear} className="button-secondary self-start">
            Clear history
          </button>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 surface-subtle p-5">
          <p className="font-display text-xl font-semibold text-sand">No saved analyses yet</p>
          <p className="mt-2 text-sm leading-7 text-mist/68">
            Generate a plan or launch the instant demo, and JobCraftor will keep the latest dashboards here for quick
            revisit.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpen(entry)}
              className="premium-card-interactive grid gap-4 p-5 text-left"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="status-badge-neutral">{sourceLabel(entry.meta.source)}</span>
                    <span className="text-xs uppercase tracking-[0.18em] text-mist/55">
                      Saved {formatSavedAt(entry.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-sand">
                    {entry.result.roleTitle}
                  </h3>
                  <p className="text-sm leading-7 text-mist/70">{entry.result.companyHint}</p>
                </div>
                <span className="status-badge-success">Open</span>
              </div>

              <p className="text-sm leading-7 text-mist/68">{entry.result.summary}</p>

              <div className="flex flex-wrap gap-2">
                {entry.result.resumeImprovements.keywordRecommendations.slice(0, 4).map((keyword) => (
                  <span
                    key={keyword}
                    className="status-badge-neutral normal-case tracking-normal text-sm font-medium text-sand"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
