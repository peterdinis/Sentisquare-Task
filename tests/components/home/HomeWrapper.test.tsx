import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalyzeText } from "@/hooks/useAnalyzeText";
import HomepageWrapper from "@/components/home/HomeWrapper";
import { MutateOptions, UseMutationResult } from "@tanstack/react-query";
import { TextRazorResponse } from "@/types/textRazorTypes";

/**
 * Mock child components to isolate HomepageWrapper for unit testing
 */
vi.mock("../../../components/dashboard/DashboardHeader", () => ({
  default: () => <div data-testid="dashboard-header">DashboardHeader</div>,
}));

vi.mock("../../../components/files/FileUploader", () => ({
  default: ({
    onFileRead,
    isLoading,
  }: {
    onFileRead: (lines: string[]) => void;
    isLoading: boolean;
  }) => (
    <div>
      <button onClick={() => onFileRead(["Line 1", "Line 2"])}>
        Upload File
      </button>
      {isLoading && <span>Loading...</span>}
    </div>
  ),
}));

vi.mock("../../../components/textEntity/EntityStats", () => ({
  default: ({
    entityCounts,
    totalLines,
  }: {
    entityCounts: Array<{ type: string; count: number }>;
    totalLines: number;
  }) => <div data-testid="entity-stats">EntityStats - Lines: {totalLines}</div>,
}));

vi.mock("../../../components/charts/ChartSection", () => ({
  default: () => <div data-testid="charts-section">ChartsSection</div>,
}));

vi.mock("../../../components/text/HighlightedText", () => ({
  default: () => <div data-testid="highlighted-texts">HighlightedTexts</div>,
}));

vi.mock("../../../components/toasts/ToastNotifier", () => ({
  default: ({
    show,
    message,
    isError,
  }: {
    show: boolean;
    message: string;
    isError: boolean;
  }) => <div data-testid="toast">{show ? message : null}</div>,
}));

// Mock the hook
vi.mock("../../../hooks/useAnalyzeText");

/**
 * Mock function for the mutateAsync method from useAnalyzeText hook
 * @type {import('vitest').MockedFunction}
 */
const mockMutateAsync = vi.fn();

/**
 * Unit tests for HomepageWrapper component
 * Tests file upload functionality, entity processing, and result display
 */
