import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Charts from "../../../components/charts/ChartsWrapper";
import { COLORS } from "@/constants/applicationConstants";

// Mock Recharts komponenty, aby testy nepadali
vi.mock("recharts", async () => {
  const original: any = await vi.importActual("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Bar: ({ dataKey }: any) => <div>Bar: {dataKey}</div>,
    Pie: ({ dataKey }: any) => <div>Pie: {dataKey}</div>,
    Cell: ({ fill }: any) => <div>Cell: {fill}</div>,
    CartesianGrid: () => <div>Grid</div>,
    XAxis: ({ dataKey }: any) => <div>XAxis: {dataKey}</div>,
    YAxis: () => <div>YAxis</div>,
    Tooltip: () => <div>Tooltip</div>,
  };
});

describe("Charts component", () => {
  const entityCounts = [
    { type: "Person", count: 5 },
    { type: "Organization", count: 3 },
    { type: "Location", count: 2 },
  ];

  it("renders without crashing", () => {
    render(<Charts entityCounts={entityCounts} />);
    expect(screen.getByText("Entity types — frequency")).toBeInTheDocument();
    expect(screen.getByText("Share by type (pie)")).toBeInTheDocument();
  });

  it("renders BarChart and PieChart with correct data keys", () => {
    render(<Charts entityCounts={entityCounts} />);

    // Bar chart
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByText("Bar: count")).toBeInTheDocument();
    expect(screen.getByText("XAxis: type")).toBeInTheDocument();

    // Pie chart
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByText("Pie: count")).toBeInTheDocument();

    // Cells colors
    entityCounts.forEach((_, idx) => {
      expect(screen.getByText(`Cell: ${COLORS[idx % COLORS.length]}`)).toBeInTheDocument();
    });
  });
});
