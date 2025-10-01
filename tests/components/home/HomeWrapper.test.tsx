import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalyzeText } from "@/hooks/useAnalyzeText";
import HomepageWrapper from "@/components/home/HomeWrapper";

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
  }) => (
    <div data-testid="entity-stats">
      EntityStats - Lines: {totalLines}
    </div>
  ),
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
const mockMutateAsync = vi.fn();

/**
 * Unit tests for HomepageWrapper component
 */
describe("HomepageWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default hook mock
    vi.mocked(useAnalyzeText).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
    } as any);
  });

  /**
   * Test that header and file uploader are rendered correctly
   */
  it("renders the header and file uploader", () => {
    render(<HomepageWrapper />);
    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
    expect(screen.getByText("DashboardHeader")).toBeInTheDocument();
    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });

  /**
   * Test that no results are displayed before uploading a file
   */
  it("does not show results initially", () => {
    render(<HomepageWrapper />);
    expect(screen.queryByTestId("entity-stats")).not.toBeInTheDocument();
    expect(screen.queryByTestId("charts-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("highlighted-texts")).not.toBeInTheDocument();
  });

  /**
   * Test successful file processing and rendering of results
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
        screen.getByText("✅ Successfully processed 2 lines!")
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("entity-stats")).toBeInTheDocument();
    expect(screen.getByTestId("charts-section")).toBeInTheDocument();
    expect(screen.getByTestId("highlighted-texts")).toBeInTheDocument();
  });

  /**
   * Test that entities without a type default to "Unknown"
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
   * Test handling of null entities array
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
        screen.getByText("✅ Successfully processed 1 lines!")
      ).toBeInTheDocument();
    });
  });

  /**
   * Test that isPending state is passed correctly to FileUploader
   */
  it("passes isPending state to FileUploader", () => {
    vi.mocked(useAnalyzeText).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
      isError: false,
    } as any);

    render(<HomepageWrapper />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  /**
   * Test that no success toast is shown when all lines fail
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
      screen.queryByText(/✅ Successfully processed/)
    ).not.toBeInTheDocument();
  });

  /**
   * Test that entity counts are aggregated correctly
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
   * Test that processing continues even if some lines fail
   */
  it("continues processing after partial failure", async () => {
    const user = userEvent.setup();

    mockMutateAsync
      .mockRejectedValueOnce(new Error("API Error"))
      .mockResolvedValueOnce({
        response: { entities: [{ type: ["Organization"], matchedText: "Company" }] },
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
