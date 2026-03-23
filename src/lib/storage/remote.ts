import type { StorageAdapter } from "./adapter";
import type { UserProfile } from "@/types/profile";
import type { Resume, CoverLetter } from "@/types/resume";
import type { EmployerContact } from "@/types/contact";
import type { InterviewPrep } from "@/types/interview";
import type { JDAnalysis } from "@/app/(app)/interviews/jd-decoder/types";
import type { MockInterviewSession } from "@/app/(app)/interviews/mock-interview/types";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export class RemoteStorageAdapter implements StorageAdapter {
  async getProfile(): Promise<UserProfile | null> {
    try {
      return await fetchJson<UserProfile>("/api/profile");
    } catch {
      return null;
    }
  }

  async setProfile(profile: UserProfile): Promise<void> {
    await fetchJson("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  }

  async getResumes(): Promise<Resume[]> {
    try {
      return await fetchJson<Resume[]>("/api/resumes");
    } catch {
      return [];
    }
  }

  async getResume(id: string): Promise<Resume | null> {
    try {
      return await fetchJson<Resume>(`/api/resumes/${id}`);
    } catch {
      return null;
    }
  }

  async saveResume(resume: Resume): Promise<void> {
    await fetchJson(`/api/resumes/${resume.id}`, {
      method: "PUT",
      body: JSON.stringify(resume),
    });
  }

  async deleteResume(id: string): Promise<void> {
    await fetchJson(`/api/resumes/${id}`, { method: "DELETE" });
  }

  async getCoverLetters(): Promise<CoverLetter[]> {
    try {
      return await fetchJson<CoverLetter[]>("/api/cover-letters");
    } catch {
      return [];
    }
  }

  async saveCoverLetter(letter: CoverLetter): Promise<void> {
    await fetchJson(`/api/cover-letters/${letter.id}`, {
      method: "PUT",
      body: JSON.stringify(letter),
    });
  }

  async deleteCoverLetter(id: string): Promise<void> {
    await fetchJson(`/api/cover-letters/${id}`, { method: "DELETE" });
  }

  async getInterviewPrep(): Promise<InterviewPrep | null> {
    try {
      return await fetchJson<InterviewPrep>("/api/interviews");
    } catch {
      return null;
    }
  }

  async setInterviewPrep(prep: InterviewPrep): Promise<void> {
    await fetchJson("/api/interviews", {
      method: "PUT",
      body: JSON.stringify(prep),
    });
  }

  async getContacts(): Promise<EmployerContact[]> {
    try {
      return await fetchJson<EmployerContact[]>("/api/contacts");
    } catch {
      return [];
    }
  }

  async getContact(id: string): Promise<EmployerContact | null> {
    try {
      return await fetchJson<EmployerContact>(`/api/contacts/${id}`);
    } catch {
      return null;
    }
  }

  async saveContact(contact: EmployerContact): Promise<void> {
    await fetchJson(`/api/contacts/${contact.id}`, {
      method: "PUT",
      body: JSON.stringify(contact),
    });
  }

  async deleteContact(id: string): Promise<void> {
    await fetchJson(`/api/contacts/${id}`, { method: "DELETE" });
  }

  // TODO: Implement remote storage for JD analyses when API routes are ready.
  // Until then, authenticated users will not persist JD analysis data.
  async getJDAnalyses(): Promise<JDAnalysis[]> {
    console.warn("RemoteStorageAdapter.getJDAnalyses: not implemented — returning empty array");
    return [];
  }
  async saveJDAnalysis(_analysis: JDAnalysis): Promise<void> {
    console.warn("RemoteStorageAdapter.saveJDAnalysis: not implemented — data not persisted");
  }
  async deleteJDAnalysis(_id: string): Promise<void> {
    console.warn("RemoteStorageAdapter.deleteJDAnalysis: not implemented");
  }

  // TODO: Implement remote storage for mock sessions when API routes are ready.
  // Until then, authenticated users will not persist mock interview sessions.
  async getMockSessions(): Promise<MockInterviewSession[]> {
    console.warn("RemoteStorageAdapter.getMockSessions: not implemented — returning empty array");
    return [];
  }
  async saveMockSession(_session: MockInterviewSession): Promise<void> {
    console.warn("RemoteStorageAdapter.saveMockSession: not implemented — data not persisted");
  }
  async deleteMockSession(_id: string): Promise<void> {
    console.warn("RemoteStorageAdapter.deleteMockSession: not implemented");
  }
}
