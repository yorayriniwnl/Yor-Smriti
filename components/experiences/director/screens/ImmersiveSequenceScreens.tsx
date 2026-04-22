'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

import { LETTER_PARAGRAPHS, TIMELINE_CARDS, FRAGMENT_WORDS, SMALL_THINGS, LETTER_PAGE_LINES, STORY_HINT_FRAGMENTS } from './immersive/constants';

import { toPublicScreenNumber } from './immersive/utils';

import { useEmotionalScrollResistance } from './immersive/hooks';

import { SymbolMotif } from './immersive/components/SymbolMotif';
import { SceneEyebrow } from './immersive/components/SceneEyebrow';
import { YorSignatureMotif } from './immersive/components/YorSignatureMotif';
import { MemoryEchoText } from './immersive/components/MemoryEchoText';
import { LetterPageCard } from './immersive/components/LetterPageCard';

export function LetterPeakScreen({ emotion, personalization }: ExperienceScreenProps) {
  const letterPeakScrollRef = useRef<HTMLDivElement | null>(null);
  useEmotionalScrollResistance(letterPeakScrollRef, 0.4);

  return (
    <motion.section
      className="space-y-6"
      animate={{ y: [20, 0], opacity: [0, 1] }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center">
        <SceneEyebrow text={`screen ${toPublicScreenNumber(86)} - the letter`} />

        <TextReveal
          text={`I am sorry, ${personalization.name}. Please read this once.`}
          emotion={emotion}
          mode="typewriter"
          speedMs={23}
          className="mt-2 text-[clamp(1.55rem,4.2vw,2.4rem)]"
        />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/28 p-4 backdrop-blur-2xl">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 48%), radial-gradient(circle at 50% 100%, rgba(255,183,143,0.12), transparent 58%)',
          }}
        />

        <div
          ref={letterPeakScrollRef}
          className="emotional-scroll relative max-h-[48vh] space-y-4 overflow-y-auto rounded-2xl border border-white/15 bg-black/20 p-5"
          data-nav-ignore="true"
        >
          {LETTER_PARAGRAPHS.map((paragraph, index) => (
            <TextReveal
              key={`letter-p-${index}`}
              text={paragraph}
              emotion={emotion}
              mode="typewriter"
              speedMs={18}
              delay={index * 0.5}
              className="text-[clamp(1rem,2.3vw,1.15rem)] leading-relaxed"
            />
          ))}

          <TextReveal
            text={`- still learning, still trying for you, ${personalization.name}`}
            emotion={emotion}
            mode="typewriter"
            speedMs={21}
            delay={2.2}
            className="pt-1 text-[clamp(1.08rem,2.5vw,1.25rem)] italic"
          />
        </div>
      </div>
    </motion.section>
  );
}

export function FreezeMomentScreen() {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.06, 0.15, 0.08], scale: [0.9, 1.1, 0.94] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(218, 229, 255, 0.18), rgba(218, 229, 255, 0))',
        }}
      />

      <motion.span
        aria-hidden="true"
        className="relative block h-12 w-px"
        style={{ background: 'rgba(236, 241, 255, 0.72)' }}
        animate={{ opacity: [0.1, 0.8, 0.1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <p className="sr-only">Breathing space</p>
    </section>
  );
}

export function Timeline88Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <SceneEyebrow text={`screen ${toPublicScreenNumber(88)} - the timeline`} />

        <TextReveal
          text="Do you remember how it all started?"
          emotion={emotion}
          className="mt-2 text-[clamp(1.45rem,4vw,2.3rem)]"
        />
        <TextReveal
          text="Because I do... every little detail."
          emotion={emotion}
          delay={0.24}
          className="text-[clamp(1.1rem,3vw,1.4rem)] opacity-90"
        />
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/18 bg-black/30 p-4 backdrop-blur-xl"
        data-nav-ignore="true"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 10% 20%, rgba(255,210,165,0.18), transparent 40%), radial-gradient(circle at 92% 78%, rgba(255,153,196,0.14), transparent 44%)',
          }}
        />

        <div className="relative flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
          {TIMELINE_CARDS.map((card, index) => (
            <motion.article
              key={card.title}
              className="min-w-[240px] rounded-2xl border border-white/20 bg-black/25 p-4"
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.18, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: '0 10px 24px rgba(255, 208, 160, 0.22)' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.2rem',
                  lineHeight: 1.2,
                }}
              >
                {card.title}
              </p>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: '0.98rem',
                  lineHeight: 1.52,
                  opacity: 0.9,
                }}
              >
                {card.detail}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FirstCrack89Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <motion.span
            key={`crack-line-${index}`}
            className="absolute left-1/2 top-1/2 h-px"
            style={{
              width: `${90 + index * 36}px`,
              background: 'rgba(235, 242, 255, 0.18)',
              transform: `translate(-50%, -50%) rotate(${index * 27 - 38}deg)`,
            }}
            animate={{ opacity: [0.08, 0.2, 0.08] }}
            transition={{ duration: 3.4 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative space-y-4">
        <SceneEyebrow text={`screen ${toPublicScreenNumber(89)} - the first crack`} />

        <TextReveal
          text="Things... started breaking."
          emotion={emotion}
          className="mx-auto max-w-[33ch] text-[clamp(1.4rem,3.8vw,2.2rem)]"
        />

        <TextReveal
          text="I looked away."
          emotion={emotion}
          delay={0.3}
          className="text-[clamp(1.08rem,2.9vw,1.35rem)] opacity-90"
        />
      </div>
    </section>
  );
}

