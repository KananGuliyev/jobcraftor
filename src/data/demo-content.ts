import type {
  AnalyzeJobCraftorInput,
  JobCraftorAnalysisMeta,
  JobCraftorResult,
} from "@/types/jobcraftor";

export const demoInput: AnalyzeJobCraftorInput = {
  jobPostingUrl: "https://careers.nexora.dev/software-engineering-intern",
  targetRole: "Software Engineering Intern",
  deadline: "2026-04-10",
  jobPostingText: `Software Engineering Intern

About the role
Nexora is building collaboration tools for distributed product and engineering teams. We are hiring a Software Engineering Intern to help ship user-facing features, improve internal tooling, and support product quality across our platform.

What you will do
- Build and refine product features in TypeScript, React, and modern web tooling
- Work closely with engineers, product managers, and designers to turn specs into polished user experiences
- Write maintainable code, debug issues, and contribute to code reviews
- Improve internal developer workflows, dashboards, or automation tools
- Help test features and strengthen reliability before launch

What we look for
- Coursework, projects, or internship experience in software engineering
- Comfort with JavaScript or TypeScript and frontend development fundamentals
- Familiarity with React, APIs, and Git-based collaboration
- Strong debugging habits and attention to code quality
- Clear communication and enthusiasm for learning in a fast-moving team

Nice to have
- Experience with Node.js, backend APIs, or databases
- Experience deploying projects or working with CI/CD
- Evidence of shipping products, hackathon work, or technical leadership`,
  resumeFileName: null,
  resumeText: `Aria Kim
Computer Science student
University of Washington | Class of 2027

Experience
- Frontend Engineering Intern, Student Hub
  Built React components for event discovery and improved mobile navigation clarity across the platform.
  Worked with a student product manager to ship interface changes used by 4,000+ students.

- Teaching Assistant, Intro to Programming
  Helped students debug Java and Python assignments and explained core programming concepts in weekly office hours.

Projects
- Study Group Finder
  Built a full-stack web app with Next.js, TypeScript, and Firebase that helps students create and join study groups.
  Added authentication, profile pages, and real-time updates for active sessions.

- API Monitoring Dashboard
  Built a dashboard that visualizes endpoint health, response times, and incident summaries using React and charting libraries.

Skills
TypeScript, JavaScript, React, Next.js, HTML, CSS, Firebase, Git, REST APIs

Leadership
- Organizer, Women in Computing
  Coordinated workshops and project nights for students exploring software engineering careers.`,
};

