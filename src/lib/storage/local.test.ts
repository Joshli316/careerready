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

    it("saves and retrieves starStories within InterviewPrep", async () => {
      const story = {
        id: "star-1",
        question: "Tell me about a challenge.",
        situation: "Tight deadline",
        task: "Ship on time",
        action: "Prioritized tasks",
        result: "Shipped 2 days early",
        tags: [],
        strength: 4,
        earnedSecret: "Delegation works",
        primarySkill: "Leadership" as const,
        secondarySkill: "Time Management" as const,
        deployFor: "startup roles",
        useCount: 1,
      };
      const prep = {
        commonResponses: [],
        starStories: [story],
        companyResearch: [],
        thankYouNotes: [],
      };
      await adapter.setInterviewPrep(prep);
      const result = await adapter.getInterviewPrep();
      expect(result?.starStories).toHaveLength(1);
      expect(result?.starStories[0].id).toBe("star-1");
      expect(result?.starStories[0].question).toBe("Tell me about a challenge.");
      expect(result?.starStories[0].primarySkill).toBe("Leadership");
    });

    it("overwrites starStories on update", async () => {
      const prep = {
        commonResponses: [],
        starStories: [
          { id: "s1", question: "Q1", situation: "", task: "", action: "", result: "", tags: [], strength: 0, earnedSecret: "", primarySkill: "" as const, secondarySkill: "" as const, deployFor: "", useCount: 0 },
        ],
        companyResearch: [],
        thankYouNotes: [],
      };
      await adapter.setInterviewPrep(prep);

      const updated = {
        ...prep,
        starStories: [
          { ...prep.starStories[0], question: "Updated Q1" },
          { id: "s2", question: "Q2", situation: "", task: "", action: "", result: "", tags: [], strength: 0, earnedSecret: "", primarySkill: "" as const, secondarySkill: "" as const, deployFor: "", useCount: 0 },
        ],
      };
      await adapter.setInterviewPrep(updated);

      const result = await adapter.getInterviewPrep();
      expect(result?.starStories).toHaveLength(2);
      expect(result?.starStories[0].question).toBe("Updated Q1");
      expect(result?.starStories[1].id).toBe("s2");
    });
  });

  describe("JD analyses", () => {
    const testAnalysis = {
      id: "jd-1",
      createdAt: "2026-03-21T00:00:00Z",
      jobTitle: "Frontend Engineer",
      company: "Acme",
      rawJD: "We are looking for a frontend engineer...",
      summary: "A frontend role at Acme.",
      requirements: [],
      storyMatches: [],
      gaps: [],
      mockQuestions: [],
      prepChecklist: [],
    };

    it("returns empty array when no analyses exist", async () => {
      expect(await adapter.getJDAnalyses()).toEqual([]);
    });

    it("saves and retrieves an analysis", async () => {
      await adapter.saveJDAnalysis(testAnalysis);
      const analyses = await adapter.getJDAnalyses();
      expect(analyses).toHaveLength(1);
      expect(analyses[0].jobTitle).toBe("Frontend Engineer");
    });

    it("upserts — replaces existing by id", async () => {
      await adapter.saveJDAnalysis(testAnalysis);
      await adapter.saveJDAnalysis({ ...testAnalysis, jobTitle: "Backend Engineer" });
      const analyses = await adapter.getJDAnalyses();
      expect(analyses).toHaveLength(1);
      expect(analyses[0].jobTitle).toBe("Backend Engineer");
    });

    it("deletes an analysis by id", async () => {
      await adapter.saveJDAnalysis(testAnalysis);
      await adapter.deleteJDAnalysis("jd-1");
      expect(await adapter.getJDAnalyses()).toHaveLength(0);
    });
  });

  describe("mock sessions", () => {
    const testSession = {
      id: "ms-1",
      createdAt: "2026-03-21T00:00:00Z",
      sourceType: "generic" as const,
      sourceLabel: "Generic Practice",
      jobContext: "Entry-level position",
      exchanges: [
        { question: "Tell me about yourself.", type: "behavioral" as const, answer: "I am a developer.", feedback: "Good start." },
      ],
      summary: null,
      completed: false,
    };

    it("returns empty array when no sessions exist", async () => {
      expect(await adapter.getMockSessions()).toEqual([]);
    });

    it("saves and retrieves a session", async () => {
      await adapter.saveMockSession(testSession);
      const sessions = await adapter.getMockSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].sourceLabel).toBe("Generic Practice");
    });

    it("upserts — replaces existing by id", async () => {
      await adapter.saveMockSession(testSession);
      await adapter.saveMockSession({ ...testSession, completed: true, summary: "Done" });
      const sessions = await adapter.getMockSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].completed).toBe(true);
      expect(sessions[0].summary).toBe("Done");
    });

    it("deletes a session by id", async () => {
      await adapter.saveMockSession(testSession);
      await adapter.deleteMockSession("ms-1");
      expect(await adapter.getMockSessions()).toHaveLength(0);
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
