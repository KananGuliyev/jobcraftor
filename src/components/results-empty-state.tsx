const previewItems = [
  "Role breakdown with responsibilities, skills, and what matters most",
  "Fit analysis with strengths, gaps, and prioritized blockers",
  "Resume upgrades, outreach copy, and interview prep in one place",
  "A day-by-day action plan that feels ready to execute",
];

export function ResultsEmptyState() {
  return (
    <div className="grid min-h-[720px] content-center gap-7 p-3">
      <div className="space-y-4">
        <p className="eyebrow-label">Results dashboard</p>
        <h2 className="max-w-[12ch] font-display text-4xl font-semibold tracking-[-0.03em] text-sand sm:text-5xl">
          Your full application plan appears here
        </h2>
        <p className="max-w-2xl text-base leading-8 text-mist/70">
          Generate a plan or launch the instant demo to open the main JobCraftor moment: a dedicated dashboard built
          for faster applications, sharper outreach, and stronger interview prep.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {previewItems.map((item, index) => (
          <article key={item} className="premium-card-interactive p-5">
            <p className="section-label">Preview {index + 1}</p>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-sand">{item}</h3>
            <p className="mt-2 text-sm leading-7 text-mist/68">
              Designed to feel polished, scannable, and easy to understand in under a minute.
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
