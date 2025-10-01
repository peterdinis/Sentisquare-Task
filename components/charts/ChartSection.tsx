"use client";

import React from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";
import Charts from "./ChartsWrapper";

/**
 * ChartsSection component displays the entity distribution charts
 * in a card layout with smooth entrance animations.
 *
 * @component
 * @param {Object} props - Component props
 * @param {{ type: string, count: number }[]} props.entityCounts - Array of objects representing entity types and their counts
 * @returns {JSX.Element} The card with charts displaying entity distribution
 *
 * @example
 * <ChartsSection entityCounts={[{ type: 'Person', count: 5 }, { type: 'Organization', count: 3 }]} />
 */
const ChartsSection = ({
  entityCounts,
}: {
  entityCounts: { type: string; count: number }[];
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-sm border-0 rounded-3 p-3">
      <Card.Title className="fw-semibold mb-3">
        📈 Entity Distribution
      </Card.Title>
      <Charts entityCounts={entityCounts} />
    </Card>
  </motion.div>
);

export default ChartsSection;