export const demoResult: JobCraftorResult = {
  roleTitle: "Software Engineering Intern",
  companyHint: "Nexora",
  summary:
    "This is a strong early-career application with clear frontend momentum, solid product-minded project work, and relevant collaboration signals. The biggest opportunity is proving backend depth, debugging rigor, and shipped engineering impact more explicitly before applying.",
  roleBreakdown: {
    responsibilities: [
      "Ship user-facing features in TypeScript and React with attention to polish and maintainability.",
      "Collaborate with product and design to turn requirements into working product improvements.",
      "Debug issues, improve reliability, and contribute to the team's engineering workflow.",
    ],
    keySkills: ["TypeScript", "React", "API integration", "Debugging", "Code quality", "Cross-functional communication"],
    whatMattersMost: [
      "Lead with shipped frontend work because the resume already shows credible overlap there.",
      "Close the backend and debugging-proof gap so the application feels more complete for a general software engineering internship.",
      "Frame projects as engineering outcomes with scope, tradeoffs, and measurable usage rather than as classroom exercises.",
    ],
  },
  fitAnalysis: {
    score: 86,
    verdict: "Strong fit with a few credibility gaps to tighten",
    strengths: [
      "You already show direct overlap in TypeScript, React, and product-facing frontend development.",
      "The Study Group Finder project demonstrates full-stack initiative and experience shipping a real student-facing product.",
      "Teaching assistant work signals debugging patience, technical communication, and strong fundamentals.",
      "Your internship and leadership experience both support cross-functional collaboration and ownership.",
    ],
    gaps: [
      "Backend depth is mentioned, but the strongest proof is still frontend-weighted.",
      "The resume should show more explicit debugging, testing, or code-quality work to match the internship's expectations.",
      "Some bullets still describe activity rather than engineering outcomes, performance improvements, or technical decisions.",
    ],
  },
  blockers: [
    {
      title: "Backend proof is lighter than frontend proof",
      whyItMatters:
        "For a software engineering internship, recruiters will want to see that you can contribute beyond UI work and understand the full product stack.",
      priority: "high",
    },
    {
      title: "Debugging and reliability work is not explicit enough",
      whyItMatters:
        "The posting calls out debugging, maintainability, and launch quality, so weak evidence here can make the application feel less production-ready.",
      priority: "medium",
    },
    {
      title: "Top bullets need stronger engineering impact framing",
      whyItMatters:
        "If the resume emphasizes tasks instead of shipped results, it can undersell your readiness even when the underlying work is relevant.",
      priority: "medium",
    },
  ],
  sevenDayPlan: [
    {
      day: 1,
      title: "Decode the internship",
      goal: "Turn the posting into an engineering scorecard you can target directly.",
      tasks: [
        "Highlight every mention of frontend, APIs, debugging, code quality, and collaboration.",
        "Mark backend proof as the primary gap and debugging evidence as the secondary gap.",
        "Choose the Study Group Finder project and Student Hub internship as the two anchor stories for this application.",
      ],
    },
    {
      day: 2,
      title: "Rewrite the top of the resume",
      goal: "Make your strongest engineering overlap visible in the first scan.",
      tasks: [
        "Rewrite the internship bullet to show what feature shipped, what changed, and who benefited.",
        "Move the most technical project bullet higher on the page and tighten the skills section around the posting.",
        "Add clearer wording around APIs, state management, or data flow where truthful.",
      ],
    },
    {
      day: 3,
      title: "Create one stronger backend proof point",
      goal: "Give the application one concrete signal that you can contribute beyond the frontend.",
      tasks: [
        "Expand the Study Group Finder project with a short bullet about authentication, database structure, or API flow.",
        "Document one technical challenge you solved and how you debugged it.",
        "Prepare a simple architecture note or repo screenshot you can reference in interviews.",
      ],
    },
    {
      day: 4,
      title: "Add debugging and quality evidence",
      goal: "Show that you can write code that is reliable, not just functional.",
      tasks: [
        "Rewrite one project bullet to mention bug fixing, testing, validation, or monitoring.",
        "Add a line describing how you identified and resolved a real issue in a project or internship.",
        "Review the resume for vague phrases like 'worked on' or 'helped with' and replace them with stronger verbs.",
      ],
    },
    {
      day: 5,
      title: "Prepare the application story",
      goal: "Connect your background to Nexora's engineering internship clearly and confidently.",
      tasks: [
        "Write a short explanation of why this internship fits your product-minded engineering background.",
        "Draft a concise outreach note for a recruiter or engineer.",
        "Prepare a 30-second pitch linking your internship, project work, and learning goals to the role.",
      ],
    },
    {
      day: 6,
      title: "Practice interview-ready engineering stories",
      goal: "Turn your projects into stronger technical interview answers.",
      tasks: [
        "Prepare one story about shipping a frontend feature end to end.",
        "Prepare one story about debugging a broken workflow or improving quality.",
        "Practice explaining a technical tradeoff from the Study Group Finder or Monitoring Dashboard project.",
      ],
    },
    {
      day: 7,
      title: "Submit with a stronger engineering signal",
      goal: "Finalize the application and carry the same story into interviews.",
      tasks: [
        "Do one final pass on wording, ordering, and keyword alignment.",
        "Submit the application and save your two strongest stories in a prep note.",
        "Schedule a short follow-up block to rehearse likely questions before recruiter outreach begins.",
      ],
    },
  ],
  resumeImprovements: {
    rewrites: [
      {
        before: "Built React components for event discovery and improved mobile navigation clarity across the platform.",
        after:
          "Built and shipped React components for event discovery and mobile navigation, improving clarity in a student platform used by 4,000+ users.",
        why: "This version sounds more like shipped engineering work and ties the feature to visible user impact.",
      },
      {
        before: "Built a full-stack web app with Next.js, TypeScript, and Firebase that helps students create and join study groups.",
        after:
          "Built a full-stack Next.js and TypeScript application with Firebase auth and real-time data flows, enabling students to create, join, and manage active study groups.",
        why: "This makes the project sound more technically credible and strengthens the backend proof signal.",
      },
      {
        before: "Built a dashboard that visualizes endpoint health, response times, and incident summaries using React and charting libraries.",
        after:
          "Built a React monitoring dashboard that surfaced endpoint health, latency trends, and incident summaries, giving developers a faster way to spot reliability issues.",
        why: "This sharper framing supports debugging and reliability signals that matter for the role.",
      },
    ],
    keywordRecommendations: ["TypeScript", "React", "APIs", "Debugging", "Code quality", "Node.js", "Reliability", "Feature delivery"],
  },
  networkingMessage:
    "Hi, I'm applying for the Software Engineering Intern role at Nexora. I've been building TypeScript and React projects with a strong product focus, and your team's mix of user-facing work, engineering quality, and cross-functional collaboration really stood out. If you have any advice on what makes a student candidate stand out for this internship, I'd love to learn from your perspective.",
  interviewPrep: [
    {
      question: "Tell me about a feature you built end to end and how you decided what to prioritize.",
      whatTheyAreTesting: "Product-minded engineering judgment, ownership, and your ability to ship with intention.",
    },
    {
      question: "Describe a bug or broken workflow you had to debug. How did you isolate the issue?",
      whatTheyAreTesting: "Debugging discipline, technical reasoning, and how you work through ambiguity.",
    },
    {
      question: "How have you used APIs, data, or backend tools in your projects?",
      whatTheyAreTesting: "Whether your engineering experience goes beyond frontend implementation alone.",
    },
    {
      question: "How do you make sure code is maintainable when you are moving quickly?",
      whatTheyAreTesting: "Code quality instincts, collaboration readiness, and production-minded habits.",
    },
  ],
};

export const demoMeta: JobCraftorAnalysisMeta = {
  source: "demo",
  notice:
    "Demo mode is showing a polished software engineering internship walkthrough with preloaded text inputs and precomputed results, so the full product stays fast and reliable on stage.",
  model: "contest-demo",
};

export const demoHighlights = {
  badge: "Demo mode",
  subtitle: "software engineering internship example",
};
