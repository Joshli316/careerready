import type { UserProfile } from "@/types/profile";
import type { Resume, CoverLetter } from "@/types/resume";
import type { EmployerContact } from "@/types/contact";
import type { InterviewPrep } from "@/types/interview";

export interface StorageAdapter {
  getProfile(): Promise<UserProfile | null>;
  setProfile(profile: UserProfile): Promise<void>;
  getResumes(): Promise<Resume[]>;
  getResume(id: string): Promise<Resume | null>;
  saveResume(resume: Resume): Promise<void>;
  deleteResume(id: string): Promise<void>;
  getCoverLetters(): Promise<CoverLetter[]>;
  saveCoverLetter(letter: CoverLetter): Promise<void>;
  deleteCoverLetter(id: string): Promise<void>;
  getInterviewPrep(): Promise<InterviewPrep | null>;
  setInterviewPrep(prep: InterviewPrep): Promise<void>;
  getContacts(): Promise<EmployerContact[]>;
  getContact(id: string): Promise<EmployerContact | null>;
  saveContact(contact: EmployerContact): Promise<void>;
  deleteContact(id: string): Promise<void>;
}
