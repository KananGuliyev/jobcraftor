export function ResultsLoadingState() {
  return (
    <div className="grid h-full min-h-[920px] content-center gap-6 p-3">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-sky/80">Analyzing inputs</p>
        <h2 className="font-display text-4xl font-semibold text-sand">Mapping strengths, blockers, and next steps</h2>
        <p className="max-w-2xl text-base leading-8 text-mist/75">
          JobCraftor is reading the role, checking your evidence, and assembling the first-pass dashboard from the
          mock server route.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-32 animate-pulse rounded-[24px] border border-white/10 bg-white/5" />
        <div className="h-32 animate-pulse rounded-[24px] border border-white/10 bg-white/5 [animation-delay:120ms]" />
        <div className="h-32 animate-pulse rounded-[24px] border border-white/10 bg-white/5 [animation-delay:240ms]" />
      </div>
    </div>
  );
}
