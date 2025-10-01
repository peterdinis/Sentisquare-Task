import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Charts from "../../../components/charts/ChartsWrapper";
import { COLORS } from "../../../constants/applicationConstants";
import "@testing-library/jest-dom";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: any[];
  }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }: { dataKey: string; fill: string }) => (
    <div data-testid="bar" data-key={dataKey} data-fill={fill} />
  ),
  XAxis: ({ dataKey }: { dataKey: string }) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  CartesianGrid: ({ strokeDasharray }: { strokeDasharray: string }) => (
    <div data-testid="cartesian-grid" data-stroke={strokeDasharray} />
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: ({
    children,
    data,
    dataKey,
    nameKey,
  }: {
    children: React.ReactNode;
    data: any[];
    dataKey: string;
    nameKey: string;
  }) => (
    <div
      data-testid="pie"
      data-chart-data={JSON.stringify(data)}
      data-key={dataKey}
      data-name-key={nameKey}
    >
      {children}
    </div>
  ),
  Cell: ({ fill }: { fill: string }) => (
    <div data-testid="cell" data-fill={fill} />
  ),
}));

describe("Charts", () => {
  const mockEntityCounts = [
    { type: "Person", count: 5 },
    { type: "Organization", count: 3 },
    { type: "Location", count: 2 },
  ];

  it("renders both chart cards correctly", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    expect(screen.getByText("Entity types — frequency")).toBeInTheDocument();
    expect(screen.getByText("Share by type (pie)")).toBeInTheDocument();
  });

  it("renders bar chart with correct data", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const barChart = screen.getAllByTestId("bar-chart")[0];
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]",
    );

    expect(chartData).toEqual(mockEntityCounts);
  });

  it("renders bar chart components", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    expect(screen.getAllByTestId("x-axis")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("y-axis")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("cartesian-grid")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("bar")[0]).toBeInTheDocument();
  });

  it("renders bar with correct dataKey and fill color", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const bar = screen.getAllByTestId("bar")[0];
    expect(bar).toHaveAttribute("data-key", "count");
    expect(bar).toHaveAttribute("data-fill", "#4e79a7");
  });

  it("renders pie chart with correct data", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const pie = screen.getByTestId("pie");
    const chartData = JSON.parse(pie.getAttribute("data-chart-data") || "[]");

    expect(chartData).toEqual(mockEntityCounts);
  });

  it("renders pie chart with correct dataKey and nameKey", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-key", "count");
    expect(pie).toHaveAttribute("data-name-key", "type");
  });

  it("renders correct number of cells for pie chart", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(mockEntityCounts.length);
  });

  it("applies correct colors to pie chart cells", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const cells = screen.getAllByTestId("cell");
    cells.forEach((cell, index) => {
      expect(cell).toHaveAttribute("data-fill", COLORS[index % COLORS.length]);
    });
  });

  it("renders with empty entityCounts array", () => {
    render(<Charts entityCounts={[]} />);

    expect(screen.getByText("Entity types — frequency")).toBeInTheDocument();
    expect(screen.getByText("Share by type (pie)")).toBeInTheDocument();
  });

  it("handles single entity type", () => {
    const singleEntity = [{ type: "Person", count: 10 }];
    render(<Charts entityCounts={singleEntity} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(1);
  });

  it("handles large number of entity types", () => {
    const manyEntities = Array.from({ length: 15 }, (_, i) => ({
      type: `Type${i}`,
      count: i + 1,
    }));

    render(<Charts entityCounts={manyEntities} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(15);
  });

  it("wraps colors correctly when entity count exceeds COLORS array length", () => {
    const manyEntities = Array.from({ length: COLORS.length + 2 }, (_, i) => ({
      type: `Type${i}`,
      count: i + 1,
    }));

    render(<Charts entityCounts={manyEntities} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", COLORS[0]);
    expect(cells[COLORS.length]).toHaveAttribute("data-fill", COLORS[0]);
    expect(cells[COLORS.length + 1]).toHaveAttribute("data-fill", COLORS[1]);
  });

  it("renders both ResponsiveContainers", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const containers = screen.getAllByTestId("responsive-container");
    expect(containers).toHaveLength(2);
  });

  it("renders tooltips for both charts", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const tooltips = screen.getAllByTestId("tooltip");
    expect(tooltips.length).toBeGreaterThanOrEqual(2);
  });

  it("renders CartesianGrid with correct stroke pattern", () => {
    render(<Charts entityCounts={mockEntityCounts} />);

    const grid = screen.getAllByTestId("cartesian-grid")[0];
    expect(grid).toHaveAttribute("data-stroke", "3 3");
  });

  it("applies motion wrapper correctly", () => {
    const { container } = render(<Charts entityCounts={mockEntityCounts} />);

    const motionDiv = container.querySelector("div");
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders cards with correct structure", () => {
    const { container } = render(<Charts entityCounts={mockEntityCounts} />);

    const cards = container.querySelectorAll(".card");
    expect(cards).toHaveLength(2);
  });

  it("handles zero counts in data", () => {
    const dataWithZeros = [
      { type: "Person", count: 0 },
      { type: "Organization", count: 5 },
    ];

    render(<Charts entityCounts={dataWithZeros} />);

    const barChart = screen.getAllByTestId("bar-chart")[0];
    const chartData = JSON.parse(
      barChart.getAttribute("data-chart-data") || "[]",
    );

    expect(chartData[0].count).toBe(0);
  });
});
