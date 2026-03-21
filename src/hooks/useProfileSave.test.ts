import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfileSave } from "./useProfileSave";
import type { StorageAdapter } from "@/lib/storage/adapter";

// Mock dependencies
const mockShowSaved = vi.fn();
const mockToast = vi.fn();

vi.mock("@/hooks/useStorage", () => ({
  useStorage: vi.fn(),
}));

vi.mock("@/hooks/useSaveIndicator", () => ({
  useSaveIndicator: () => ({ saved: false, showSaved: mockShowSaved }),
}));

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Import after mocks
import { useStorage } from "@/hooks/useStorage";
const mockUseStorage = vi.mocked(useStorage);

function createMockStorage(overrides: Partial<StorageAdapter> = {}): StorageAdapter {
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
    ...overrides,
  };
}

describe("useProfileSave", () => {
  let mockStorage: StorageAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = createMockStorage();
    mockUseStorage.mockReturnValue(mockStorage);
  });

  it("save() calls storage.getProfile() then storage.setProfile() with merged data", async () => {
    const { result } = renderHook(() => useProfileSave());

    await act(async () => {
      await result.current.save({ brandStatement: "I am awesome" });
    });

    expect(mockStorage.getProfile).toHaveBeenCalledOnce();
    expect(mockStorage.setProfile).toHaveBeenCalledWith({ brandStatement: "I am awesome" });
  });

  it("save() calls showSaved() and toast() on success", async () => {
    const { result } = renderHook(() => useProfileSave());

    await act(async () => {
      await result.current.save({ brandStatement: "Test" });
    });

    expect(mockShowSaved).toHaveBeenCalledOnce();
    expect(mockToast).toHaveBeenCalledWith("Saved successfully", "success");
  });

  it("save() calls toast() with error on failure", async () => {
    mockStorage = createMockStorage({
      getProfile: vi.fn().mockRejectedValue(new Error("DB error")),
    });
    mockUseStorage.mockReturnValue(mockStorage);

    const { result } = renderHook(() => useProfileSave());

    await act(async () => {
      await result.current.save({ brandStatement: "Test" });
    });

    expect(mockToast).toHaveBeenCalledWith("Failed to save. Please try again.", "error");
    expect(mockShowSaved).not.toHaveBeenCalled();
  });

  it("save() merges patch with existing profile (does not overwrite other fields)", async () => {
    mockStorage = createMockStorage({
      getProfile: vi.fn().mockResolvedValue({
        brandStatement: "Original brand",
        powerStatement: "Original power",
      }),
    });
    mockUseStorage.mockReturnValue(mockStorage);

    const { result } = renderHook(() => useProfileSave());

    await act(async () => {
      await result.current.save({ brandStatement: "Updated brand" });
    });

    expect(mockStorage.setProfile).toHaveBeenCalledWith({
      brandStatement: "Updated brand",
      powerStatement: "Original power",
    });
  });
});
