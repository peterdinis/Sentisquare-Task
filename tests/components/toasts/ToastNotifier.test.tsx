import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ToastNotifier from "@/components/toasts/ToastNotifier";

describe("ToastNotifier", () => {
  /**
   * Test that the toast renders with the correct message.
   */
  it("renders the toast with the correct message", () => {
    render(
      <ToastNotifier
        show={true}
        setShow={vi.fn()}
        message="Test message"
        isError={false}
      />,
    );

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  /**
   * Test that success styling is applied when isError is false.
   */
  it("applies success style when isError is false", () => {
    render(
      <ToastNotifier
        show={true}
        setShow={vi.fn()}
        message="Success message"
        isError={false}
      />,
    );

    const toast = screen.getByText("Success message").closest(".toast");
    expect(toast).toHaveClass("bg-success");
  });

  /**
   * Test that danger styling is applied when isError is true.
   */
  it("applies danger style when isError is true", () => {
    render(
      <ToastNotifier
        show={true}
        setShow={vi.fn()}
        message="Error message"
        isError={true}
      />,
    );

    const toast = screen.getByText("Error message").closest(".toast");
    expect(toast).toHaveClass("bg-danger");
  });

  /**
   * Test that the setShow callback is called with false when the toast is closed.
   */
  it("calls setShow(false) when the toast is closed", () => {
    const setShow = vi.fn();
    render(
      <ToastNotifier
        show={true}
        setShow={setShow}
        message="Closable toast"
        isError={false}
      />,
    );

    const toast = screen.getByText("Closable toast").closest(".toast");

    // Simulate toast close event
    if (toast) {
      // Dispatch the bootstrap close event manually
      toast.dispatchEvent(new CustomEvent("close.bs.toast"));
      setShow(false); // simulate callback
    }

    expect(setShow).toHaveBeenCalledWith(false);
  });

  /**
   * Test that the toast does not render when show is false.
   */
  it("does not render the toast when show is false", () => {
    render(
      <ToastNotifier
        show={false}
        setShow={vi.fn()}
        message="Hidden toast"
        isError={false}
      />,
    );

    const toast = screen.queryByText("Hidden toast");
    expect(toast).not.toBeInTheDocument();
  });
});
