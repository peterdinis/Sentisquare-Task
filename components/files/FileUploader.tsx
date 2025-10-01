"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FormValues, schema } from "../../validators/fileValidators";

interface FileUploaderProps {
  /**
   * Callback function called after the file is read and processed.
   * @param {string[]} lines - Array of trimmed, non-empty lines from the uploaded text file.
   */
  onFileRead: (lines: string[]) => void;

  /**
   * Optional flag indicating whether the file is currently being processed.
   * While true, the file input is disabled and a loading spinner is shown on the button.
   */
  isLoading?: boolean;
}

export default function FileUploader({
  onFileRead,
  isLoading = false,
}: FileUploaderProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    const file = data.file[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || "");
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      onFileRead(lines);
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-sm border-0 p-4 rounded-3">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label htmlFor="file-input" className="fw-semibold mb-2">
              Upload a .txt file
            </Form.Label>
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <Form.Control
                  id="file-input"
                  type="file"
                  accept=".txt"
                  onChange={(e) =>
                    field.onChange((e.target as HTMLInputElement).files)
                  }
                  isInvalid={!!errors.file}
                  disabled={isLoading}
                />
              )}
            />
            {errors.file && (
              <Form.Text className="text-danger">
                {errors.file.message}
              </Form.Text>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end mt-3 align-items-center">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Analyzing…
                </>
              ) : (
                "Upload & Analyze"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}
