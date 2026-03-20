export type ResumeTemplate = "chronological" | "functional" | "combination";

export interface ResumeContent {
  contactInfo: {
    name: string;
    phone: string;
    email: string;
    linkedin?: string;
  };
  profileOverview: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    dates: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    location: string;
    dates: string;
  }>;
  skills: string[];
  certifications: string[];
}

export interface Resume {
  id: string;
  title: string;
  template: ResumeTemplate;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
}

export interface CoverLetter {
  id: string;
  resumeId?: string;
  title: string;
  content: {
    recipientName: string;
    recipientTitle: string;
    company: string;
    address: string;
    opening: string;
    body: string;
    closing: string;
  };
  createdAt: string;
}
