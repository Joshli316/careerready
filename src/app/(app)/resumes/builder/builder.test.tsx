import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResumeBuilderPage from "./page";
import { createMockStorage } from "@/test/createMockStorage";
import type { Resume } from "@/types/resume";

// Mock dependencies
const mockToast = vi.fn();
const mockShowSaved = vi.fn();
const mockExportResume = vi.fn();

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/hooks/useSaveIndicator", () => ({
  useSaveIndicator: () => ({ saved: false, showSaved: mockShowSaved }),
}));

vi.mock("@/hooks/usePdfExport", () => ({
  usePdfExport: () => ({ exportResume: mockExportResume, exporting: false }),
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

describe("ResumeBuilderPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getResumes.mockResolvedValue([]);
    mockStorage.getProfile.mockResolvedValue(null);
  });

  it("renders without crashing", async () => {
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Resume Builder")).toBeInTheDocument();
    });
  });

  it("shows empty resume form with default fields", async () => {
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Resume Builder")).toBeInTheDocument();
    });

    // Check resume title field exists with default value
    const titleInput = screen.getByDisplayValue("My Resume");
    expect(titleInput).toBeInTheDocument();

    // Check contact info section
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Last")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("(555) 555-5555")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@email.com")).toBeInTheDocument();

    // Check profile overview section
    expect(screen.getByText("Profile Overview")).toBeInTheDocument();

    // Check experience section
    expect(screen.getByText("Experience")).toBeInTheDocument();

    // Check education section
    expect(screen.getByText("Education")).toBeInTheDocument();

    // Check skills section
    expect(screen.getByText("Skills")).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByText("Save Resume")).toBeInTheDocument();
    expect(screen.getByText("Export PDF")).toBeInTheDocument();
  });

  it("can fill in the resume title field", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("My Resume")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("My Resume");
    await user.clear(titleInput);
    await user.type(titleInput, "Marketing Resume");

    expect(screen.getByDisplayValue("Marketing Resume")).toBeInTheDocument();
  });

  it("can fill in contact info fields", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("First Last")).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("First Last");
    await user.type(nameInput, "Jane Doe");

    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
  });

  it("shows the tip callout when no profile data exists", async () => {
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Complete the/i)
      ).toBeInTheDocument();
    });
  });

  it("shows live preview section", async () => {
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Live Preview")).toBeInTheDocument();
    });
  });

  // === NEW TESTS ===

  // 1. Save resume — click save button, verify storage.saveResume() called with correct data
  it("calls storage.saveResume with current resume data when Save is clicked", async () => {
    const user = userEvent.setup();
    const existingResume = makeResume();
    mockStorage.getResumes.mockResolvedValue([existingResume]);
    // After save, getResumes returns the updated list
    mockStorage.saveResume.mockResolvedValue(undefined);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Resume")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Save Resume"));

    await waitFor(() => {
      expect(mockStorage.saveResume).toHaveBeenCalledTimes(1);
    });

    const savedResume = mockStorage.saveResume.mock.calls[0][0] as Resume;
    expect(savedResume.id).toBe("resume-1");
    expect(savedResume.title).toBe("Test Resume");
    expect(savedResume.content.contactInfo.name).toBe("John Doe");
    expect(mockToast).toHaveBeenCalledWith("Resume saved successfully");
  });

  // 2. Multiple resumes + tab switching
  it("renders tabs for multiple resumes and switches on click", async () => {
    const user = userEvent.setup();
    const resume1 = makeResume({ id: "r1", title: "Resume Alpha" });
    const resume2 = makeResume({ id: "r2", title: "Resume Beta", content: { ...makeResume().content, contactInfo: { name: "Beta User", phone: "", email: "", linkedin: "" } } });
    mockStorage.getResumes.mockResolvedValue([resume1, resume2]);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Resume Alpha" })).toBeInTheDocument();
    });

    expect(screen.getByRole("tab", { name: "Resume Beta" })).toBeInTheDocument();

    // First resume is active by default
    expect(screen.getByDisplayValue("Resume Alpha")).toBeInTheDocument();

    // Click second tab
    await user.click(screen.getByRole("tab", { name: "Resume Beta" }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Resume Beta")).toBeInTheDocument();
    });
  });

  // 3. Add experience
  it("adds a new experience entry when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Experience")).toBeInTheDocument();
    });

    // Initially no experience entries — should show empty message
    expect(screen.getByText(/No experience added yet/i)).toBeInTheDocument();

    // Find the Add button in the Experience section
    const experienceSection = screen.getByText("Experience").closest("section")!;
    const addButton = experienceSection.querySelector("button")!;
    await user.click(addButton);

    // New experience fields should appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Job Title")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("Company")).toBeInTheDocument();
  });

  // 4. Add education
  it("adds a new education entry when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Education")).toBeInTheDocument();
    });

    // Initially no education entries
    expect(screen.getByText(/Add your degrees/i)).toBeInTheDocument();

    // Find the Add button in the Education section
    const educationHeading = screen.getByText("Education");
    const educationSection = educationHeading.closest("section")!;
    const addButton = educationSection.querySelector("button")!;
    await user.click(addButton);

    // New education fields should appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText("School / Institution")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("Degree / Certificate")).toBeInTheDocument();
  });

  // 5. Add/remove skills
  it("adds a skill via Enter key and removes it via the remove button", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Skills")).toBeInTheDocument();
    });

    const skillInput = screen.getByPlaceholderText("Add a skill...");

    // Add a skill via Enter
    await user.type(skillInput, "Python{Enter}");

    await waitFor(() => {
      // Skill chip has aria-label remove button
      expect(screen.getByLabelText("Remove skill Python")).toBeInTheDocument();
    });

    // Add another via the Add button (the one next to the skill input)
    await user.type(skillInput, "Excel");
    const skillsHeading = screen.getByRole("heading", { name: "Skills" });
    const skillsSection = skillsHeading.closest("section")!;
    const addSkillButtons = skillsSection.querySelectorAll("button");
    const addBtn = Array.from(addSkillButtons).find((b) => b.textContent === "Add")!;
    await user.click(addBtn);

    await waitFor(() => {
      expect(screen.getByLabelText("Remove skill Excel")).toBeInTheDocument();
    });

    // Remove Python
    const removeButton = screen.getByLabelText("Remove skill Python");
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByLabelText("Remove skill Python")).not.toBeInTheDocument();
    });

    // Excel should still be there
    expect(screen.getByLabelText("Remove skill Excel")).toBeInTheDocument();
  });

  // 6. Delete resume — click delete, verify confirm dialog and deleteResume called
  it("deletes a resume after confirmation", async () => {
    const user = userEvent.setup();
    const resume1 = makeResume({ id: "r1", title: "Resume One" });
    const resume2 = makeResume({ id: "r2", title: "Resume Two" });
    mockStorage.getResumes.mockResolvedValue([resume1, resume2]);
    mockStorage.deleteResume.mockResolvedValue(undefined);

    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Resume One")).toBeInTheDocument();
    });

    // Click "Delete this resume"
    const deleteButton = screen.getByText("Delete this resume");
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Delete "Resume One"? This cannot be undone.');
    await waitFor(() => {
      expect(mockStorage.deleteResume).toHaveBeenCalledWith("r1");
    });

    confirmSpy.mockRestore();
  });

  // 7. Auto-populate from profile
  it("auto-populates skills and profile overview from profile data", async () => {
    const user = userEvent.setup();
    mockStorage.getProfile.mockResolvedValue({
      skills: [
        { name: "Leadership", category: "soft", source: "self" },
        { name: "Data Analysis", category: "hard", source: "self" },
      ],
      brandStatement: "A visionary leader with strong analytical skills.",
    });

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText(/Auto-fill skills and profile/)).toBeInTheDocument();
    });

    // Click the Auto-Fill button
    await user.click(screen.getByRole("button", { name: /Auto-Fill/ }));

    // Skills should be populated — check via remove buttons (unique to skill chips)
    await waitFor(() => {
      expect(screen.getByLabelText("Remove skill Leadership")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Remove skill Data Analysis")).toBeInTheDocument();

    // Profile overview should be set (Textarea)
    const textarea = screen.getByPlaceholderText(/Detail-oriented/);
    expect(textarea).toHaveValue("A visionary leader with strong analytical skills.");
  });

  // 8. Empty resume title — leave title blank, save, verify saveResume still called
  it("saves even with an empty resume title", async () => {
    const user = userEvent.setup();
    const existingResume = makeResume();
    mockStorage.getResumes.mockResolvedValue([existingResume]);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Resume")).toBeInTheDocument();
    });

    // Clear the title
    const titleInput = screen.getByDisplayValue("Test Resume");
    await user.clear(titleInput);

    await user.click(screen.getByText("Save Resume"));

    await waitFor(() => {
      expect(mockStorage.saveResume).toHaveBeenCalledTimes(1);
    });

    const savedResume = mockStorage.saveResume.mock.calls[0][0] as Resume;
    expect(savedResume.title).toBe("");
  });

  // 9. Remove all experience — verify section shows add button
  it("shows add button after removing all experience entries", async () => {
    const user = userEvent.setup();
    const resumeWithExp = makeResume();
    mockStorage.getResumes.mockResolvedValue([resumeWithExp]);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Position 1")).toBeInTheDocument();
    });

    // Remove the single experience entry
    const removeBtn = screen.getByLabelText("Remove position 1");
    await user.click(removeBtn);

    await waitFor(() => {
      expect(screen.getByText(/No experience added yet/i)).toBeInTheDocument();
    });

    // The Add button should still be available in the Experience section
    const experienceSection = screen.getByText("Experience").closest("section")!;
    const addButton = experienceSection.querySelector("button");
    expect(addButton).toBeTruthy();
  });

  // 10. Rapid Cmd+S — dispatch keydown Ctrl+S twice quickly, verify saveResume called
  it("handles rapid Ctrl+S without crashing", async () => {
    const existingResume = makeResume();
    mockStorage.getResumes.mockResolvedValue([existingResume]);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Resume")).toBeInTheDocument();
    });

    // Fire two rapid Ctrl+S events
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });

    await waitFor(() => {
      expect(mockStorage.saveResume).toHaveBeenCalled();
    });

    // Should not crash — component still renders
    expect(screen.getByText("Resume Builder")).toBeInTheDocument();
  });

  // 11. Long skill name — verify it renders without error
  it("renders a very long skill name without error", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByText("Skills")).toBeInTheDocument();
    });

    const longSkill = "A".repeat(200);
    const skillInput = screen.getByPlaceholderText("Add a skill...");
    await user.type(skillInput, longSkill + "{Enter}");

    await waitFor(() => {
      expect(screen.getByLabelText(`Remove skill ${longSkill}`)).toBeInTheDocument();
    });
  });

  // 12. Storage quota exceeded — mock saveResume to throw, verify error toast
  it("shows error toast when storage quota is exceeded", async () => {
    const user = userEvent.setup();
    const existingResume = makeResume();
    mockStorage.getResumes.mockResolvedValue([existingResume]);
    mockStorage.saveResume.mockRejectedValue(new Error("Storage is full."));

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Resume")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Save Resume"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Failed to save resume", "error");
    });
  });

  // 13. Corrupted data — mock getResumes returning invalid data, verify graceful handling
  it("handles corrupted resume data gracefully", async () => {
    // Return data that is not a proper Resume array — e.g., objects missing required fields
    mockStorage.getResumes.mockResolvedValue([{ id: "bad", garbage: true }]);

    render(<ResumeBuilderPage />);

    // Should still render without crashing — falls back to what it can show
    await waitFor(() => {
      expect(screen.getByText("Resume Builder")).toBeInTheDocument();
    });
  });

  // 14. PDF export trigger — click Export PDF, verify exportResume called
  it("triggers PDF export when Export PDF button is clicked", async () => {
    const user = userEvent.setup();
    const existingResume = makeResume();
    mockStorage.getResumes.mockResolvedValue([existingResume]);

    render(<ResumeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Resume")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Export PDF"));

    await waitFor(() => {
      expect(mockExportResume).toHaveBeenCalledTimes(1);
    });

    // Verify the resume data was passed to export
    const exportedResume = mockExportResume.mock.calls[0][0] as Resume;
    expect(exportedResume.id).toBe("resume-1");
  });
});