export function ThingsISaid90Screen({ emotion }: ExperienceScreenProps) {
  return (
    <motion.section
      className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center"
      animate={{ scale: [1, 1.045] }}
      transition={{ duration: 3.6, ease: 'easeInOut' }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {FRAGMENT_WORDS.map((word, index) => (
          <motion.span
            key={word}
            className="absolute text-[0.82rem] uppercase tracking-[0.12em]"
            style={{
              left: `${12 + (index % 3) * 32}%`,
              top: `${18 + Math.floor(index / 3) * 28}%`,
              fontFamily: 'var(--font-dm-mono)',
              opacity: 0.22,
            }}
            animate={{ y: [0, -10, 0], opacity: [0.1, 0.34, 0.12] }}
            transition={{ duration: 4 + index * 0.35, repeat: Infinity, ease: 'easeInOut' }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      <div className="relative space-y-4">
        <SceneEyebrow text={`screen ${toPublicScreenNumber(90)} - the things i said`} />

        <TextReveal
          text="Some words... I wish I could take back."
          emotion={emotion}
          mode="typewriter"
          speedMs={22}
          className="mx-auto max-w-[34ch] text-[clamp(1.46rem,4vw,2.3rem)]"
        />

        <TextReveal
          text="But they stayed with you."
          emotion={emotion}
          delay={0.22}
          className="text-[clamp(1.06rem,2.8vw,1.35rem)] opacity-90"
        />

        <TextReveal
          text="I'm sorry..."
          emotion={emotion}
          delay={0.44}
          mode="typewriter"
          speedMs={30}
          className="text-[clamp(1.8rem,5.2vw,3rem)]"
        />
      </div>
    </motion.section>
  );
}

export function YourSilence91Screen() {
  return (
    <section className="flex min-h-[58vh] flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-2">
        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.2rem,3.2vw,1.7rem)',
            lineHeight: 1.5,
            opacity: 0.9,
          }}
        >
          And then... you stopped talking.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.1rem,3vw,1.45rem)',
            lineHeight: 1.5,
            opacity: 0.84,
          }}
        >
          That silence said everything.
        </p>
      </div>

      <motion.span
        aria-hidden="true"
        className="block h-8 w-px"
        style={{ background: 'rgba(240, 243, 250, 0.86)' }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.05, repeat: Infinity, ease: 'linear' }}
      />
    </section>
  );
}

export function Distance92Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <SymbolMotif kind="distance" />

      <SceneEyebrow text={`screen ${toPublicScreenNumber(92)} - the distance`} />

      <TextReveal
        text="We were still there..."
        emotion={emotion}
        className="text-[clamp(1.35rem,3.7vw,2.1rem)]"
      />
      <TextReveal
        text="Just... not together anymore."
        emotion={emotion}
        delay={0.2}
        className="text-[clamp(1.2rem,3.2vw,1.8rem)] opacity-92"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.8, duration: 1.3 }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(1rem,2.4vw,1.2rem)',
          lineHeight: 1.55,
          maxWidth: '32ch',
        }}
      >
        I still wish you peace, even from far away.
      </motion.p>
    </section>
  );
}

