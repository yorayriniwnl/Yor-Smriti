'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/hooks/useStageController';
import { stageVariants, buttonVariants } from '@/lib/animations';
import { ChatBubble, TypingIndicator, ChatContainer } from '@/components/ui/ChatBubble';
import { CHAT_MESSAGES } from '@/lib/messages';

// ─── ChatStage ────────────────────────────────────────────────────────────────

export function ChatStage() {
  const advanceStage = useAppStore((s) => s.advanceStage);

  // Track which messages are visible and whether typing is showing
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;

    // Clear any timers on unmount
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    // Sequence: type → reveal → type → reveal → ...
    let cumulativeDelay = 600; // initial pause before first typing

    CHAT_MESSAGES.forEach((msg) => {
      // 1. Show typing indicator
      const showTypingTimer = setTimeout(() => {
        setIsTyping(true);
      }, cumulativeDelay);
      timersRef.current.push(showTypingTimer);

      // 2. Hide typing, show message
      cumulativeDelay += msg.typingDuration;
      const revealTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => new Set(Array.from(prev).concat(msg.id)));

      }, cumulativeDelay);
      timersRef.current.push(revealTimer);

      // 3. Pause before next message
      cumulativeDelay += msg.revealDelay;
    });

    // Show continue button after all messages
    const continueDelay = cumulativeDelay + 1200;
    const continueTimer = setTimeout(() => {
      setShowContinue(true);
    }, continueDelay);
    timersRef.current.push(continueTimer);
  }, []);

  return (
    <motion.div
      key="chat"
      variants={stageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="stage-root"
    >
      <div className="flex w-full max-w-[520px] flex-col gap-8">
        {/* Header - subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5, delay: 0.2 } }}
          className="flex items-center gap-3 mb-2"
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--accent)', opacity: 0.6 }}
          />
          <span
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}
          >
            message
          </span>
        </motion.div>

        {/* Chat messages */}
        <ChatContainer>
          <AnimatePresence mode="sync">
            {CHAT_MESSAGES.map((msg) =>
              visibleMessages.has(msg.id) ? (
                <ChatBubble
                  key={msg.id}
                  text={msg.text}
                  isVisible={true}
                  index={CHAT_MESSAGES.indexOf(msg)}
                />
              ) : null
            )}

            {/* Typing indicator - only one shown at a time */}
            <TypingIndicator key="typing" isVisible={isTyping} />
          </AnimatePresence>
        </ChatContainer>

        {/* Continue prompt */}
        <AnimatePresence>
          {showContinue && (
            <motion.div
              key="continue"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              className="mt-4 self-start"
            >
              <button
                onClick={advanceStage}
                className="group flex items-center gap-3 outline-none"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    transition: 'color 0.4s ease',
                  }}
                  className="group-hover:text-[var(--text-secondary)]"
                >
                  continue
                </span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    color: 'var(--accent-dim)',
                    fontSize: '0.7rem',
                    opacity: 0.7,
                  }}
                >
                  →
                </motion.span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
