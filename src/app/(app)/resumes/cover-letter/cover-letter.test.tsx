import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoverLetterPage from "./page";
import { createMockStorage } from "@/test/createMockStorage";
import type { CoverLetter, Resume } from "@/types/resume";

// Mock dependencies
const mockToast = vi.fn();
const mockShowSaved = vi.fn();
const mockExportCoverLetter = vi.fn();

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/hooks/useSaveIndicator", () => ({
  useSaveIndicator: () => ({ saved: false, showSaved: mockShowSaved }),
}));

vi.mock("@/hooks/usePdfExport", () => ({
  usePdfExport: () => ({ exportCoverLetter: mockExportCoverLetter, exporting: false }),
}));

const mockStorage = createMockStorage();

vi.mock("@/hooks/useStorage", () => ({
  useStorage: () => mockStorage,
}));

function makeResume(overrides: Partial<Resume> = {}): Resume {
  return {
    id: "resume-1",
    title: "Test Resume",
    template: "chronological",
    content: {
      contactInfo: { name: "John Doe", phone: "555-1234", email: "john@test.com", linkedin: "" },
      profileOverview: "A skilled developer.",
      experience: [{ title: "Dev", company: "Acme", location: "NY", dates: "2024-Present", bullets: ["Built things"] }],
      education: [{ school: "MIT", degree: "BS CS", location: "Boston", dates: "2020-2024" }],
      skills: ["JavaScript", "React"],
      certifications: [],
    },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function makeCoverLetter(overrides: Partial<CoverLetter> = {}): CoverLetter {
  return {
    id: "cl-1",
    title: "My Cover Letter",
    content: {
      recipientName: "Mr. Smith",
      recipientTitle: "HR Director",
      company: "Acme Corp",
      address: "123 Main St",
      opening: "I am writing to apply for the position.",
      body: "My experience in software development makes me a strong candidate.",
      closing: "I look forward to hearing from you.",
    },
    createdAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("CoverLetterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getCoverLetters.mockResolvedValue([]);
    mockStorage.getProfile.mockResolvedValue(null);
    mockStorage.getResumes.mockResolvedValue([]);
  });

  // === Happy Paths ===

  // 1. Renders empty state
  it("renders empty state with form fields when no cover letters exist", async () => {
    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    // Check recipient fields exist
    expect(screen.getByLabelText("Hiring Manager Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Title (optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByLabelText("Address (optional)")).toBeInTheDocument();

    // Check paragraph sections
    expect(screen.getByText("Opening Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Body Paragraph")).toBeInTheDocument();
    expect(screen.getByText("Closing Paragraph")).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText("Export PDF")).toBeInTheDocument();
    expect(screen.getByText("Save Cover Letter")).toBeInTheDocument();

    // All fields should be empty
    expect(screen.getByLabelText("Hiring Manager Name")).toHaveValue("");
  });

  // 2. Loads saved cover letter
  it("loads and populates a saved cover letter", async () => {
    const saved = makeCoverLetter();
    mockStorage.getCoverLetters.mockResolvedValue([saved]);

    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Hiring Manager Name")).toHaveValue("Mr. Smith");
    });

    expect(screen.getByLabelText("Title (optional)")).toHaveValue("HR Director");
    expect(screen.getByLabelText("Company")).toHaveValue("Acme Corp");
    expect(screen.getByLabelText("Address (optional)")).toHaveValue("123 Main St");

    // Check textarea content via display value
    expect(screen.getByDisplayValue("I am writing to apply for the position.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("My experience in software development makes me a strong candidate.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("I look forward to hearing from you.")).toBeInTheDocument();
  });

  // 3. Save cover letter
  it("saves cover letter and shows toast on save", async () => {
    const user = userEvent.setup();
    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    // Fill some fields
    await user.type(screen.getByLabelText("Hiring Manager Name"), "Jane Recruiter");
    await user.type(screen.getByLabelText("Company"), "Tech Corp");

    await user.click(screen.getByText("Save Cover Letter"));

    await waitFor(() => {
      expect(mockStorage.saveCoverLetter).toHaveBeenCalledTimes(1);
    });

    const savedData = mockStorage.saveCoverLetter.mock.calls[0][0] as CoverLetter;
    expect(savedData.content.recipientName).toBe("Jane Recruiter");
    expect(savedData.content.company).toBe("Tech Corp");

    expect(mockShowSaved).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith("Saved successfully", "success");
  });

  // 4. Toggle Edit/Preview
  it("toggles between edit and preview on mobile", async () => {
    const user = userEvent.setup();
    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    // Find the toggle button - it shows "Preview" initially
    const toggleButton = screen.getByRole("button", { name: /Preview/i });
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);

    // After clicking, it should now show "Edit"
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
    });
  });

  // 5. PDF export
  it("triggers PDF export when Export PDF is clicked", async () => {
    const user = userEvent.setup();
    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Export PDF"));

    await waitFor(() => {
      expect(mockExportCoverLetter).toHaveBeenCalledTimes(1);
    });

    // Verify a CoverLetter object was passed
    const exportedLetter = mockExportCoverLetter.mock.calls[0][0] as CoverLetter;
    expect(exportedLetter.title).toBe("My Cover Letter");
  });

  // === AI Integration ===

  // 6. AI form submits and populates fields
  it("populates cover letter fields after AI generation", async () => {
    const user = userEvent.setup();
    const resume = makeResume();
    mockStorage.getResumes.mockResolvedValue([resume]);

    // Mock fetch for AI endpoint
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        result: {
          recipientName: "Hiring Manager",
          opening: "AI generated opening paragraph.",
          body: "AI generated body paragraph.",
          closing: "AI generated closing paragraph.",
        },
        remaining: 5,
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<CoverLetterPage />);

    // Wait for saved resume to load in AI form
    await waitFor(() => {
      expect(screen.getByText("Test Resume")).toBeInTheDocument();
    });

    // Click saved resume button to switch resume source (initial state is "pasted" since savedResume arrives after mount)
    await user.click(screen.getByText("Test Resume"));

    // Fill AI form fields
    await user.type(screen.getByLabelText("Company Name"), "TestCo");
    await user.type(screen.getByLabelText("Job Title"), "Engineer");
    await user.type(screen.getByLabelText("Job Description"), "Build great software");

    // Click generate
    await user.click(screen.getByRole("button", { name: /Generate Cover Letter/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Verify fields were populated
    await waitFor(() => {
      expect(screen.getByDisplayValue("AI generated opening paragraph.")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("AI generated body paragraph.")).toBeInTheDocument();
    expect(screen.getByDisplayValue("AI generated closing paragraph.")).toBeInTheDocument();

    // Verify success toast
    expect(mockToast).toHaveBeenCalledWith(
      expect.stringContaining("Cover letter generated"),
      "success"
    );

    vi.unstubAllGlobals();
  });

  // 7. AI form shows confirmation when overwriting
  it("shows confirmation dialog when generating over existing content", async () => {
    const user = userEvent.setup();
    const existingLetter = makeCoverLetter();
    mockStorage.getCoverLetters.mockResolvedValue([existingLetter]);
    mockStorage.getResumes.mockResolvedValue([makeResume()]);

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<CoverLetterPage />);

    // Wait for both letter and resume to load
    await waitFor(() => {
      expect(screen.getByLabelText("Hiring Manager Name")).toHaveValue("Mr. Smith");
    });
    await waitFor(() => {
      expect(screen.getByText("Test Resume")).toBeInTheDocument();
    });

    // Click saved resume button to switch resume source
    await user.click(screen.getByText("Test Resume"));

    // Fill AI form - job description is required
    await user.type(screen.getByLabelText("Job Description"), "Build great software");

    // Click generate - should trigger confirmation since content exists
    await user.click(screen.getByRole("button", { name: /Generate Cover Letter/i }));

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledWith(
        "This will replace your current cover letter content. Continue?"
      );
    });

    confirmSpy.mockRestore();
  });

  // 8. Resume source toggle
  it("shows saved resume option when a resume exists", async () => {
    const resume = makeResume();
    mockStorage.getResumes.mockResolvedValue([resume]);

    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    // Should show saved resume button with resume title
    await waitFor(() => {
      expect(screen.getByText("Test Resume")).toBeInTheDocument();
    });

    // Should also show "Paste text" option
    expect(screen.getByText("Paste text")).toBeInTheDocument();
  });

  // === Edge Cases ===

  // 9. Empty content saves
  it("saves with all empty fields without error", async () => {
    const user = userEvent.setup();
    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    // Save without filling anything
    await user.click(screen.getByText("Save Cover Letter"));

    await waitFor(() => {
      expect(mockStorage.saveCoverLetter).toHaveBeenCalledTimes(1);
    });

    const savedData = mockStorage.saveCoverLetter.mock.calls[0][0] as CoverLetter;
    expect(savedData.content.recipientName).toBe("");
    expect(savedData.content.opening).toBe("");
    expect(savedData.content.body).toBe("");
    expect(savedData.content.closing).toBe("");
  });

  // 10. Long body text
  it("renders very long body text without error", async () => {
    const longText = "A".repeat(5000);
    const letterWithLongBody = makeCoverLetter({
      content: {
        recipientName: "Test",
        recipientTitle: "",
        company: "",
        address: "",
        opening: "",
        body: longText,
        closing: "",
      },
    });
    mockStorage.getCoverLetters.mockResolvedValue([letterWithLongBody]);

    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(longText)).toBeInTheDocument();
    });

    // Component rendered without crashing
    expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
  });

  // === Error Handling ===

  // 11. AI generation fails
  it("shows error toast when AI generation fails with 500", async () => {
    const user = userEvent.setup();
    mockStorage.getResumes.mockResolvedValue([makeResume()]);

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Internal server error" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<CoverLetterPage />);

    // Wait for saved resume to load
    await waitFor(() => {
      expect(screen.getByText("Test Resume")).toBeInTheDocument();
    });

    // Click saved resume button to switch resume source
    await user.click(screen.getByText("Test Resume"));

    // Fill required AI form fields
    await user.type(screen.getByLabelText("Job Description"), "Build great software");

    await user.click(screen.getByRole("button", { name: /Generate Cover Letter/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Internal server error", "error");
    });

    vi.unstubAllGlobals();
  });

  // 12. Save fails
  it("shows error toast when save fails", async () => {
    const user = userEvent.setup();
    mockStorage.saveCoverLetter.mockRejectedValue(new Error("Storage full"));

    render(<CoverLetterPage />);

    await waitFor(() => {
      expect(screen.getByText("Cover Letter Builder")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Save Cover Letter"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        "Failed to save cover letter. Please try again.",
        "error"
      );
    });
  });
});