export function WhatIMiss93Screen({ emotion, personalization }: ExperienceScreenProps) {
  const name = personalization.name.trim();
  const missYouLine = name.length > 0 ? `I miss you, ${name}.` : 'I miss you.';

  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center overflow-hidden text-center">
      <MemoryEchoText text="I miss us" />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.55, 0.9, 0.58], scale: [1, 1.06, 1] }}
        transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255, 184, 132, 0.24), transparent 52%), radial-gradient(circle at 50% 0%, rgba(255, 150, 194, 0.2), transparent 50%), linear-gradient(180deg, rgba(48,17,10,0.12), rgba(8,3,8,0.42))',
        }}
      />

      <motion.div
        className="relative space-y-3 px-4"
        animate={{ opacity: [0.86, 1, 0.9], scale: [0.994, 1.014, 1] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <TextReveal
          text={missYouLine}
          emotion={emotion}
          className="text-[clamp(1.45rem,4vw,2.4rem)] drop-shadow-[0_0_18px_rgba(255,209,166,0.28)]"
        />
        <TextReveal
          text="I miss us."
          emotion={emotion}
          delay={0.18}
          className="text-[clamp(1.7rem,5vw,3.1rem)] drop-shadow-[0_0_26px_rgba(255,184,132,0.35)]"
        />

        <YorSignatureMotif className="mx-auto mt-2" />
      </motion.div>
    </section>
  );
}

export function SmallThings94Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-7 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 16% 20%, rgba(255, 220, 180, 0.14), transparent 34%), radial-gradient(circle at 84% 76%, rgba(255, 184, 132, 0.12), transparent 36%)',
        }}
      />

      <div className="relative">

        <TextReveal
          text="The small things..."
          emotion={emotion}
          className="mt-2 text-[clamp(1.45rem,4vw,2.35rem)]"
        />
        <TextReveal
          text="Those mattered."
          emotion={emotion}
          delay={0.2}
          className="text-[clamp(1.1rem,3vw,1.5rem)] opacity-92"
        />
      </div>

      <div className="relative mx-auto max-w-lg rounded-3xl border border-white/18 bg-black/24 p-5 backdrop-blur-lg">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {STORY_HINT_FRAGMENTS.map((hint, index) => (
            <p
              key={hint}
              className="absolute"
              style={{
                top: `${12 + index * 22}%`,
                right: `${8 + index * 5}%`,
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
                opacity: 0.18,
                filter: 'blur(0.8px)',
              }}
            >
              {hint}
            </p>
          ))}
        </div>

        <ul className="space-y-3">
          {SMALL_THINGS.map((line, index) => (
            <motion.li
              key={line}
              className={index === 1 ? 'memory-depth-present' : 'memory-depth-past'}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.32 + index * 0.34, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.08rem,2.8vw,1.35rem)',
                lineHeight: 1.5,
              }}
            >
              {line}
            </motion.li>
          ))}
        </ul>

        <div className="mt-5 space-y-2">
          <motion.p
            className="memory-depth-past"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.48 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(0.96rem,2.5vw,1.1rem)',
              lineHeight: 1.45,
            }}
          >
            Some moments are slipping away.
          </motion.p>

          <motion.p
            className="memory-depth-present"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.92 }}
            transition={{ delay: 1.35, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1rem,2.6vw,1.16rem)',
              lineHeight: 1.45,
            }}
          >
            But some still feel like tonight.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export function MyMistakes95Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <SymbolMotif kind="shadow" />

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.05, ease: 'linear' }}
        style={{
          background:
            'radial-gradient(circle at 50% 12%, rgba(255,255,255,0.04), transparent 42%), linear-gradient(180deg, rgba(3,3,5,0.92), rgba(2,2,4,0.98))',
        }}
      />

      <motion.div
        className="relative space-y-3 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.1, ease: 'easeInOut' }}
      >
        <TextReveal
          text="I wasn't always right."
          emotion={emotion}
          className="text-[clamp(1.42rem,3.9vw,2.25rem)]"
        />
        <TextReveal
          text="Mostly... I was wrong."
          emotion={emotion}
          delay={0.3}
          className="mx-auto max-w-[35ch] text-[clamp(1.04rem,2.7vw,1.35rem)] opacity-92"
        />

        <motion.div
          className="relative mx-auto mt-2 h-16 w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.8 }}
        >
          <p
            className="memory-depth-past absolute inset-0"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.35rem,3.8vw,2rem)',
              lineHeight: 1.1,
            }}
          >
            I&apos;m not.
          </p>
          <p
            className="relative"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(1.35rem,3.8vw,2rem)',
              lineHeight: 1.1,
            }}
          >
            I&apos;m fine.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function IRealizeNow96Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <SymbolMotif kind="light" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ scale: [0.22, 1.95], opacity: [0.12, 0.34, 0.08] }}
        transition={{ duration: 4.3, repeat: Infinity, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 234, 197, 0.56), rgba(255, 234, 197, 0))',
          filter: 'blur(8px)',
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ scale: [0.4, 1.2], opacity: [0.08, 0.2, 0.05] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
        style={{
          border: '1px solid rgba(255, 226, 188, 0.24)',
          filter: 'blur(2px)',
        }}
      />

      <div className="relative space-y-3 px-4">

        <TextReveal
          text="I see it now."
          emotion={emotion}
          className="text-[clamp(1.44rem,3.9vw,2.28rem)]"
        />
        <TextReveal
          text="What I missed... was you."
          emotion={emotion}
          delay={1.05}
          className="text-[clamp(1.1rem,2.9vw,1.45rem)] opacity-90"
        />
      </div>
    </section>
  );
}

