'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

interface MemoryMoment {
  id: string;
  title: string;
  date: string;
  detail: string;
}

const MEMORIES: MemoryMoment[] = [
  {
    id: 'm1',
    title: 'The first long call',
    date: 'June 2023',
    detail: 'Three hours passed and it still felt short. I knew you were different.',
  },
  {
    id: 'm2',
    title: 'Rain walk and chai',
    date: 'August 2023',
    detail: 'We laughed at nothing and everything while the city blurred behind us.',
  },
  {
    id: 'm3',
    title: 'Your quiet support',
    date: 'December 2023',
    detail: 'You held me together when I was too stubborn to admit I was breaking.',
  },
  {
    id: 'm4',
    title: 'The difficult night',
    date: 'March 2024',
    detail: 'That was the night I failed you. I still replay it, hoping to choose better.',
  },
];

export function MemoryTimelineScreen({
  emotion,
  onNext,
}: ExperienceScreenProps) {
  const [activeMemoryId, setActiveMemoryId] = useState(MEMORIES[0].id);

  return (
    <section className="space-y-6">
      <div className="text-center">
        <p
          className="uppercase tracking-[0.16em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.66rem',
            opacity: 0.82,
          }}
        >
          memory timeline
        </p>

        <TextReveal
          text="The moments that still define us"
          emotion={emotion}
          className="mt-2 text-[clamp(1.55rem,4vw,2.35rem)]"
        />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/20 p-4 backdrop-blur-xl">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.13), transparent 42%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.08), transparent 43%)',
          }}
        />

        <div className="relative flex overflow-x-auto space-x-6 pb-2 pt-1 [scrollbar-width:none]">
          {MEMORIES.map((memory, index) => {
            const isActive = memory.id === activeMemoryId;

            return (
              <motion.button
                key={memory.id}
                type="button"
                className="min-w-[250px] rounded-xl border p-4 text-left"
                onClick={() => setActiveMemoryId(memory.id)}
                initial={{ opacity: 0, x: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: index * 0.14, duration: 0.66, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, scale: 1.01 }}
                style={{
                  borderColor: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                  boxShadow: isActive
                    ? '0 10px 24px rgba(255,255,255,0.12)'
                    : '0 4px 14px rgba(0,0,0,0.18)',
                  transition: 'border-color 260ms ease, background-color 260ms ease, box-shadow 260ms ease',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.15rem',
                    lineHeight: 1.2,
                  }}
                >
                  {memory.title}
                </p>
                <span
                  style={{
                    display: 'block',
                    marginTop: '0.4rem',
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.66rem',
                    letterSpacing: '0.08em',
                    opacity: 0.78,
                    textTransform: 'uppercase',
                  }}
                >
                  {memory.date}
                </span>

                {isActive ? (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.92, y: 0 }}
                    transition={{ duration: 0.44 }}
                    className="mt-3"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1rem',
                      lineHeight: 1.55,
                    }}
                  >
                    {memory.detail}
                  </motion.p>
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <div className="relative mt-5 flex justify-center gap-2">
          {MEMORIES.map((memory) => {
            const isActive = memory.id === activeMemoryId;
            return (
              <button
                key={`dot-${memory.id}`}
                type="button"
                aria-label={`Open ${memory.title}`}
                onClick={() => setActiveMemoryId(memory.id)}
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.38)',
                  boxShadow: isActive ? '0 0 14px rgba(255,255,255,0.42)' : 'none',
                  transition: 'background-color 220ms ease, box-shadow 220ms ease',
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onNext}
          className="rounded-full px-6 py-3 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: '#fff',
            background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
            boxShadow: '0 10px 24px rgba(247, 85, 144, 0.28)',
          }}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
