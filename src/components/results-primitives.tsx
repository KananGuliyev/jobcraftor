"use client";

import type { ReactNode } from "react";

interface ResultsSectionIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

interface ResultsSectionHeaderProps extends ResultsSectionIntroProps {
  action?: ReactNode;
}

interface ResultsSurfaceCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ResultsSectionIntro({ eyebrow, title, description }: ResultsSectionIntroProps) {
  return (
    <div className="space-y-3">
      <p className="section-label">{eyebrow}</p>
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-sand sm:text-4xl">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-mist/68">{description}</p>
      </div>
    </div>
  );
}

export function ResultsSectionHeader({
  eyebrow,
  title,
  description,
  action,
}: ResultsSectionHeaderProps) {
  if (!action) {
    return <ResultsSectionIntro eyebrow={eyebrow} title={title} description={description} />;
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <ResultsSectionIntro eyebrow={eyebrow} title={title} description={description} />
      {action}
    </div>
  );
}

export function ResultsSurfaceCard({ title, action, children, className = "" }: ResultsSurfaceCardProps) {
  return (
    <div className={`surface-subtle p-5 ${className}`.trim()}>
      {title || action ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {title ? <h3 className="font-display text-xl font-semibold text-sand">{title}</h3> : <div />}
          {action}
        </div>
      ) : null}
      <div>{children}</div>
    </div>
  );
}
