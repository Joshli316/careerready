import { describe, it, expect } from "vitest";
import { hydrateStory, computeQualityScore, isStoryComplete } from "./storyUtils";
import type { StarStory } from "@/types/interview";

const fullStory: StarStory = {
  id: "s1",
  question: "Tell me about a challenge.",
  situation: "I was on a tight deadline.",
  task: "Deliver the project on time.",
  action: "I prioritized tasks and delegated.",
  result: "We shipped 2 days early.",
  tags: [],
  strength: 3,
  earnedSecret: "Delegation beats heroics.",
  primarySkill: "Leadership",
  secondarySkill: "Time Management",
  deployFor: "startup roles",
  useCount: 2,
};

const emptyStory: StarStory = {
  id: "s2",
  question: "",
  situation: "",
  task: "",
  action: "",
  result: "",
  tags: [],
  strength: 0,
  earnedSecret: "",
  primarySkill: "",
  secondarySkill: "",
  deployFor: "",
  useCount: 0,
};

describe("hydrateStory", () => {
  it("fills defaults for missing fields", () => {
    const hydrated = hydrateStory({ id: "x" });
    expect(hydrated).toEqual({
      id: "x",
      question: "",
      situation: "",
      task: "",
      action: "",
      result: "",
      tags: [],
      strength: 0,
      earnedSecret: "",
      primarySkill: "",
      secondarySkill: "",
      deployFor: "",
      useCount: 0,
    });
  });

  it("preserves existing fields", () => {
    const hydrated = hydrateStory(fullStory);
    expect(hydrated).toEqual(fullStory);
  });

  it("fills only missing fields on a partial story", () => {
    const hydrated = hydrateStory({ id: "p1", question: "Q?", strength: 4 });
    expect(hydrated.id).toBe("p1");
    expect(hydrated.question).toBe("Q?");
    expect(hydrated.strength).toBe(4);
    expect(hydrated.situation).toBe("");
    expect(hydrated.primarySkill).toBe("");
  });
});

describe("computeQualityScore", () => {
  it("returns 0 for empty story", () => {
    expect(computeQualityScore(emptyStory)).toBe(0);
  });

  it("returns 100 for fully complete story", () => {
    expect(computeQualityScore(fullStory)).toBe(100);
  });

  it("returns partial score for partial story", () => {
    const partial: StarStory = {
      ...emptyStory,
      question: "Q?",
      situation: "S",
      action: "A",
      primarySkill: "Leadership",
    };
    // 4 of 8 checks pass = 4 * 12.5 = 50
    expect(computeQualityScore(partial)).toBe(50);
  });

  it("does not count whitespace-only fields", () => {
    const whitespace: StarStory = {
      ...emptyStory,
      question: "   ",
      situation: "\n",
    };
    expect(computeQualityScore(whitespace)).toBe(0);
  });
});

describe("isStoryComplete", () => {
  it("returns true for a fully complete story", () => {
    expect(isStoryComplete(fullStory)).toBe(true);
  });

  it("returns false for an incomplete story", () => {
    expect(isStoryComplete(emptyStory)).toBe(false);
  });

  it("returns false when one field is missing", () => {
    const almostDone: StarStory = { ...fullStory, earnedSecret: "" };
    expect(isStoryComplete(almostDone)).toBe(false);
  });
});
