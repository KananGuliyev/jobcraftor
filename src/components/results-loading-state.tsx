export function ResultsLoadingState() {
  return (
    <div className="grid min-h-[720px] content-center gap-6 p-3">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-sky/80">Analyzing inputs</p>
        <h2 className="font-display text-4xl font-semibold text-sand sm:text-5xl">Building your full results dashboard</h2>
        <p className="max-w-2xl text-base leading-8 text-mist/75">
          JobCraftor is reading the role, mapping strengths and gaps, and assembling the dedicated dashboard from the
          server-side analysis engine.
        </p>
      </div>

      <div className="grid gap-4">
        <div className="h-40 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-[24px] border border-white/10 bg-white/5 [animation-delay:120ms]" />
          <div className="h-64 animate-pulse rounded-[24px] border border-white/10 bg-white/5 [animation-delay:240ms]" />
        </div>
        <div className="h-72 animate-pulse rounded-[28px] border border-white/10 bg-white/5 [animation-delay:320ms]" />
      </div>
    </div>
  );
}
