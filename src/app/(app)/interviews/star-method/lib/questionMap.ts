import type { Competency, StarStory } from "@/types/interview";

export const BEHAVIORAL_QUESTIONS: { question: string; skills: Competency[] }[] =
  [
    {
      question: "Tell me about a time you led a team through a difficult project.",
      skills: ["Leadership", "Teamwork"],
    },
    {
      question: "Describe a situation where you had to motivate others to reach a goal.",
      skills: ["Leadership"],
    },
    {
      question: "Give an example of a time you worked effectively as part of a team.",
      skills: ["Teamwork"],
    },
    {
      question: "Tell me about a complex problem you solved and how you approached it.",
      skills: ["Problem-Solving"],
    },
    {
      question: "Describe a time when you identified a problem before it became serious.",
      skills: ["Problem-Solving", "Initiative"],
    },
    {
      question: "Give an example of when you had to explain a difficult concept to someone.",
      skills: ["Communication"],
    },
    {
      question: "Tell me about a time you had to deliver difficult news or feedback.",
      skills: ["Communication"],
    },
    {
      question: "Describe a situation where you had to quickly adapt to a major change.",
      skills: ["Adaptability"],
    },
    {
      question: "Tell me about a time you learned a new skill to complete a project.",
      skills: ["Adaptability", "Technical Skills"],
    },
    {
      question: "Give an example of when you took initiative without being asked.",
      skills: ["Initiative"],
    },
    {
      question: "Tell me about a time you successfully resolved a conflict with a coworker.",
      skills: ["Conflict Resolution"],
    },
    {
      question: "Describe a situation where you had to manage competing deadlines.",
      skills: ["Time Management"],
    },
    {
      question: "Tell me about a time you went above and beyond for a customer or stakeholder.",
      skills: ["Customer Focus"],
    },
    {
      question: "Give an example of a technical challenge you overcame.",
      skills: ["Technical Skills"],
    },
    {
      question: "Describe a time you disagreed with a decision and how you handled it.",
      skills: ["Conflict Resolution", "Communication"],
    },
  ] as const;

export function getCoveredCompetencies(stories: StarStory[]): Set<Competency> {
  const covered = new Set<Competency>();
  for (const story of stories) {
    if (story.primarySkill !== "") covered.add(story.primarySkill);
    if (story.secondarySkill !== "") covered.add(story.secondarySkill);
  }
  return covered;
}

export function getUncoveredQuestions(
  stories: StarStory[]
): typeof BEHAVIORAL_QUESTIONS {
  const covered = getCoveredCompetencies(stories);
  return BEHAVIORAL_QUESTIONS.filter((q) =>
    q.skills.every((skill) => !covered.has(skill))
  );
}
