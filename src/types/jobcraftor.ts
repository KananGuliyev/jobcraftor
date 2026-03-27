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

export interface RoleBreakdownSection {
  responsibilities: string[];
  keySkills: string[];
  whatMattersMost: string[];
}

export interface FitAnalysis {
  score: number;
  verdict: string;
  strengths: string[];
  gaps: string[];
}

export interface BlockerItem {
  title: string;
  whyItMatters: string;
  priority: GapStrength;
}

export interface ResumeImprovements {
  rewrites: ResumeRewrite[];
  keywordRecommendations: string[];
}

export interface InterviewPrepItem {
  question: string;
  whatTheyAreTesting: string;
}

export interface AnalyzeJobCraftorInput {
  jobPostingText: string;
  jobPostingUrl?: string;
  resumeText: string;
  resumeFileName?: string | null;
  targetRole?: string;
  deadline?: string;
}

export interface JobCraftorResult {
  roleTitle: string;
  companyHint: string;
  summary: string;
  roleBreakdown: RoleBreakdownSection;
  fitAnalysis: FitAnalysis;
  blockers: BlockerItem[];
  sevenDayPlan: PlanDay[];
  resumeImprovements: ResumeImprovements;
  networkingMessage: string;
  interviewPrep: InterviewPrepItem[];
}
