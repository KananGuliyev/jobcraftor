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
    <div className="space-y-3.5">
      <p className="section-label">{eyebrow}</p>
      <div className="space-y-2.5">
        <h2 className="font-display text-[2.05rem] font-semibold tracking-[-0.03em] text-sand sm:text-[2.5rem]">
          {title}
        </h2>
        <p className="max-w-[60ch] text-sm leading-7 text-mist/66 sm:text-[15px]">{description}</p>
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
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <ResultsSectionIntro eyebrow={eyebrow} title={title} description={description} />
      <div className="print-hidden md:pt-1">{action}</div>
    </div>
  );
}

export function ResultsSurfaceCard({ title, action, children, className = "" }: ResultsSurfaceCardProps) {
  return (
    <div className={`surface-subtle p-5 sm:p-6 ${className}`.trim()}>
      {title || action ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {title ? <h3 className="font-display text-[1.35rem] font-semibold tracking-[-0.02em] text-sand">{title}</h3> : <div />}
          {action}
        </div>
      ) : null}
      <div className={title || action ? "mt-4" : ""}>{children}</div>
    </div>
  );
}
