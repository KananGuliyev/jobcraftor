import type {
  AnalyzeJobCraftorInput,
  GapItem,
  GapStrength,
  JobCraftorResult,
  PlanDay,
  ResumeRewrite,
  RoleBreakdownItem,
} from "@/types/jobcraftor";

const roleSignals = [
  {
    title: "SQL",
    aliases: ["sql", "database", "query", "queries"],
    detail: "The role expects evidence that you can interrogate data and support decisions with analysis.",
  },
  {
    title: "Product analytics",
    aliases: ["analytics", "dashboard", "metrics", "conversion", "engagement", "retention"],
    detail: "You will likely be asked to define success metrics and explain product impact.",
  },
  {
    title: "User research",
    aliases: ["interview", "interviews", "research", "insights", "synthesized"],
    detail: "The posting values translating user signals into clear product or operational actions.",
  },
  {
    title: "Product briefs",
    aliases: ["brief", "briefs", "prd", "spec", "requirements"],
    detail: "Structured writing is part of the job, not just a support skill.",
  },
  {
    title: "Experimentation",
    aliases: ["experiment", "testing", "a/b", "hypothesis"],
    detail: "The company wants someone who can improve outcomes through measured iteration.",
  },
  {
    title: "Cross-functional execution",
    aliases: ["engineering", "design", "cross-functional", "stakeholders", "delivery"],
    detail: "Success depends on coordinating work across multiple teams.",
  },
  {
    title: "Career-tech motivation",
    aliases: ["career", "resume", "interview", "education", "marketplace"],
    detail: "Mission alignment will help your application feel intentional instead of generic.",
  },
];

const stopWords = new Set([
  "their",
  "about",
  "while",
  "where",
  "there",
  "would",
  "should",
  "could",
  "which",
  "student",
  "intern",
  "role",
  "team",
  "with",
  "from",
  "that",
  "this",
  "into",
  "will",
  "have",
  "your",
  "they",
  "them",
  "what",
  "when",
  "were",
  "been",
]);

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ");
}

function hasSignal(text: string, aliases: string[]) {
  return aliases.some((alias) => text.includes(alias));
}

