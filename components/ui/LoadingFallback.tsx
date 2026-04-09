"use client";

import { motion } from 'framer-motion';
import React from 'react';

export function LoadingFallback({ compact }: { compact?: boolean }) {
  return (
    <div
      className={compact ? 'py-2' : 'min-h-[12rem] py-6'}
      aria-hidden="true"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="rounded-full animate-pulse"
            style={{ width: 10, height: 10, background: 'var(--accent)' }}
          />
          <span
            style={{
              color: 'rgba(255,210,230,0.9)',
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.95rem',
            }}
          >
            Loading…
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default LoadingFallback;
