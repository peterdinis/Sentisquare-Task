import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUploader from "../../components/files/FileUploader";
import "@testing-library/jest-dom";

describe("FileUploader", () => {
  const fileContent = "Line 1\nLine 2\n\nLine 3";
  const mockOnFileRead = vi.fn();

  beforeEach(() => {
    mockOnFileRead.mockClear();

    // Mock DataTransfer for Node environment
    class MockDataTransfer {
      items: { add: (file: File) => void }[];
      files: File[];
      constructor() {
        this.items = [];
        this.files = [];
      }
      get filesList() {
        return this.files;
      }
      get length() {
        return this.files.length;
      }
      add(file: File) {
        this.items.push({ file, kind: "file" });
        this.files.push(file);
      }
    }
    global.DataTransfer = MockDataTransfer as any;
  });

  it("renders file input and upload button", () => {
    render(<FileUploader onFileRead={mockOnFileRead} />);
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
  });

  it("calls onFileRead with trimmed lines when file is uploaded", async () => {
    render(<FileUploader onFileRead={mockOnFileRead} />);

    const file = new File([fileContent], "test.txt", { type: "text/plain" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    // Simulate file upload using mocked DataTransfer
    const dataTransfer = new DataTransfer();
    dataTransfer.add(file);

    fireEvent.change(input, { target: { files: dataTransfer.files } });

    const button = screen.getByRole("button", { name: /upload/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnFileRead).toHaveBeenCalledTimes(1);
      expect(mockOnFileRead).toHaveBeenCalledWith([
        "Line 1",
        "Line 2",
        "Line 3",
      ]);
    });
  });

  it("shows validation error if no file is selected", async () => {
    render(<FileUploader onFileRead={mockOnFileRead} />);

    const button = screen.getByRole("button", { name: /upload/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/file is required/i)).toBeInTheDocument();
      expect(mockOnFileRead).not.toHaveBeenCalled();
    });
  });
});