export function YouDeservedBetter97Screen({ emotion }: ExperienceScreenProps) {
  return (
    <motion.section
      className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center"
      animate={{ scale: [1, 1.024] }}
      transition={{ duration: 5.2, ease: 'easeInOut' }}
    >
      <SymbolMotif kind="shadow" />

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, rgba(255, 255, 255, 0.08), transparent 36%), radial-gradient(circle at 50% 50%, rgba(8, 9, 14, 0), rgba(8, 9, 14, 0.74) 70%), radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.44) 82%)',
        }}
      />

      <div className="relative space-y-3 px-4">

        <TextReveal
          text="You deserved better..."
          emotion={emotion}
          className="text-[clamp(1.52rem,4.3vw,2.5rem)]"
        />
        <TextReveal
          text="I wasn't that."
          emotion={emotion}
          delay={0.24}
          className="text-[clamp(1.12rem,3vw,1.5rem)] opacity-92"
        />

        <TextReveal
          text="You didn't deserve that version of me."
          emotion={emotion}
          delay={0.62}
          className="text-[clamp(1.02rem,2.6vw,1.24rem)] opacity-86"
        />
      </div>
    </motion.section>
  );
}

export function IfICouldGoBack98Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`rewind-${index}`}
            className="absolute h-px w-[150%]"
            style={{
              left: '-20%',
              top: `${30 + index * 18}%`,
              background: 'rgba(226, 234, 255, 0.16)',
            }}
            animate={{ x: [34, -34, 34], opacity: [0.08, 0.24, 0.08] }}
            transition={{ duration: 3 + index * 0.55, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPositionX: ['0%', '-18%', '0%'] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 30px, rgba(255,255,255,0.04) 30px, rgba(255,255,255,0.04) 31px)',
          }}
        />
      </div>

      <div className="relative space-y-3 px-4">

        <TextReveal
          text="If I could go back..."
          emotion={emotion}
          className="text-[clamp(1.44rem,4vw,2.35rem)]"
        />
        <TextReveal
          text="I'd choose better."
          emotion={emotion}
          delay={0.2}
          className="text-[clamp(1.14rem,2.9vw,1.48rem)] opacity-92"
        />

        <TextReveal
          text="I thought you would always-"
          emotion={emotion}
          delay={0.72}
          className="text-[clamp(0.96rem,2.4vw,1.18rem)] opacity-72"
        />
      </div>
    </section>
  );
}

export function TheApology99Screen() {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <MemoryEchoText text="I'm sorry" />

      <div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        style={{ opacity: 0.98 }}
      />

      <motion.div
        className="relative px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.02, delay: 0.8, ease: 'linear' }}
      >

        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(2.8rem,10vw,5.6rem)',
            lineHeight: 0.95,
            textShadow: '0 0 24px rgba(255, 214, 214, 0.1)',
          }}
        >
          I&apos;m sorry.
        </motion.p>
      </motion.div>
    </section>
  );
}

