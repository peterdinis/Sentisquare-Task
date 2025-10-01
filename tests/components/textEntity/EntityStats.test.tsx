import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EntityStats from "../../../components/textEntity/EntityStats";
import "@testing-library/jest-dom";

describe("EntityStats", () => {
  const mockData = [
    { type: "Person", count: 5 },
    { type: "Organization", count: 3 },
    { type: "Location", count: 2 },
  ];

  it("renders total lines processed", () => {
    render(<EntityStats entityCounts={mockData} totalLines={10} />);
    expect(screen.getByText(/Lines processed:/)).toHaveTextContent(
      "Lines processed: 10",
    );
  });

  it("renders total entities", () => {
    render(<EntityStats entityCounts={mockData} totalLines={10} />);
    // total entities = 5 + 3 + 2 = 10
    expect(screen.getByText(/Total entities:/)).toHaveTextContent(
      "Total entities: 10",
    );
  });

  it("renders the most frequent entity type", () => {
    render(<EntityStats entityCounts={mockData} totalLines={10} />);
    // Most frequent is "Person" with count 5
    expect(screen.getByText(/Most frequent entity type:/)).toHaveTextContent(
      "Most frequent entity type: Person",
    );
  });

  it("renders '-' if entityCounts is empty", () => {
    render(<EntityStats entityCounts={[]} totalLines={5} />);
    expect(screen.getByText(/Most frequent entity type:/)).toHaveTextContent(
      "Most frequent entity type: -",
    );
  });

  it("renders correctly with a single entity type", () => {
    const single = [{ type: "Company", count: 7 }];
    render(<EntityStats entityCounts={single} totalLines={7} />);
    expect(screen.getByText(/Total entities:/)).toHaveTextContent(
      "Total entities: 7",
    );
    expect(screen.getByText(/Most frequent entity type:/)).toHaveTextContent(
      "Most frequent entity type: Company",
    );
  });
});
