'use client';
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface ChartsProps {
  entityCounts: { type: string; count: number }[];
}

const COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949'];

/**
 * Dashboard grafů: bar chart + pie chart
 */
export default function Charts({ entityCounts }: ChartsProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
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