export const restartFadeMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const afterglowOverlayMotion = {
  animate: { opacity: [0.12, 0.24, 0.14] },
  transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' as const },
};
