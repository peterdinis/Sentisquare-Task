import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploader from "@/components/files/FileUploader";

describe("FileUploader", () => {
  it("renders the file input and submit button", () => {
    render(<FileUploader onFileRead={vi.fn()} />);

    const fileInput = screen.getByLabelText(/upload a .txt file/i);
    const submitButton = screen.getByRole("button", { name: /upload & analyze/i });

    expect(fileInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(fileInput).not.toBeDisabled();
  });

  it("displays loading spinner and disables inputs when isLoading is true", () => {
    render(<FileUploader onFileRead={vi.fn()} isLoading />);

    const fileInput = screen.getByLabelText(/upload a .txt file/i) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /analyzing/i });

    expect(fileInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Analyzing…");
  });

  it("calls onFileRead with trimmed, non-empty lines when a file is uploaded", async () => {
    const onFileRead = vi.fn();
    render(<FileUploader onFileRead={onFileRead} />);

    const fileInput = screen.getByLabelText(/upload a .txt file/i) as HTMLInputElement;

    // Mock file content
    const file = new File(["line1\n\nline2\n  line3  \n"], "test.txt", { type: "text/plain" });

    // Mock FileReader
    const readAsTextMock = vi.fn();
    const addEventListenerMock = vi.fn((event, cb) => {
      if (event === "load") {
        cb({ target: { result: file } });
      }
    });

    vi.stubGlobal("FileReader", class {
      readAsText = readAsTextMock;
      onload: ((ev: any) => void) | null = null;
      addEventListener = addEventListenerMock;
    });

    fireEvent.change(fileInput, { target: { files: [file] } });
    const submitButton = screen.getByRole("button", { name: /upload & analyze/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onFileRead).toHaveBeenCalledWith(["line1", "line2", "line3"]);
    });

    vi.unstubAllGlobals();
  });

  it("shows validation error if no file is selected", async () => {
    render(<FileUploader onFileRead={vi.fn()} />);

    const submitButton = screen.getByRole("button", { name: /upload & analyze/i });
    fireEvent.click(submitButton);

    const errorText = await screen.findByText(/required/i);
    expect(errorText).toBeInTheDocument();
  });
});
