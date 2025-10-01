'use client';

import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Charts from '@/components/charts/ChartsWrapper';

const ChartsSection = ({ entityCounts }: { entityCounts: { type: string, count: number }[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="shadow-sm border-0 rounded-3 p-3">
      <Card.Title className="fw-semibold mb-3">📈 Entity Distribution</Card.Title>
      <Charts entityCounts={entityCounts} />
    </Card>
  </motion.div>
);

export default ChartsSection;
