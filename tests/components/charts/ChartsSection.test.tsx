import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChartsSection from "../../../components/charts/ChartSection";

// Mock vnútorného Charts komponentu
vi.mock("../../components/charts/ChartsWrapper", () => ({
  default: ({ entityCounts }: any) => (
    <div data-testid="charts-wrapper">{JSON.stringify(entityCounts)}</div>
  ),
}));

describe("ChartsSection", () => {
  const entityCounts = [
    { type: "Person", count: 5 },
    { type: "Organization", count: 3 },
  ];

  it("renders without crashing", () => {
    render(<ChartsSection entityCounts={entityCounts} />);
    expect(screen.getByText("📈 Entity Distribution")).toBeInTheDocument();
  });

  it("forwards entityCounts to Charts component", () => {
    render(<ChartsSection entityCounts={entityCounts} />);
    const chartsWrapper = screen.getByTestId("charts-wrapper");
    expect(chartsWrapper).toHaveTextContent(
      JSON.stringify(entityCounts)
    );
  });
});
