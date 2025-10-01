import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUploader from "@/components/files/FileUploader";

describe("FileUploader", () => {
  const mockOnFileRead = vi.fn();
  let file: File;

  beforeEach(() => {
    vi.clearAllMocks();
    file = new File(["line1\nline2\n\nline3\n"], "test.txt", {
      type: "text/plain",
    });
  });

  /**
   * Test that the file upload form renders correctly.
   */
  it("renders the file upload form correctly", () => {
    render(<FileUploader onFileRead={mockOnFileRead} />);

    expect(screen.getByLabelText(/upload a \.txt file/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upload & analyze/i }),
    ).toBeInTheDocument();
  });

  /**
   * Test that a file can be selected via the file input.
   */
  it("allows file selection", async () => {
    const user = userEvent.setup();
    render(<FileUploader onFileRead={mockOnFileRead} />);

    const input = screen.getByLabelText(
      /upload a \.txt file/i,
    ) as HTMLInputElement;
    await user.upload(input, file);

    expect(input.files?.[0]).toBe(file);
    expect(input.files).toHaveLength(1);
  });

  /**
   * Test that onFileRead is called with parsed lines when form is submitted.
   */
  it("calls onFileRead with parsed lines when form is submitted", async () => {
    const user = userEvent.setup();
    render(<FileUploader onFileRead={mockOnFileRead} />);

    const input = screen.getByLabelText(/upload a \.txt file/i);
    const submitButton = screen.getByRole("button", {
      name: /upload & analyze/i,
    });

    await user.upload(input, file);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnFileRead).toHaveBeenCalledWith(["line1", "line2", "line3"]);
    });
  });

  /**
   * Test that empty lines are filtered and whitespace is trimmed.
   */
  it("trims whitespace and filters empty lines", async () => {
    const user = userEvent.setup();
    const fileWithSpaces = new File(
      ["  line1  \n\n  line2\n   \nline3  \n\n"],
      "test.txt",
      { type: "text/plain" },
    );

    render(<FileUploader onFileRead={mockOnFileRead} />);

    const input = screen.getByLabelText(/upload a \.txt file/i);
    const submitButton = screen.getByRole("button", {
      name: /upload & analyze/i,
    });

    await user.upload(input, fileWithSpaces);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnFileRead).toHaveBeenCalledWith(["line1", "line2", "line3"]);
    });
  });

  /**
   * Test that the loading state disables inputs and shows appropriate text.
   */
  it("shows loading state when isLoading is true", () => {
    render(<FileUploader onFileRead={mockOnFileRead} isLoading={true} />);

    const submitButton = screen.getByRole("button", { name: /analyzing/i });
    const input = screen.getByLabelText(/upload a \.txt file/i);

    expect(submitButton).toBeDisabled();
    expect(input).toBeDisabled();
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
  });

  /**
   * Test that both file input and button are disabled when loading.
   */
  it("disables file input and button during loading", () => {
    render(<FileUploader onFileRead={mockOnFileRead} isLoading={true} />);

    const input = screen.getByLabelText(/upload a \.txt file/i);
    const submitButton = screen.getByRole("button");

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  /**
   * Test that a validation error is shown if no file is selected.
   */
  it("displays validation error when no file is selected", async () => {
    const user = userEvent.setup();
    render(<FileUploader onFileRead={mockOnFileRead} />);

    const submitButton = screen.getByRole("button", {
      name: /upload & analyze/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });

    expect(mockOnFileRead).not.toHaveBeenCalled();
  });

  /**
   * Test handling of files with CRLF line endings.
   */
  it("handles files with different line endings (CRLF)", async () => {
    const user = userEvent.setup();
    const fileWithCRLF = new File(["line1\r\nline2\r\nline3"], "test.txt", {
      type: "text/plain",
    });

    render(<FileUploader onFileRead={mockOnFileRead} />);

    const input = screen.getByLabelText(/upload a \.txt file/i);
    const submitButton = screen.getByRole("button", {
      name: /upload & analyze/i,
    });

    await user.upload(input, fileWithCRLF);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnFileRead).toHaveBeenCalledWith(["line1", "line2", "line3"]);
    });
  });

  /**
   * Test that empty files are handled correctly.
   */
  it("handles empty file correctly", async () => {
    const user = userEvent.setup();
    const emptyFile = new File([""], "empty.txt", { type: "text/plain" });

    render(<FileUploader onFileRead={mockOnFileRead} />);

    const input = screen.getByLabelText(/upload a \.txt file/i);
    const submitButton = screen.getByRole("button", {
      name: /upload & analyze/i,
    });

    await user.upload(input, emptyFile);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnFileRead).toHaveBeenCalledWith([]);
    });
  });

  /**
   * Test that the file input only accepts .txt files.
   */
  it("applies correct accept attribute to file input", () => {
    render(<FileUploader onFileRead={mockOnFileRead} />);

    const input = screen.getByLabelText(/upload a \.txt file/i);
    expect(input).toHaveAttribute("accept", ".txt");
  });

  /**
   * Test that the component renders with initial animation wrapper.
   */
  it("renders with initial animation", () => {
    const { container } = render(<FileUploader onFileRead={mockOnFileRead} />);
    const motionDiv = container.querySelector("div");
    expect(motionDiv).toBeInTheDocument();
  });
});
