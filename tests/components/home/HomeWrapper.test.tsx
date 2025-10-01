import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomepageWrapper from "@/components/home/HomeWrapper";

// Mock podkomponenty, ktoré netreba testovať priamo
vi.mock("../../components/dashboard/DashboardHeader", () => ({
  default: () => <div>DashboardHeader</div>,
}));
vi.mock("../../components/files/FileUploader", () => ({
  default: (props: any) => (
    <div>
      FileUploader
      <button onClick={() => props.onFileRead(["line1", "line2"])}>Upload</button>
    </div>
  ),
}));
vi.mock("../textEntity/EntityStats", () => ({
  default: (props: any) => <div>EntityStats: {props.totalLines}</div>,
}));
vi.mock("../text/HighlightedText", () => ({
  default: (props: any) => <div>HighlightedTexts</div>,
}));
vi.mock("../charts/ChartSection", () => ({
  default: () => <div>ChartsSection</div>,
}));
vi.mock("../toasts/ToastNotifier", () => ({
  default: (props: any) => <div>ToastNotifier: {props.message}</div>,
}));

// Mock hook
const mutateAsyncMock = vi.fn();
vi.mock("@/hooks/useAnalyzeText", () => ({
  useAnalyzeText: () => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
    isError: false,
  }),
}));

describe("HomepageWrapper", () => {
  beforeEach(() => {
    mutateAsyncMock.mockReset();
  });

  it("renders dashboard header, file uploader, and toast notifier", () => {
    render(<HomepageWrapper />);

    expect(screen.getByText("DashboardHeader")).toBeInTheDocument();
    expect(screen.getByText("FileUploader")).toBeInTheDocument();
    expect(screen.getByText("ToastNotifier:")).toBeInTheDocument();
  });

  it("processes uploaded lines and shows stats, charts, highlighted texts, and toast", async () => {
    // Mock mutateAsync to return entities
    mutateAsyncMock.mockImplementation(async (line: string) => ({
      response: { entities: [{ entityId: "1", matchedText: line, type: ["Person"], confidenceScore: 1 }] },
    }));

    render(<HomepageWrapper />);

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledTimes(2);
      expect(screen.getByText("EntityStats: 2")).toBeInTheDocument();
      expect(screen.getByText("HighlightedTexts")).toBeInTheDocument();
      expect(screen.getByText("ChartsSection")).toBeInTheDocument();
      expect(screen.getByText("ToastNotifier: ✅ Successfully processed 2 lines!")).toBeInTheDocument();
    });
  });

  it("shows error toast when a line fails to process", async () => {
    // First line fails, second succeeds
    mutateAsyncMock.mockImplementation(async (line: string) => {
      if (line === "line1") throw new Error("fail");
      return { response: { entities: [{ entityId: "2", matchedText: line, type: ["Person"], confidenceScore: 1 }] } };
    });

    render(<HomepageWrapper />);

    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/❌ Error processing line: "line1"/)).toBeInTheDocument();
      expect(screen.getByText("EntityStats: 1")).toBeInTheDocument();
    });
  });
});