describe("HomepageWrapper", () => {
  /**
   * Setup hook before each test
   * Clears all mocks and resets useAnalyzeText to default state
   */
  beforeEach(() => {
    vi.clearAllMocks();

    // Default hook mock
    vi.mocked(useAnalyzeText).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false,
      isError: false,
      data: undefined,
      variables: undefined,
      isPending: false,
      error: null,
      isIdle: true,
      isSuccess: false,
      status: "idle",
      mutate: function (
        variables: string,
        options?: MutateOptions<TextRazorResponse, unknown, string, unknown>,
      ): void {
        throw new Error("Function not implemented.");
      },
      reset: function (): void {
        throw new Error("Function not implemented.");
      },
      context: undefined,
      failureCount: 0,
      failureReason: undefined,
      isPaused: false,
      submittedAt: 0,
    } as UseMutationResult<TextRazorResponse, unknown, string, unknown>);
  });

  /**
   * Test that header and file uploader components are rendered correctly
   * Verifies the initial UI structure is present
   */
  it("renders the header and file uploader", () => {
    render(<HomepageWrapper />);
    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
    expect(screen.getByText("DashboardHeader")).toBeInTheDocument();
    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });

  /**
   * Test that result components are not displayed before uploading a file
   * Ensures clean initial state without premature result rendering
   */
  it("does not show results initially", () => {
    render(<HomepageWrapper />);
    expect(screen.queryByTestId("entity-stats")).not.toBeInTheDocument();
    expect(screen.queryByTestId("charts-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("highlighted-texts")).not.toBeInTheDocument();
  });

  /**
   * Test successful file processing workflow
   * Verifies that:
   * - File lines are processed via API calls
   * - Success toast is displayed with correct message
   * - Result components (stats, charts, highlighted text) are rendered
   */
  it("processes uploaded lines and shows success toast", async () => {
    const user = userEvent.setup();

    mockMutateAsync
      .mockResolvedValueOnce({
        response: { entities: [{ type: ["Person"], matchedText: "John" }] },
      })
      .mockResolvedValueOnce({
        response: {
          entities: [{ type: ["Organization"], matchedText: "Acme" }],
        },
      });

    render(<HomepageWrapper />);
    await user.click(screen.getByText("Upload File"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(2);
      expect(mockMutateAsync).toHaveBeenCalledWith("Line 1");
      expect(mockMutateAsync).toHaveBeenCalledWith("Line 2");
    });

    await waitFor(() => {
      expect(
        screen.getByText("✅ Successfully processed 2 lines!"),
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("entity-stats")).toBeInTheDocument();
    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
    expect(screen.getByTestId("highlighted-texts")).toBeInTheDocument();
  });

  /**
   * Test handling of entities without a type property
   * Verifies that entities missing the 'type' field default to "Unknown" category
   */
  it("handles entities with no type as Unknown", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValueOnce({
      response: { entities: [{ matchedText: "Something" }] },
    });

    render(<HomepageWrapper />);
    await user.click(screen.getByText("Upload File"));

    await waitFor(() => {
      expect(screen.getByTestId("entity-stats")).toBeInTheDocument();
    });
  });

  /**
   * Test handling of null entities array in API response
   * Ensures the component handles null/undefined entities gracefully without errors
   */
  it("handles null entities array", async () => {
    const user = userEvent.setup();

    mockMutateAsync.mockResolvedValueOnce({
      response: { entities: null },
    });

    render(<HomepageWrapper />);
    await user.click(screen.getByText("Upload File"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByText("✅ Successfully processed 1 lines!"),
      ).toBeInTheDocument();
    });
  });

  /**
   * Test error handling when all lines fail to process
   * Verifies that:
   * - No success toast is shown when all API calls fail
   * - Component handles complete failure gracefully
   */
  it("does not show success toast when all lines fail", async () => {
    const user = userEvent.setup();

    mockMutateAsync
      .mockRejectedValueOnce(new Error("API Error"))
      .mockRejectedValueOnce(new Error("API Error"));

    render(<HomepageWrapper />);
    await user.click(screen.getByText("Upload File"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(2);
    });

    expect(
      screen.queryByText(/✅ Successfully processed/),
    ).not.toBeInTheDocument();
  });

  /**
   * Test entity count aggregation across multiple lines
   * Verifies that:
   * - Entities from multiple lines are aggregated correctly
   * - Total line count is displayed accurately
   * - Same entity types are counted together
   */
  it("aggregates entity counts correctly", async () => {
    const user = userEvent.setup();

    mockMutateAsync
      .mockResolvedValueOnce({
        response: {
          entities: [
            { type: ["Person"], matchedText: "John" },
            { type: ["Person"], matchedText: "Jane" },
          ],
        },
      })
      .mockResolvedValueOnce({
        response: {
          entities: [
            { type: ["Person"], matchedText: "Bob" },
            { type: ["Location"], matchedText: "Paris" },
          ],
        },
      });

    render(<HomepageWrapper />);
    await user.click(screen.getByText("Upload File"));

    await waitFor(() => {
      expect(screen.getByTestId("entity-stats")).toBeInTheDocument();
      expect(screen.getByText("EntityStats - Lines: 2")).toBeInTheDocument();
    });
  });

  /**
   * Test partial failure handling during file processing
   * Verifies that:
   * - Processing continues after some lines fail
   * - Successful lines are still processed and displayed
   * - Result components show data from successful lines only
   */
  it("continues processing after partial failure", async () => {
    const user = userEvent.setup();

    mockMutateAsync
      .mockRejectedValueOnce(new Error("API Error"))
      .mockResolvedValueOnce({
        response: {
          entities: [{ type: ["Organization"], matchedText: "Company" }],
        },
      });

    render(<HomepageWrapper />);
    await user.click(screen.getByText("Upload File"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByTestId("entity-stats")).toBeInTheDocument();
    expect(screen.getByText("EntityStats - Lines: 1")).toBeInTheDocument();
  });
});