function strengthFromIndex(index: number): GapStrength {
  if (index === 0) return "high";
  if (index < 3) return "medium";
  return "low";
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function extractRoleTitle(jobPostingText: string) {
  const firstLine = jobPostingText
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return firstLine && firstLine.length < 70 ? firstLine : "Target role";
}

function formatDeadline(deadline?: string) {
  if (!deadline) {
    return null;
  }

  const parsed = new Date(`${deadline}T12:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return deadline;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractCompanyHint(jobPostingUrl?: string) {
  if (!jobPostingUrl) {
    return "Target company";
  }

  try {
    const hostname = new URL(jobPostingUrl).hostname.replace(/^www\./, "");
    const label = hostname.split(".")[0] ?? hostname;
    return toTitleCase(label.replace(/[-_]/g, " "));
  } catch {
    return "Target company";
  }
}

function buildRoleBreakdown(jobPostingText: string): RoleBreakdownItem[] {
  const cleanJob = normalize(jobPostingText);

  const explicit = roleSignals
    .filter((signal) => hasSignal(cleanJob, signal.aliases))
    .slice(0, 4)
    .map((signal) => ({
      title: signal.title,
      detail: signal.detail,
    }));

  if (explicit.length >= 3) {
    return explicit;
  }

  const fallback = [
    {
      title: "Execution support",
      detail: "The role needs someone who can move from ambiguity to a clear, organized plan.",
    },
    {
      title: "Communication",
      detail: "Written synthesis and concise updates will likely matter as much as raw analysis.",
    },
    {
      title: "Outcome focus",
      detail: "You will need to connect your work to measurable impact, not just activity.",
    },
  ];

  return [...explicit, ...fallback].slice(0, 4);
}

function inferKeywordGaps(jobPosting: string, resume: string): GapItem[] {
  const roleWords = normalize(jobPosting)
    .split(/\s+/)
    .filter((word) => word.length > 4 && !stopWords.has(word));
  const resumeText = normalize(resume);

  return Array.from(new Set(roleWords))
    .filter((word) => !resumeText.includes(word))
    .slice(0, 3)
    .map((word, index) => ({
      title: toTitleCase(word),
      detail: "This role language shows up more strongly in the posting than in your current resume story.",
      strength: strengthFromIndex(index),
    }));
}

function getPriorityGaps(jobPosting: string, resume: string): GapItem[] {
  const cleanJob = normalize(jobPosting);
  const cleanResume = normalize(resume);

  const explicit = roleSignals
    .filter((signal) => hasSignal(cleanJob, signal.aliases) && !hasSignal(cleanResume, signal.aliases))
    .map((signal, index) => ({
      title: signal.title,
      detail: signal.detail,
      strength: strengthFromIndex(index),
    }));

  if (explicit.length >= 3) {
    return explicit.slice(0, 3);
  }

  return [...explicit, ...inferKeywordGaps(jobPosting, resume)].slice(0, 3);
}

function getMatchedSkills(jobPosting: string, resume: string) {
  const cleanJob = normalize(jobPosting);
  const cleanResume = normalize(resume);

  return roleSignals
    .filter((signal) => hasSignal(cleanJob, signal.aliases) && hasSignal(cleanResume, signal.aliases))
    .map((signal) => signal.title)
    .slice(0, 5);
}

function getProofPoints(resume: string) {
  const bullets = resume
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"))
    .slice(0, 4);

  if (bullets.length === 0) {
    return [
      "Add stronger bullets with metrics, ownership, and concrete project outcomes.",
      "Lead with one project or internship that most closely matches the role.",
    ];
  }

  return bullets.map((bullet) => bullet.replace(/^-+\s*/, ""));
}

function getRewrites(priorityGaps: GapItem[]): ResumeRewrite[] {
  const templates: ResumeRewrite[] = [
    {
      before: "Helped improve a student application workflow.",
      after:
        "Led student interviews and workflow analysis to identify application drop-off, then prioritized changes that improved completion rate.",
      why: "This version shows ownership, evidence, and user-centered decision making.",
    },
    {
      before: "Worked with stakeholders on product updates.",
      after:
        "Partnered with design and engineering to scope a release plan, define success metrics, and align stakeholders on launch priorities.",
      why: "This sounds like execution leadership instead of generic collaboration.",
    },
    {
      before: "Built an interview prep dashboard.",
      after:
        "Built a React dashboard for interview-prep readiness that surfaced progress trends, follow-up actions, and coaching signals for students.",
      why: "This ties the project to a user problem and a relevant outcome.",
    },
  ];

  return templates.map((template, index) => ({
    ...template,
    why:
      index < priorityGaps.length
        ? `${template.why} It also helps cover the ${priorityGaps[index].title.toLowerCase()} gap.`
        : template.why,
  }));
}

function getInterviewPrompts(priorityGaps: GapItem[], matchedSkills: string[]) {
  return [
    {
      question: "Tell me about a time you turned an ambiguous problem into a concrete execution plan.",
      rationale: "This role values structured thinking when goals are still fuzzy.",
    },
    {
      question: "How would you know whether onboarding or engagement improved after a product change?",
      rationale: "The posting suggests that metrics literacy matters.",
    },
    {
      question: priorityGaps[0]
        ? `How are you actively building confidence in ${priorityGaps[0].title.toLowerCase()}?`
        : "What capability are you trying to strengthen most right now, and how?",
      rationale: "A strong growth answer can reduce concern about your biggest blocker.",
    },
    {
      question: matchedSkills[0]
        ? `What is your best example of ${matchedSkills[0].toLowerCase()} driving a better outcome?`
        : "What experience best proves you can succeed in this role?",
      rationale: "Guide the interview toward your strongest evidence early.",
    },
  ];
}

function getSevenDayPlan(priorityGaps: GapItem[], matchedSkills: string[], deadline?: string): PlanDay[] {
  const primaryGap = priorityGaps[0]?.title ?? "role-specific proof";
  const topStrength = matchedSkills[0] ?? "cross-functional execution";
  const formattedDeadline = formatDeadline(deadline);

  return [
    {
      day: 1,
      title: "Decode the role",
      goal: "Turn the posting into a scorecard you can act on immediately.",
      tasks: [
        "Highlight the top responsibilities, metrics, and role language from the posting.",
        `Mark ${primaryGap.toLowerCase()} as the main blocker to close before interviews.`,
        `Pick ${topStrength.toLowerCase()} as the strength you want to lead with in every artifact.`,
      ],
    },
    {
      day: 2,
      title: "Rewrite the resume",
      goal: "Make your best evidence obvious in the first recruiter scan.",
      tasks: [
        "Rewrite the top three bullets using ownership, evidence, and outcomes.",
        "Move the most relevant internship, project, or leadership proof higher on the page.",
        `Add one line that shows momentum toward ${primaryGap.toLowerCase()}.`,
      ],
    },
    {
      day: 3,
      title: "Create missing proof",
      goal: "Build one lightweight artifact that closes your biggest gap.",
      tasks: [
        `Draft a mini case study, metrics review, or project add-on tied to ${primaryGap.toLowerCase()}.`,
        "Capture one screenshot, chart, or note you can talk through in interviews.",
        "Turn the artifact into a concise portfolio blurb or LinkedIn talking point.",
      ],
    },
    {
      day: 4,
      title: "Sharpen the application package",
      goal: "Align your resume, outreach, and story around one clear message.",
      tasks: [
        "Write a short outreach note or cover letter opener tailored to the company mission.",
        "Mirror the job language in your headline, top bullets, and project framing.",
        "Prepare a thirty-second answer to why this team and why now.",
        formattedDeadline ? `Set your application package to final by ${formattedDeadline}.` : "Choose a target submit date and work backward from it.",
      ],
    },
    {
      day: 5,
      title: "Practice interview stories",
      goal: "Defend your fit with examples, not generalities.",
      tasks: [
        `Prepare three STAR stories, especially one that proves ${topStrength.toLowerCase()}.`,
        `Practice your answer for how you are closing the ${primaryGap.toLowerCase()} gap.`,
        "Rehearse explaining one metric, one tradeoff, and one user insight.",
      ],
    },
    {
      day: 6,
      title: "Mock and refine",
      goal: "Stress-test the story before you submit or interview.",
      tasks: [
        "Run a twenty-minute mock interview with a friend, mentor, or club leader.",
        "Ask what sounded generic, unsupported, or too broad.",
        "Revise your opening pitch and weakest story right after the mock.",
      ],
    },
    {
      day: 7,
      title: "Launch confidently",
      goal: "Submit a tighter application and keep the momentum going.",
      tasks: [
        "Check formatting, links, dates, and company-specific language one last time.",
        "Submit the application and save the role notes for follow-up prep.",
        formattedDeadline
          ? `Submit before ${formattedDeadline} and schedule a short follow-up prep block three days later.`
          : "Schedule a short review in three days to prepare for recruiter outreach.",
      ],
    },
  ];
}

function getNetworkingMessage(companyHint: string, roleTitle: string, topStrength: string, topGap: string) {
  return `Hi, I’m applying for the ${roleTitle} role at ${companyHint} and your team’s blend of execution and user impact stood out to me. I’ve already built experience around ${topStrength.toLowerCase()}, and I’m actively strengthening ${topGap.toLowerCase()} through targeted project work. If you have any advice on what separates strong candidates for this role, I’d love to learn from your perspective.`;
}

export function analyzeJobCraftor(input: AnalyzeJobCraftorInput): JobCraftorResult {
  const jobPostingText = input.jobPostingText.trim() || `Role sourced from ${input.jobPostingUrl ?? "a shared link"}`;
  const resumeText = input.resumeText.trim();
  const targetRole = input.targetRole?.trim();
  const formattedDeadline = formatDeadline(input.deadline?.trim());

  const matchedSkills = getMatchedSkills(jobPostingText, resumeText);
  const priorityGaps = getPriorityGaps(jobPostingText, resumeText);
  const proofPoints = getProofPoints(resumeText);
  const rewrites = getRewrites(priorityGaps);
  const interviewPrompts = getInterviewPrompts(priorityGaps, matchedSkills);
  const sevenDayPlan = getSevenDayPlan(priorityGaps, matchedSkills, input.deadline);
  const roleBreakdown = buildRoleBreakdown(jobPostingText);
  const roleTitle = targetRole || extractRoleTitle(jobPostingText);
  const companyHint = extractCompanyHint(input.jobPostingUrl);

  const score = Math.max(
    42,
    Math.min(94, 54 + matchedSkills.length * 8 - priorityGaps.filter((gap) => gap.strength === "high").length * 6),
  );

  const verdict =
    score >= 80
      ? "High fit with a few polish opportunities"
      : score >= 68
        ? "Promising fit with targeted gaps"
        : "Early fit that needs sharper positioning";

  const summary =
    matchedSkills.length >= priorityGaps.length
      ? "Your background already overlaps with the role. The highest-leverage move is making that overlap more specific and easier to spot."
      : "You have enough raw signal to apply, but you need tighter proof and a more role-specific story around the biggest gaps.";

  const summaryWithContext = [
    summary,
    targetRole ? `The plan is tuned toward the ${targetRole} path.` : null,
    formattedDeadline ? `Your application deadline is treated as ${formattedDeadline}, so the week plan is framed around that timeline.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    roleTitle,
    companyHint,
    score,
    verdict,
    summary: summaryWithContext,
    roleBreakdown,
    matchedSkills,
    priorityGaps,
    quickWins: [
      "Tailor the top third of the resume to the exact language of the role.",
      "Replace generic collaboration phrases with ownership, evidence, and outcomes.",
      formattedDeadline
        ? `Work backward from ${formattedDeadline} so your strongest proof is ready before you submit.`
        : "Bring one role-relevant artifact or metric into your interview prep.",
    ],
    proofPoints,
    rewrites,
    networkingMessage: getNetworkingMessage(
      companyHint,
      roleTitle,
      matchedSkills[0] ?? "cross-functional execution",
      priorityGaps[0]?.title ?? "role-specific proof",
    ),
    interviewPrompts,
    sevenDayPlan,
  };
}
