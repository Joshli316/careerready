import { vi } from "vitest";
import type { StorageAdapter } from "@/lib/storage/adapter";

export function createMockStorage(
  overrides: Partial<Record<keyof StorageAdapter, ReturnType<typeof vi.fn>>> = {}
): Record<keyof StorageAdapter, ReturnType<typeof vi.fn>> {
  return {
    getProfile: vi.fn().mockResolvedValue(null),
    setProfile: vi.fn().mockResolvedValue(undefined),
    getResumes: vi.fn().mockResolvedValue([]),
    getResume: vi.fn().mockResolvedValue(null),
    saveResume: vi.fn().mockResolvedValue(undefined),
    deleteResume: vi.fn().mockResolvedValue(undefined),
    getCoverLetters: vi.fn().mockResolvedValue([]),
    saveCoverLetter: vi.fn().mockResolvedValue(undefined),
    deleteCoverLetter: vi.fn().mockResolvedValue(undefined),
    getInterviewPrep: vi.fn().mockResolvedValue(null),
    setInterviewPrep: vi.fn().mockResolvedValue(undefined),
    getContacts: vi.fn().mockResolvedValue([]),
    getContact: vi.fn().mockResolvedValue(null),
    saveContact: vi.fn().mockResolvedValue(undefined),
    deleteContact: vi.fn().mockResolvedValue(undefined),
    getJDAnalyses: vi.fn().mockResolvedValue([]),
    saveJDAnalysis: vi.fn().mockResolvedValue(undefined),
    deleteJDAnalysis: vi.fn().mockResolvedValue(undefined),
    getMockSessions: vi.fn().mockResolvedValue([]),
    saveMockSession: vi.fn().mockResolvedValue(undefined),
    deleteMockSession: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}
