"use client";

import type { BlockerItem, JobCraftorResult } from "@/types/jobcraftor";
import { ResultsSectionHeader, ResultsSectionIntro, ResultsSurfaceCard } from "./results-primitives";

interface ResultsPanelProps {
  result: JobCraftorResult;
  onCopyNetworking: () => void;
  onCopyInterviewPrep: () => void;
}

function priorityTone(priority: BlockerItem["priority"]) {
  if (priority === "high") return "status-badge-danger";
  if (priority === "medium") return "status-badge-warning";
  return "status-badge-info text-sand";
}

export function ResultsPanel({ result, onCopyNetworking, onCopyInterviewPrep }: ResultsPanelProps) {
  return (
    <div className="grid gap-8" id="dashboard">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-soft sm:p-7">
        <div className="grid gap-5 xl:grid-cols-[260px_1fr] xl:items-end">
          <div className="space-y-3">
            <p className="eyebrow-label">Overall fit</p>
            <h1 className="font-display text-6xl font-semibold tracking-[-0.05em] text-sand sm:text-7xl">{result.fitAnalysis.score}/100</h1>
            <p className="text-base text-sand">{result.fitAnalysis.verdict}</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-mist/60">
              <span className="status-badge-neutral">{result.roleTitle}</span>
              <span className="status-badge-neutral">{result.companyHint}</span>
            </div>
            <p className="max-w-4xl text-base leading-8 text-mist/72">{result.summary}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="premium-card p-5 sm:p-6">
          <ResultsSectionIntro
            eyebrow="Role priorities"
            title="What The Role Really Prioritizes"
            description="A quick read on the work, signals, and story areas that matter most for this application."
          />

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <ResultsSurfaceCard title="Key responsibilities">
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.roleBreakdown.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultsSurfaceCard>

            <ResultsSurfaceCard title="Key skills">
              <div className="mt-4 flex flex-wrap gap-2">
                {result.roleBreakdown.keySkills.map((skill) => (
                  <span key={skill} className="status-badge-success normal-case tracking-normal text-sm font-medium text-sand">
                    {skill}
                  </span>
                ))}
              </div>
            </ResultsSurfaceCard>

            <ResultsSurfaceCard title="What matters most">
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.roleBreakdown.whatMattersMost.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultsSurfaceCard>
          </div>
        </article>

        <article className="premium-card p-5 sm:p-6">
          <ResultsSectionIntro
            eyebrow="Where you fit"
            title="Current Fit"
            description="Where the application already feels credible and where it still needs stronger proof."
          />

          <div className="mt-6 grid gap-4">
            <ResultsSurfaceCard title="Strengths">
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.fitAnalysis.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultsSurfaceCard>

            <ResultsSurfaceCard title="Missing skills or gaps">
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.fitAnalysis.gaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ResultsSurfaceCard>
          </div>
        </article>
      </section>

      <section className="grid gap-5">
        <ResultsSectionIntro
          eyebrow="Biggest blockers"
          title="Top 3 Blockers"
          description="These are the issues most likely to weaken the application if you leave them untouched."
        />

        <div className="grid gap-4 xl:grid-cols-3">
          {result.blockers.map((blocker, index) => (
            <article key={blocker.title} className="premium-card p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="section-label">Priority {index + 1}</p>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-sand">{blocker.title}</h3>
                  </div>
                  <span className={priorityTone(blocker.priority)}>
                    {blocker.priority} priority
                  </span>
                </div>
                <p className="text-sm leading-7 text-mist/70">{blocker.whyItMatters}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <ResultsSectionIntro
          eyebrow="Action plan"
          title="7-Day Action Plan"
          description="A concrete week of steps to make the application sharper, more credible, and easier to defend."
        />

        <div className="grid gap-4 xl:grid-cols-2">
          {result.sevenDayPlan.map((day) => (
            <article key={day.day} className="premium-card p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="section-label">Day {day.day}</p>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-sand">{day.title}</h3>
                    <p className="text-sm leading-7 text-mist/68">{day.goal}</p>
                  </div>
                  <span className="status-badge-neutral">
                    Ready to execute
                  </span>
                </div>

                <div className="grid gap-3">
                  {day.tasks.map((task) => (
                    <div key={task} className="surface-subtle flex gap-3 px-4 py-3">
                      <span className="mt-1 h-4 w-4 rounded-[5px] border border-sunrise/55 bg-transparent" />
                      <p className="text-sm leading-7 text-mist/72">{task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="premium-card p-5 sm:p-6">
          <ResultsSectionIntro
            eyebrow="Resume upgrades"
            title="Resume Improvements"
            description="Sharper bullet framing plus role-specific keywords so the resume reads like evidence, not effort."
          />

          <div className="mt-6 grid gap-4">
            {result.resumeImprovements.rewrites.map((rewrite) => (
              <ResultsSurfaceCard key={rewrite.after}>
                <div className="grid gap-4 xl:grid-cols-2">
                  <div>
                    <p className="section-label">Before</p>
                    <p className="mt-2 text-sm leading-7 text-mist/70">{rewrite.before}</p>
                  </div>
                  <div>
                    <p className="section-label">After</p>
                    <p className="mt-2 text-sm leading-7 text-sand">{rewrite.after}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-sky/74">{rewrite.why}</p>
              </ResultsSurfaceCard>
            ))}
          </div>

          <div className="surface-muted mt-6 p-5">
            <p className="section-label">Keywords to mirror</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.resumeImprovements.keywordRecommendations.map((keyword) => (
                <span key={keyword} className="status-badge-neutral normal-case tracking-normal text-sm font-medium text-sand">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </article>

        <article className="grid gap-6">
          <div className="premium-card p-5 sm:p-6">
            <ResultsSectionHeader
              eyebrow="Outreach"
              title="Networking Message"
              description="A short outreach draft you can adapt for alumni, recruiters, or team members."
              action={
                <button type="button" onClick={onCopyNetworking} className="button-secondary print-hidden">
                  Copy outreach
                </button>
              }
            />

            <div className="surface-subtle mt-6 p-5">
              <p className="text-sm leading-8 text-mist/76">{result.networkingMessage}</p>
            </div>
          </div>

          <div className="premium-card p-5 sm:p-6">
            <ResultsSectionHeader
              eyebrow="Interview prep"
              title="Interview Prep"
              description="Likely questions plus the real evaluation signal behind each one."
              action={
                <button type="button" onClick={onCopyInterviewPrep} className="button-secondary print-hidden">
                  Copy questions
                </button>
              }
            />

            <div className="mt-6 grid gap-4">
              {result.interviewPrep.map((item) => (
                <ResultsSurfaceCard key={item.question}>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-sand">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-sky/74">What they are testing: {item.whatTheyAreTesting}</p>
                </ResultsSurfaceCard>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
