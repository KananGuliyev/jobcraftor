import type { JobCraftorResult } from "@/types/jobcraftor";

function buildNumberedList(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

export function buildNetworkingMessageCopy(result: JobCraftorResult) {
  return result.networkingMessage;
}

export function buildInterviewQuestionsCopy(result: JobCraftorResult) {
  return result.interviewPrep
    .map(
      (item, index) =>
        `${index + 1}. ${item.question}\nWhat the interviewer is testing: ${item.whatTheyAreTesting}`,
    )
    .join("\n\n");
}

export function buildApplicationPrepSummary(result: JobCraftorResult) {
  const topBlockers = result.blockers.map((blocker) => `${blocker.title}: ${blocker.whyItMatters}`);
  const firstThreeDays = result.sevenDayPlan.slice(0, 3).map((day) => `Day ${day.day} - ${day.title}: ${day.goal}`);

  return [
    "JOBCRAFTOR APPLICATION PREP SUMMARY",
    "",
    `Role: ${result.roleTitle}`,
    `Company context: ${result.companyHint}`,
    `Fit score: ${result.fitAnalysis.score}/100`,
    `Verdict: ${result.fitAnalysis.verdict}`,
    "",
    "Summary",
    result.summary,
    "",
    "Top strengths",
    buildNumberedList(result.fitAnalysis.strengths),
    "",
    "Top blockers",
    buildNumberedList(topBlockers),
    "",
    "Immediate 7-day plan focus",
    buildNumberedList(firstThreeDays),
    "",
    "Resume keywords to mirror",
    result.resumeImprovements.keywordRecommendations.join(", "),
    "",
    "Networking message",
    result.networkingMessage,
  ].join("\n");
}
