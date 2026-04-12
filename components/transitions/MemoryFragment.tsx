'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MemoryFragmentProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function MemoryFragment({
  children,
  delay = 0,
  className,
}: MemoryFragmentProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{
        opacity: [0, 0.76, 0.62, 1],
        filter: ['blur(10px)', 'blur(4px)', 'blur(7px)', 'blur(0px)'],
      }}
      transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
