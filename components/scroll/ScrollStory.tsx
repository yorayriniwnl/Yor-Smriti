"use client";

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = { children: React.ReactNode };

export default function ScrollStory({ children }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const progress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
        el.style.setProperty('--scroll-progress', String(progress));
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const panels = React.Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className="story-root h-screen w-full overflow-y-scroll snap-y snap-mandatory antialiased"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {panels.map((child, idx) => (
        <section key={idx} className="story-panel snap-start min-h-screen flex items-center justify-center">
          <motion.div
            className="flex min-h-screen w-full items-center justify-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {child}
          </motion.div>
        </section>
      ))}
    </div>
  );
}
