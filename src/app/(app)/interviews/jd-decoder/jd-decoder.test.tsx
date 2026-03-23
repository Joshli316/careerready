import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JDDecoderPage from "./page";
import { createMockStorage } from "@/test/createMockStorage";
import type { JDAnalysis, PrepChecklistItem } from "./types";
import type { StarStory, InterviewPrep } from "@/types/interview";

// --- Mocks ---

const mockToast = vi.fn();

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockStorage = createMockStorage();

vi.mock("@/hooks/useStorage", () => ({
  useStorage: () => mockStorage,
}));

// Mock HTMLDialogElement methods (not supported by jsdom)
HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});

// --- Test Data Factories ---

function makeStory(overrides: Partial<StarStory> = {}): StarStory {
  return {
    id: "story-1",
    question: "Tell me about a leadership experience",
    situation: "Led a team of 5",
    task: "Deliver a project on time",
    action: "Organized sprints and daily standups",
    result: "Delivered 2 weeks early",
    tags: ["leadership"],
    strength: 4,
    earnedSecret: "",
    primarySkill: "Leadership",
    secondarySkill: "Teamwork",
    deployFor: "management roles",
    useCount: 2,
    ...overrides,
  };
}

function makeChecklistItem(overrides: Partial<PrepChecklistItem> = {}): PrepChecklistItem {
  return {
    id: "chk-1",
    label: "Practice your leadership story",
    type: "practice",
    done: false,
    ...overrides,
  };
}

function makeAnalysis(overrides: Partial<JDAnalysis> = {}): JDAnalysis {
  return {
    id: "analysis-1",
    createdAt: "2025-06-01T00:00:00.000Z",
    jobTitle: "Software Engineer",
    company: "TestCo",
    rawJD: "We are looking for a software engineer with 3+ years of experience...",
    summary: "A mid-level software engineering role focusing on full-stack development.",
    requirements: [
      {
        id: "req-1",
        category: "hard_skill",
        description: "3+ years TypeScript experience",
        importance: "must_have",
        competency: "Technical Skills",
      },
      {
        id: "req-2",
        category: "soft_skill",
        description: "Strong communication skills",
        importance: "nice_to_have",
        competency: "Communication",
      },
    ],
    storyMatches: [
      {
        requirementId: "req-1",
        storyId: "story-1",
        relevanceScore: 4,
        talkingPoints: ["Led TypeScript migration", "Built type-safe APIs"],
      },
    ],
    gaps: [
      {
        requirementId: "req-2",
        suggestion: "Prepare a story about cross-team communication",
        suggestedQuestion: "Tell me about a time you communicated a complex idea",
      },
    ],
    mockQuestions: [
      {
        question: "Describe your experience with TypeScript",
        type: "technical",
        targetRequirementIds: ["req-1"],
        suggestedStoryIds: ["story-1"],
        talkingPoints: ["Mention migration project", "Discuss type safety benefits"],
      },
    ],
    prepChecklist: [
      makeChecklistItem({ id: "chk-1", label: "Practice your leadership story", type: "practice" }),
      makeChecklistItem({ id: "chk-2", label: "Research TestCo engineering blog", type: "research" }),
    ],
    ...overrides,
  };
}

const sampleApiResult = {
  jobTitle: "Frontend Developer",
  company: "AcmeCorp",
  summary: "A frontend role building React apps.",
  requirements: [
    {
      id: "req-api-1",
      category: "hard_skill",
      description: "React and TypeScript expertise",
      importance: "must_have",
      competency: "Technical Skills",
    },
  ],
  storyMatches: [],
  gaps: [
    {
      requirementId: "req-api-1",
      suggestion: "Prepare a React story",
      suggestedQuestion: "Tell me about a React project",
    },
  ],
  mockQuestions: [
    {
      question: "How do you approach component architecture?",
      type: "technical",
      targetRequirementIds: ["req-api-1"],
      suggestedStoryIds: [],
      talkingPoints: ["Discuss composition patterns"],
    },
  ],
  prepChecklist: [
    { id: "chk-api-1", label: "Study React patterns", type: "research" },
  ],
};

