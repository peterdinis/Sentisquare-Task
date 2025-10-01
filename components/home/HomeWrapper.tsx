"use client";

import React, { FC, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { LineData } from "@/types/textRazorTypes";
import { useAnalyzeText } from "../../hooks/useAnalyzeText";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import FileUploader from "../../components/files/FileUploader";
import EntityStats from "../textEntity/EntityStats";
import HighlightedTexts from "../text/HighlightedText";
import ToastNotifier from "../toasts/ToastNotifier";
import ChartsSection from "../charts/ChartSection";

/**
 * HomepageWrapper component serves as the main dashboard page.
 *
 * Features:
 * - Upload a .txt file with multiple lines
 * - Analyze each line using the TextRazor API (entities only)
 * - Display the results in charts and entity statistics
 * - Highlight detected entities in each line
 * - Show toast notifications for success or errors
 *
 * @component
 * @returns {JSX.Element} The dashboard page with file upload, charts, stats, and highlighted texts
 *
 * @example
 * <HomepageWrapper />
 */
const HomepageWrapper: FC = () => {
  const [linesData, setLinesData] = useState<LineData[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { mutateAsync, isPending, isError } = useAnalyzeText();

  /**
   * Handles the uploaded file lines.
   * Sends each line to the TextRazor API and collects entity results.
   * Updates state and shows toast notifications for success or errors.
   *
   * @param {string[]} lines - Array of trimmed, non-empty text lines from the uploaded file
   */
  const handleFileRead = async (lines: string[]) => {
    const all: LineData[] = [];
    for (const line of lines) {
      try {
        const res = await mutateAsync(line);
        all.push({ text: line, entities: res.response.entities ?? [] });
      } catch {
        setToastMessage(`❌ Error processing line: "${line}"`);
        setShowToast(true);
      }
    }
    setLinesData(all);
    if (all.length > 0) {
      setToastMessage(`✅ Successfully processed ${all.length} lines!`);
      setShowToast(true);
    }
  };

  // Aggregate entity counts for charts and stats
  const counts: Record<string, number> = {};
  linesData.forEach((ld) =>
    ld.entities.forEach((e) => {
      const t = e.type?.[0] ?? "Unknown";
      counts[t] = (counts[t] || 0) + 1;
    }),
  );
  const entityCounts = Object.entries(counts).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <Container fluid className="py-5">
      {/* Header */}
      <DashboardHeader
        title="TextRazor Dashboard"
        subtitle="Upload, analyze and visualize text entities"
      />

      {/* File Uploader */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8} lg={6}>
          <FileUploader onFileRead={handleFileRead} isLoading={isPending} />
        </Col>
      </Row>

      {/* Results */}
      {entityCounts.length > 0 && (
        <Row className="mt-4 g-4">
          <Col xs={12} lg={3}>
            <EntityStats
              entityCounts={entityCounts}
              totalLines={linesData.length}
            />
          </Col>
          <Col xs={12} lg={5}>
            <ChartsSection entityCounts={entityCounts} />
          </Col>
          <Col xs={12} lg={4}>
            <HighlightedTexts linesData={linesData} />
          </Col>
        </Row>
      )}

      {/* Toast Notifications */}
      <ToastNotifier
        show={showToast}
        setShow={setShowToast}
        message={toastMessage}
        isError={isError}
      />
    </Container>
  );
};

export default HomepageWrapper;
