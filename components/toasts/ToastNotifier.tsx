"use client";

import React, { type JSX } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

/**
 * ToastNotifier component displays a toast notification at the top-end of the screen.
 * It can show success or error messages and automatically hides after a short delay.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the toast is currently visible
 * @param {(v: boolean) => void} props.setShow - Function to update the visibility of the toast
 * @param {string} props.message - Message text to display inside the toast
 * @param {boolean} props.isError - If true, displays a red "danger" toast; otherwise, a green "success" toast
 * @returns {JSX.Element} A Bootstrap toast notification
 *
 * @example
 * <ToastNotifier
 *   show={true}
 *   setShow={(v) => console.log(v)}
 *   message="Successfully processed 5 lines!"
 *   isError={false}
 * />
 */
const ToastNotifier = ({
  show,
  setShow,
  message,
  isError,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
  message: string;
  isError: boolean;
}): JSX.Element => (
  <ToastContainer position="top-end" className="p-3">
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={4000}
      autohide
      bg={isError ? "danger" : "success"}
      className="shadow-sm"
    >
      <Toast.Body className="text-white fw-semibold">{message}</Toast.Body>
    </Toast>
  </ToastContainer>
);

export default ToastNotifier;
