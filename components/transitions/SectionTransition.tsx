"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionTransition({ children, className = '', delay = 0 }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.995 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay }}
      viewport={{ once: true, amount: 0.18 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
