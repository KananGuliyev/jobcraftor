const featureCards = [
  {
    title: "Decode the role",
    copy: "Translate a posting into the skills, signals, and expectations that actually matter.",
  },
  {
    title: "Find your blockers",
    copy: "See where your resume already fits and which gaps are most likely to hold you back.",
  },
  {
    title: "Get the plan",
    copy: "Walk away with resume upgrades, outreach copy, interview prompts, and a 7-day action plan.",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste the job posting",
    copy: "Drop in the role description or URL so JobCraftor has a concrete target to analyze.",
  },
  {
    number: "02",
    title: "Add your resume",
    copy: "Upload or paste your current resume so the app can compare your evidence against the role.",
  },
  {
    number: "03",
    title: "Get a tailored plan",
    copy: "Receive a focused dashboard with blockers, rewrites, outreach help, and next steps.",
  },
];

interface HeroProps {
  onPrimaryCta: () => void;
  onSecondaryCta: () => void;
}

export function Hero({ onPrimaryCta, onSecondaryCta }: HeroProps) {
  return (
    <div className="section-block" id="top">
      <section className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
        <div className="space-y-8">
          <div className="status-badge-info w-fit">
            Built for students and early-career applicants
          </div>

          <div className="space-y-5">
            <p className="eyebrow-label">JobCraftor</p>
            <h1 className="max-w-[10.5ch] font-display text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-sand sm:text-6xl xl:text-[5.7rem]">
              Turn any job posting into a personalized action plan.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-mist/72 sm:text-lg">
              JobCraftor helps internship and job seekers understand what a role is asking for, where their resume
              falls short, and how to close the gap fast with a credible, focused plan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onPrimaryCta} className="button-primary">
              Start with your posting
            </button>
            <button type="button" onClick={onSecondaryCta} className="button-secondary">
              Try instant demo
            </button>
          </div>

          <p className="max-w-xl text-sm leading-7 text-mist/60">
            Designed to turn application uncertainty into structured next steps, without making students sift through
            generic advice.
          </p>
        </div>

        <div className="premium-card relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-x-14 top-0 h-28 rounded-full bg-sky/[0.08] blur-3xl" />
          <div className="relative grid gap-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="section-label">Product preview</p>
                <h2 className="font-display text-[2rem] font-semibold tracking-[-0.02em] text-sand">
                  A dashboard that feels actionable
                </h2>
              </div>
              <span className="status-badge-success">
                Live workflow
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.72fr_1.28fr]">
              <div className="surface-muted p-5">
                <p className="section-label">Fit score</p>
                <p className="mt-3 font-display text-6xl font-semibold tracking-[-0.04em] text-sand">84</p>
                <p className="mt-2 text-sm leading-7 text-mist/68">Promising fit with a few proof gaps to tighten before you apply.</p>
              </div>

              <div className="grid gap-4">
                <div className="surface-subtle p-5">
                  <p className="section-label">Top blockers</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="status-badge-danger normal-case tracking-normal text-sm font-medium">
                      SQL proof
                    </span>
                    <span className="status-badge-warning normal-case tracking-normal text-sm font-medium">
                      Metrics storytelling
                    </span>
                    <span className="status-badge-info normal-case tracking-normal text-sm font-medium text-sand">
                      Product briefs
                    </span>
                  </div>
                </div>

                <div className="surface-subtle p-5">
                  <p className="section-label">7-day momentum</p>
                  <div className="mt-3 grid gap-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink/55 px-4 py-3 text-sm text-mist/78">
                      <span>Rewrite top bullets</span>
                      <span className="text-sunrise">Day 2</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink/55 px-4 py-3 text-sm text-mist/78">
                      <span>Create one proof artifact</span>
                      <span className="text-sky">Day 3</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink/55 px-4 py-3 text-sm text-mist/78">
                      <span>Practice interview stories</span>
                      <span className="text-mint">Day 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <article key={card.title} className="premium-card-interactive p-6">
            <p className="section-label">Feature</p>
            <h3 className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.02em] text-sand">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-mist/68">{card.copy}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.84fr_1.16fr] lg:items-start" id="how-it-works">
        <div className="space-y-4">
          <p className="section-label">How it works</p>
          <h2 className="max-w-[13ch] font-display text-4xl font-semibold leading-tight tracking-[-0.03em] text-sand sm:text-5xl">
            A faster way to get from confusion to application-ready.
          </h2>
          <p className="max-w-xl text-base leading-8 text-mist/70">
            The workflow is intentionally narrow: understand the role, compare it against your current story, and act
            on the gaps that matter most.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="premium-card-interactive p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] font-display text-lg font-semibold text-sand">
                {step.number}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.02em] text-sand">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mist/68">{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center" id="results-preview">
        <div className="space-y-4">
          <p className="section-label">Results preview</p>
          <h2 className="max-w-[12ch] font-display text-4xl font-semibold leading-tight tracking-[-0.03em] text-sand sm:text-5xl">
            A result that feels more like a strategy session than a score.
          </h2>
          <p className="max-w-xl text-base leading-8 text-mist/70">
            Students do not just need feedback. They need a plan they can execute this week. JobCraftor turns the
            analysis into concrete next steps across resume, outreach, and interview prep.
          </p>
          <p className="text-sm leading-7 text-mist/60">
            Built for students navigating internships, early-career roles, and applications that need to feel
            intentional from the first glance.
          </p>
        </div>

        <div className="premium-card overflow-hidden p-5 sm:p-6">
          <div className="grid gap-4 xl:grid-cols-[240px_1fr]">
            <div className="surface-muted p-5">
              <p className="section-label">Snapshot</p>
              <h3 className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] text-sand">82/100</h3>
              <p className="mt-3 text-sm leading-7 text-mist/70">Strong application potential if the resume tells a sharper metrics and execution story.</p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="surface-subtle p-5">
                  <p className="section-label">Resume improvements</p>
                  <ul className="mt-3 grid gap-2 text-sm leading-7 text-mist/70">
                    <li>Lead with quantified ownership</li>
                    <li>Mirror role language in top bullets</li>
                    <li>Add one artifact-backed proof point</li>
                  </ul>
                </div>
                <div className="surface-subtle p-5">
                  <p className="section-label">Interview prep</p>
                  <ul className="mt-3 grid gap-2 text-sm leading-7 text-mist/70">
                    <li>Ambiguous problem to execution</li>
                    <li>How you measure product impact</li>
                    <li>How you are closing current gaps</li>
                  </ul>
                </div>
              </div>

              <div className="surface-subtle p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="section-label">7-day action plan</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-sand">From insight to execution</h3>
                  </div>
                  <span className="status-badge-neutral">
                    Structured next steps
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="surface-muted px-4 py-4">
                    <p className="section-label">Day 1-2</p>
                    <p className="mt-2 text-sm leading-7 text-mist/76">Decode the role and rewrite the top section of the resume.</p>
                  </div>
                  <div className="surface-muted px-4 py-4">
                    <p className="section-label">Day 3-4</p>
                    <p className="mt-2 text-sm leading-7 text-mist/76">Create one proof artifact and sharpen your outreach story.</p>
                  </div>
                  <div className="surface-muted px-4 py-4">
                    <p className="section-label">Day 5-7</p>
                    <p className="mt-2 text-sm leading-7 text-mist/76">Practice interview stories and submit with a stronger narrative.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
