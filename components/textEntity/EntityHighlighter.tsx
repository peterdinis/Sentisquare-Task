"use client";

import React from "react";
import { Card, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { TextRazorEntity } from "@/types/textRazorTypes";
import { highlightEntities } from "../../utils/highlight";

interface Props {
  /** The original text to display with highlighted entities */
  text: string;
  /** Array of TextRazorEntity objects detected in the text */
  entities: TextRazorEntity[];
}

/**
 * EntityHighlighter component highlights named entities in a given text.
 *
 * It uses the `highlightEntities` utility to wrap matched entity texts with HTML spans
 * and displays each entity as a Bootstrap badge below the text.
 *
 * Uses **Framer Motion** for fade-in animation.
 *
 * @component
 * @param {Props} props - The text and entities to highlight
 * @returns {JSX.Element} A card containing the highlighted text and entity badges
 *
 * @example
 * const entities = [
 *   { matchedText: 'George Bush', type: ['Person'] },
 *   { matchedText: 'USA', type: ['Country'] }
 * ];
 * <EntityHighlighter text="George Bush was president of USA." entities={entities} />
 */
export default function EntityHighlighter({ text, entities }: Props) {
  // Map entities to the format used by the highlightEntities utility
  const items = entities.map((e) => ({
    matchedText: e.matchedText,
    type: e.type?.[0] ?? "Unknown",
  }));

  const html = highlightEntities(text, items);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-2"
    >
      <Card className="p-3">
        {/* Highlighted text */}
        <div dangerouslySetInnerHTML={{ __html: html }} />
        {/* Entity badges */}
        <div className="mt-2">
          {entities.map((e, i) => (
            <Badge key={i} pill bg="info" text="dark" className="me-1">
              {e.matchedText} ({e.type?.[0] ?? "Unknown"})
            </Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
