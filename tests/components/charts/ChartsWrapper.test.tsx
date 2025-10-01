import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Charts from "@/components/charts/ChartsWrapper";
import { COLORS } from "@/constants/applicationConstants";

/** Represents a single entity type and its count */
interface EntityCount {
  type: string;
  count: number;
}

/**
 * Mock Recharts components to simplify rendering in tests.
 * Each mock renders a simple div with test attributes for inspection.
 */
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children, data }: { children: React.ReactNode; data: EntityCount[] }) => (
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
    data: EntityCount[];
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
  /** Sample entity counts for testing */
  const mockEntityCounts: EntityCount[] = [
    { type: "Person", count: 5 },
    { type: "Organization", count: 3 },
    { type: "Location", count: 2 },
  ];

  /**
   * Test that both chart cards render correctly
   */
  it("renders both chart cards correctly", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    expect(screen.getByText("Entity types — frequency")).toBeInTheDocument();
    expect(screen.getByText("Share by type (pie)")).toBeInTheDocument();
  });

  /**
   * Test that BarChart receives the correct data
   */
  it("renders bar chart with correct data", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const barChart = screen.getAllByTestId("bar-chart")[0];
    const chartData: EntityCount[] = JSON.parse(barChart.getAttribute("data-chart-data") || "[]");
    expect(chartData).toEqual(mockEntityCounts);
  });

  /**
   * Test that BarChart components are rendered
   */
  it("renders bar chart components", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    expect(screen.getAllByTestId("x-axis")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("y-axis")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("cartesian-grid")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("bar")[0]).toBeInTheDocument();
  });

  /**
   * Test Bar component has correct dataKey and fill
   */
  it("renders bar with correct dataKey and fill color", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const bar = screen.getAllByTestId("bar")[0];
    expect(bar).toHaveAttribute("data-key", "count");
    expect(bar).toHaveAttribute("data-fill", "#4e79a7");
  });

  /**
   * Test that PieChart receives the correct data
   */
  it("renders pie chart with correct data", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const pie = screen.getByTestId("pie");
    const chartData: EntityCount[] = JSON.parse(pie.getAttribute("data-chart-data") || "[]");
    expect(chartData).toEqual(mockEntityCounts);
  });

  /**
   * Test Pie component has correct dataKey and nameKey
   */
  it("renders pie chart with correct dataKey and nameKey", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const pie = screen.getByTestId("pie");
    expect(pie).toHaveAttribute("data-key", "count");
    expect(pie).toHaveAttribute("data-name-key", "type");
  });

  /**
   * Test the correct number of Pie cells are rendered
   */
  it("renders correct number of cells for pie chart", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(mockEntityCounts.length);
  });

  /**
   * Test that Pie cells apply the correct colors
   */
  it("applies correct colors to pie chart cells", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const cells = screen.getAllByTestId("cell");
    cells.forEach((cell, index) => {
      expect(cell).toHaveAttribute("data-fill", COLORS[index % COLORS.length]);
    });
  });

  /**
   * Test rendering with empty entityCounts array
   */
  it("renders with empty entityCounts array", () => {
    render(<Charts entityCounts={[]} />);
    expect(screen.getByText("Entity types — frequency")).toBeInTheDocument();
    expect(screen.getByText("Share by type (pie)")).toBeInTheDocument();
  });

  /**
   * Test handling a single entity type
   */
  it("handles single entity type", () => {
    const singleEntity: EntityCount[] = [{ type: "Person", count: 10 }];
    render(<Charts entityCounts={singleEntity} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(1);
  });

  /**
   * Test handling a large number of entity types
   */
  it("handles large number of entity types", () => {
    const manyEntities: EntityCount[] = Array.from({ length: 15 }, (_, i) => ({
      type: `Type${i}`,
      count: i + 1,
    }));
    render(<Charts entityCounts={manyEntities} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(15);
  });

  /**
   * Test color wrapping when entity count exceeds COLORS array length
   */
  it("wraps colors correctly when entity count exceeds COLORS array length", () => {
    const manyEntities: EntityCount[] = Array.from({ length: COLORS.length + 2 }, (_, i) => ({
      type: `Type${i}`,
      count: i + 1,
    }));
    render(<Charts entityCounts={manyEntities} />);
    const cells = screen.getAllByTestId("cell");
    expect(cells[0]).toHaveAttribute("data-fill", COLORS[0]);
    expect(cells[COLORS.length]).toHaveAttribute("data-fill", COLORS[0]);
    expect(cells[COLORS.length + 1]).toHaveAttribute("data-fill", COLORS[1]);
  });

  /**
   * Test both ResponsiveContainers are rendered
   */
  it("renders both ResponsiveContainers", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const containers = screen.getAllByTestId("responsive-container");
    expect(containers).toHaveLength(2);
  });

  /**
   * Test that tooltips render for both charts
   */
  it("renders tooltips for both charts", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const tooltips = screen.getAllByTestId("tooltip");
    expect(tooltips.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Test CartesianGrid uses the correct stroke pattern
   */
  it("renders CartesianGrid with correct stroke pattern", () => {
    render(<Charts entityCounts={mockEntityCounts} />);
    const grid = screen.getAllByTestId("cartesian-grid")[0];
    expect(grid).toHaveAttribute("data-stroke", "3 3");
  });

  /**
   * Test Motion wrapper is applied correctly
   */
  it("applies motion wrapper correctly", () => {
    const { container } = render(<Charts entityCounts={mockEntityCounts} />);
    const motionDiv = container.querySelector("div");
    expect(motionDiv).toBeInTheDocument();
  });

  /**
   * Test that chart cards have correct structure
   */
  it("renders cards with correct structure", () => {
    const { container } = render(<Charts entityCounts={mockEntityCounts} />);
    const cards = container.querySelectorAll(".card");
    expect(cards).toHaveLength(2);
  });

  /**
   * Test handling zero counts in data
   */
  it("handles zero counts in data", () => {
    const dataWithZeros: EntityCount[] = [
      { type: "Person", count: 0 },
      { type: "Organization", count: 5 },
    ];
    render(<Charts entityCounts={dataWithZeros} />);
    const barChart = screen.getAllByTestId("bar-chart")[0];
    const chartData: EntityCount[] = JSON.parse(barChart.getAttribute("data-chart-data") || "[]");
    expect(chartData[0].count).toBe(0);
  });
});
