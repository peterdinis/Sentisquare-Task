'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { FormValues, schema } from '../../validators/fileValidators';

interface FileUploaderProps {
  /**
   * Callback function called after the file is read.
   * @param {string[]} lines - Array of trimmed non-empty lines from the uploaded text file.
   */
  onFileRead: (lines: string[]) => void;
}

/**
 * FileUploader component allows users to upload a text (.txt) file,
 * reads its content, splits it into individual lines, trims empty lines,
 * and passes the resulting array of lines to the provided `onFileRead` callback.
 *
 * Uses **react-hook-form** for form management and validation via **Zod**.
 *
 * @param {FileUploaderProps} props - Props containing the `onFileRead` callback
 * @returns JSX.Element - File upload form
 *
 * @example
 * <FileUploader onFileRead={(lines) => console.log(lines)} />
 */
export default function FileUploader({ onFileRead }: FileUploaderProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  /**
   * Handles the form submission.
   * Reads the selected file as text, splits it into lines, trims whitespace,
   * filters out empty lines, and calls `onFileRead` with the resulting array.
   *
   * @param {FormValues} data - Form values containing the uploaded file
   */
  const onSubmit = (data: FormValues) => {
    const file = data.file[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      onFileRead(lines);
    };
    reader.readAsText(file);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row className="align-items-center g-2">
        <Col xs={12} md={8}>
          <Controller
  name="file"
  control={control}
  render={({ field }) => (
    <Form.Control
      type="file"
      accept=".txt"
      data-testid="file-input"
      onChange={e => field.onChange((e.target as HTMLInputElement).files)}
    />
  )}
/>
          {errors.file && <div className="text-danger small mt-1">{errors.file.message}</div>}
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button type="submit" className="mt-2">Upload</Button>
        </Col>
      </Row>
    </Form>
  );
}
