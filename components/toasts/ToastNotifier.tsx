'use client';

import { Toast, ToastContainer } from 'react-bootstrap';

const ToastNotifier = ({
  show,
  setShow,
  message,
  isError
}: {
  show: boolean;
  setShow: (v: boolean) => void;
  message: string;
  isError: boolean;
}) => (
  <ToastContainer position="top-end" className="p-3">
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={4000}
      autohide
      bg={isError ? 'danger' : 'success'}
      className="shadow-sm"
    >
      <Toast.Body className="text-white fw-semibold">{message}</Toast.Body>
    </Toast>
  </ToastContainer>
);

export default ToastNotifier;
