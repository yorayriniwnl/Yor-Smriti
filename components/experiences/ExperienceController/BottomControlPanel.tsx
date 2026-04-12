import { motion } from 'framer-motion';

interface ActiveTheme {
  textColor: string;
  accentColor: string;
  glowColor: string;
}

interface BottomControlPanelProps {
  shouldShowControls: boolean;
  handlePrevWithControl: () => void;
  isFirst: boolean;
  allowTapToContinue: boolean;
  isLast: boolean;
  handleNextWithControl: () => void;
  autoAdvance: boolean;
  isPaused: boolean;
  resume: () => void;
  pause: () => void;
  onReplay: () => void;
  shareEnabled: boolean;
  handleShare: () => void;
  activeTheme: ActiveTheme;
  currentEmotion: string;
  index: number;
  total: number;
  shareMessage: string;
}

export function BottomControlPanel({
  shouldShowControls,
  handlePrevWithControl,
  isFirst,
  allowTapToContinue,
  isLast,
  handleNextWithControl,
  autoAdvance,
  isPaused,
  resume,
  pause,
  onReplay,
  shareEnabled,
  handleShare,
  activeTheme,
  currentEmotion,
  index,
  total,
  shareMessage,
}: BottomControlPanelProps) {
  if (!shouldShowControls) {
    return null;
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/15 bg-black/20 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          onClick={handlePrevWithControl}
          disabled={isFirst}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em] disabled:cursor-not-allowed disabled:opacity-45"
          style={{
            borderColor: 'color-mix(in oklab, white 22%, transparent)',
            color: activeTheme.textColor,
            fontFamily: 'var(--font-dm-mono)',
          }}
        >
          Previous
        </motion.button>

        {allowTapToContinue && !isLast ? (
          <motion.button
            onClick={handleNextWithControl}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full px-5 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
            style={{
              background: `linear-gradient(90deg, ${activeTheme.accentColor}, #f75590)`,
              color: '#fff',
              fontFamily: 'var(--font-dm-mono)',
              boxShadow: `0 10px 24px ${activeTheme.glowColor}`,
            }}
          >
            Tap right to continue
          </motion.button>
        ) : null}

        {autoAdvance ? (
          <motion.button
            onClick={isPaused ? resume : pause}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
            style={{
              borderColor: 'color-mix(in oklab, white 22%, transparent)',
              color: activeTheme.textColor,
              fontFamily: 'var(--font-dm-mono)',
            }}
          >
            {isPaused ? 'Resume Auto Pace' : 'Pause Auto Pace'}
          </motion.button>
        ) : null}

        <motion.button
          onClick={onReplay}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'color-mix(in oklab, white 22%, transparent)',
            color: activeTheme.textColor,
            fontFamily: 'var(--font-dm-mono)',
          }}
        >
          Replay
        </motion.button>

        {shareEnabled ? (
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.1em]"
            style={{
              borderColor: 'color-mix(in oklab, white 22%, transparent)',
              color: activeTheme.textColor,
              fontFamily: 'var(--font-dm-mono)',
            }}
          >
            Share
          </motion.button>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-[0.66rem] uppercase tracking-[0.11em]">
        <p style={{ fontFamily: 'var(--font-dm-mono)', opacity: 0.8 }}>
          Emotion: {currentEmotion}
        </p>
        <p style={{ fontFamily: 'var(--font-dm-mono)', opacity: 0.8 }}>
          {index + 1}/{Math.max(total, 1)}
        </p>
      </div>

      {shareMessage ? (
        <p
          className="mt-2 break-all text-[0.66rem]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            opacity: 0.76,
          }}
        >
          {shareMessage}
        </p>
      ) : null}
    </div>
  );
}