export function LetterBegins100Screen({ emotion }: ExperienceScreenProps) {
  const letterBeginsScrollRef = useRef<HTMLDivElement | null>(null);
  useEmotionalScrollResistance(letterBeginsScrollRef, 0.43);
  const [isUnreadOpened, setIsUnreadOpened] = useState(false);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);

  useEffect(() => {
    let idleTimer: number | null = null;

    const armIdleTimer = () => {
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
      }

      setShowIdlePrompt(false);
      idleTimer = window.setTimeout(() => {
        setShowIdlePrompt(true);
      }, 3900);
    };

    armIdleTimer();

    const activityEvents: Array<keyof WindowEventMap> = [
      'pointerdown',
      'keydown',
      'wheel',
      'touchstart',
    ];

    for (const eventName of activityEvents) {
      window.addEventListener(eventName, armIdleTimer, { passive: true });
    }

    return () => {
      for (const eventName of activityEvents) {
        window.removeEventListener(eventName, armIdleTimer);
      }

      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
      }
    };
  }, []);

  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-6 text-center">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 24%, rgba(255, 218, 173, 0.16), transparent 48%), radial-gradient(circle at 50% 86%, rgba(255, 165, 123, 0.1), transparent 42%)',
        }}
      />

      <TextReveal
        text="I never sent this."
        emotion={emotion}
        delay={0.8}
        className="relative text-[clamp(1.42rem,4vw,2.3rem)]"
      />

      <motion.div animate={{ x: [0, 2, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.button
          type="button"
          data-nav-ignore="true"
          onClick={() => setIsUnreadOpened(true)}
          className="relative rounded-full border px-4 py-2 text-[0.62rem] uppercase tracking-[0.08em]"
          style={{
            borderColor: 'rgba(255,255,255,0.28)',
            color: 'rgba(244, 246, 255, 0.86)',
            fontFamily: 'var(--font-dm-mono)',
            background: 'rgba(8, 10, 20, 0.36)',
            opacity: isUnreadOpened ? 0.5 : 0.95,
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isUnreadOpened ? 'Message opened' : '(1 new message) tap to open'}
        </motion.button>
      </motion.div>

      {showIdlePrompt ? (
        <TextReveal
          text="You don't have to rush..."
          emotion={emotion}
          delay={0.05}
          className="relative text-[clamp(0.92rem,2.3vw,1.05rem)] opacity-72"
        />
      ) : null}

      {isUnreadOpened ? (
        <motion.div
          className="relative px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.96, 0.92, 0.16] }}
          transition={{ duration: 4.8, times: [0, 0.2, 0.62, 1], ease: 'easeInOut' }}
        >
          <TextReveal
            text="Maybe I should've said this earlier..."
            emotion={emotion}
            mode="typewriter"
            speedMs={29}
            delay={0.14}
            className="text-[clamp(1rem,2.7vw,1.28rem)]"
          />
        </motion.div>
      ) : null}

      <motion.div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/18 bg-black/34 px-4 py-3 text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          className="uppercase tracking-[0.12em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.62rem',
            opacity: 0.76,
          }}
        >
          Unsent message
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.92 }}
          transition={{ delay: 0.82, duration: 0.42 }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.98rem,2.7vw,1.1rem)',
            lineHeight: 1.45,
          }}
        >
          Typing...
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.84 }}
          transition={{ delay: 1.28, duration: 0.42 }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.98rem,2.7vw,1.1rem)',
            lineHeight: 1.45,
            textDecoration: 'line-through',
          }}
        >
          Deleting...
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.98 }}
          transition={{ delay: 1.78, duration: 0.44 }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.98rem,2.7vw,1.1rem)',
            lineHeight: 1.45,
          }}
        >
          Typing again...
        </motion.p>

        <p
          className="mt-1"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.07em',
            opacity: 0.38,
            filter: 'blur(0.5px)',
          }}
        >
          17 Sep 2:11 AM
        </p>
      </motion.div>

      <motion.div
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#f2d6b3]/34 bg-[#f5e7d2]/88 p-5 text-left shadow-[0_18px_56px_rgba(0,0,0,0.36)]"
        initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(94, 65, 34, 0.06) 0px, rgba(94, 65, 34, 0.06) 1px, transparent 1px, transparent 23px), radial-gradient(circle at 14% 10%, rgba(255,255,255,0.58), transparent 35%)',
          }}
        />

        <div
          ref={letterBeginsScrollRef}
          className="emotional-scroll relative max-h-[34vh] space-y-4 overflow-y-auto rounded-[1.4rem] border border-[#af8258]/34 bg-[#f8eddc]/82 p-5"
          data-nav-ignore="true"
        >
          <p
            className="uppercase tracking-[0.12em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.64rem',
              color: 'rgba(89, 57, 31, 0.72)',
            }}
          >
            Letter begins
          </p>

          <TextReveal
            text="I never sent this."
            emotion={emotion}
            mode="typewriter"
            speedMs={26}
            className="text-[clamp(1.1rem,2.9vw,1.5rem)] leading-relaxed text-[#3f2a19]"
          />

          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(0.98rem,2.5vw,1.12rem)',
              lineHeight: 1.55,
              color: 'rgba(82, 55, 35, 0.84)',
            }}
          >
            So I am writing it all, slowly.
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export function Letter101Screen({ emotion }: ExperienceScreenProps) {
  return <LetterPageCard screen={101} line={LETTER_PAGE_LINES[101]} emotion={emotion} />;
}

