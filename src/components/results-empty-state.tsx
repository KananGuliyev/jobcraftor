const previewItems = [
  "Role breakdown with responsibilities, skills, and what matters most",
  "Fit analysis with strengths, gaps, and prioritized blockers",
  "Resume upgrades, outreach copy, and interview prep in one place",
  "A day-by-day action plan that feels ready to execute",
];

export function ResultsEmptyState() {
  return (
    <div className="grid min-h-[720px] content-center gap-6 p-3">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-sky/80">Results dashboard</p>
        <h2 className="font-display text-4xl font-semibold text-sand sm:text-5xl">Your full JobCraftor dashboard appears here</h2>
        <p className="max-w-2xl text-base leading-8 text-mist/75">
          Once you generate a plan, this screen becomes the core wow moment: a dedicated results experience built for
          faster applications, better outreach, and stronger interview preparation.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {previewItems.map((item) => (
          <article key={item} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <h3 className="font-display text-xl font-semibold text-sand">{item}</h3>
            <p className="mt-2 text-sm leading-7 text-mist/70">
              Designed to feel polished, scannable, and demo-ready even before the live AI layer is wired in.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
