import { motion } from 'framer-motion';

export function MemoryEchoText({ text }: { text: string }) {
  return (
    <motion.p
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.05, 0.12, 0.06] }}
      transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        fontFamily: 'var(--font-cormorant)',
        fontSize: 'clamp(1.9rem,6.8vw,4.8rem)',
        lineHeight: 1,
        letterSpacing: '0.03em',
        color: 'rgba(255, 240, 233, 0.28)',
        filter: 'blur(1px)',
      }}
    >
      {text}
    </motion.p>
  );
}