export function Letter102Screen({ emotion }: ExperienceScreenProps) {
  return <LetterPageCard screen={102} line={LETTER_PAGE_LINES[102]} emotion={emotion} />;
}

export function Letter103Screen({ emotion }: ExperienceScreenProps) {
  return <LetterPageCard screen={103} line={LETTER_PAGE_LINES[103]} emotion={emotion} />;
}

export function Letter104Screen({ emotion }: ExperienceScreenProps) {
  return <LetterPageCard screen={104} line={LETTER_PAGE_LINES[104]} emotion={emotion} />;
}

export function Letter105Screen({ emotion }: ExperienceScreenProps) {
  return <LetterPageCard screen={105} line={LETTER_PAGE_LINES[105]} emotion={emotion} />;
}

export function NoExpectations106Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-start justify-center gap-4 text-left">
      <TextReveal
        text="I don't expect anything."
        emotion={emotion}
        className="text-[clamp(1.38rem,3.8vw,2.15rem)]"
      />
      <TextReveal
        text="Not even forgiveness."
        emotion={emotion}
        delay={0.22}
        className="text-[clamp(1.08rem,2.9vw,1.45rem)] opacity-90"
      />
    </section>
  );
}

export function ButIf107Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-end justify-center gap-4 text-right">
      <TextReveal
        text="But if someday..."
        emotion={emotion}
        className="text-[clamp(1.38rem,3.8vw,2.2rem)]"
      />
      <TextReveal
        text="You feel the same..."
        emotion={emotion}
        delay={0.22}
        className="text-[clamp(1.08rem,2.9vw,1.45rem)] opacity-92"
      />

      <TextReveal
        text="You read this, didn't you?"
        emotion={emotion}
        delay={0.85}
        className="text-[clamp(0.98rem,2.5vw,1.14rem)] opacity-74"
      />
    </section>
  );
}

export function IllBeHere108Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-4 overflow-hidden text-center">
      <SymbolMotif kind="light" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.2, 0.1], scale: [0.82, 1.1, 0.9] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 226, 186, 0.36), rgba(255, 226, 186, 0))',
        }}
      />

      <TextReveal
        text="I'll be here."
        emotion={emotion}
        className="text-[clamp(1.5rem,4.4vw,2.6rem)]"
      />
      <TextReveal
        text="Still."
        emotion={emotion}
        delay={0.24}
        className="text-[clamp(1.2rem,3.2vw,1.72rem)]"
      />

      <TextReveal
        text="I still do."
        emotion={emotion}
        delay={0.72}
        className="memory-depth-past text-[clamp(0.96rem,2.5vw,1.12rem)]"
      />

      <TextReveal
        text="I remember everything."
        emotion={emotion}
        delay={1.02}
        className="memory-depth-past text-[clamp(0.92rem,2.3vw,1.06rem)] opacity-64"
      />
    </section>
  );
}

export function OrMaybe109Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-2xl flex-col items-end justify-center gap-4 text-right">
      <TextReveal
        text="Or maybe..."
        emotion={emotion}
        className="text-[clamp(1.4rem,4vw,2.2rem)]"
      />
      <TextReveal
        text="No reply."
        emotion={emotion}
        delay={0.24}
        className="text-[clamp(1.1rem,3vw,1.5rem)] opacity-92"
      />

      <TextReveal
        text="Read it once more."
        emotion={emotion}
        delay={0.84}
        className="text-[clamp(0.95rem,2.4vw,1.1rem)] opacity-66"
      />
    </section>
  );
}

export function GoodbyeFade110Screen({
  emotion,
}: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-6 overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        initial={{ opacity: 0.78 }}
        animate={{ opacity: 0.995 }}
        transition={{ duration: 1.7, ease: 'easeOut' }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        initial={{ opacity: 0.34, scale: 0.88 }}
        animate={{ opacity: 0.08, scale: 1.04 }}
        transition={{ duration: 2.6, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 225, 188, 0.26), rgba(255, 225, 188, 0))',
          filter: 'blur(4px)',
        }}
      />

      <motion.div
        className="relative px-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.78, delay: 0.6, ease: 'easeOut' }}
      >
        <TextReveal
          text="Take care."
          emotion={emotion}
          delay={0.7}
          className="text-[clamp(1.9rem,5.5vw,3.5rem)]"
        />
      </motion.div>
    </section>
  );
}

