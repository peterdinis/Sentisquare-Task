import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextRazorEntity } from "@/types/textRazorTypes";
import EntityHighlighter from "@/components/textEntity/EntityHighlighter";

describe("EntityHighlighter", () => {
  /** Sample text to highlight entities in */
  const text = "George Bush was president of USA.";

  /** Sample entities to be highlighted */
  const entities: TextRazorEntity[] = [
    {
      entityId: "1",
      matchedText: "George Bush",
      type: ["Person"],
      confidenceScore: 0.99,
    },
    {
      entityId: "2",
      matchedText: "USA",
      type: ["Country"],
      confidenceScore: 0.95,
    },
  ];

  /**
   * Test that the component renders the text container and highlights.
   */
  it("renders the text with highlights", () => {
    render(<EntityHighlighter text={text} entities={entities} />);
    const card = document.querySelector(".card");
    expect(card).toBeInTheDocument();

    // Ensure highlighted spans exist
    const highlights = card!.querySelectorAll(".entity-badge");
    expect(highlights.length).toBe(2);
    expect(highlights[0]).toHaveTextContent("George Bush");
    expect(highlights[1]).toHaveTextContent("USA");
  });

  /**
   * Test that entity badges are rendered with type labels.
   */
  it("renders entity badges", () => {
    render(<EntityHighlighter text={text} entities={entities} />);
    expect(screen.getByText(/George Bush \(Person\)/i)).toBeInTheDocument();
    expect(screen.getByText(/USA \(Country\)/i)).toBeInTheDocument();
  });

  /**
   * Test that highlighted entities are displayed in the text body.
   */
  it("highlights entities in the text", () => {
    render(<EntityHighlighter text={text} entities={entities} />);
    const highlightedElements = document.querySelectorAll(".entity-badge");
    expect(highlightedElements.length).toBe(2);
    expect(highlightedElements[0]).toHaveTextContent("George Bush");
    expect(highlightedElements[1]).toHaveTextContent("USA");
  });

  /**
   * Test that the component handles an empty entity array without errors.
   */
  it("handles empty entities", () => {
    render(<EntityHighlighter text={text} entities={[]} />);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(document.querySelectorAll(".entity-badge").length).toBe(0);
  });
});
