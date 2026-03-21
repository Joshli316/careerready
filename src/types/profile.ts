export interface MasterAppEducation {
  school: string;
  degree: string;
  dates: string;
  location: string;
}

export interface MasterAppWorkEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  duties: string;
  reasonLeft: string;
  supervisorName: string;
  supervisorPhone: string;
}

export interface MasterAppReference {
  name: string;
  phone: string;
  email: string;
  occupation: string;
  yearsKnown: string;
}

export interface MasterApp {
  name: string;
  address: string;
  phone: string;
  email: string;
  education: MasterAppEducation[];
  workHistory: MasterAppWorkEntry[];
  skills: string;
  languages: string;
  certifications: string;
  references: MasterAppReference[];
}

export interface ReferencesEntry {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  relationship: "professional" | "personal";
}

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
  brandDiscovery?: {
    field: string;
    position: string;
    skills: string;
    accomplishments: string;
  };
  masterApp?: MasterApp;
  references?: ReferencesEntry[];
  networkContacts?: {
    professional: string[];
    personal: string[];
  };
  socialAudit?: Record<string, "pass" | "fail" | null>;
  selfEvaluation?: Record<string, number>;
  jobSearchChecklist?: {
    progress: number[];
    methods: number[];
  };
  emailTemplate?: string;
  voicemailScript?: string;
}
