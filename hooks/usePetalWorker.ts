'use client';

// Fix #25: public/workers/petal.worker.js was never instantiated by any
// component. The worker file itself has a USAGE NOTE showing the correct
// pattern, but no code followed it. This hook safely constructs the worker
// with a try/catch (for browsers that throw synchronously on `new Worker()`,
// e.g. Firefox with strict CSP, certain mobile WebViews) and an `onerror`
// handler for async failures. On any error the caller falls back to the
// existing DOM-based petal animation.

import { useEffect, useRef, type RefObject } from 'react';

interface PetalWorkerOptions {
  /** Ref to the canvas element the worker will draw petals onto. */
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Animation mode forwarded to the worker. */
  mode?: 'mixed' | 'petals' | 'hearts' | 'finale';
  /** Called when the worker fails to start or crashes — use to activate fallback. */
  onError?: (reason: string) => void;
}

/**
 * Instantiates `/workers/petal.worker.js` on an OffscreenCanvas with full
 * error handling. Returns early and calls `onError` if:
 *   - `OffscreenCanvas` is not supported (Safari < 17, older mobile browsers)
 *   - `new Worker(...)` throws synchronously (Firefox with restrictive CSP,
 *     some Android WebViews)
 *   - The worker fires an `error` event after construction
 *   - The worker posts `{ type: 'error' }` back from its internal handler
 *
 * The worker is terminated and the canvas reference released on unmount.
 */
export function usePetalWorker({ canvasRef, mode = 'mixed', onError }: PetalWorkerOptions) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // OffscreenCanvas is required for worker-based rendering.
    if (typeof OffscreenCanvas === 'undefined') {
      onError?.('OffscreenCanvas not supported');
      return;
    }

    let worker: Worker;
    let offscreen: OffscreenCanvas;

    try {
      worker = new Worker('/workers/petal.worker.js');
    } catch (err) {
      // new Worker() can throw synchronously on Firefox with strict Content
      // Security Policy, or on some mobile WebViews that block Workers.
      const reason = err instanceof Error ? err.message : String(err);
      console.warn('[PetalWorker] Worker construction failed, using fallback:', reason);
      onError?.(reason);
      return;
    }

    // Async error — fires when the worker script itself fails to parse or
    // throws at the top level inside the worker context.
    worker.onerror = (e: ErrorEvent) => {
      const reason = e.message ?? 'unknown worker error';
      console.warn('[PetalWorker] Worker runtime error, using fallback:', reason);
      onError?.(reason);
      worker.terminate();
      workerRef.current = null;
    };

    // The worker forwards its own internal errors via postMessage so they
    // surface even in browsers that suppress ErrorEvent on cross-origin scripts.
    worker.onmessage = (e: MessageEvent) => {
      if (e.data?.type === 'error') {
        const reason = String(e.data.message ?? 'worker reported error');
        console.warn('[PetalWorker] Worker posted error, using fallback:', reason);
        onError?.(reason);
        worker.terminate();
        workerRef.current = null;
      }
    };

    try {
      offscreen = canvas.transferControlToOffscreen();
    } catch (err) {
      // transferControlToOffscreen() throws if the canvas already has a 2D
      // context (e.g. if a fallback paint happened before this effect ran).
      const reason = err instanceof Error ? err.message : String(err);
      console.warn('[PetalWorker] transferControlToOffscreen failed:', reason);
      onError?.(reason);
      worker.terminate();
      return;
    }

    worker.postMessage(
      {
        type: 'init',
        canvas: offscreen,
        width: canvas.offsetWidth || canvas.width,
        height: canvas.offsetHeight || canvas.height,
        mode,
      },
      [offscreen], // transfer ownership — canvas is now owned by the worker
    );

    workerRef.current = worker;

    // Resize forwarding
    const handleResize = () => {
      if (!workerRef.current) return;
      workerRef.current.postMessage({
        type: 'resize',
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'stop' });
        // Give the worker one frame to clean up before terminating.
        const w = workerRef.current;
        workerRef.current = null;
        setTimeout(() => w.terminate(), 32);
      }
    };
  }, [canvasRef, mode, onError]);
}
