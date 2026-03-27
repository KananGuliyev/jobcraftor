const previewItems = [
  "Role breakdown for what the team actually wants",
  "Fit score with clear blockers and quick wins",
  "Resume rewrites plus a networking message draft",
  "Interview prompts and a seven-day action plan",
];

export function ResultsEmptyState() {
  return (
    <div className="grid h-full min-h-[920px] content-center gap-6 p-3">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-sky/80">Results dashboard</p>
        <h2 className="font-display text-4xl font-semibold text-sand">Your personalized execution plan appears here</h2>
        <p className="max-w-2xl text-base leading-8 text-mist/75">
          Once you analyze a role, JobCraftor will translate the posting and resume into a focused dashboard built
          for better applications, better outreach, and better interview prep.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {previewItems.map((item) => (
          <article key={item} className="panel-surface p-5">
            <h3 className="font-display text-xl font-semibold text-sand">{item}</h3>
            <p className="mt-2 text-sm leading-7 text-mist/70">
              Designed to feel demo-ready from the first pass, even before the live AI layer is wired in.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
