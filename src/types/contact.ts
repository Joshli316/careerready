export type ContactStatus =
  | "saved"
  | "applied"
  | "phone_screen"
  | "interview"
  | "follow_up"
  | "offer"
  | "rejected"
  | "accepted";

export type ContactSource =
  | "job_board"
  | "networking"
  | "company_site"
  | "referral"
  | "job_fair"
  | "other";

export interface EmployerContact {
  id: string;
  companyName: string;
  position: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string;
  dateApplied?: string;
  status: ContactStatus;
  followUpDate?: string;
  notes?: string;
  source?: ContactSource;
  createdAt: string;
  updatedAt: string;
}
