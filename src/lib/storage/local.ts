"use client";

import type { StorageAdapter } from "./adapter";
import type { UserProfile } from "@/types/profile";
import type { Resume, CoverLetter } from "@/types/resume";
import type { EmployerContact } from "@/types/contact";
import type { InterviewPrep } from "@/types/interview";
import type { JDAnalysis } from "@/app/(app)/interviews/jd-decoder/types";
import type { MockInterviewSession } from "@/app/(app)/interviews/mock-interview/types";

const PREFIX = "careerready_";

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`${PREFIX}${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`Corrupted data for key "${PREFIX}${key}", resetting.`);
    localStorage.removeItem(`${PREFIX}${key}`);
    return null;
  }
}

const STORAGE_WARN_BYTES = 4 * 1024 * 1024; // 4MB — warn at ~80% of 5MB limit

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(value);
  localStorage.setItem(`${PREFIX}${key}`, json);
  checkStorageUsage();
}

function checkStorageUsage(): void {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) {
        total += (localStorage.getItem(k) ?? "").length * 2; // UTF-16
      }
    }
    if (total > STORAGE_WARN_BYTES) {
      console.warn(`CareerReady localStorage usage: ${(total / 1024 / 1024).toFixed(1)}MB of ~5MB. Consider creating an account to sync data.`);
    }
  } catch {
    // Ignore — quota errors will surface on next setItem
  }
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

  async getJDAnalyses(): Promise<JDAnalysis[]> {
    return getItem<JDAnalysis[]>("jd_analyses") ?? [];
  }
  async saveJDAnalysis(analysis: JDAnalysis): Promise<void> {
    const analyses = await this.getJDAnalyses();
    const idx = analyses.findIndex((a) => a.id === analysis.id);
    if (idx >= 0) analyses[idx] = analysis;
    else analyses.push(analysis);
    setItem("jd_analyses", analyses);
  }
  async deleteJDAnalysis(id: string): Promise<void> {
    const analyses = (await this.getJDAnalyses()).filter((a) => a.id !== id);
    setItem("jd_analyses", analyses);
  }

  async getMockSessions(): Promise<MockInterviewSession[]> {
    return getItem<MockInterviewSession[]>("mock_sessions") ?? [];
  }
  async saveMockSession(session: MockInterviewSession): Promise<void> {
    const sessions = await this.getMockSessions();
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) sessions[idx] = session;
    else sessions.push(session);
    setItem("mock_sessions", sessions);
  }
  async deleteMockSession(id: string): Promise<void> {
    const sessions = (await this.getMockSessions()).filter((s) => s.id !== id);
    setItem("mock_sessions", sessions);
  }
}
