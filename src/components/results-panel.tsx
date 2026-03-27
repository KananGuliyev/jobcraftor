import type { JobCraftorResult } from "@/types/jobcraftor";

interface ResultsPanelProps {
  result: JobCraftorResult;
}

function StrengthBadge({ strength }: { strength: "high" | "medium" | "low" }) {
  const label = strength === "high" ? "Highest priority" : strength === "medium" ? "Important" : "Helpful";
  const tone =
    strength === "high"
      ? "border-ember/40 bg-ember/10"
      : strength === "medium"
        ? "border-sunrise/40 bg-sunrise/10"
        : "border-sky/30 bg-sky/10";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] text-mist/75 ${tone}`}>
      {label}
    </span>
  );
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <div className="grid gap-5" id="dashboard">
      <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-sunrise/12 to-sky/10 p-6 shadow-soft">
        <div className="grid gap-4 xl:grid-cols-[260px_1fr] xl:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky/80">Fit analysis</p>
            <h2 className="font-display text-6xl font-semibold text-sand">{result.score}/100</h2>
            <p className="mt-2 text-base text-sand">{result.verdict}</p>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-mist/60">
              <span className="rounded-full border border-white/10 px-3 py-1">{result.roleTitle}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">{result.companyHint}</span>
            </div>
            <p className="max-w-3xl text-base leading-8 text-mist/75">{result.summary}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel-surface p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-sky/80">Role breakdown</p>
          <div className="mt-4 grid gap-3">
            {result.roleBreakdown.map((item) => (
              <div key={item.title} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <h3 className="font-display text-lg font-semibold text-sand">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-mist/75">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-surface p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-sky/80">Matched signals</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.matchedSkills.length > 0 ? (
              result.matchedSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-mint/25 bg-mint/10 px-4 py-2 text-sm text-sand">
                  {skill}
                </span>
              ))
            ) : (
              <span className="token">No strong overlap surfaced yet</span>
            )}
          </div>
          <p className="mt-4 text-sm leading-7 text-mist/70">
            These are the areas where the posting and your current resume already reinforce each other.
          </p>
        </article>

        <article className="panel-surface p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-sky/80">Quick wins</p>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/75">
            {result.quickWins.map((win) => (
              <li key={win}>{win}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4">
        <div className="space-y-1">
          <h3 className="font-display text-2xl font-semibold text-sand">Top 3 blockers</h3>
          <p className="section-copy">These are the highest-leverage gaps to address before or right after you apply.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {result.priorityGaps.map((gap) => (
            <article key={gap.title} className="panel-surface grid gap-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h4 className="font-display text-xl font-semibold text-sand">{gap.title}</h4>
                <StrengthBadge strength={gap.strength} />
              </div>
              <p className="text-sm leading-7 text-mist/75">{gap.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="panel-surface p-5">
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-semibold text-sand">Resume improvements</h3>
            <p className="section-copy">Use stronger framing so the resume reads like evidence, not effort.</p>
          </div>
          <div className="mt-5 grid gap-4">
            {result.rewrites.map((rewrite) => (
              <div key={rewrite.after} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-sky/80">Before</p>
                <p className="mt-2 text-sm leading-7 text-mist/75">{rewrite.before}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-sky/80">After</p>
                <p className="mt-2 text-sm leading-7 text-sand">{rewrite.after}</p>
                <p className="mt-4 text-sm leading-7 text-sky/80">{rewrite.why}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-surface p-5">
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-semibold text-sand">Networking message</h3>
            <p className="section-copy">A short outreach draft you can adapt for alumni, recruiters, or team members.</p>
          </div>
          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-8 text-mist/80">{result.networkingMessage}</p>
          </div>

          <div className="mt-5 space-y-1">
            <h3 className="font-display text-2xl font-semibold text-sand">Current proof points</h3>
            <p className="section-copy">Signals already present in the resume that you can emphasize more clearly.</p>
          </div>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/75">
            {result.proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="panel-surface p-5">
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-semibold text-sand">Interview questions</h3>
            <p className="section-copy">Practice the questions most likely to sharpen your candidacy.</p>
          </div>
          <div className="mt-5 grid gap-4">
            {result.interviewPrompts.map((prompt) => (
              <div key={prompt.question} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <h4 className="font-display text-lg font-semibold text-sand">{prompt.question}</h4>
                <p className="mt-2 text-sm leading-7 text-mist/75">{prompt.rationale}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-surface p-5">
          <div className="space-y-1">
            <h3 className="font-display text-2xl font-semibold text-sand">7-day action plan</h3>
            <p className="section-copy">A focused week from uncertainty to a stronger application package.</p>
          </div>
          <div className="mt-5 grid gap-4">
            {result.sevenDayPlan.map((day) => (
              <article key={day.day} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h4 className="font-display text-xl font-semibold text-sand">
                      Day {day.day}: {day.title}
                    </h4>
                    <p className="text-sm leading-7 text-mist/75">{day.goal}</p>
                  </div>
                  <span className="rounded-full bg-sunrise/15 px-3 py-1 text-xs uppercase tracking-[0.16em] text-sunrise">
                    Day {day.day}
                  </span>
                </div>
                <ul className="mt-4 grid gap-2 text-sm leading-7 text-mist/75">
                  {day.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
