"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

export default function CinematicTransition({ children }: Props) {
  const pathname = usePathname();

  const pageVariants = {
    initial: { opacity: 0, scale: 1.03, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
  };

  const overlayVariants = {
    initial: { opacity: 0.18, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
    animate: { opacity: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
    exit: { opacity: 0.18, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] } },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-transition"
        style={{ minHeight: '100dvh' }}
      >
        <motion.div className="cinematic-blur-overlay" variants={overlayVariants} aria-hidden />
        <div className="page-transition-inner">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
