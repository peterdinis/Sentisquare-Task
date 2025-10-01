'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { COLORS } from '@/constants/applicationConstants';

interface ChartsProps {
  /** Array of objects representing entity types and their counts */
  entityCounts: { type: string; count: number }[];
}

/**
 * Charts component displays a **dashboard for analyzed entities**.
 *
 * It includes:
 * - **Bar chart**: shows the frequency of each entity type
 * - **Pie chart**: shows the proportional share of each entity type
 *
 * Uses **Recharts** for the charts and **Framer Motion** for entry animation.
 *
 * @param {ChartsProps} props - Data containing counts of individual entity types
 * @returns JSX.Element - Dashboard containing bar and pie charts
 *
 * @example
 * const entityCounts = [
 *   { type: 'Person', count: 5 },
 *   { type: 'Organization', count: 3 },
 *   { type: 'Location', count: 2 }
 * ];
 * <Charts entityCounts={entityCounts} />
 */
export default function Charts({ entityCounts }: ChartsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      {/* Bar chart – frequency of entity types */}
      <Card className="p-3 mb-3">
        <h5>Entity types — frequency</h5>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={entityCounts} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4e79a7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pie chart – share of each entity type */}
      <Card className="p-3">
        <h5>Share by type (pie)</h5>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={entityCounts} dataKey="count" nameKey="type" outerRadius={80} fill="#8884d8" label>
                {entityCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}
