export interface UserProfile {
  beliefs?: {
    positive: string[];
    challenges: Array<{ challenge: string; solution: string }>;
  };
  obstacles?: Array<{ obstacle: string; phase: "before" | "during" | "employed"; solution: string }>;
  focusGoals?: Array<{
    goal: string;
    steps: { today: string[]; threeWeeks: string[]; threeMonths: string[] };
    resources: string[];
    purpose: string;
    deadline: string;
    fullStatement: string;
  }>;
  skills?: Array<{ name: string; category: "soft" | "hard"; source: string }>;
  workValues?: Array<{ value: string; rank: number }>;
  brandStatement?: string;
  powerStatement?: string;
  emailTemplate?: string;
  voicemailScript?: string;
}
