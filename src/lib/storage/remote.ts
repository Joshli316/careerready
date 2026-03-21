import type { StorageAdapter } from "./adapter";
import type { UserProfile } from "@/types/profile";
import type { Resume, CoverLetter } from "@/types/resume";
import type { EmployerContact } from "@/types/contact";
import type { InterviewPrep } from "@/types/interview";
import type { JDAnalysis } from "@/app/(app)/interviews/jd-decoder/types";

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

  async getJDAnalyses(): Promise<JDAnalysis[]> {
    return [];
  }
  async saveJDAnalysis(_analysis: JDAnalysis): Promise<void> {
    // Remote storage not yet implemented for JD analyses
  }
  async deleteJDAnalysis(_id: string): Promise<void> {
    // Remote storage not yet implemented for JD analyses
  }
}
