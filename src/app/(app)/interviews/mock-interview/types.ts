export interface MockInterviewQuestion {
  question: string;
  type: "behavioral" | "situational" | "technical" | "culture_fit";
  talkingPoints: string[];
}

export interface MockInterviewExchange {
  question: string;
  type: MockInterviewQuestion["type"];
  answer: string;
  feedback: string;
}

export interface MockInterviewSession {
  id: string;
  createdAt: string;
  sourceType: "jd_analysis" | "generic";
  sourceLabel: string;
  jobContext: string;
  exchanges: MockInterviewExchange[];
  summary: string | null;
  completed: boolean;
}
