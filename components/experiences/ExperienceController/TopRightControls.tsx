import { motion } from 'framer-motion';

interface TopRightControlsProps {
  isUiVoidScreen: boolean;
  isSilentMode: boolean;
  toggleSilentMode: () => void;
  soundToggleOpacity: number;
  textColor: string;
  showPauseButton: boolean;
  autoAdvance: boolean;
  isPaused: boolean;
  resume: () => void;
  pause: () => void;
  isPrivateMode: boolean;
  cursorHidden: boolean;
}

export function TopRightControls({
  isUiVoidScreen,
  isSilentMode,
  toggleSilentMode,
  soundToggleOpacity,
  textColor,
  showPauseButton,
  autoAdvance,
  isPaused,
  resume,
  pause,
  isPrivateMode,
  cursorHidden,
}: TopRightControlsProps) {
  return (
    <>
      {!isUiVoidScreen ? (
        <motion.button
          type="button"
          data-nav-ignore="true"
          onClick={toggleSilentMode}
          className="absolute right-4 top-4 z-30 rounded-full border px-3 py-1 text-[0.58rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.24)',
            color: textColor,
            fontFamily: 'var(--font-dm-mono)',
            opacity: soundToggleOpacity,
            pointerEvents: soundToggleOpacity < 0.08 ? 'none' : 'auto',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {isSilentMode ? 'Silent' : 'Sound'}
        </motion.button>
      ) : null}

      {showPauseButton && autoAdvance && !isUiVoidScreen ? (
        <motion.button
          type="button"
          data-nav-ignore="true"
          onClick={isPaused ? resume : pause}
          className="absolute right-24 top-4 z-30 rounded-full border px-3 py-1 text-[0.58rem] uppercase tracking-[0.1em]"
          style={{
            borderColor: 'rgba(255,255,255,0.24)',
            color: textColor,
            fontFamily: 'var(--font-dm-mono)',
            opacity: isPrivateMode && cursorHidden ? 0 : 0.62,
            pointerEvents: isPrivateMode && cursorHidden ? 'none' : 'auto',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>
      ) : null}
    </>
  );
}
