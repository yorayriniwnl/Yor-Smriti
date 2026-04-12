import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useEmotionalScrollResistance(
  ref: RefObject<HTMLElement | null>,
  resistance = 0.42,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    let frame: number | null = null;
    let targetScrollTop = element.scrollTop;

    const maxScroll = () => Math.max(0, element.scrollHeight - element.clientHeight);

    const step = () => {
      const delta = targetScrollTop - element.scrollTop;
      element.scrollTop += delta * 0.24;

      if (Math.abs(delta) < 0.7) {
        element.scrollTop = targetScrollTop;
        frame = null;
        return;
      }

      frame = window.requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 0.5 || element.scrollHeight <= element.clientHeight) {
        return;
      }

      event.preventDefault();
      targetScrollTop = clampNumber(
        targetScrollTop + event.deltaY * resistance,
        0,
        maxScroll(),
      );

      if (frame === null) {
        frame = window.requestAnimationFrame(step);
      }
    };

    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', onWheel);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [ref, resistance]);
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
