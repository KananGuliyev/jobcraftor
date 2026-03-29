export function ResultsLoadingState() {
  return (
    <div className="grid min-h-[720px] content-center gap-7 p-3">
      <div className="space-y-4">
        <p className="eyebrow-label">Building your plan</p>
        <h2 className="max-w-[12ch] font-display text-4xl font-semibold tracking-[-0.03em] text-sand sm:text-5xl">
          Building your personalized results dashboard
        </h2>
        <p className="max-w-2xl text-base leading-8 text-mist/70">
          JobCraftor is turning the posting and your background into a clearer fit read, a sharper priority order, and
          the next steps most likely to strengthen the application.
        </p>
        <p className="max-w-2xl text-sm leading-7 text-mist/60">
          If you need the fastest walkthrough for judging, the instant demo is always available from the main screen.
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
