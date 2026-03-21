import type { Competency } from "@/types/interview";

export interface JDRequirement {
  id: string;
  category: "hard_skill" | "soft_skill" | "experience" | "education" | "certification";
  description: string;
  importance: "must_have" | "nice_to_have";
  competency: Competency | null;
}

export interface StoryMatch {
  requirementId: string;
  storyId: string;
  relevanceScore: number;
  talkingPoints: string[];
}

export interface GapItem {
  requirementId: string;
  suggestion: string;
  suggestedQuestion: string;
}

export interface MockQuestion {
  question: string;
  type: "behavioral" | "situational" | "technical" | "culture_fit";
  targetRequirementIds: string[];
  suggestedStoryIds: string[];
  talkingPoints: string[];
}

export interface PrepChecklistItem {
  id: string;
  label: string;
  type: "polish_story" | "draft_new_story" | "research" | "practice";
  done: boolean;
}

export interface JDAnalysis {
  id: string;
  createdAt: string;
  jobTitle: string;
  company: string;
  rawJD: string;
  summary: string;
  requirements: JDRequirement[];
  storyMatches: StoryMatch[];
  gaps: GapItem[];
  mockQuestions: MockQuestion[];
  prepChecklist: PrepChecklistItem[];
}
