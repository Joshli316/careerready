import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactLogPage from "./page";
import type { EmployerContact } from "@/types/contact";
import { createMockStorage } from "@/test/createMockStorage";

// Mock dependencies
const mockToast = vi.fn();

vi.mock("@/components/ui/Toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockStorage = createMockStorage();

vi.mock("@/hooks/useStorage", () => ({
  useStorage: () => mockStorage,
}));

describe("ContactLogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getContacts.mockResolvedValue([]);
  });

  it("renders empty state when no contacts exist", async () => {
    render(<ContactLogPage />);

    await waitFor(() => {
      expect(screen.getByText("Your job search starts here")).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Add your first company/)
    ).toBeInTheDocument();
  });

  it("displays contact list when contacts exist", async () => {
    const contacts: EmployerContact[] = [
      {
        id: "1",
        companyName: "Acme Corp",
        position: "Software Engineer",
        status: "applied",
        dateApplied: "2026-01-15T00:00:00.000Z",
        createdAt: "2026-01-15T00:00:00.000Z",
        updatedAt: "2026-01-15T00:00:00.000Z",
      },
      {
        id: "2",
        companyName: "Globex Inc",
        position: "Product Manager",
        status: "interview",
        dateApplied: "2026-02-01T00:00:00.000Z",
        createdAt: "2026-02-01T00:00:00.000Z",
        updatedAt: "2026-02-01T00:00:00.000Z",
      },
    ];
    mockStorage.getContacts.mockResolvedValue(contacts);

    render(<ContactLogPage />);

    await waitFor(() => {
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Globex Inc")).toBeInTheDocument();
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    // Status labels may appear multiple times (in badges, stats, and inline selects)
    expect(screen.getAllByText("Applied").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Interview").length).toBeGreaterThanOrEqual(1);
  });

  it("can add a new contact", async () => {
    const user = userEvent.setup();

    // After saving, getContacts returns the new contact
    const newContact: EmployerContact = {
      id: "abc",
      companyName: "Test Company",
      position: "Designer",
      status: "applied",
      dateApplied: "2026-03-01T00:00:00.000Z",
      createdAt: "2026-03-01T00:00:00.000Z",
      updatedAt: "2026-03-01T00:00:00.000Z",
    };

    mockStorage.getContacts
      .mockResolvedValueOnce([]) // initial load
      .mockResolvedValue([newContact]); // after save

    render(<ContactLogPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Your job search starts here")).toBeInTheDocument();
    });

    // Click "Add Contact" button
    await user.click(screen.getByRole("button", { name: /add contact/i }));

    // Fill the form
    const companyInput = screen.getByPlaceholderText("Company name");
    const positionInput = screen.getByPlaceholderText(
      "Job title you applied for"
    );
    await user.type(companyInput, "Test Company");
    await user.type(positionInput, "Designer");

    // Click Save
    await user.click(screen.getByRole("button", { name: /save contact/i }));

    // Verify storage was called
    await waitFor(() => {
      expect(mockStorage.saveContact).toHaveBeenCalledOnce();
    });

    // Verify the saved contact has the right data
    const savedContact = mockStorage.saveContact.mock.calls[0][0];
    expect(savedContact.companyName).toBe("Test Company");
    expect(savedContact.position).toBe("Designer");
    expect(savedContact.status).toBe("applied");

    // Verify toast was shown
    expect(mockToast).toHaveBeenCalledWith("Contact added");
  });

  it("renders the page title and description", async () => {
    render(<ContactLogPage />);

    expect(screen.getByText("Contact Log")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Track every application, follow-up, and employer interaction."
      )
    ).toBeInTheDocument();
  });
});
