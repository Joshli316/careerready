import type { StarStory } from "@/types/interview";

export function hydrateStory(
  raw: Partial<StarStory> & Pick<StarStory, "id">
): StarStory {
  return {
    id: raw.id,
    question: raw.question ?? "",
    situation: raw.situation ?? "",
    task: raw.task ?? "",
    action: raw.action ?? "",
    result: raw.result ?? "",
    tags: raw.tags ?? [],
    strength: raw.strength ?? 0,
    earnedSecret: raw.earnedSecret ?? "",
    primarySkill: raw.primarySkill ?? "",
    secondarySkill: raw.secondarySkill ?? "",
    deployFor: raw.deployFor ?? "",
    useCount: raw.useCount ?? 0,
  };
}

export function computeQualityScore(story: StarStory): number {
  const checks = [
    story.question.trim().length > 0,
    story.situation.trim().length > 0,
    story.task.trim().length > 0,
    story.action.trim().length > 0,
    story.result.trim().length > 0,
    story.strength > 0,
    story.earnedSecret.trim().length > 0,
    story.primarySkill !== "",
  ];
  const passed = checks.filter(Boolean).length;
  return passed * 12.5;
}

export function isStoryComplete(story: StarStory): boolean {
  return computeQualityScore(story) === 100;
}
