export type GapStrength = "high" | "medium" | "low";

export interface GapItem {
  title: string;
  detail: string;
  strength: GapStrength;
}

export interface ResumeRewrite {
  before: string;
  after: string;
  why: string;
}

export interface InterviewPrompt {
  question: string;
  rationale: string;
}

export interface PlanDay {
  day: number;
  title: string;
  goal: string;
  tasks: string[];
}

export interface RoleBreakdownItem {
  title: string;
  detail: string;
}

export interface AnalyzeJobCraftorInput {
  jobPostingText: string;
  jobPostingUrl?: string;
  resumeText: string;
  resumeFileName?: string | null;
}

export interface JobCraftorResult {
  roleTitle: string;
  companyHint: string;
  score: number;
  verdict: string;
  summary: string;
  roleBreakdown: RoleBreakdownItem[];
  matchedSkills: string[];
  priorityGaps: GapItem[];
  quickWins: string[];
  proofPoints: string[];
  rewrites: ResumeRewrite[];
  networkingMessage: string;
  interviewPrompts: InterviewPrompt[];
  sevenDayPlan: PlanDay[];
}
