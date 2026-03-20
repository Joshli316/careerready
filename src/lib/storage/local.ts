"use client";

import type { StorageAdapter } from "./adapter";
import type { UserProfile } from "@/types/profile";
import type { Resume, CoverLetter } from "@/types/resume";
import type { EmployerContact } from "@/types/contact";
import type { InterviewPrep } from "@/types/interview";

const PREFIX = "careerready_";

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${PREFIX}${key}`);
  return raw ? JSON.parse(raw) : null;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
}

export class LocalStorageAdapter implements StorageAdapter {
  async getProfile(): Promise<UserProfile | null> {
    return getItem<UserProfile>("profile");
  }
  async setProfile(profile: UserProfile): Promise<void> {
    setItem("profile", profile);
  }

  async getResumes(): Promise<Resume[]> {
    return getItem<Resume[]>("resumes") ?? [];
  }
  async getResume(id: string): Promise<Resume | null> {
    const resumes = await this.getResumes();
    return resumes.find((r) => r.id === id) ?? null;
  }
  async saveResume(resume: Resume): Promise<void> {
    const resumes = await this.getResumes();
    const idx = resumes.findIndex((r) => r.id === resume.id);
    if (idx >= 0) resumes[idx] = resume;
    else resumes.push(resume);
    setItem("resumes", resumes);
  }
  async deleteResume(id: string): Promise<void> {
    const resumes = (await this.getResumes()).filter((r) => r.id !== id);
    setItem("resumes", resumes);
  }

  async getCoverLetters(): Promise<CoverLetter[]> {
    return getItem<CoverLetter[]>("cover_letters") ?? [];
  }
  async saveCoverLetter(letter: CoverLetter): Promise<void> {
    const letters = await this.getCoverLetters();
    const idx = letters.findIndex((l) => l.id === letter.id);
    if (idx >= 0) letters[idx] = letter;
    else letters.push(letter);
    setItem("cover_letters", letters);
  }
  async deleteCoverLetter(id: string): Promise<void> {
    const letters = (await this.getCoverLetters()).filter((l) => l.id !== id);
    setItem("cover_letters", letters);
  }

  async getInterviewPrep(): Promise<InterviewPrep | null> {
    return getItem<InterviewPrep>("interviews");
  }
  async setInterviewPrep(prep: InterviewPrep): Promise<void> {
    setItem("interviews", prep);
  }

  async getContacts(): Promise<EmployerContact[]> {
    return getItem<EmployerContact[]>("contacts") ?? [];
  }
  async getContact(id: string): Promise<EmployerContact | null> {
    const contacts = await this.getContacts();
    return contacts.find((c) => c.id === id) ?? null;
  }
  async saveContact(contact: EmployerContact): Promise<void> {
    const contacts = await this.getContacts();
    const idx = contacts.findIndex((c) => c.id === contact.id);
    if (idx >= 0) contacts[idx] = contact;
    else contacts.push(contact);
    setItem("contacts", contacts);
  }
  async deleteContact(id: string): Promise<void> {
    const contacts = (await this.getContacts()).filter((c) => c.id !== id);
    setItem("contacts", contacts);
  }
}
