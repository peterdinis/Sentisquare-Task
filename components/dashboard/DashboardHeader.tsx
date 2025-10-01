"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * DashboardHeader component displays the main title and optional subtitle
 * of the dashboard with a smooth entrance animation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The main dashboard title
 * @param {string} [props.subtitle] - Optional subtitle displayed below the title
 * @returns {JSX.Element} Animated header for the dashboard
 *
 * @example
 * <DashboardHeader
 *   title="TextRazor Dashboard"
 *   subtitle="Upload, analyze and visualize text entities"
 * />
 */
const DashboardHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
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
