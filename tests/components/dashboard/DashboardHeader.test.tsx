import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

describe("DashboardHeader", () => {
  /**
   * Test that the main title is rendered correctly.
   */
  it("renders the title", () => {
    render(<DashboardHeader title="Main Dashboard" />);
    const titleElement = screen.getByText("Main Dashboard");

    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H1");
  });

  /**
   * Test that the subtitle is rendered if provided as a prop.
   */
  it("renders the subtitle if provided", () => {
    render(
      <DashboardHeader
        title="Main Dashboard"
        subtitle="This is the subtitle"
      />,
    );

    const subtitleElement = screen.getByText("This is the subtitle");

    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement.tagName).toBe("P");
  });

  /**
   * Test that no subtitle is rendered if the subtitle prop is not provided.
   */
  it("does not render a subtitle if none is provided", () => {
    render(<DashboardHeader title="Main Dashboard" />);

    // Query for a subtitle element; it should not exist
    const subtitleElement = screen.queryByText("This is the subtitle");
    expect(subtitleElement).not.toBeInTheDocument();
  });
});
