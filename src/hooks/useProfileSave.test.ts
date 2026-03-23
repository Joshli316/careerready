import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfileSave } from "./useProfileSave";
import { createMockStorage } from "@/test/createMockStorage";

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

describe("useProfileSave", () => {
  let mockStorage: ReturnType<typeof createMockStorage>;

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
