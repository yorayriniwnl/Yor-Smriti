'use client';

/**
 * Animation wrapper for the private content page.
 * Intentionally contains NO content text — all content is rendered by the
 * parent SERVER component (page.tsx) so it never appears in the JS bundle.
 */
import { motion } from 'framer-motion';
import { ReadingProgress } from '@/components/ui/ReadingProgress';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

export function ContentShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE_SOFT }}
      className="relative z-10 mx-auto px-6"
      style={{ maxWidth: 580, paddingTop: '8vh', paddingBottom: '16vh' }}
    >
      <ReadingProgress />
      {children}
    </motion.div>
  );
}
