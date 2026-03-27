"use client";

import type { BlockerItem, JobCraftorResult } from "@/types/jobcraftor";

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

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="section-label">{eyebrow}</p>
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-sand sm:text-4xl">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-mist/68">{description}</p>
      </div>
    </div>
  );
}

export function ResultsPanel({ result, onCopyNetworking, onCopyInterviewPrep }: ResultsPanelProps) {
  return (
    <div className="grid gap-8" id="dashboard">
      <section className="rounded-[32px] border border-white/10 bg-white/[0.045] p-6 shadow-soft sm:p-7">
        <div className="grid gap-5 xl:grid-cols-[260px_1fr] xl:items-end">
          <div className="space-y-3">
            <p className="eyebrow-label">Fit analysis</p>
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
          <SectionIntro
            eyebrow="Role breakdown"
            title="Role Breakdown"
            description="A quick read on the work this role expects, the skills that matter most, and where to focus your story."
          />

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            <div className="surface-subtle p-5">
              <h3 className="font-display text-xl font-semibold text-sand">Key responsibilities</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.roleBreakdown.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="surface-subtle p-5">
              <h3 className="font-display text-xl font-semibold text-sand">Key skills</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.roleBreakdown.keySkills.map((skill) => (
                  <span key={skill} className="status-badge-success normal-case tracking-normal text-sm font-medium text-sand">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="surface-subtle p-5">
              <h3 className="font-display text-xl font-semibold text-sand">What matters most</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.roleBreakdown.whatMattersMost.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="premium-card p-5 sm:p-6">
          <SectionIntro
            eyebrow="Fit analysis"
            title="Fit Analysis"
            description="Where your profile is already credible and where the current application still needs stronger proof."
          />

          <div className="mt-6 grid gap-4">
            <div className="surface-subtle p-5">
              <h3 className="font-display text-xl font-semibold text-sand">Strengths</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.fitAnalysis.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="surface-subtle p-5">
              <h3 className="font-display text-xl font-semibold text-sand">Missing skills or gaps</h3>
              <ul className="mt-4 grid gap-3 text-sm leading-7 text-mist/70">
                {result.fitAnalysis.gaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5">
        <SectionIntro
          eyebrow="Biggest blockers"
          title="Top 3 Blockers"
          description="These are the most important concerns to resolve before or immediately after applying."
        />

        <div className="grid gap-4 xl:grid-cols-3">
          {result.blockers.map((blocker, index) => (
            <article key={blocker.title} className="premium-card p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="section-label">Blocker {index + 1}</p>
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
        <SectionIntro
          eyebrow="Action plan"
          title="7-Day Action Plan"
          description="A concrete week of steps designed to make the application sharper, more credible, and easier to defend."
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
                    Checklist-ready
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
          <SectionIntro
            eyebrow="Resume improvements"
            title="Resume Improvements"
            description="Sharper bullet framing plus role-specific keywords to help the resume read like evidence, not effort."
          />

          <div className="mt-6 grid gap-4">
            {result.resumeImprovements.rewrites.map((rewrite) => (
              <div key={rewrite.after} className="surface-subtle p-5">
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
              </div>
            ))}
          </div>

          <div className="surface-muted mt-6 p-5">
            <p className="section-label">Keyword recommendations</p>
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionIntro
                eyebrow="Networking"
                title="Networking Message"
                description="A short outreach draft you can adapt for alumni, recruiters, or team members."
              />
              <button type="button" onClick={onCopyNetworking} className="button-secondary print-hidden">
                Copy message
              </button>
            </div>

            <div className="surface-subtle mt-6 p-5">
              <p className="text-sm leading-8 text-mist/76">{result.networkingMessage}</p>
            </div>
          </div>

          <div className="premium-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <SectionIntro
                eyebrow="Interview prep"
                title="Interview Prep"
                description="Likely questions plus the actual evaluation signal behind each one."
              />
              <button type="button" onClick={onCopyInterviewPrep} className="button-secondary print-hidden">
                Copy questions
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {result.interviewPrep.map((item) => (
                <div key={item.question} className="surface-subtle p-5">
                  <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-sand">{item.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-sky/74">What the interviewer is testing: {item.whatTheyAreTesting}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
