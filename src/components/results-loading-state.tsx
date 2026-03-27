export function ResultsLoadingState() {
  return (
    <div className="grid min-h-[720px] content-center gap-7 p-3">
      <div className="space-y-4">
        <p className="eyebrow-label">Building your plan</p>
        <h2 className="max-w-[12ch] font-display text-4xl font-semibold tracking-[-0.03em] text-sand sm:text-5xl">
          Preparing your full results dashboard
        </h2>
        <p className="max-w-2xl text-base leading-8 text-mist/70">
          JobCraftor is reading the role, comparing it against your resume, and assembling the dashboard with fit,
          blockers, and next steps.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="skeleton-block h-44 rounded-[28px]" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="skeleton-block h-72 [animation-delay:120ms]" />
          <div className="skeleton-block h-72 [animation-delay:240ms]" />
        </div>
        <div className="skeleton-block h-80 rounded-[28px] [animation-delay:320ms]" />
      </div>
    </div>
  );
}
