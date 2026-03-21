import { describe, it, expect } from "vitest";
import {
  BEHAVIORAL_QUESTIONS,
  getCoveredCompetencies,
  getUncoveredQuestions,
} from "./questionMap";
import type { StarStory } from "@/types/interview";

const makeStory = (
  primary: StarStory["primarySkill"],
  secondary: StarStory["secondarySkill"] = ""
): StarStory => ({
  id: "s1",
  question: "Q",
  situation: "S",
  task: "T",
  action: "A",
  result: "R",
  tags: [],
  strength: 3,
  earnedSecret: "",
  primarySkill: primary,
  secondarySkill: secondary,
  deployFor: "",
  useCount: 0,
});

describe("getCoveredCompetencies", () => {
  it("returns empty set for no stories", () => {
    const result = getCoveredCompetencies([]);
    expect(result.size).toBe(0);
  });

  it("collects primary and secondary skills", () => {
    const stories = [makeStory("Leadership", "Teamwork")];
    const result = getCoveredCompetencies(stories);
    expect(result.has("Leadership")).toBe(true);
    expect(result.has("Teamwork")).toBe(true);
    expect(result.size).toBe(2);
  });

  it("ignores empty skill strings", () => {
    const stories = [makeStory("", "")];
    const result = getCoveredCompetencies(stories);
    expect(result.size).toBe(0);
  });

  it("deduplicates skills across stories", () => {
    const stories = [
      makeStory("Leadership", ""),
      makeStory("Leadership", "Communication"),
    ];
    const result = getCoveredCompetencies(stories);
    expect(result.size).toBe(2);
    expect(result.has("Leadership")).toBe(true);
    expect(result.has("Communication")).toBe(true);
  });
});

describe("getUncoveredQuestions", () => {
  it("returns all questions when no skills are tagged", () => {
    const result = getUncoveredQuestions([]);
    expect(result.length).toBe(BEHAVIORAL_QUESTIONS.length);
  });

  it("filters out questions whose skills are all covered", () => {
    // Cover Leadership and Teamwork
    const stories = [makeStory("Leadership", "Teamwork")];
    const uncovered = getUncoveredQuestions(stories);

    // Questions that ONLY need Leadership/Teamwork should be gone
    const coveredQs = BEHAVIORAL_QUESTIONS.filter((q) =>
      q.skills.some((s) => s === "Leadership" || s === "Teamwork")
    );

    // Every covered question should NOT be in uncovered
    for (const q of coveredQs) {
      expect(uncovered.find((u) => u.question === q.question)).toBeUndefined();
    }

    // Uncovered should be fewer than total
    expect(uncovered.length).toBeLessThan(BEHAVIORAL_QUESTIONS.length);
  });

  it("returns empty when all competencies are covered", () => {
    const allSkills = [
      "Leadership", "Teamwork", "Problem-Solving", "Communication",
      "Adaptability", "Initiative", "Conflict Resolution",
      "Time Management", "Customer Focus", "Technical Skills",
    ] as const;
    const stories = allSkills.map((s) => makeStory(s));
    const uncovered = getUncoveredQuestions(stories);
    expect(uncovered.length).toBe(0);
  });
});
