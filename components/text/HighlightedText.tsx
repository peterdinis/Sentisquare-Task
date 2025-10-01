"use client";

import React from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import EntityHighlighter from "../textEntity/EntityHighlighter";
import { LineData } from "@/types/textRazorTypes";

/**
 * HighlightedTexts component displays a list of text lines with their detected entities highlighted.
 * Each line is rendered using the `EntityHighlighter` component.
 *
 * @component
 * @param {Object} props - Component props
 * @param {LineData[]} props.linesData - Array of text lines with their corresponding entities
 * @returns {JSX.Element} A card displaying the highlighted texts with a scrollable area
 */
interface HighlightedTextsProps {
  linesData: LineData[];
}

const HighlightedTexts = ({ linesData }: HighlightedTextsProps) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card
      className="shadow-sm border-0 rounded-3 p-3"
      style={{ maxHeight: 560, overflowY: "auto" }}
    >
      <Card.Title className="fw-semibold mb-3">
        📝 Texts with Highlighted Entities
      </Card.Title>

      {linesData.map((line, idx) => {
        // Ensure each entity is a full TextRazorEntity
        const entities = line.entities.map((e) => ({
          entityId: e.entityId ?? "",
          confidenceScore: e.confidenceScore ?? 0,
          matchedText: e.matchedText,
          type: e.type ?? ["Unknown"],
        }));

        return (
          <EntityHighlighter key={idx} text={line.text} entities={entities} />
        );
      })}
    </Card>
  </motion.div>
);

export default HighlightedTexts;
