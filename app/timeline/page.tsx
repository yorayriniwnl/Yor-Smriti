'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  mood: 'warm' | 'soft' | 'tender' | 'golden' | 'quiet';
  isSpecial?: boolean;
}

// ─── Fill these with your real memories ──────────────────────────────────────
const MEMORIES: MemoryEntry[] = [
  {
    id: 'mem-1',
    date: 'The beginning',
    title: 'The first time I noticed you',
    description:
      'I did not say anything. I just noticed. The way you laughed, the way you existed in a room — I could not stop noticing.',
    mood: 'soft',
  },
  {
    id: 'mem-2',
    date: 'Early days',
    title: 'Our first real conversation',
    description:
      'We talked like we had known each other forever. I kept thinking — why does this feel so easy? Why does this feel so right?',
    mood: 'warm',
    isSpecial: true,
  },
  {
    id: 'mem-3',
    date: 'A quiet afternoon',
    title: 'When I realized I was falling',
    description:
      'It was not a dramatic moment. It was just you, doing something ordinary. And something in me went completely still and certain.',
    mood: 'golden',
    isSpecial: true,
  },
  {
    id: 'mem-4',
    date: 'Us',
    title: 'The moments only we know',
    description:
      'All the inside jokes. The things only we find funny. The silence that never felt uncomfortable. I hold those close.',
    mood: 'tender',
  },
  {
    id: 'mem-5',
    date: 'A hard day',
    title: 'When you were there without being asked',
    description:
      'I did not say I needed you. But you knew. That kind of knowing is rare. I think about that more than you realize.',
    mood: 'quiet',
  },
  {
    id: 'mem-6',
    date: 'My favourite memory',
    title: 'When everything felt perfect',
    description:
      'I do not think either of us said anything important. But I remember thinking — I want more of this. I want all of this.',
    mood: 'golden',
    isSpecial: true,
  },
  {
    id: 'mem-7',
    date: 'Now',
    title: 'You, still',
    description:
      'After everything. Through the silence and the hurt and the distance — it is still you. It has always been you.',
    mood: 'warm',
    isSpecial: true,
  },
];

const MOOD_STYLES: Record<MemoryEntry['mood'], { dot: string; glow: string; accent: string }> = {
  warm: {
    dot: 'rgba(247, 130, 144, 0.95)',
    glow: 'rgba(247, 85, 144, 0.18)',
    accent: 'rgba(255, 160, 190, 0.85)',
  },
  soft: {
    dot: 'rgba(200, 160, 230, 0.9)',
    glow: 'rgba(180, 120, 220, 0.14)',
    accent: 'rgba(220, 180, 245, 0.8)',
  },
  tender: {
    dot: 'rgba(255, 190, 170, 0.9)',
    glow: 'rgba(240, 150, 130, 0.14)',
    accent: 'rgba(255, 200, 185, 0.8)',
  },
  golden: {
    dot: 'rgba(240, 200, 100, 0.9)',
    glow: 'rgba(220, 180, 80, 0.18)',
    accent: 'rgba(248, 215, 140, 0.85)',
  },
  quiet: {
    dot: 'rgba(160, 200, 230, 0.85)',
    glow: 'rgba(120, 170, 210, 0.12)',
    accent: 'rgba(180, 215, 240, 0.78)',
  },
};

