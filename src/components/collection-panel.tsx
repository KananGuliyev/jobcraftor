"use client";

import type { ReactNode } from "react";

interface CollectionPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  clearLabel?: string;
  onClear?: () => void;
  children: ReactNode;
}

interface CollectionPanelEmptyStateProps {
  title: string;
  description: string;
}

export function CollectionPanel({
  eyebrow,
  title,
  description,
  clearLabel,
  onClear,
  children,
}: CollectionPanelProps) {
  return (
    <section className="premium-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <p className="eyebrow-label">{eyebrow}</p>
          <h2 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-sand">{title}</h2>
          <p className="section-subtitle max-w-2xl">{description}</p>
        </div>
        {clearLabel && onClear ? (
          <button type="button" onClick={onClear} className="button-secondary self-start">
            {clearLabel}
          </button>
        ) : null}
      </div>

      {children}
    </section>
  );
}

export function CollectionPanelEmptyState({ title, description }: CollectionPanelEmptyStateProps) {
  return (
    <div className="mt-6 surface-subtle p-5">
      <p className="font-display text-xl font-semibold text-sand">{title}</p>
      <p className="mt-2 text-sm leading-7 text-mist/68">{description}</p>
    </div>
  );
}
