import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockInterviewPage from "./page";
import { createMockStorage } from "@/test/createMockStorage";
import type { MockInterviewSession } from "./types";

// --- Mocks ---

const mockToast = vi.fn();

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockStorage = createMockStorage();

vi.mock("@/hooks/useStorage", () => ({
  useStorage: () => mockStorage,
}));

vi.mock("nanoid", () => ({
  nanoid: () => "test-session-id",
}));

// Mock HTMLDialogElement methods (not supported by jsdom)
HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});

// --- Test Data Factories ---

function makeSession(overrides: Partial<MockInterviewSession> = {}): MockInterviewSession {
  return {
    id: "session-1",
    createdAt: "2025-06-01T00:00:00.000Z",
    sourceType: "generic",
    sourceLabel: "Generic Practice",
    jobContext: "Entry-level position",
    exchanges: [
      {
        question: "Tell me about yourself.",
        type: "behavioral",
        answer: "I am a software engineer with experience in building web apps.",
        feedback: "Good structure. Consider adding more specifics about your achievements.",
      },
      {
        question: "Why are you interested in this position?",
        type: "culture_fit",
        answer: "I love the company mission and want to contribute to the team.",
        feedback: "Show more research about the company. Mention specific products or values.",
      },
    ],
    summary: "Overall good performance with room for improvement in specificity.",
    completed: true,
    ...overrides,
  };
}

// --- Helper: mock fetch for both API endpoints ---

function createMockFetch(options?: {
  coachOk?: boolean;
  coachResult?: string;
  coachError?: string;
  summaryOk?: boolean;
  summaryResult?: {
    overall: string;
    strengths: string[];
    improvements: string[];
    confidenceRating: number;
    confidenceNote: string;
  };
  summaryError?: string;
}) {
  const opts = {
    coachOk: true,
    coachResult: "Great answer! You demonstrated strong communication skills.",
    summaryOk: true,
    summaryResult: {
      overall: "You performed well overall with clear and structured answers.",
      strengths: ["Clear communication", "Good examples"],
      improvements: ["Add more specifics", "Use STAR format"],
      confidenceRating: 7,
      confidenceNote: "Ready for most entry-level interviews",
    },
    ...options,
  };

  return vi.fn().mockImplementation((url: string) => {
    if (url.includes("coach-response")) {
      if (!opts.coachOk) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: opts.coachError || "Server error" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: opts.coachResult }),
      });
    }
    if (url.includes("mock-summary")) {
      if (!opts.summaryOk) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: opts.summaryError || "Server error" }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: opts.summaryResult }),
      });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });
}

// --- Tests ---

