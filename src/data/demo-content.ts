import type { AnalyzeJobCraftorInput } from "@/types/jobcraftor";

export const demoInput: AnalyzeJobCraftorInput = {
  jobPostingUrl: "https://jobs.example.com/product-operations-intern",
  jobPostingText: `Product Operations Intern

About the role
We are looking for a student who can turn ambiguous problems into clear execution. You will work across product, design, and engineering to improve onboarding, engagement, and conversion for early-career users.

Responsibilities
- Analyze user behavior and summarize insights from dashboards and user interviews
- Write concise product briefs and define success metrics
- Coordinate with engineering and design during feature delivery
- Support experiments that improve resume review and interview prep workflows

Preferred qualifications
- Experience with SQL, spreadsheets, or product analytics tools
- Strong written communication and structured thinking
- Experience presenting recommendations with data
- Interest in career technology, education, or marketplace products`,
  resumeFileName: "maya-chen-resume.txt",
  resumeText: `Maya Chen
Computer Science and Economics student

Experience
- Product Fellow, Campus Career Lab
  Led a 4-person team to redesign internship application tracking and improved weekly active usage by 23%.
  Interviewed 18 students, synthesized patterns, and presented recommendations to advisors.

- Operations Analyst Intern, BrightPath Logistics
  Built spreadsheet models to monitor delays and cut weekly reporting time by 35%.
  Shared insights with cross-functional stakeholders.

Projects
- Interview Prep Dashboard
  Built a React dashboard that tracks mock interview progress, resume quality signals, and follow-up tasks.

Leadership
- Vice President, Women in Technology
  Coordinated workshops, managed speakers, and grew membership by 40%.`,
};