function TimelineEntry({ memory, index }: { memory: MemoryEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const style = MOOD_STYLES[memory.mood];
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`relative flex items-start gap-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -28 : 28, y: 8 }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.9, ease: EASE_SOFT, delay: 0.1 }}
        className="relative w-[calc(50%-28px)] shrink-0"
      >
        <div
          className="relative overflow-hidden rounded-[1.4rem] border px-5 py-6"
          style={{
            background: `linear-gradient(160deg, rgba(38, 14, 30, 0.94) 0%, rgba(16, 6, 14, 0.97) 100%)`,
            borderColor: memory.isSpecial
              ? 'rgba(244, 173, 210, 0.38)'
              : 'rgba(244, 173, 210, 0.18)',
            boxShadow: memory.isSpecial
              ? `0 18px 40px rgba(0,0,0,0.5), 0 8px 20px ${style.glow}`
              : '0 10px 28px rgba(0,0,0,0.4)',
          }}
        >
          {/* Ambient top glow */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background: `radial-gradient(ellipse at ${isLeft ? '0%' : '100%'} 0%, ${style.glow.replace('0.18', '0.22').replace('0.14', '0.16').replace('0.12', '0.12')}, transparent 65%)`,
            }}
          />

          <div className="relative">
            <p
              className="mb-2 uppercase tracking-[0.15em]"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                color: style.accent,
                fontSize: '0.58rem',
              }}
            >
              {memory.date}
            </p>

            <h3
              className="mb-3"
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'rgba(255, 236, 246, 0.97)',
                fontSize: 'clamp(1.05rem, 2.5vw, 1.4rem)',
                lineHeight: 1.2,
                fontWeight: memory.isSpecial ? 500 : 400,
              }}
            >
              {memory.title}
            </h3>

            <p
              style={{
                color: 'rgba(255, 205, 228, 0.78)',
                fontFamily: 'var(--font-crimson)',
                fontSize: '0.9rem',
                lineHeight: 1.65,
                fontStyle: 'italic',
              }}
            >
              {memory.description}
            </p>

            {memory.isSpecial && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE_SOFT }}
                className="mt-4 h-px origin-left"
                style={{
                  background: `linear-gradient(to right, ${style.dot}, transparent)`,
                }}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Centre spine dot */}
      <div className="relative flex shrink-0 flex-col items-center" style={{ width: 56 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: EASE_SOFT, delay: 0.2 }}
          className="relative z-10 rounded-full"
          style={{
            width: memory.isSpecial ? 18 : 12,
            height: memory.isSpecial ? 18 : 12,
            background: style.dot,
            boxShadow: `0 0 0 4px rgba(5,3,10,1), 0 0 16px ${style.glow}`,
          }}
        />
        {memory.isSpecial && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="absolute rounded-full"
            style={{
              width: 32, height: 32,
              top: -7,
              background: style.glow,
              filter: 'blur(8px)',
            }}
          />
        )}
      </div>

      {/* Spacer for opposite side */}
      <div className="w-[calc(50%-28px)] shrink-0" />
    </div>
  );
}

export default function TimelinePage() {
  return (
    <main
      className="relative min-h-dvh w-dvw overflow-x-hidden px-4 py-14"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
        overflowY: 'auto',
        height: '100dvh',
      }}
    >
      {/* Sticky header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
        className="relative z-10 mb-14 text-center"
      >
        <p
          className="mb-2 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 171, 210, 0.7)',
            fontSize: '0.58rem',
          }}
        >
          our story
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            color: 'rgba(255, 236, 246, 0.98)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          Memory Timeline
        </h1>
        <p
          className="mx-auto mt-3 max-w-[40ch]"
          style={{
            color: 'rgba(255, 200, 225, 0.7)',
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.92rem, 2vw, 1.05rem)',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          Every moment that mattered. In the order they changed me.
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-3xl">
        {/* Vertical spine line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.6, ease: EASE_SOFT, delay: 0.3 }}
          className="absolute left-1/2 top-0 w-px origin-top"
          style={{
            height: '100%',
            transform: 'translateX(-50%)',
            background:
              'linear-gradient(to bottom, rgba(247,85,144,0.0), rgba(247,85,144,0.22) 10%, rgba(247,85,144,0.22) 90%, rgba(247,85,144,0.0))',
          }}
          aria-hidden="true"
        />

        {/* Entries */}
        <div className="flex flex-col gap-12">
          {MEMORIES.map((memory, index) => (
            <TimelineEntry key={memory.id} memory={memory} index={index} />
          ))}
        </div>

        {/* End marker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_SOFT }}
          className="mt-16 flex flex-col items-center gap-4 pb-10 text-center"
        >
          <div
            className="h-px w-20"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(247,85,144,0.4), transparent)',
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: 'rgba(255, 220, 240, 0.8)',
              fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
              fontStyle: 'italic',
              lineHeight: 1.3,
            }}
          >
            And still writing it.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 171, 210, 0.5)',
            }}
          >
            — Ayrin
          </p>
        </motion.div>
      </div>

      {/* Nav back */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/hub"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            color: 'rgba(255, 171, 210, 0.45)',
            textTransform: 'uppercase',
          }}
        >
          ← back
        </Link>
      </div>
    </main>
  );
}