export function PostEndGhost111Screen({
  emotion,
}: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.88, 0.95, 0.88] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06), rgba(0,0,0,0.92) 68%)',
        }}
      />

      <TextReveal
        text="Still here?"
        emotion={emotion}
        delay={0.7}
        className="relative text-[clamp(1.3rem,3.7vw,2.1rem)]"
      />

      <TextReveal
        text="I didn't think you'd make it this far."
        emotion={emotion}
        delay={1.05}
        className="relative text-[clamp(0.98rem,2.5vw,1.18rem)] opacity-82"
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.26] }}
        transition={{ duration: 3.8, delay: 1.5, ease: 'easeInOut' }}
      >
        <TextReveal
          text="You're still scrolling..."
          emotion={emotion}
          delay={1.55}
          className="text-[clamp(0.96rem,2.5vw,1.14rem)] opacity-82"
        />
      </motion.div>

      <TextReveal
        text="I still do."
        emotion={emotion}
        delay={2.2}
        className="memory-depth-past text-[clamp(1.05rem,2.9vw,1.38rem)]"
      />

      <YorSignatureMotif className="relative" opacity={0.44} />
    </section>
  );
}

export function NoTextVoid112Screen({
}: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255, 224, 176, 0.08), rgba(0,0,0,0.96) 72%)',
        }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.06, 0.2, 0.06], scale: [0.86, 1.14, 0.88] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 238, 202, 0.3), rgba(255, 238, 202, 0))',
          filter: 'blur(2px)',
        }}
      />

      <p className="sr-only">Silence</p>
    </section>
  );
}

export function ReversedExpectation113Screen({
  emotion,
}: ExperienceScreenProps) {
  const [showLateLine, setShowLateLine] = useState(false);

  useEffect(() => {
    const lateLineTimer = window.setTimeout(() => {
      setShowLateLine(true);
    }, 3600);

    return () => {
      window.clearTimeout(lateLineTimer);
    };
  }, []);

  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        style={{ opacity: 0.995 }}
      />

      <motion.p
        className="pointer-events-none absolute top-[34%] px-4"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.8, delay: 0.28, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(0.88rem,2.2vw,1.02rem)',
          lineHeight: 1.4,
          color: 'rgba(248, 238, 225, 0.5)',
          filter: 'blur(0.2px)',
        }}
      >
        I almost didn&apos;t say this...
      </motion.p>

      {showLateLine ? (
        <motion.div
          className="relative px-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.88, ease: 'easeOut' }}
        >
          <TextReveal
            text="I didn't know what to say either."
            emotion={emotion}
            mode="typewriter"
            speedMs={30}
            className="text-[clamp(1.15rem,3.2vw,1.7rem)]"
          />
        </motion.div>
      ) : null}

      <p className="sr-only">Silence before the final line</p>
    </section>
  );
}

export function FakeEnd114Screen({
  emotion,
}: ExperienceScreenProps) {
  const [showOneLastThing, setShowOneLastThing] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowOneLastThing(true);
    }, 2400);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: [0.98, 1, 0.98] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {showOneLastThing ? (
        <motion.div
          className="relative px-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <TextReveal
            text="One last thing..."
            emotion={emotion}
            mode="typewriter"
            speedMs={31}
            className="text-[clamp(1.15rem,3.2vw,1.76rem)]"
          />
        </motion.div>
      ) : null}

      <p className="sr-only">A false ending before one last line</p>
    </section>
  );
}

export function MemoryDistortion115Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.07), rgba(0,0,0,0.9) 72%)',
        }}
      />

      <TextReveal
        text="I remember... most things."
        emotion={emotion}
        className="relative text-[clamp(1.24rem,3.5vw,1.95rem)]"
      />

      <TextReveal
        text="You've probably felt this too... haven't you?"
        emotion={emotion}
        delay={0.3}
        className="relative text-[clamp(0.96rem,2.5vw,1.18rem)] opacity-84"
      />

      <motion.article
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/16 bg-black/30 p-5 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.78))',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.1), transparent 52%)',
          }}
        />

        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.98rem,2.6vw,1.14rem)',
            lineHeight: 1.52,
            color: 'rgba(242, 244, 252, 0.74)',
            filter: 'blur(1.7px)',
            userSelect: 'none',
          }}
        >
          I kept writing drafts here. I erased names, dates, reasons. A few lines still stayed, half-visible, like they wanted to be read but not forgiven.
        </p>
      </motion.article>
    </section>
  );
}

