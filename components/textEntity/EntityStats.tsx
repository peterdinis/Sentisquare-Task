'use client';

import { Card, ListGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';

const EntityStats = ({ entityCounts, totalLines }: { entityCounts: { type: string, count: number }[], totalLines: number }) => {
  const totalEntities = entityCounts.reduce((sum, e) => sum + e.count, 0);
  const topEntity = entityCounts.sort((a, b) => b.count - a.count)[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body>
          <Card.Title className="fw-semibold mb-3">📊 Stats Overview</Card.Title>
          <ListGroup variant="flush">
            <ListGroup.Item>Lines processed: <strong>{totalLines}</strong></ListGroup.Item>
            <ListGroup.Item>Total entities: <strong>{totalEntities}</strong></ListGroup.Item>
            <ListGroup.Item>Most frequent entity type: <strong>{topEntity?.type ?? '-'}</strong></ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default EntityStats;
