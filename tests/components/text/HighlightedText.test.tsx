import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineData } from "@/types/textRazorTypes";
import HighlightedTexts from "@/components/text/HighlightedText";

describe("HighlightedTexts", () => {
  /** Mock data representing lines of text with detected entities */
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

  /**
   * Test that the card title renders correctly.
   */
  it("renders the card title", () => {
    render(<HighlightedTexts linesData={mockLines} />);
    expect(
      screen.getByText("📝 Texts with Highlighted Entities"),
    ).toBeInTheDocument();
  });

  /**
   * Test that all highlighted entities are rendered.
   */
  it("renders the correct number of EntityHighlighter components", () => {
    render(<HighlightedTexts linesData={mockLines} />);
    const highlightedTexts = screen.getAllByText(/John|OpenAI|Microsoft/);
    expect(highlightedTexts.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * Test that each entity's matched text is displayed in the output.
   */
  it("renders entity matchedText in the output", () => {
    render(<HighlightedTexts linesData={mockLines} />);
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("Microsoft")).toBeInTheDocument();
  });

  /**
   * Test that entities with missing types are handled gracefully.
   */
  it("renders unknown type if entity type is missing", () => {
    const linesWithMissingType: LineData[] = [
      {
        text: "Unknown entity",
        entities: [
          {
            entityId: "4",
            matchedText: "Unknown",
            type: [],
            confidenceScore: 0,
          },
        ],
      },
    ];
    render(<HighlightedTexts linesData={linesWithMissingType} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  /**
   * Test that the component handles an empty linesData array without errors.
   */
  it("handles empty linesData gracefully", () => {
    render(<HighlightedTexts linesData={[]} />);
    expect(
      screen.getByText("📝 Texts with Highlighted Entities"),
    ).toBeInTheDocument();
  });
});