export function StillThere116Screen({ emotion }: ExperienceScreenProps) {
  const [showStillThere, setShowStillThere] = useState(false);
  const [showHiddenLine, setShowHiddenLine] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const silenceTimer = window.setTimeout(() => {
      setShowStillThere(true);
    }, 3200);

    const idleRevealTimer = window.setTimeout(() => {
      setShowHiddenLine(true);
    }, 5200);

    return () => {
      window.clearTimeout(silenceTimer);
      window.clearTimeout(idleRevealTimer);
      if (longPressTimerRef.current !== null) {
        window.clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, []);

  const handlePointerDown = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
    }

    longPressTimerRef.current = window.setTimeout(() => {
      setShowHiddenLine(true);
      longPressTimerRef.current = null;
    }, 1300);
  };

  const clearLongPress = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <section
      className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center"
      onPointerDown={handlePointerDown}
      onPointerUp={clearLongPress}
      onPointerLeave={clearLongPress}
      data-nav-ignore="true"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(0,0,0,0.98)' }}
      />

      {showStillThere ? (
        <TextReveal
          text="Still here?"
          emotion={emotion}
          className="relative text-[clamp(1.2rem,3.4vw,1.88rem)]"
        />
      ) : null}

      {showHiddenLine ? (
        <motion.p
          className="absolute bottom-[22%] px-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.78, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.9rem,2.3vw,1.06rem)',
            lineHeight: 1.4,
          }}
        >
          I didn&apos;t think you&apos;d look this closely.
        </motion.p>
      ) : null}
    </section>
  );
}

export function UserBecomesStory117Screen({ emotion }: ExperienceScreenProps) {
  return (
    <section className="relative flex min-h-[58vh] flex-col items-center justify-center gap-5 overflow-hidden text-center">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.86, 0.96, 0.86] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255, 224, 176, 0.08), rgba(0,0,0,0.94) 70%)',
        }}
      />

      <TextReveal
        text="Maybe this wasn't about me..."
        emotion={emotion}
        className="relative text-[clamp(1.12rem,3.1vw,1.72rem)]"
      />

      <TextReveal
        text="Maybe it was about you."
        emotion={emotion}
        delay={0.34}
        className="relative text-[clamp(1.15rem,3.2vw,1.82rem)]"
      />

      <motion.p
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 2.6, delay: 1.45, ease: 'easeInOut' }}
        style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 'clamp(1.2rem,3.4vw,1.9rem)',
          lineHeight: 1.2,
        }}
      >
        Maybe in another...
      </motion.p>
    </section>
  );
}

export function FinalMicroInteraction118Screen({ onNext }: ExperienceScreenProps) {
  const [hasTriedToClick, setHasTriedToClick] = useState(false);
  const [showItsOkay, setShowItsOkay] = useState(false);

  const handleFinalTap = () => {
    if (hasTriedToClick) {
      return;
    }

    setHasTriedToClick(true);
    window.setTimeout(() => {
      setShowItsOkay(true);
    }, 820);

    window.setTimeout(() => {
      onNext();
    }, 2200);
  };

  return (
    <section
      className="relative flex min-h-[58vh] items-center justify-center overflow-hidden text-center"
      onClick={handleFinalTap}
      role="button"
      tabIndex={0}
      aria-label="Continue through silence"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleFinalTap();
        }
      }}
      data-nav-ignore="true"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-black"
        aria-hidden="true"
        animate={{ opacity: [0.96, 1, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        initial={{ opacity: 0.2, scale: 1 }}
        animate={{ opacity: [0.2, 0], scale: [1, 2.3] }}
        transition={{ duration: 4, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 231, 198, 0.34), rgba(255, 231, 198, 0))',
          filter: 'blur(3px)',
        }}
      />

      {showItsOkay ? (
        <motion.p
          className="relative px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(1.08rem,3vw,1.6rem)',
            lineHeight: 1.3,
          }}
        >
          It&apos;s okay.
        </motion.p>
      ) : null}

      <p className="sr-only">Tap to continue through silence</p>
    </section>
  );
}

export function TrueFinalState119Screen() {
  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.97, 1, 0.97] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'rgba(0,0,0,1)' }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
        animate={{ opacity: [0.04, 0.01, 0.04], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1), rgba(255,255,255,0))',
          filter: 'blur(10px)',
        }}
      />

      <p className="sr-only">Silence. Darkness. Memory.</p>
    </section>
  );
}
