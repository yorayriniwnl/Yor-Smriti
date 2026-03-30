'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatBubble, ChatContainer, TypingIndicator } from '@/components/ui/ChatBubble';

const MESSAGE_LINES = [
  {
    id: 'msg-1',
    text: "I know things haven't been right.",
    typingDuration: 2200,
    revealDelay: 800,
  },
  {
    id: 'msg-2',
    text: "And I don't want to pretend it's okay.",
    typingDuration: 2600,
    revealDelay: 1400,
  },
  {
    id: 'msg-3',
    text: 'So I made something instead of just texting.',
    typingDuration: 2800,
    revealDelay: 1800,
  },
  {
    id: 'msg-4',
    text: 'Please just hear me out.',
    typingDuration: 1800,
    revealDelay: 2200,
  },
];

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

export default function MessagePage() {
  const [isStarted, setIsStarted] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    let cumulativeDelay = 380;
    MESSAGE_LINES.forEach((line) => {
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
      }, cumulativeDelay);
      timersRef.current.push(typingTimer);

      cumulativeDelay += line.typingDuration;
      const revealTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => new Set(Array.from(prev).concat(line.id)));
      }, cumulativeDelay);
      timersRef.current.push(revealTimer);

      cumulativeDelay += line.revealDelay;
    });

    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, cumulativeDelay + 500);
    timersRef.current.push(continueTimer);
  }, [isStarted]);

  return (
    <main
      id="main-content"
      className="relative flex h-dvh w-dvw items-center justify-center overflow-hidden px-4"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 15% 18%, rgba(255, 196, 224, 0.16), transparent 34%), radial-gradient(circle at 84% 82%, rgba(255, 229, 166, 0.11), transparent 34%)',
        }}
      />

      <motion.section
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border px-6 py-8 md:px-10"
        style={{
          borderColor: 'rgba(244, 173, 210, 0.28)',
          background:
            'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
          boxShadow:
            '0 36px 74px rgba(0, 0, 0, 0.56), 0 16px 34px rgba(247, 85, 144, 0.22)',
        }}
      >
        {!isStarted ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
            className="text-center"
          >
            <p
              className="mb-2 uppercase tracking-[0.18em]"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                color: 'rgba(255, 193, 223, 0.8)',
                fontSize: '0.62rem',
              }}
            >
              a quiet message
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-cormorant)',
                color: 'rgba(255, 236, 246, 0.98)',
                fontSize: 'clamp(1.9rem, 5vw, 3rem)',
                lineHeight: 1.14,
                fontWeight: 500,
              }}
            >
              Hey... just give me 60 seconds.
            </h1>

            <motion.button
              type="button"
              onClick={() => setIsStarted(true)}
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center justify-center rounded-full px-9 py-3"
              style={{
                background:
                  'linear-gradient(90deg, rgba(240, 91, 160, 0.95), rgba(204, 57, 127, 0.95))',
                color: '#fff',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 10px 28px rgba(232, 80, 153, 0.32)',
              }}
            >
              Okay
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_SOFT }}
            className="flex w-full flex-col gap-6"
          >
            <div className="mb-1 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent)', opacity: 0.7 }} />
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.66rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255, 197, 224, 0.82)',
                  textTransform: 'uppercase',
                }}
              >
                message
              </span>
            </div>

            <ChatContainer>
              <AnimatePresence mode="sync">
                {MESSAGE_LINES.map((msg, index) =>
                  visibleMessages.has(msg.id) ? (
                    <ChatBubble key={msg.id} text={msg.text} isVisible={true} index={index} />
                  ) : null
                )}
                <TypingIndicator key="typing" isVisible={isTyping} />
              </AnimatePresence>
            </ChatContainer>

            <AnimatePresence>
              {showContinue ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-1 self-start"
                >
                  <Link
                    href="/message/why-smriti"
                    className="group flex items-center gap-3"
                    style={{ textDecoration: 'none' }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-mono)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        color: 'rgba(255, 198, 225, 0.86)',
                        textTransform: 'uppercase',
                      }}
                    >
                      why smriti?
                    </span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        color: 'rgba(247, 120, 172, 0.95)',
                        fontSize: '0.8rem',
                      }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.section>
    </main>
  );
}
