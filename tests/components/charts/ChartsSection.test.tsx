import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartsSection from "@/components/charts/ChartSection";

/**
 * Mock the internal Charts component to isolate ChartsSection tests.
 * It simply renders the passed entityCounts as JSON.
 */
vi.mock("../../../components/charts/ChartsWrapper", () => ({
  default: ({
    entityCounts,
  }: {
    entityCounts: { type: string; count: number }[];
  }) => <div data-testid="charts-wrapper">{JSON.stringify(entityCounts)}</div>,
}));

describe("ChartsSection", () => {
  /** Sample data for entity counts */
  const entityCounts: { type: string; count: number }[] = [
    { type: "Person", count: 5 },
    { type: "Organization", count: 3 },
  ];

  /**
   * Test that the ChartsSection component renders without crashing
   */
  it("renders without crashing", () => {
    render(<ChartsSection entityCounts={entityCounts} />);
    expect(screen.getByText("📈 Entity Distribution")).toBeInTheDocument();
  });

  /**
   * Test that ChartsSection correctly forwards entityCounts to the Charts component
   */
  it("forwards entityCounts to Charts component", () => {
    render(<ChartsSection entityCounts={entityCounts} />);
    const chartsWrapper = screen.getByTestId("charts-wrapper");
    expect(chartsWrapper).toHaveTextContent(JSON.stringify(entityCounts));
  });
});
