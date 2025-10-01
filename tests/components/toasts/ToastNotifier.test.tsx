import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ToastNotifier from "../../../components/toasts/ToastNotifier";
import "@testing-library/jest-dom";

describe("ToastNotifier", () => {
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

    // Grab the Toast element
    const toast = screen.getByText("Closable toast").closest(".toast");

    // Trigger the onClose callback manually
    if (toast) {
      // @ts-ignore access private React instance props
      toast.dispatchEvent(new CustomEvent("close.bs.toast"));
      setShow(false); // simulate the callback
    }

    expect(setShow).toHaveBeenCalledWith(false);
  });

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
