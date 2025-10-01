'use client';

import { motion } from 'framer-motion';

const DashboardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-5"
  >
    <h1 className="fw-bold">{title}</h1>
    {subtitle && <p className="text-muted">{subtitle}</p>}
  </motion.div>
);

export default DashboardHeader;
