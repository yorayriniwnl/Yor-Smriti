'use client';

import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/transitions/TextReveal';
import type { ExperienceScreenProps } from '@/hooks/useExperienceFlow';

export interface ScriptNarrativeLine {
  id: number;
  line: string;
  shift?: string;
}

export const SCRIPT_NARRATIVE_LINES: ScriptNarrativeLine[] = [
  { id: 80, line: 'Do you remember?' },
  { id: 81, line: 'Because I do.' },
  { id: 82, line: 'Too clearly.' },
  { id: 83, line: 'Every small thing...' },
  { id: 84, line: "That I should've valued." },
  { id: 85, line: "But didn't." },
  { id: 86, line: 'Not when it mattered.' },
  { id: 87, line: 'Not when it was you.' },

  { id: 88, line: 'It started quietly...', shift: 'Shift - Memory -> Realization' },
  { id: 89, line: 'Things... slipping.' },
  { id: 90, line: "Words I didn't think twice about." },
  { id: 91, line: 'But you felt every one.' },
  { id: 92, line: 'And then...' },
  { id: 93, line: 'You went quiet.' },
  { id: 94, line: 'Not angry.' },
  { id: 95, line: 'Just... distant.' },

  { id: 96, line: 'We were still there.', shift: 'Shift - Distance' },
  { id: 97, line: 'Just not... together.' },
  { id: 98, line: 'Same space.' },
  { id: 99, line: 'Different silence.' },

  { id: 100, line: 'I miss you.', shift: 'Shift - Longing' },
  { id: 101, line: 'But not just you...' },
  { id: 102, line: 'Us.' },
  { id: 103, line: 'The version that laughed...' },
  { id: 104, line: 'Before things got heavy.' },

  { id: 105, line: "I left because I felt I didn't deserve you.", shift: 'Shift - Accountability' },
  { id: 106, line: "I wasn't stable mentally." },
  { id: 107, line: "I wasn't stable physically." },
  { id: 108, line: "It wasn't you." },

  { id: 109, line: 'It was me.', shift: 'Shift - Regret Peak' },
  { id: 110, line: 'And I knew I was not enough then.' },

  { id: 111, line: 'I stepped away... and called it protection.', shift: 'Shift - Extended Peak' },
  { id: 112, line: 'But it hurt you too.' },
  { id: 113, line: 'I see that now.' },
  { id: 114, line: 'It showed me everything.' },

  { id: 115, line: "I'm sorry.", shift: 'Shift - The Apology Core' },
  { id: 116, line: 'For leaving when you needed me.' },
  { id: 117, line: 'For making you question yourself.' },
  { id: 118, line: 'It was never your fault.' },
  { id: 119, line: 'It was my instability.' },
  { id: 120, line: 'Not your worth.' },

  { id: 121, line: 'I see it now.', shift: 'Shift - Letter Fragments' },
  { id: 122, line: 'Too late, maybe.' },
  { id: 123, line: 'But clearly.' },
  { id: 124, line: "You weren't asking for much." },
  { id: 125, line: 'Just... me.' },

  { id: 126, line: "I don't expect anything.", shift: 'Shift - Letting Go / Hope' },
  { id: 127, line: 'Not even forgiveness.' },
  { id: 128, line: 'But if someday...' },
  { id: 129, line: 'You think of me-' },
  { id: 130, line: "I hope it doesn't hurt." },

  { id: 131, line: "I'll be here.", shift: 'Shift - Final Emotional Fade' },
  { id: 132, line: "Even if you're not." },
  { id: 133, line: 'Or maybe...' },
  { id: 134, line: 'This is where it ends.' },

  { id: 135, line: 'Take care.', shift: 'Shift - Final Line' },
  { id: 136, line: 'Always.' },

  { id: 137, line: 'Still here?', shift: 'Afterglow' },
  { id: 138, line: 'I thought you might be.' },
];

function toPublicScreenNumber(legacyScreen: number) {
  return legacyScreen - 79;
}

function resolveBackdrop(id: number) {
  if (id >= 115 && id <= 120) {
    return 'radial-gradient(circle at 50% 40%, rgba(255, 215, 178, 0.2), rgba(0,0,0,0.92) 72%)';
  }

  if (id >= 135) {
    return 'radial-gradient(circle at 50% 36%, rgba(255, 230, 205, 0.1), rgba(0,0,0,0.98) 74%)';
  }

  if (id >= 126) {
    return 'radial-gradient(circle at 50% 42%, rgba(255, 203, 174, 0.14), rgba(0,0,0,0.94) 72%)';
  }

  if (id >= 109) {
    return 'radial-gradient(circle at 50% 42%, rgba(255, 192, 192, 0.12), rgba(0,0,0,0.94) 72%)';
  }

  return 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.07), rgba(0,0,0,0.92) 72%)';
}

function ScriptNarrativeLineScreen({
  id,
  line,
  shift,
  emotion,
}: {
  id: number;
  line: string;
  shift?: string;
  emotion: ExperienceScreenProps['emotion'];
}) {
  const isPeak = id >= 109 && id <= 120;
  const isFinal = id >= 135;
  const lineSize = isFinal
    ? 'text-[clamp(2rem,5.6vw,3.8rem)]'
    : isPeak
      ? 'text-[clamp(1.5rem,4.4vw,2.7rem)]'
      : 'text-[clamp(1.25rem,3.7vw,2.2rem)]';

  return (
    <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden px-4 text-center">
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: resolveBackdrop(id) }}
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1] }}
      >
        {shift ? (
          <p
            className="uppercase tracking-[0.16em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.64rem',
              color: 'rgba(241, 244, 252, 0.78)',
            }}
          >
            {shift}
          </p>
        ) : (
          <p
            className="uppercase tracking-[0.16em]"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.62rem',
              color: 'rgba(241, 244, 252, 0.62)',
            }}
          >
            Screen {toPublicScreenNumber(id)}
          </p>
        )}

        <TextReveal
          text={line}
          emotion={emotion}
          mode={id >= 111 ? 'typewriter' : 'fade'}
          speedMs={id >= 111 ? 28 : 24}
          className={lineSize}
        />
      </motion.div>
    </section>
  );
}

export function createScriptNarrativeComponent(
  definition: ScriptNarrativeLine,
): ComponentType<ExperienceScreenProps> {
  function ScriptScreenComponent({ emotion }: ExperienceScreenProps) {
    return (
      <ScriptNarrativeLineScreen
        id={definition.id}
        line={definition.line}
        shift={definition.shift}
        emotion={emotion}
      />
    );
  }

  ScriptScreenComponent.displayName = `ScriptNarrativeScreen${definition.id}`;
  return ScriptScreenComponent;
}
