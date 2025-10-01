'use client';

import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import EntityHighlighter from '../textEntity/EntityHighlighter';
import { LineData } from '@/types/textRazorTypes';

const HighlightedTexts = ({ linesData }: { linesData: LineData[] }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-sm border-0 rounded-3 p-3" style={{ maxHeight: 560, overflowY: 'auto' }}>
      <Card.Title className="fw-semibold mb-3">📝 Texts with Highlighted Entities</Card.Title>
      {linesData.map((l, idx) => (
        <EntityHighlighter key={idx} text={l.text} entities={l.entities} />
      ))}
    </Card>
  </motion.div>
);

export default HighlightedTexts;
