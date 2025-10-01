import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HighlightedTexts from "../../../components/text/HighlightedText";
import { LineData } from "@/types/textRazorTypes";
import "@testing-library/jest-dom";

describe("HighlightedTexts", () => {
  const mockLines: LineData[] = [
    {
      text: "John works at OpenAI.",
      entities: [
        {
          entityId: "1",
          matchedText: "John",
          type: ["Person"],
          confidenceScore: 0.99,
        },
        {
          entityId: "2",
          matchedText: "OpenAI",
          type: ["Organization"],
          confidenceScore: 0.95,
        },
      ],
    },
    {
      text: "Microsoft released a new product.",
      entities: [
        {
          entityId: "3",
          matchedText: "Microsoft",
          type: ["Organization"],
          confidenceScore: 0.97,
        },
      ],
    },
  ];

  it("renders the card title", () => {
    render(<HighlightedTexts linesData={mockLines} />);
    expect(
      screen.getByText("📝 Texts with Highlighted Entities")
    ).toBeInTheDocument();
  });

  it("renders the correct number of EntityHighlighter components", () => {
    render(<HighlightedTexts linesData={mockLines} />);
    const highlightedTexts = screen.getAllByText(/John|OpenAI|Microsoft/);
    expect(highlightedTexts.length).toBeGreaterThanOrEqual(3);
  });

  it("renders entity matchedText in the output", () => {
    render(<HighlightedTexts linesData={mockLines} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
  });

  it("renders unknown type if entity type is missing", () => {
    const linesWithMissingType: LineData[] = [
      { text: "Unknown entity", entities: [{ entityId: "4", matchedText: "Unknown", type: [], confidenceScore: 0 }] },
    ];
    render(<HighlightedTexts linesData={linesWithMissingType} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("handles empty linesData gracefully", () => {
    render(<HighlightedTexts linesData={[]} />);
    expect(
      screen.getByText("📝 Texts with Highlighted Entities")
    ).toBeInTheDocument();
  });
});
