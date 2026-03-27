import type {
  AnalyzeJobCraftorInput,
  BlockerItem,
  GapItem,
  GapStrength,
  InterviewPrepItem,
  JobCraftorResult,
  PlanDay,
  ResumeImprovements,
  ResumeRewrite,
  RoleBreakdownSection,
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

function extractResponsibilities(jobPostingText: string) {
  const lines = jobPostingText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-+\s*/, ""))
    .slice(0, 4);

  if (bullets.length >= 3) {
    return bullets;
  }

  return [
    "Translate the posting into a clear role scorecard before applying.",
    "Show concrete proof for the most important work this team expects.",
    "Frame your story around impact, not just participation.",
  ];
}

function getRoleKeywords(jobPostingText: string) {
  return Array.from(
    new Set(
      normalize(jobPostingText)
        .split(/\s+/)
        .filter((word) => word.length > 4 && !stopWords.has(word)),
    ),
  );
}

function inferKeywordGaps(jobPosting: string, resume: string): GapItem[] {
  const roleWords = getRoleKeywords(jobPosting);
  const resumeText = normalize(resume);

  return roleWords
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

  const combined = [...explicit, ...inferKeywordGaps(jobPosting, resume)].slice(0, 3);

  if (combined.length > 0) {
    return combined;
  }

  return [
    {
      title: "Role-specific proof",
      detail: "Your application needs one clearer piece of evidence that maps directly to the job's highest-priority work.",
      strength: "high",
    },
    {
      title: "Outcome framing",
      detail: "Recruiters will look for metrics, ownership, and evidence of impact rather than generic responsibility descriptions.",
      strength: "medium",
    },
    {
      title: "Focused positioning",
      detail: "The story needs to feel tailored to this role instead of broad enough to fit any application.",
      strength: "low",
    },
  ];
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

function buildRoleBreakdown(jobPostingText: string, matchedSkills: string[], gaps: GapItem[]): RoleBreakdownSection {
  const cleanJob = normalize(jobPostingText);
  const responsibilities = extractResponsibilities(jobPostingText);

  const explicitSkills = roleSignals
    .filter((signal) => hasSignal(cleanJob, signal.aliases))
    .map((signal) => signal.title)
    .slice(0, 5);

  const fallbackSkills = getRoleKeywords(jobPostingText).slice(0, 5).map(toTitleCase);

  const keySkills = (explicitSkills.length > 0 ? explicitSkills : fallbackSkills).slice(0, 5);

  const whatMattersMost = [
    matchedSkills[0]
      ? `Lead with ${matchedSkills[0].toLowerCase()} because it is already supported by your background.`
      : "Lead with the strongest evidence you already have and make it easy to spot.",
    gaps[0]
      ? `Close the ${gaps[0].title.toLowerCase()} gap first because it is most likely to create recruiter hesitation.`
      : "Focus on clarity, relevance, and proof instead of trying to cover everything at once.",
    "Use metrics, ownership, and cross-functional context to make your story feel more credible.",
  ];

  return {
    responsibilities,
    keySkills,
    whatMattersMost,
  };
}

function buildStrengths(matchedSkills: string[], proofPoints: string[]) {
  const strengths = matchedSkills.map((skill) => `You already show overlap in ${skill.toLowerCase()}.`);
  const proofBased = proofPoints.slice(0, 2).map((point) => `Resume evidence: ${point}`);

  return [...strengths, ...proofBased].slice(0, 4).filter(Boolean);
}

function buildGaps(priorityGaps: GapItem[]) {
  return priorityGaps.map((gap) => `${gap.title}: ${gap.detail}`).slice(0, 4).filter(Boolean);
}

function buildBlockers(priorityGaps: GapItem[]): BlockerItem[] {
  return priorityGaps.slice(0, 3).map((gap) => ({
    title: gap.title,
    whyItMatters: gap.detail,
    priority: gap.strength,
  }));
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

function getKeywordRecommendations(jobPosting: string, resume: string, matchedSkills: string[], gaps: GapItem[]) {
  const resumeText = normalize(resume);
  const fromSignals = roleSignals
    .filter((signal) => !matchedSkills.includes(signal.title) && hasSignal(normalize(jobPosting), signal.aliases))
    .map((signal) => signal.title);

  const fromKeywords = getRoleKeywords(jobPosting)
    .filter((word) => !resumeText.includes(word))
    .slice(0, 4)
    .map(toTitleCase);

  return Array.from(new Set([...fromSignals, ...gaps.map((gap) => gap.title), ...fromKeywords])).slice(0, 6);
}

function getInterviewPrep(priorityGaps: GapItem[], matchedSkills: string[]): InterviewPrepItem[] {
  return [
    {
      question: "Tell me about a time you turned an ambiguous problem into a concrete execution plan.",
      whatTheyAreTesting: "Whether you can structure uncertainty and move from ambiguity to action.",
    },
    {
      question: "How would you know whether onboarding or engagement improved after a product change?",
      whatTheyAreTesting: "Metrics literacy, product judgment, and your ability to define success clearly.",
    },
    {
      question: priorityGaps[0]
        ? `How are you actively building confidence in ${priorityGaps[0].title.toLowerCase()}?`
        : "What capability are you trying to strengthen most right now, and how?",
      whatTheyAreTesting: "Self-awareness, growth mindset, and whether your biggest gap is being addressed intentionally.",
    },
    {
      question: matchedSkills[0]
        ? `What is your best example of ${matchedSkills[0].toLowerCase()} driving a better outcome?`
        : "What experience best proves you can succeed in this role?",
      whatTheyAreTesting: "The strongest proof you can offer and how well you connect your work to outcomes.",
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
  return `Hi, I'm applying for the ${roleTitle} role at ${companyHint} and your team's blend of execution and user impact stood out to me. I've already built experience around ${topStrength.toLowerCase()}, and I'm actively strengthening ${topGap.toLowerCase()} through targeted project work. If you have any advice on what separates strong candidates for this role, I'd love to learn from your perspective.`;
}

export function analyzeJobCraftor(input: AnalyzeJobCraftorInput): JobCraftorResult {
  const jobPostingText = input.jobPostingText ?? `Role sourced from ${input.jobPostingUrl ?? "a shared link"}`;
  const resumeText = input.resumeText;
  const targetRole = input.targetRole;
  const formattedDeadline = formatDeadline(input.deadline);

  const matchedSkills = getMatchedSkills(jobPostingText, resumeText);
  const priorityGaps = getPriorityGaps(jobPostingText, resumeText);
  const proofPoints = getProofPoints(resumeText);
  const roleBreakdown = buildRoleBreakdown(jobPostingText, matchedSkills, priorityGaps);
  const resumeImprovements: ResumeImprovements = {
    rewrites: getRewrites(priorityGaps),
    keywordRecommendations: getKeywordRecommendations(jobPostingText, resumeText, matchedSkills, priorityGaps),
  };
  const interviewPrep = getInterviewPrep(priorityGaps, matchedSkills);
  const sevenDayPlan = getSevenDayPlan(priorityGaps, matchedSkills, input.deadline);
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

  const summaryBase =
    matchedSkills.length >= priorityGaps.length
      ? "Your background already overlaps with the role. The highest-leverage move is making that overlap more specific and easier to spot."
      : "You have enough raw signal to apply, but you need tighter proof and a more role-specific story around the biggest gaps.";

  const summary = [
    summaryBase,
    targetRole ? `The plan is tuned toward the ${targetRole} path.` : null,
    formattedDeadline ? `Your application deadline is treated as ${formattedDeadline}, so the week plan is framed around that timeline.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    roleTitle,
    companyHint,
    summary,
    roleBreakdown,
    fitAnalysis: {
      score,
      verdict,
      strengths: buildStrengths(matchedSkills, proofPoints),
      gaps: buildGaps(priorityGaps),
    },
    blockers: buildBlockers(priorityGaps),
    sevenDayPlan,
    resumeImprovements,
    networkingMessage: getNetworkingMessage(
      companyHint,
      roleTitle,
      matchedSkills[0] ?? "cross-functional execution",
      priorityGaps[0]?.title ?? "role-specific proof",
    ),
    interviewPrep,
  };
}
