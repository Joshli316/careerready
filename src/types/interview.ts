export interface StarStory {
  id: string;
  question: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
}

export interface InterviewResponse {
  question: string;
  answer: string;
  category: "common" | "behavioral" | "tough";
}

export interface CompanyResearch {
  company: string;
  mission: string;
  products: string;
  culture: string;
  recentNews: string;
  questions: string[];
}

export interface InterviewPrep {
  commonResponses: InterviewResponse[];
  starStories: StarStory[];
  companyResearch: CompanyResearch[];
  thankYouNotes: Array<{
    company: string;
    interviewer: string;
    date: string;
    note: string;
    sent: boolean;
  }>;
}
