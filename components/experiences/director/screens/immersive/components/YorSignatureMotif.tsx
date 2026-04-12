import { motion } from 'framer-motion';

export function YorSignatureMotif({
  className,
  opacity = 0.58,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={{ opacity: [opacity * 0.66, opacity, opacity * 0.66] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.2rem',
      }}
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={`ys-dot-${dot}`}
          style={{
            width: '0.22rem',
            height: '0.22rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 230, 196, 0.9)',
            boxShadow: '0 0 8px rgba(255, 230, 196, 0.4)',
          }}
        />
      ))}
    </motion.div>
  );
}
