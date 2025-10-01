import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import "@testing-library/jest-dom";

describe("DashboardHeader", () => {
  it("renders the title", () => {
    render(<DashboardHeader title="Main Dashboard" />);
    const titleElement = screen.getByText("Main Dashboard");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H1");
  });

  it("renders the subtitle if provided", () => {
    render(
      <DashboardHeader
        title="Main Dashboard"
        subtitle="This is the subtitle"
      />
    );
    const subtitleElement = screen.getByText("This is the subtitle");
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement.tagName).toBe("P");
  });

  it("does not render a subtitle if none is provided", () => {
    render(<DashboardHeader title="Main Dashboard" />);
    const subtitleElement = screen.queryByText(/./); // any text besides title
    expect(subtitleElement?.textContent).not.toBe("This is the subtitle");
  });
});