// --- Tests ---

describe("JDDecoderPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getJDAnalyses.mockResolvedValue([]);
    mockStorage.getInterviewPrep.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // === Happy Paths ===

  // 1. Renders empty state
  it("renders empty state with input form and textarea", async () => {
    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByText("JD Decoder")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    expect(screen.getByText("Analyze This Job")).toBeInTheDocument();
  });

  // 2. Display saved analysis
  it("displays a saved analysis with job title and company", async () => {
    const analysis = makeAnalysis();
    mockStorage.getJDAnalyses.mockResolvedValue([analysis]);
    mockStorage.getInterviewPrep.mockResolvedValue({
      starStories: [makeStory()],
      commonResponses: [],
      companyResearch: [],
      thankYouNotes: [],
    } as InterviewPrep);

    const user = userEvent.setup();
    render(<JDDecoderPage />);

    // Wait for saved analyses to load, then click the saved analysis tag
    await waitFor(() => {
      expect(screen.getByText("Software Engineer — TestCo")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Software Engineer — TestCo"));

    // Verify the analysis summary renders
    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText(/at TestCo/)).toBeInTheDocument();
    });
  });

  // 3. Submit JD and display results
  it("submits JD text and displays decoded analysis results", async () => {
    const user = userEvent.setup();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: sampleApiResult }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Paste the full job posting/);
    const jdText = "A".repeat(60); // More than 50 chars
    await user.type(textarea, jdText);

    await user.click(screen.getByText("Analyze This Job"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    // Verify analysis appears
    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText(/at AcmeCorp/)).toBeInTheDocument();
    });

    expect(mockToast).toHaveBeenCalledWith("JD decoded successfully!", "success");
  });

  // 4. Save analysis to storage
  it("saves analysis to storage after successful decode", async () => {
    const user = userEvent.setup();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: sampleApiResult }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Paste the full job posting/);
    await user.type(textarea, "A".repeat(60));

    await user.click(screen.getByText("Analyze This Job"));

    await waitFor(() => {
      expect(mockStorage.saveJDAnalysis).toHaveBeenCalledTimes(1);
    });

    const savedAnalysis = mockStorage.saveJDAnalysis.mock.calls[0][0] as JDAnalysis;
    expect(savedAnalysis.jobTitle).toBe("Frontend Developer");
    expect(savedAnalysis.company).toBe("AcmeCorp");
    expect(savedAnalysis.rawJD).toBe("A".repeat(60));
    expect(savedAnalysis.requirements).toHaveLength(1);
  });

  // 5. Delete saved analysis
  it("deletes a saved analysis after confirmation", async () => {
    const analysis = makeAnalysis();
    mockStorage.getJDAnalyses.mockResolvedValue([analysis]);

    const user = userEvent.setup();
    render(<JDDecoderPage />);

    // Wait for the saved analysis tag to appear
    await waitFor(() => {
      expect(screen.getByText("Software Engineer — TestCo")).toBeInTheDocument();
    });

    // Click the delete button (trash icon)
    const deleteButton = screen.getByLabelText("Delete Software Engineer analysis");
    await user.click(deleteButton);

    // Confirm dialog should appear — click the "Delete" confirm button
    await waitFor(() => {
      expect(screen.getByText("Delete Analysis")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(mockStorage.deleteJDAnalysis).toHaveBeenCalledWith("analysis-1");
    });
  });

  // === Edge Cases ===

  // 6. JD under 50 chars disables submit
  it("disables submit button when JD text is under 50 characters", async () => {
    const user = userEvent.setup();
    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Paste the full job posting/);
    await user.type(textarea, "Short JD text");

    expect(screen.getByText("Analyze This Job")).toBeDisabled();
  });

  // 7. JD at 15000 char limit
  it("enables submit and shows character count at 15000 char limit", async () => {
    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Paste the full job posting/) as HTMLTextAreaElement;

    // Use fireEvent for large paste (userEvent.type would be extremely slow)
    const longText = "A".repeat(15000);
    // Simulate paste by directly setting value and firing input event
    // We need to use native event approach since userEvent.type for 15000 chars is too slow
    Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value"
    )!.set!.call(textarea, longText);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    // React uses onChange which maps to the input event; trigger change as well
    textarea.dispatchEvent(new Event("change", { bubbles: true }));

    await waitFor(() => {
      expect(screen.getByText("15,000 / 15,000")).toBeInTheDocument();
    });

    expect(screen.getByText("Analyze This Job")).not.toBeDisabled();
  });

  // 8. No STAR stories — all requirements are gaps
  it("works with no STAR stories — all requirements shown as gaps", async () => {
    const user = userEvent.setup();
    mockStorage.getInterviewPrep.mockResolvedValue({
      starStories: [],
      commonResponses: [],
      companyResearch: [],
      thankYouNotes: [],
    } as InterviewPrep);

    const allGapsResult = {
      ...sampleApiResult,
      storyMatches: [],
      gaps: [
        {
          requirementId: "req-api-1",
          suggestion: "Prepare a React story",
          suggestedQuestion: "Tell me about a React project",
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: allGapsResult }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/Paste the full job posting/), "A".repeat(60));
    await user.click(screen.getByText("Analyze This Job"));

    await waitFor(() => {
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    });

    // Verify the gap suggestion is shown
    expect(screen.getByText("Prepare a React story")).toBeInTheDocument();
  });

  // 9. Toggle checklist item
  it("toggles a checklist item when clicked", async () => {
    const analysis = makeAnalysis();
    mockStorage.getJDAnalyses.mockResolvedValue([analysis]);

    const user = userEvent.setup();
    render(<JDDecoderPage />);

    // Select the saved analysis
    await waitFor(() => {
      expect(screen.getByText("Software Engineer — TestCo")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Software Engineer — TestCo"));

    // Wait for checklist to render
    await waitFor(() => {
      expect(screen.getByText("Practice your leadership story")).toBeInTheDocument();
    });

    // Find the toggle button (role="checkbox") for the checklist item
    const toggleBtn = screen.getByRole("checkbox", { name: "Practice your leadership story" });
    expect(toggleBtn).toHaveAttribute("aria-checked", "false");

    await user.click(toggleBtn);

    await waitFor(() => {
      expect(toggleBtn).toHaveAttribute("aria-checked", "true");
    });

    // Verify storage was called to save the updated analysis
    expect(mockStorage.saveJDAnalysis).toHaveBeenCalled();
  });

  // === Error Handling ===

  // 10. API returns 500
  it("shows error toast when API returns 500", async () => {
    const user = userEvent.setup();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Internal server error" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/Paste the full job posting/), "A".repeat(60));
    await user.click(screen.getByText("Analyze This Job"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Internal server error", "error");
    });
  });

  // 11. API returns 429
  it("shows rate limit message when API returns 429", async () => {
    const user = userEvent.setup();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Daily AI limit reached. Try again tomorrow." }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/Paste the full job posting/), "A".repeat(60));
    await user.click(screen.getByText("Analyze This Job"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Daily AI limit reached. Try again tomorrow.", "error");
    });
  });

  // 12. Malformed API response
  it("handles malformed API response gracefully", async () => {
    const user = userEvent.setup();

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new SyntaxError("Unexpected token")),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<JDDecoderPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Paste the full job posting/)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText(/Paste the full job posting/), "A".repeat(60));
    await user.click(screen.getByText("Analyze This Job"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Something went wrong. Please try again.", "error");
    });
  });
});
