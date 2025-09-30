'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col } from 'react-bootstrap';

interface FileUploaderProps {
  onFileRead: (lines: string[]) => void;
}

const fileListSchema = z
  .custom<FileList>((value): value is FileList => value instanceof FileList, {
    message: 'File is required',
  })
  .refine((files) => files.length > 0, 'File is required')
  .refine((files) => files[0]?.type === 'text/plain', 'Only .txt files are allowed');

const schema = z.object({
  file: fileListSchema,
});

type FormValues = z.infer<typeof schema>;

export default function FileUploader({ onFileRead }: FileUploaderProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

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
