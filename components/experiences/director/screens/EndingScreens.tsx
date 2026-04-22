'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

export function EndingHopefulScreen({
  onPrev,
  onRestart,
  personalization,
}: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-6 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.66rem', opacity: 0.8 }}
      >
        hopeful ending
      </p>

      <motion.h2
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
        className="text-[clamp(1.6rem,4.4vw,2.6rem)]"
        style={{ fontFamily: 'var(--font-cormorant)', lineHeight: 1.2 }}
      >
        Maybe someday, we can begin again.
      </motion.h2>

      <p
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(1rem,2.6vw,1.2rem)',
          lineHeight: 1.55,
          opacity: 0.9,
          maxWidth: '34ch',
        }}
      >
        I will be patient, {personalization.name}. I will be better whether or not that someday
        arrives.
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.88 }}
        transition={{ duration: 1.2, delay: 3.2 }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(0.98rem,2.4vw,1.12rem)',
          lineHeight: 1.54,
          opacity: 0.88,
        }}
      >
        If you ever come back to this page, I will still choose gentleness first.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 3.6 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <motion.button
          type="button"
          onClick={() => onRestart()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: '#fff',
            background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
            boxShadow: '0 10px 24px rgba(247, 85, 144, 0.28)',
          }}
        >
          Replay
        </motion.button>

        <motion.button
          type="button"
          onClick={onPrev}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.34)',
            fontFamily: 'var(--font-dm-mono)',
            color: 'inherit',
          }}
        >
          Revisit choice
        </motion.button>
        <Link
          href="/reply"
          className="text-[0.62rem] uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255,171,210,0.6)',
            borderBottom: '1px solid rgba(255,171,210,0.22)',
            paddingBottom: '1px',
          }}
        >
          Send a reply 💌
        </Link>
      </motion.div>
    </section>
  );
}

export function EndingClosureScreen({
  onPrev,
  onRestart,
  personalization,
}: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-6 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.66rem', opacity: 0.8 }}
      >
        closure ending
      </p>

      <motion.h2
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
        className="text-[clamp(1.55rem,4.4vw,2.5rem)]"
        style={{ fontFamily: 'var(--font-cormorant)', lineHeight: 1.2 }}
      >
        I will let you go with respect.
      </motion.h2>

      <p
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(1rem,2.6vw,1.2rem)',
          lineHeight: 1.55,
          opacity: 0.9,
          maxWidth: '34ch',
        }}
      >
        This is not defeat. It is me learning to love you without holding you, {personalization.name}.
      </p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.86 }}
        transition={{ duration: 1.2, delay: 3.1 }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(0.98rem,2.4vw,1.12rem)',
          lineHeight: 1.54,
          opacity: 0.88,
        }}
      >
        I will keep your peace unbroken, even from a distance.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 3.5 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <motion.button
          type="button"
          onClick={() => onRestart()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: '#fff',
            background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
            boxShadow: '0 10px 24px rgba(247, 85, 144, 0.28)',
          }}
        >
          Replay
        </motion.button>

        <motion.button
          type="button"
          onClick={onPrev}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.34)',
            fontFamily: 'var(--font-dm-mono)',
            color: 'inherit',
          }}
        >
          Revisit choice
        </motion.button>
        <Link
          href="/reply"
          className="text-[0.62rem] uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255,171,210,0.6)',
            borderBottom: '1px solid rgba(255,171,210,0.22)',
            paddingBottom: '1px',
          }}
        >
          Send a reply 💌
        </Link>
      </motion.div>
    </section>
  );
}

export function EndingGoodbyeScreen({
  onPrev,
  onRestart,
  personalization,
}: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 pt-6 text-center">
      <p
        className="uppercase tracking-[0.16em]"
        style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.66rem', opacity: 0.66 }}
      >
        goodbye ending
      </p>

      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="h-px w-24"
        style={{ background: 'rgba(255,255,255,0.26)' }}
      />

      <motion.h2
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 0.84, filter: 'blur(0px)' }}
        transition={{ duration: 1.05 }}
        className="text-[clamp(1.45rem,4vw,2.2rem)]"
        style={{ fontFamily: 'var(--font-cormorant)', lineHeight: 1.2 }}
      >
        Silence says what words cannot.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.66 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(0.98rem,2.4vw,1.14rem)',
          maxWidth: '34ch',
          lineHeight: 1.55,
        }}
      >
        I will carry the lesson, {personalization.name}, and leave the rest to time.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.3, delay: 3.1 }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(0.98rem,2.4vw,1.1rem)',
          lineHeight: 1.55,
          opacity: 0.8,
        }}
      >
        This ending will stay quiet, but it will not stay bitter.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 3.5 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <motion.button
          type="button"
          onClick={() => onRestart()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: '#fff',
            background: 'linear-gradient(90deg, rgba(255, 133, 179, 0.95), rgba(247, 85, 144, 0.95))',
            boxShadow: '0 10px 24px rgba(247, 85, 144, 0.28)',
          }}
        >
          Replay
        </motion.button>

        <motion.button
          type="button"
          onClick={onPrev}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.28)',
            fontFamily: 'var(--font-dm-mono)',
            color: 'inherit',
            opacity: 0.88,
          }}
        >
          Revisit choice
        </motion.button>
      </motion.div>
    </section>
  );
}
