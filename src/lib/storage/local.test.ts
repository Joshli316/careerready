import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalStorageAdapter } from "./local";

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock });

describe("LocalStorageAdapter", () => {
  let adapter: LocalStorageAdapter;

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    adapter = new LocalStorageAdapter();
  });

  describe("profile", () => {
    it("returns null when no profile exists", async () => {
      const profile = await adapter.getProfile();
      expect(profile).toBeNull();
    });

    it("saves and retrieves a profile", async () => {
      const profile = {
        brandStatement: "Test brand",
        powerStatement: "Test power",
        skills: [{ name: "TypeScript", category: "hard" as const, source: "work" }],
      };
      await adapter.setProfile(profile);
      const retrieved = await adapter.getProfile();
      expect(retrieved).toEqual(profile);
    });

    it("overwrites existing profile", async () => {
      await adapter.setProfile({ brandStatement: "old" });
      await adapter.setProfile({ brandStatement: "new" });
      const result = await adapter.getProfile();
      expect(result?.brandStatement).toBe("new");
    });
  });

  describe("resumes", () => {
    const testResume = {
      id: "test-1",
      title: "Test Resume",
      template: "chronological" as const,
      content: {
        contactInfo: { name: "Jane", phone: "555", email: "j@e.com" },
        profileOverview: "Overview",
        experience: [],
        education: [],
        skills: ["TypeScript"],
        certifications: [],
      },
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    it("returns empty array when no resumes exist", async () => {
      const resumes = await adapter.getResumes();
      expect(resumes).toEqual([]);
    });

    it("saves and retrieves a resume", async () => {
      await adapter.saveResume(testResume);
      const resumes = await adapter.getResumes();
      expect(resumes).toHaveLength(1);
      expect(resumes[0].title).toBe("Test Resume");
    });

    it("updates an existing resume by id", async () => {
      await adapter.saveResume(testResume);
      await adapter.saveResume({ ...testResume, title: "Updated Resume" });
      const resumes = await adapter.getResumes();
      expect(resumes).toHaveLength(1);
      expect(resumes[0].title).toBe("Updated Resume");
    });

    it("retrieves a single resume by id", async () => {
      await adapter.saveResume(testResume);
      const resume = await adapter.getResume("test-1");
      expect(resume?.title).toBe("Test Resume");
    });

    it("returns null for non-existent resume id", async () => {
      const resume = await adapter.getResume("nonexistent");
      expect(resume).toBeNull();
    });

    it("deletes a resume", async () => {
      await adapter.saveResume(testResume);
      await adapter.deleteResume("test-1");
      const resumes = await adapter.getResumes();
      expect(resumes).toHaveLength(0);
    });
  });

  describe("contacts", () => {
    const testContact = {
      id: "c-1",
      companyName: "Acme",
      position: "Engineer",
      status: "applied" as const,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    it("returns empty array when no contacts exist", async () => {
      expect(await adapter.getContacts()).toEqual([]);
    });

    it("saves and retrieves contacts", async () => {
      await adapter.saveContact(testContact);
      const contacts = await adapter.getContacts();
      expect(contacts).toHaveLength(1);
      expect(contacts[0].companyName).toBe("Acme");
    });

    it("updates existing contact", async () => {
      await adapter.saveContact(testContact);
      await adapter.saveContact({ ...testContact, status: "interview" as const });
      const contacts = await adapter.getContacts();
      expect(contacts).toHaveLength(1);
      expect(contacts[0].status).toBe("interview");
    });

    it("deletes a contact", async () => {
      await adapter.saveContact(testContact);
      await adapter.deleteContact("c-1");
      expect(await adapter.getContacts()).toHaveLength(0);
    });
  });

  describe("interview prep", () => {
    it("returns null when no prep exists", async () => {
      expect(await adapter.getInterviewPrep()).toBeNull();
    });

    it("saves and retrieves interview prep", async () => {
      const prep = {
        commonResponses: [{ question: "Q1", answer: "A1", category: "common" as const }],
        starStories: [],
        companyResearch: [],
        thankYouNotes: [],
      };
      await adapter.setInterviewPrep(prep);
      const result = await adapter.getInterviewPrep();
      expect(result?.commonResponses).toHaveLength(1);
    });
  });

  describe("cover letters", () => {
    const testLetter = {
      id: "cl-1",
      title: "Test Letter",
      content: {
        recipientName: "Jane",
        recipientTitle: "HR",
        company: "Acme",
        address: "123 St",
        opening: "Hello",
        body: "Body",
        closing: "Thanks",
      },
      createdAt: "2026-01-01",
    };

    it("saves and retrieves cover letters", async () => {
      await adapter.saveCoverLetter(testLetter);
      const letters = await adapter.getCoverLetters();
      expect(letters).toHaveLength(1);
    });

    it("deletes a cover letter", async () => {
      await adapter.saveCoverLetter(testLetter);
      await adapter.deleteCoverLetter("cl-1");
      expect(await adapter.getCoverLetters()).toHaveLength(0);
    });
  });
});
