import { motion } from 'framer-motion';
import type { SymbolKind } from '../constants';

export function SymbolMotif({ kind }: { kind: SymbolKind }) {
  if (kind === 'light') {
    return (
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.2, 0.1], scale: [0.84, 1.12, 0.9] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 226, 186, 0.3), rgba(255, 226, 186, 0))',
          filter: 'blur(2px)',
        }}
      />
    );
  }

  if (kind === 'shadow') {
    return (
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.2, 0.4, 0.24] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 52%, rgba(0,0,0,0.16), rgba(0,0,0,0.52) 78%)',
        }}
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[0, 1].map((index) => (
        <motion.div
          key={`distance-symbol-${index}`}
          className="absolute left-1/2 h-px w-[68%] -translate-x-1/2"
          style={{
            top: `${44 + index * 9}%`,
            background: 'rgba(224, 232, 248, 0.2)',
          }}
          animate={{ x: [-6, 6, -6], opacity: [0.08, 0.24, 0.1] }}
          transition={{ duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
