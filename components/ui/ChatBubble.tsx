'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatMessageVariants, typingVariants } from '@/lib/animations';

// ─── ChatBubble ───────────────────────────────────────────────────────────────

interface ChatBubbleProps {
  text: string;
  isVisible: boolean;
  index: number;
}

export const ChatBubble = memo(function ChatBubble({
  text,
  isVisible,
  index,
}: ChatBubbleProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      key={`bubble-${index}`}
      variants={chatMessageVariants}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3"
    >
      {/* Avatar dot */}
      <div className="mt-1 flex-shrink-0">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: 'var(--accent-dim)' }}
        />
      </div>

      {/* Bubble */}
      <div className="chat-bubble">
        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            color: 'var(--text-primary)',
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            lineHeight: '1.75',
          }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
});

// ─── TypingIndicator ──────────────────────────────────────────────────────────

interface TypingIndicatorProps {
  isVisible: boolean;
}

export const TypingIndicator = memo(function TypingIndicator({
  isVisible,
}: TypingIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="typing-indicator"
          variants={typingVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex items-start gap-3"
        >
          {/* Avatar dot */}
          <div className="mt-1 flex-shrink-0">
            <div
              className="h-2 w-2 rounded-full opacity-40"
              style={{ backgroundColor: 'var(--accent-dim)' }}
            />
          </div>

          {/* Typing bubble */}
          <div
            className="chat-bubble flex items-center gap-2"
            style={{ padding: '0.875rem 1.1rem' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─── ChatContainer ────────────────────────────────────────────────────────────

interface ChatContainerProps {
  children: React.ReactNode;
}

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex w-full max-w-[480px] flex-col gap-4">
      {children}
    </div>
  );
}