describe("MockInterviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getJDAnalyses.mockResolvedValue([]);
    mockStorage.getMockSessions.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // === Happy Paths ===

  // 1. Setup renders
  it("shows Quick Practice and From a Job Posting options on setup", async () => {
    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Practice")).toBeInTheDocument();
    });

    expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
  });

  // 2. Start quick practice
  it("transitions to answering phase when clicking Start Quick Practice", async () => {
    const user = userEvent.setup();
    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Start Quick Practice"));

    await waitFor(() => {
      expect(screen.getByText("Tell me about yourself.")).toBeInTheDocument();
    });

    expect(screen.getByText("Question 1 of 6")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
  });

  // 3. Submit answer
  it("transitions to feedback phase after submitting an answer", async () => {
    const user = userEvent.setup();
    const mockFetch = createMockFetch();
    vi.stubGlobal("fetch", mockFetch);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Start Quick Practice"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Answer as if you're talking/);
    await user.type(textarea, "I am a dedicated software engineer with three years of experience building web applications and APIs.");

    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("AI Feedback")).toBeInTheDocument();
      expect(screen.getByText("Great answer! You demonstrated strong communication skills.")).toBeInTheDocument();
    });
  });

  // 4. Next question
  it("advances to the next question when clicking Next", async () => {
    const user = userEvent.setup();
    const mockFetch = createMockFetch();
    vi.stubGlobal("fetch", mockFetch);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Start Quick Practice"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
    });

    // Answer question 1
    await user.type(
      screen.getByPlaceholderText(/Answer as if you're talking/),
      "I am a dedicated software engineer with three years of experience building web applications."
    );
    await user.click(screen.getByText("Submit"));

    // Wait for feedback
    await waitFor(() => {
      expect(screen.getByText("AI Feedback")).toBeInTheDocument();
    });

    // Click Next
    await user.click(screen.getByText("Next"));

    // Should be on question 2
    await waitFor(() => {
      expect(screen.getByText("Question 2 of 6")).toBeInTheDocument();
      expect(screen.getByText("Why are you interested in this position?")).toBeInTheDocument();
    });
  });

  // 5. Finish interview
  it("shows summary after finishing the last question", async () => {
    const user = userEvent.setup();
    const mockFetch = createMockFetch();
    vi.stubGlobal("fetch", mockFetch);

    // Use a JD analysis with only 1 mock question so we can finish quickly
    mockStorage.getJDAnalyses.mockResolvedValue([
      {
        id: "jd-1",
        createdAt: "2025-06-01T00:00:00.000Z",
        jobTitle: "Tester",
        company: "TestCo",
        rawJD: "A test job",
        summary: "A test role",
        requirements: [],
        storyMatches: [],
        gaps: [],
        mockQuestions: [
          {
            question: "Describe your testing experience",
            type: "technical" as const,
            targetRequirementIds: [],
            suggestedStoryIds: [],
            talkingPoints: ["Talk about testing"],
          },
        ],
        prepChecklist: [],
      },
    ]);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Practice for a Specific Job")).toBeInTheDocument();
    });

    // Select the JD analysis
    await user.click(screen.getByText("Tester"));
    await user.click(screen.getByText("Start Job-Specific Practice"));

    // Answer the only question
    await waitFor(() => {
      expect(screen.getByText("Describe your testing experience")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/Answer as if you're talking/),
      "I have extensive testing experience with unit tests, integration tests, and E2E tests."
    );
    await user.click(screen.getByText("Submit"));

    // On feedback, should show "Finish Interview" since it's the last question
    await waitFor(() => {
      expect(screen.getByText("Finish Interview")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Finish Interview"));

    // Summary should appear
    await waitFor(() => {
      expect(screen.getByText("How You Did")).toBeInTheDocument();
      expect(screen.getByText("You performed well overall with clear and structured answers.")).toBeInTheDocument();
    });

    // Session should have been saved
    expect(mockStorage.saveMockSession).toHaveBeenCalledTimes(1);
  });

  // 6. View past session
  it("shows past sessions and enters review mode when clicking one", async () => {
    const session = makeSession();
    mockStorage.getMockSessions.mockResolvedValue([session]);

    const user = userEvent.setup();
    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Generic Practice")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Generic Practice"));

    // Should enter review mode showing session exchanges
    await waitFor(() => {
      expect(screen.getByText("How You Did")).toBeInTheDocument();
      expect(screen.getByText("Your Answers")).toBeInTheDocument();
      expect(screen.getByText("Tell me about yourself.")).toBeInTheDocument();
    });
  });

  // === Edge Cases ===

  // 7. No JD analyses
  it("does not show job-specific section when no JD analyses exist", async () => {
    mockStorage.getJDAnalyses.mockResolvedValue([]);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Quick Practice")).toBeInTheDocument();
    });

    expect(screen.queryByText("Practice for a Specific Job")).not.toBeInTheDocument();
  });

  // 8. Answer under 10 chars
  it("disables submit button when answer is under 10 characters", async () => {
    const user = userEvent.setup();
    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Start Quick Practice"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Answer as if you're talking/);
    await user.type(textarea, "Short");

    expect(screen.getByText("Submit")).toBeDisabled();
  });

  // 9. Practice Again
  it("returns to setup when clicking Practice Again from summary", async () => {
    const user = userEvent.setup();
    const mockFetch = createMockFetch();
    vi.stubGlobal("fetch", mockFetch);

    // Use a JD with 1 question
    mockStorage.getJDAnalyses.mockResolvedValue([
      {
        id: "jd-1",
        createdAt: "2025-06-01T00:00:00.000Z",
        jobTitle: "Tester",
        company: "TestCo",
        rawJD: "A test job",
        summary: "A test role",
        requirements: [],
        storyMatches: [],
        gaps: [],
        mockQuestions: [
          {
            question: "Describe your testing experience",
            type: "technical" as const,
            targetRequirementIds: [],
            suggestedStoryIds: [],
            talkingPoints: [],
          },
        ],
        prepChecklist: [],
      },
    ]);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Tester")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Tester"));
    await user.click(screen.getByText("Start Job-Specific Practice"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/Answer as if you're talking/),
      "I have extensive testing experience with many tools and frameworks."
    );
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Finish Interview")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Finish Interview"));

    await waitFor(() => {
      expect(screen.getByText("Practice Again")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Practice Again"));

    await waitFor(() => {
      expect(screen.getByText("Quick Practice")).toBeInTheDocument();
      expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
    });
  });

  // === Error Handling ===

  // 10. Coach API fails
  it("handles coach API failure with warning toast and fallback feedback", async () => {
    const user = userEvent.setup();
    const mockFetch = createMockFetch({ coachOk: false, coachError: "Server overloaded" });
    vi.stubGlobal("fetch", mockFetch);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Start Quick Practice")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Start Quick Practice"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/Answer as if you're talking/),
      "I am a dedicated software engineer with three years of experience."
    );
    await user.click(screen.getByText("Submit"));

    // Should show warning toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Server overloaded", "warning");
    });

    // Should still transition to feedback with fallback message
    await waitFor(() => {
      expect(screen.getByText(/Feedback unavailable/)).toBeInTheDocument();
    });
  });

  // 11. Summary API fails
  it("handles summary API failure gracefully and still saves the session", async () => {
    const user = userEvent.setup();
    const mockFetch = createMockFetch({ summaryOk: false });
    vi.stubGlobal("fetch", mockFetch);

    // Use JD with 1 question
    mockStorage.getJDAnalyses.mockResolvedValue([
      {
        id: "jd-1",
        createdAt: "2025-06-01T00:00:00.000Z",
        jobTitle: "Tester",
        company: "TestCo",
        rawJD: "A test job",
        summary: "A test role",
        requirements: [],
        storyMatches: [],
        gaps: [],
        mockQuestions: [
          {
            question: "Describe your testing experience",
            type: "technical" as const,
            targetRequirementIds: [],
            suggestedStoryIds: [],
            talkingPoints: [],
          },
        ],
        prepChecklist: [],
      },
    ]);

    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Tester")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Tester"));
    await user.click(screen.getByText("Start Job-Specific Practice"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Answer as if you're talking/)).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText(/Answer as if you're talking/),
      "I have extensive testing experience with unit tests and integration tests."
    );
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(screen.getByText("Finish Interview")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Finish Interview"));

    // Should show warning about summary
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Summary not available. Your answers are still saved.", "warning");
    });

    // Session should still be saved
    expect(mockStorage.saveMockSession).toHaveBeenCalledTimes(1);
  });

  // 12. Delete past session
  it("deletes a past session after confirmation", async () => {
    const session = makeSession();
    mockStorage.getMockSessions.mockResolvedValue([session]);

    const user = userEvent.setup();
    render(<MockInterviewPage />);

    await waitFor(() => {
      expect(screen.getByText("Generic Practice")).toBeInTheDocument();
    });

    // Click the delete button
    const deleteButton = screen.getByLabelText("Delete Generic Practice session");
    await user.click(deleteButton);

    // Confirm dialog should appear
    await waitFor(() => {
      expect(screen.getByText("Delete Session")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(mockStorage.deleteMockSession).toHaveBeenCalledWith("session-1");
    });

    expect(mockToast).toHaveBeenCalledWith("Session deleted");
  });
});
