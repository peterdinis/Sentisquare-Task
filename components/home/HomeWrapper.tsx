'use client';

import React, { FC, useState } from 'react';
import { Container, Row, Col, Spinner, ToastContainer, Toast } from 'react-bootstrap';
import { motion } from 'framer-motion';
import FileUploader from '@/components/files/FileUploader';
import { LineData } from '@/types/textRazorTypes';
import { useAnalyzeText } from '@/hooks/useAnalyzeText';
import Charts from '@/components/charts/ChartsWrapper';
import EntityHighlighter from '../textEntity/EntityHighlighter';

/**
 * HomepageWrapper component serves as the main dashboard page.
 *
 * It allows users to:
 * - Upload a text file with multiple lines
 * - Analyze each line using the TextRazor API (entities only)
 * - Display the results in a **bar chart** and **pie chart**
 * - Highlight detected entities in each line
 * - Show toast notifications for success or errors
 *
 * Uses:
 * - React hooks for state management
 * - Framer Motion for smooth animations
 * - React-Bootstrap for layout, cards, spinner, and toasts
 *
 * @component
 * @returns {JSX.Element} The dashboard page with file upload, charts, and entity highlights
 *
 * @example
 * <HomepageWrapper />
 */
const HomepageWrapper: FC = () => {
  const [linesData, setLinesData] = useState<LineData[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { mutateAsync, isPending, isError, error } = useAnalyzeText();

  /**
   * Handles the uploaded text file lines.
   * Sends each line to the TextRazor API and collects entity results.
   * Updates state and shows toast notifications for success or errors.
   *
   * @param {string[]} lines - Array of non-empty, trimmed text lines from uploaded file
   */
  const handleFileRead = async (lines: string[]) => {
    const all: LineData[] = [];

    for (const line of lines) {
      try {
        const res = await mutateAsync(line);
        all.push({ text: line, entities: res.response.entities ?? [] });
      } catch (err) {
        console.error('line process error', err);
        setToastMessage(`Error processing line: "${line}"`);
        setShowToast(true);
      }
    }

    setLinesData(all);
    if (all.length > 0) {
      setToastMessage(`Processed ${all.length} lines successfully!`);
      setShowToast(true);
    }
  };

  // Count occurrences of each entity type for charts
  const counts: Record<string, number> = {};
  linesData.forEach((ld) =>
    ld.entities.forEach((e) => {
      const t = e.type?.[0] ?? 'Unknown';
      counts[t] = (counts[t] || 0) + 1;
    })
  );
  const entityCounts = Object.entries(counts).map(([type, count]) => ({ type, count }));

  return (
    <Container className="py-5">
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-5"
      >
        TextRazor Dashboard
      </motion.h1>

      {/* File Uploader Section */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={6}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FileUploader onFileRead={handleFileRead} />
          </motion.div>

          {/* Loader */}
          {isPending && (
            <div className="text-center mt-3">
              <Spinner animation="border" />
            </div>
          )}
        </Col>
      </Row>

      {/* Charts & Highlighted Texts */}
      {entityCounts.length > 0 && (
        <Row className="mt-4">
          <Col xs={12} md={6} className="mb-4">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Charts entityCounts={entityCounts} />
            </motion.div>
          </Col>
          <Col xs={12} md={6}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h5 className="mb-3">Texts with highlighted entities</h5>
              <div style={{ maxHeight: 560, overflowY: 'auto' }}>
                {linesData.map((l, idx) => (
                  <EntityHighlighter key={idx} text={l.text} entities={l.entities} />
                ))}
              </div>
            </motion.div>
          </Col>
        </Row>
      )}

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={4000}
          autohide
          bg={isError ? 'danger' : 'success'}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default HomepageWrapper;
