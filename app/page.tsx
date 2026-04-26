"use client";

// Bug 43 fix: styled-jsx was never installed. The entire CSS block that
// was inside <style jsx global> (1,100+ lines) is now in app/home.css,
// imported here as a plain Next.js CSS import. No runtime dep needed.
import './home.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePetalWorker } from '@/hooks/usePetalWorker';
import CharacterPageOverlayClient from '@/components/character/CharacterPageOverlayClient';
import { EXPERIENCE_CATALOG } from '@/lib/experienceCatalog';
// Set NEXT_PUBLIC_SINCE_DATE=YYYY-MM-DD in .env.local to control the counter
// without a code push. Falls back to the original date if unset.
const SINCE_DATE = process.env.NEXT_PUBLIC_SINCE_DATE ?? '2025-05-18';

function daysSince(dateStr: string): number | null {
  if (!dateStr || dateStr === 'YYYY-MM-DD') return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return days < 0 ? null : days;
}

const REPLIES = [
  { text: "I hear you... and I'm not going anywhere.", emotion: 'warmAttention' },
  { text: 'That means more to me than you know.', emotion: 'affectionate' },
  { text: 'Come closer. I want to answer that carefully.', emotion: 'thoughtful' },
  { text: 'I missed this - just talking, just us.', emotion: 'softSmile' },
  { text: "You don't have to carry that alone anymore.", emotion: 'concerned' },
  { text: "I've been thinking about that too, quietly.", emotion: 'reflective' },
  { text: "Tell me more. I'm all yours right now.", emotion: 'warmAttention' },
  { text: "There is sadness in that - and I don't want to look away.", emotion: 'quietSadness' },
  { text: 'That caught me softly, in a good way.', emotion: 'subtleSurprise' },
  { text: "...I love you. That's the only reply I have.", emotion: 'affectionate' },
] as const;

// 640×480 gives ~0.59x scale on iPhone SE vs the previous 0.27x at 1280×920.
function withSequenceParam(href: string): string {
  return `${href}${href.includes('?') ? '&' : '?'}sequence=1`;
}

const EXPERIENCE_PAGE_DURATION_MS = 45000;
const EXPERIENCE_PAGE_LOAD_TIMEOUT_MS = 15000;

const EXPERIENCE_PAGE_SEQUENCE = EXPERIENCE_CATALOG
  // Bug 64 fix: password-gated pages (skipInSequence: true) cannot play
  // meaningfully inside a 45-second iframe slot — the recipient would see a
  // lock screen for the entire duration. They are accessible from the hub
  // but excluded from the automated flow.
  .filter((experience) => !experience.skipInSequence)
  .map((experience) => ({
    href: withSequenceParam(experience.href),
    title: experience.title,
    duration: EXPERIENCE_PAGE_DURATION_MS,
  }));

export default function HomePage() {
  // Fix #25: petal.worker.js is now wired up with full error handling via
  // usePetalWorker. If the worker fails (e.g. Firefox CSP, old mobile WebViews),
  // useFallbackPetals flips true and the existing DOM animation takes over.
  const petalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useFallbackPetals, setUseFallbackPetals] = useState(false);
  const handleWorkerError = useCallback(() => setUseFallbackPetals(true), []);
  usePetalWorker({
    canvasRef: petalCanvasRef,
    mode: 'mixed',
    onError: handleWorkerError,
  });

  // Bug 55 fix: chatHistoryRef was declared as a plain object literal inside
  // the useEffect closure. That means in React 18 Strict Mode (double-invoke),
  // each effect execution created a fresh { current: [] } — wiping chat history
  // on remount. It also meant the ref was not stable across re-renders by
  // design. Moving it here as a useRef gives it a stable identity for the
  // component lifetime, matching the intent of the original code.
  const chatHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  useEffect(() => {
    const cur = document.getElementById('cursor') as HTMLDivElement | null;
    const ring = document.getElementById('cursor-ring') as HTMLDivElement | null;
    const petalContainer = document.getElementById('petals');
    const messages = document.getElementById('messages') as HTMLDivElement | null;
    const typing = document.getElementById('typing') as HTMLDivElement | null;
    const moodFill = document.getElementById('mood-fill') as HTMLDivElement | null;
    const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement | null;
    const experienceRunner = document.getElementById('experience-runner') as HTMLDivElement | null;
    const experienceRunnerFrame = document.getElementById('experience-runner-frame') as HTMLIFrameElement | null;
    const experienceRunnerTitle = document.getElementById('experience-runner-title') as HTMLHeadingElement | null;
    const experienceRunnerCount = document.getElementById('experience-runner-count') as HTMLParagraphElement | null;
    const experienceRunnerSkip = document.getElementById('experience-runner-skip') as HTMLButtonElement | null;
    const experienceRunnerNext = document.getElementById('experience-runner-next') as HTMLButtonElement | null;
    const experienceRunnerError = document.getElementById('experience-runner-error') as HTMLDivElement | null;
    const experienceRunnerErrorRetry = document.getElementById('experience-runner-error-retry') as HTMLButtonElement | null;
    const experienceRunnerErrorNext = document.getElementById('experience-runner-error-next') as HTMLButtonElement | null;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let msgCount = 0;

    let heartRafId: number | undefined;
    let bgRafId: number | undefined;
    let cursorRafId: number | undefined;
    let typingTimerId: number | undefined;
    let sequenceEnabled = true;
    let sequenceRunning = false;
    let sequenceToken = 0;
    let currentExperienceIndex = 0;
    let experienceAdvanceFn: (() => void) | null = null;
    let sequenceScrollRafId: number | null = null;
    const sequenceTimeoutIds: number[] = [];

    const queueSequenceTimeout = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      sequenceTimeoutIds.push(id);
    };

    const clearSequenceTimeouts = () => {
      sequenceTimeoutIds.forEach((id) => window.clearTimeout(id));
      sequenceTimeoutIds.length = 0;
    };

    const SVG_NS = 'http://www.w3.org/2000/svg';

    const appendPlainText = (parent: HTMLElement, text: string) => {
      const lines = text.split('\n');
      lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) parent.appendChild(document.createElement('br'));
        parent.appendChild(document.createTextNode(line));
      });
    };

    const cancelSequenceScroll = () => {
      if (sequenceScrollRafId !== null) {
        window.cancelAnimationFrame(sequenceScrollRafId);
        sequenceScrollRafId = null;
      }
    };

    const easeInOutSmoother = (value: number) =>
      value * value * value * (value * (value * 6 - 15) + 10);

    const getScrollDriver = (target: HTMLElement) => {
      let parent = target.parentElement;
      while (parent && parent !== document.body) {
        const style = window.getComputedStyle(parent);
        const isScrollable = /(auto|scroll)/.test(style.overflowY);
        if (isScrollable && parent.scrollHeight > parent.clientHeight + 2) {
          const scrollParent = parent;
          return {
            viewportTop: () => scrollParent.getBoundingClientRect().top,
            viewportHeight: () => scrollParent.clientHeight,
            getTop: () => scrollParent.scrollTop,
            setTop: (top: number) => {
              scrollParent.scrollTop = top;
            },
            maxTop: () => Math.max(0, scrollParent.scrollHeight - scrollParent.clientHeight),
          };
        }
        parent = parent.parentElement;
      }

      const root = document.scrollingElement as HTMLElement | null;
      const documentElement = document.documentElement;
      const body = document.body;

      return {
        viewportTop: () => 0,
        viewportHeight: () => window.innerHeight,
        getTop: () => window.scrollY || documentElement.scrollTop || body.scrollTop || root?.scrollTop || 0,
        setTop: (top: number) => {
          window.scrollTo(0, top);
          documentElement.scrollTop = top;
          body.scrollTop = top;
          if (root) root.scrollTop = top;
        },
        maxTop: () =>
          Math.max(
            0,
            Math.max(documentElement.scrollHeight, body.scrollHeight, root?.scrollHeight ?? 0) - window.innerHeight,
          ),
      };
    };

    const slowScrollToElement = (
      target: HTMLElement | null | undefined,
      durationMs: number | ((direction: 'up' | 'down', distance: number) => number),
      token: number,
      block: ScrollLogicalPosition = 'center',
    ) => {
      if (!target || token !== sequenceToken || !sequenceEnabled) return;
      cancelSequenceScroll();

      const driver = getScrollDriver(target);
      const targetRect = target.getBoundingClientRect();
      const startTop = driver.getTop();
      const elementTop = startTop + targetRect.top - driver.viewportTop();
      const viewportHeight = driver.viewportHeight();
      let endTop = elementTop;

      if (block === 'center') {
        endTop = elementTop - (viewportHeight - targetRect.height) / 2;
      } else if (block === 'end') {
        endTop = elementTop - viewportHeight + targetRect.height;
      }

      endTop = Math.max(0, Math.min(driver.maxTop(), endTop));

      const distance = endTop - startTop;
      const absoluteDistance = Math.abs(distance);
      if (absoluteDistance < 1) return;

      const direction = distance > 0 ? 'down' : 'up';
      const resolvedDurationMs =
        typeof durationMs === 'function' ? durationMs(direction, absoluteDistance) : durationMs;

      const startedAt = window.performance.now();
      const step = (now: number) => {
        if (token !== sequenceToken || !sequenceEnabled) {
          sequenceScrollRafId = null;
          return;
        }

        const progress = Math.min(1, (now - startedAt) / resolvedDurationMs);
        driver.setTop(startTop + distance * easeInOutSmoother(progress));

        if (progress < 1) {
          sequenceScrollRafId = window.requestAnimationFrame(step);
        } else {
          sequenceScrollRafId = null;
        }
      };

      sequenceScrollRafId = window.requestAnimationFrame(step);
    };

    const goScene = (id: string) => {
      document.querySelectorAll<HTMLElement>('.scene').forEach((scene) => scene.classList.remove('active'));
      const nextScene = document.getElementById(id);
      nextScene?.classList.add('active', 'slide-in');
      window.setTimeout(() => nextScene?.classList.remove('slide-in'), 480);

      document.querySelectorAll<HTMLElement>('[data-scene-target]').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.sceneTarget === id);
      });
    };

    const clearSequenceHighlights = () => {
      document.querySelectorAll<HTMLElement>('.hub-card').forEach((card) => {
        card.classList.remove('sequence-focus');
      });
    };

    const clearStoryHighlights = () => {
      document.querySelectorAll<HTMLElement>('[data-sequence-story="true"]').forEach((section) => {
        section.classList.remove('sequence-story-focus');
      });
      document.querySelectorAll<HTMLElement>('[data-sequence-story-label="true"]').forEach((label) => {
        label.classList.remove('sequence-story-label-focus');
      });
      document.querySelectorAll<HTMLElement>('[data-sequence-timeline-item="true"]').forEach((item) => {
        item.classList.remove('sequence-timeline-focus');
      });
    };

    const hideExperienceError = () => {
      experienceRunner?.classList.remove('is-error');
      experienceRunnerError?.setAttribute('aria-hidden', 'true');
    };

    const resetExperienceRunner = () => {
      experienceRunner?.classList.remove('active', 'is-loading', 'is-error');
      experienceRunner?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sequence-cinema');
      experienceAdvanceFn = null;
      hideExperienceError();

      if (experienceRunnerFrame) {
        experienceRunnerFrame.onload = null;
        experienceRunnerFrame.onerror = null;
        experienceRunnerFrame.src = 'about:blank';
      }
    };

    const offerChatAfterExperienceSequence = () => {
      resetExperienceRunner();
      clearSequenceHighlights();
      clearStoryHighlights();
      sequenceRunning = false;
      document.body.classList.remove('sequence-running');
      goScene('scene-chat');

      if (messages && !messages.querySelector('[data-sequence-chat-offer="true"]')) {
        addMessage("I opened every part of it for you. If you want, talk to me now. I'm here.", 'ayrin', 'warmAttention');
        messages.lastElementChild?.setAttribute('data-sequence-chat-offer', 'true');
      }

      window.setTimeout(() => {
        chatInput?.focus();
      }, 420);

      spawnHeart();
    };

    const showExperienceError = (index: number, retryFn: () => void, nextFn: () => void) => {
      experienceRunner?.classList.remove('is-loading');
      experienceRunner?.classList.add('is-error');
      if (experienceRunnerError) {
        experienceRunnerError.setAttribute('aria-hidden', 'false');
        if (experienceRunnerErrorRetry) experienceRunnerErrorRetry.onclick = retryFn;
        if (experienceRunnerErrorNext) {
          experienceRunnerErrorNext.style.display = '';
          experienceRunnerErrorNext.textContent = index >= EXPERIENCE_PAGE_SEQUENCE.length - 1 ? 'Finish' : 'Skip experience ->';
          experienceRunnerErrorNext.onclick = nextFn;
        }
      }
    };

    const openExperiencePage = (index: number, token: number) => {
      const page = EXPERIENCE_PAGE_SEQUENCE[index];
      if (!page || !experienceRunner || !experienceRunnerFrame) return;
      if (token !== sequenceToken || !sequenceEnabled) return;

      currentExperienceIndex = index;
      let settled = false;
      let advanced = false;
      hideExperienceError();
      if (experienceRunnerTitle) experienceRunnerTitle.textContent = page.title;
      if (experienceRunnerCount) {
        experienceRunnerCount.textContent = `${String(index + 1).padStart(2, '0')} / ${String(EXPERIENCE_PAGE_SEQUENCE.length).padStart(2, '0')}`;
      }
      if (experienceRunnerNext) {
        experienceRunnerNext.textContent = index >= EXPERIENCE_PAGE_SEQUENCE.length - 1 ? 'Finish ->' : 'Next ->';
      }

      const advance = () => {
        if (advanced || token !== sequenceToken || !sequenceEnabled) return;
        advanced = true;
        experienceAdvanceFn = null;
        if (index >= EXPERIENCE_PAGE_SEQUENCE.length - 1) {
          offerChatAfterExperienceSequence();
        } else {
          openExperiencePage(index + 1, token);
        }
      };
      experienceAdvanceFn = advance;

      experienceRunnerFrame.onload = null;
      experienceRunnerFrame.onerror = null;
      experienceRunner.removeAttribute('aria-hidden');
      experienceRunner.classList.add('active', 'is-loading');
      document.body.classList.add('sequence-cinema');

      const retryFn = () => { if (token === sequenceToken) openExperiencePage(index, token); };
      const nextFn = () => { if (token === sequenceToken) advance(); };

      // Keep load failures inside the runner so the home page never navigates away.
      const fallbackId = window.setTimeout(() => {
        if (settled || token !== sequenceToken || !sequenceEnabled) return;
        settled = true;
        showExperienceError(index, retryFn, nextFn);
      }, EXPERIENCE_PAGE_LOAD_TIMEOUT_MS);
      sequenceTimeoutIds.push(fallbackId);

      experienceRunnerFrame.onload = () => {
        // about:blank reset fires onload; ignore it.
        const src = experienceRunnerFrame?.src ?? '';
        if (!src || src === 'about:blank') return;
        if (settled || token !== sequenceToken) return;
        settled = true;
        window.clearTimeout(fallbackId);
        experienceRunner?.classList.remove('is-loading');
        queueSequenceTimeout(advance, page.duration);
      };

      // Fix 9: hard load errors (network failure, 404) show error state instead of blank
      experienceRunnerFrame.onerror = () => {
        if (settled || token !== sequenceToken || !sequenceEnabled) return;
        settled = true;
        window.clearTimeout(fallbackId);
        showExperienceError(index, retryFn, nextFn);
      };

      experienceRunnerFrame.src = page.href;
    };

    const stopSequence = () => {
      sequenceToken += 1;
      clearSequenceTimeouts();
      cancelSequenceScroll();
      clearSequenceHighlights();
      clearStoryHighlights();
      resetExperienceRunner();
      sequenceRunning = false;
      document.body.classList.remove('sequence-running');
    };

    const addMessage = (text: string, from: 'user' | 'ayrin', emotion = '') => {
      if (!messages) return;
      const div = document.createElement('div');
      div.className = `msg ${from}`;
      div.style.animationDelay = '0s';
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      if (from === 'ayrin' && emotion) {
        const emotionTag = document.createElement('span');
        emotionTag.className = 'emotion-tag';
        emotionTag.textContent = emotion;
        bubble.appendChild(emotionTag);
        bubble.appendChild(document.createElement('br'));
      }
      appendPlainText(bubble, text);
      div.appendChild(bubble);
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      msgCount += 1;

      if (moodFill) {
        const pct = Math.min(95, 40 + msgCount * 6);
        moodFill.style.width = `${pct}%`;
      }
    };

    const spawnHeart = () => {
      const sceneChat = document.getElementById('scene-chat');
      if (!sceneChat) return;
      const h = document.createElement('div');
      h.className = 'float-heart';
      h.textContent = '💗';
      Object.assign(h.style, {
        right: '1.5rem',
        bottom: '8rem',
        left: 'auto',
        fontSize: '1.2rem',
      });
      sceneChat.appendChild(h);
      window.setTimeout(() => h.remove(), 3000);
    };

    const spawnHearts = () => {
      const emojis = ['❤️', '💕', '💗', '💖', '💓', '💝', '🌹', '✨'];
      for (let i = 0; i < 12; i++) {
        const h = document.createElement('div');
        h.className = 'float-heart';
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        Object.assign(h.style, {
          left: `${20 + Math.random() * 60}vw`,
          top: `${30 + Math.random() * 40}vh`,
          animationDelay: `${Math.random() * 0.6}s`,
          fontSize: `${Math.random() * 1.2 + 0.8}rem`,
        });
        document.body.appendChild(h);
        window.setTimeout(() => h.remove(), 3200);
      }
    };

    const runExperienceSequence = () => {
      stopSequence();
      const token = sequenceToken;
      sequenceRunning = true;
      document.body.classList.add('sequence-running');
      goScene('scene-hub');
      const CARD_SCROLL_UP_MS = 2200;
      const CARD_SCROLL_DOWN_MS = CARD_SCROLL_UP_MS * 2;
      const CARD_FOCUS_SETTLE_MS = 3600;
      const CARD_FOCUS_STEP_MS = CARD_SCROLL_DOWN_MS + CARD_FOCUS_SETTLE_MS;
      const STORY_POINT_STEP_MS = 5500;
      const STORY_END_PAUSE_MS = 3500;
      const GRATITUDE_HOLD_MS = 9000;
      const GRATITUDE_SCROLL_UP_MS = 5000;
      const GRATITUDE_SCROLL_DOWN_MS = GRATITUDE_SCROLL_UP_MS * 2;
      // Let the scene transition CSS animation finish before sequence scrolling starts.
      const SCENE_SETTLE_MS = 650;

      const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-sequence-card="true"]'));
      const storySection = document.querySelector<HTMLElement>('[data-sequence-story="true"]');
      const storyLabel = document.querySelector<HTMLElement>('[data-sequence-story-label="true"]');
      const storyItems = Array.from(
        document.querySelectorAll<HTMLElement>('[data-sequence-timeline-item="true"]'),
      );
      const gratitudeCard = cards.find((card) => card.dataset.sequenceCardKey === 'gratitude');
      const gratitudeIndex = gratitudeCard ? cards.indexOf(gratitudeCard) : -1;
      const hubTitle = document.querySelector<HTMLElement>('.scene-hub-title');
      const cardScrollDuration = (direction: 'up' | 'down') =>
        direction === 'down' ? CARD_SCROLL_DOWN_MS : CARD_SCROLL_UP_MS;

      cards.forEach((card, index) => {
        queueSequenceTimeout(() => {
          if (token !== sequenceToken || !sequenceEnabled) return;
          clearSequenceHighlights();
          card.classList.add('sequence-focus');
          slowScrollToElement(card, cardScrollDuration, token, 'center');
          spawnHearts();
        }, SCENE_SETTLE_MS + 700 + index * CARD_FOCUS_STEP_MS);
      });

      const gratitudeChoreographyStart =
        gratitudeIndex >= 0
          ? SCENE_SETTLE_MS + 700 + gratitudeIndex * CARD_FOCUS_STEP_MS + CARD_FOCUS_STEP_MS
          : 0;
      const gratitudeChoreographyDuration =
        gratitudeIndex >= 0
          ? GRATITUDE_HOLD_MS +
            GRATITUDE_SCROLL_UP_MS +
            GRATITUDE_SCROLL_DOWN_MS +
            GRATITUDE_SCROLL_DOWN_MS
          : 0;

      if (gratitudeCard) {
        queueSequenceTimeout(() => {
          if (token !== sequenceToken || !sequenceEnabled) return;
          slowScrollToElement(hubTitle ?? cards[0], GRATITUDE_SCROLL_UP_MS, token, 'center');
        }, gratitudeChoreographyStart + GRATITUDE_HOLD_MS);

        queueSequenceTimeout(() => {
          if (token !== sequenceToken || !sequenceEnabled) return;
          slowScrollToElement(gratitudeCard, GRATITUDE_SCROLL_DOWN_MS, token, 'center');
        }, gratitudeChoreographyStart + GRATITUDE_HOLD_MS + GRATITUDE_SCROLL_UP_MS);

        queueSequenceTimeout(() => {
          if (token !== sequenceToken || !sequenceEnabled) return;
          slowScrollToElement(storySection, GRATITUDE_SCROLL_DOWN_MS, token, 'center');
        }, gratitudeChoreographyStart + GRATITUDE_HOLD_MS + GRATITUDE_SCROLL_UP_MS + GRATITUDE_SCROLL_DOWN_MS);
      }

      const storyStart = SCENE_SETTLE_MS + 700 + cards.length * CARD_FOCUS_STEP_MS + gratitudeChoreographyDuration;

      queueSequenceTimeout(() => {
        if (token !== sequenceToken || !sequenceEnabled) return;
        clearSequenceHighlights();
        clearStoryHighlights();
        storySection?.classList.add('sequence-story-focus');
        storyLabel?.classList.add('sequence-story-label-focus');
        slowScrollToElement(storySection, GRATITUDE_SCROLL_DOWN_MS, token, 'center');
        spawnHearts();
      }, storyStart);

      storyItems.forEach((_, index) => {
        queueSequenceTimeout(() => {
          if (token !== sequenceToken || !sequenceEnabled) return;
          storyItems.forEach((storyItem, storyIndex) => {
            storyItem.classList.toggle('sequence-timeline-focus', storyIndex <= index);
          });
        }, storyStart + 320 + index * STORY_POINT_STEP_MS);
      });

      const storyFinalBeat = storyStart + 320 + (storyItems.length - 1) * STORY_POINT_STEP_MS;
      const experienceStart = storyFinalBeat + STORY_END_PAUSE_MS;

      queueSequenceTimeout(() => {
        if (token !== sequenceToken || !sequenceEnabled) return;
        openExperiencePage(0, token);
      }, experienceStart);
    };

    const sendMsg = () => {
      if (!chatInput) return;
      const txt = chatInput.value.trim();
      if (!txt) return;
      addMessage(txt, 'user');
      chatHistoryRef.current.push({ role: 'user', content: txt });
      if (chatHistoryRef.current.length > 12) chatHistoryRef.current = chatHistoryRef.current.slice(-12);
      chatInput.value = '';

      if (!typing) return;
      typing.classList.add('visible');

      // Compute mood as a -1..1 float from the current bar width
      const moodPct = moodFill
        ? parseFloat(moodFill.style.width || '62') / 100
        : 0.62;
      const moodValue = Math.round((moodPct * 2 - 1) * 100) / 100;

      const fallbackReply = () => {
        typing?.classList.remove('visible');
        const r = REPLIES[Math.floor(Math.random() * REPLIES.length)];
        addMessage(r.text, 'ayrin', r.emotion);
        spawnHeart();
      };

      // Clear any existing typing timer
      if (typingTimerId !== undefined) window.clearTimeout(typingTimerId);

      // Call /api/chat; fall back to local REPLIES on any failure
      const minDelay = 1200 + Math.random() * 600;
      const start = Date.now();

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-yor-csrf': '1' },
        body: JSON.stringify({
          message: txt,
          memory: { mood: moodValue },
          history: chatHistoryRef.current.slice(0, -1),
        }),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then((data: { reply: string; emotion: string }) => {
          const elapsed = Date.now() - start;
          const wait = Math.max(0, minDelay - elapsed);
          typingTimerId = window.setTimeout(() => {
            typing?.classList.remove('visible');
            addMessage(data.reply, 'ayrin', data.emotion);
            chatHistoryRef.current.push({ role: 'assistant', content: data.reply });
            spawnHeart();
          }, wait);
        })
        .catch(() => {
          const elapsed = Date.now() - start;
          const wait = Math.max(0, minDelay - elapsed);
          typingTimerId = window.setTimeout(fallbackReply, wait);
        });
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animCursor = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cur) cur.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      if (ring) ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      cursorRafId = window.requestAnimationFrame(animCursor);
    };

    cursorRafId = window.requestAnimationFrame(animCursor);
    document.addEventListener('mousemove', mouseMoveHandler);

    // Bug 54 fix: guard star injection against React 18 Strict Mode double-invoke.
    // In development, useEffect fires twice on mount. Without this guard,
    // 220 star nodes are appended and the cleanup only removes the second batch,
    // leaving 110 orphaned .star elements permanently in the DOM.
    // The data attribute acts as an idempotency key: if stars are already present
    // from a prior invocation (same page lifecycle), we skip re-injection entirely.
    if (!document.body.hasAttribute('data-stars-injected')) {
      document.body.setAttribute('data-stars-injected', '1');
      for (let i = 0; i < 110; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const sz = Math.random() * 2.2 + 0.4;
        Object.assign(s.style, {
          width: `${sz}px`,
          height: `${sz}px`,
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 4}s`,
          opacity: `${Math.random() * 0.6 + 0.1}`,
        });
        document.body.appendChild(s);
      }
    }

    const PETAL_COLORS = ['#f75590', '#ff8cb8', '#ffc1db', '#e8447a', '#ffa0c8'];
    const makePetal = () => {
      if (!petalContainer) return;
      const el = document.createElement('div');
      el.className = 'petal';
      const col = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const sz = Math.random() * 14 + 8;
      const svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('width', String(sz));
      svg.setAttribute('height', String(sz));
      svg.setAttribute('viewBox', '0 0 20 20');
      const ellipse = document.createElementNS(SVG_NS, 'ellipse');
      ellipse.setAttribute('cx', '10');
      ellipse.setAttribute('cy', '12');
      ellipse.setAttribute('rx', '6');
      ellipse.setAttribute('ry', '9');
      ellipse.setAttribute('fill', col);
      ellipse.setAttribute('opacity', String(Math.random() * 0.3 + 0.5));
      ellipse.setAttribute('transform', `rotate(${Math.random() * 30 - 15} 10 10)`);
      svg.appendChild(ellipse);
      el.appendChild(svg);
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${Math.random() * 8 + 7}s`;
      el.style.animationDelay = `${Math.random() * 10}s`;
      petalContainer.appendChild(el);
      window.setTimeout(() => el.remove(), 20000);
    };

    // DOM petals only run as fallback when the worker canvas failed or isn't
    // supported — prevents duplicate rendering when the worker is active.
    if (useFallbackPetals) {
      for (let i = 0; i < 18; i++) makePetal();
    }
    const petalInterval = useFallbackPetals
      ? window.setInterval(makePetal, 1200)
      : (0 as unknown as ReturnType<typeof setInterval>);

    const heartCanvas = document.getElementById('heart-canvas') as HTMLCanvasElement | null;
    let disposeHeart: (() => void) | undefined;
    if (heartCanvas) {
      import('three').then((THREE) => {
      const renderer = new THREE.WebGLRenderer({ canvas: heartCanvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
      camera.position.z = 3.2;

      const heartPoint = (t: number): [number, number] => {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        return [x / 17, y / 17];
      };

      const count = 2800;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const scales = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const t = Math.random() * Math.PI * 2;
        const r = Math.cbrt(Math.random());
        const [hx, hy] = heartPoint(t);
        const rx2 = (Math.random() - 0.5) * 0.12 * r;
        const ry2 = (Math.random() - 0.5) * 0.12 * r;
        const rz = (Math.random() - 0.5) * 0.35 * r;
        positions[i * 3] = hx + rx2;
        positions[i * 3 + 1] = hy + ry2;
        positions[i * 3 + 2] = rz;
        const bright = 0.55 + Math.random() * 0.45;
        const isWhite = Math.random() < 0.08;
        colors[i * 3] = isWhite ? 1 : bright;
        colors[i * 3 + 1] = isWhite ? 0.92 : bright * 0.28;
        colors[i * 3 + 2] = isWhite ? 0.97 : bright * 0.55;
        scales[i] = Math.random() * 0.6 + 0.4;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

      const mat = new THREE.PointsMaterial({
        size: 0.028,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        sizeAttenuation: true,
        depthWrite: false,
      });

      const heart = new THREE.Points(geo, mat);
      scene.add(heart);

      const resizeHeart = () => {
        const el = heartCanvas.parentElement;
        const w = Math.min((el?.offsetWidth ?? 0) * 0.72, 420);
        heartCanvas.style.width = `${w}px`;
        heartCanvas.style.height = `${w}px`;
        renderer.setSize(w, w, false);
      };
      resizeHeart();
      window.addEventListener('resize', resizeHeart);

      let frame = 0;
      const animateHeart = () => {
        frame += 1;
        heart.rotation.y += 0.008;
        heart.rotation.x = Math.sin(frame * 0.012) * 0.18;
        const pulse = 1 + Math.sin(frame * 0.04) * 0.055;
        heart.scale.set(pulse, pulse, pulse);
        renderer.render(scene, camera);
        heartRafId = window.requestAnimationFrame(animateHeart);
      };
      heartRafId = window.requestAnimationFrame(animateHeart);

      disposeHeart = () => {
        window.removeEventListener('resize', resizeHeart);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      };
      }); // end import('three')
    }

    const bgCanvas = document.getElementById('bg-canvas') as HTMLCanvasElement | null;
    let bgCleanup: (() => void) | undefined;
    if (bgCanvas) {
      const gl = bgCanvas.getContext('2d');
      if (gl) {
        const resizeBg = () => {
          bgCanvas.width = window.innerWidth;
          bgCanvas.height = window.innerHeight;
        };
        resizeBg();
        window.addEventListener('resize', resizeBg);

        let t = 0;
        const drawBg = () => {
          t += 0.004;
          gl.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          gl.fillStyle = '#05030a';
          gl.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

          const cx = bgCanvas.width / 2;
          const cy = bgCanvas.height * 0.18;
          const r1 = bgCanvas.width * 0.55 + Math.sin(t) * 20;
          const r2 = bgCanvas.width * 0.35 + Math.cos(t * 0.7) * 15;

          const g1 = gl.createRadialGradient(cx, cy, 0, cx, cy, r1);
          g1.addColorStop(0, `rgba(180,50,100,${0.13 + Math.sin(t) * 0.03})`);
          g1.addColorStop(0.4, 'rgba(90,20,60,0.07)');
          g1.addColorStop(1, 'rgba(5,3,10,0)');
          gl.fillStyle = g1;
          gl.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

          const ox = Math.sin(t * 0.6) * 80;
          const oy = Math.cos(t * 0.4) * 50;
          const g2 = gl.createRadialGradient(cx + ox, cy + oy + 200, 0, cx + ox, cy + oy + 200, r2);
          g2.addColorStop(0, `rgba(100,20,70,${0.1 + Math.cos(t) * 0.025})`);
          g2.addColorStop(1, 'rgba(5,3,10,0)');
          gl.fillStyle = g2;
          gl.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

          bgRafId = window.requestAnimationFrame(drawBg);
        };

        bgRafId = window.requestAnimationFrame(drawBg);
        bgCleanup = () => window.removeEventListener('resize', resizeBg);
      }
    }

    const sparkleHandler = (e: MouseEvent) => {
      for (let i = 0; i < 6; i++) {
        const sp = document.createElement('div');
        sp.className = 'sparkle';
        const angle = (i / 6) * 360;
        const dist = Math.random() * 30 + 12;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('width', '12');
        svg.setAttribute('height', '12');
        svg.setAttribute('viewBox', '0 0 12 12');
        const polygon = document.createElementNS(SVG_NS, 'polygon');
        polygon.setAttribute('points', '6,1 7.2,4.8 11,4.8 8,7.2 9.2,11 6,8.8 2.8,11 4,7.2 1,4.8 4.8,4.8');
        polygon.setAttribute('fill', 'rgba(247,85,144,0.85)');
        svg.appendChild(polygon);
        sp.appendChild(svg);
        Object.assign(sp.style, {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          transform: `translate(${dx}px, ${dy}px)`,
        });
        document.body.appendChild(sp);
        window.setTimeout(() => sp.remove(), 700);
      }
    };
    document.addEventListener('click', sparkleHandler);

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const target = e.target as HTMLElement | null;
        if (target?.id === 'chat-input') {
          e.preventDefault();
          sendMsg();
        }
      }
    };
    document.addEventListener('keydown', keyHandler);

    const navSceneButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-target]'));
    const navPower = document.getElementById('nav-power');
    const openHeartBtn = document.getElementById('open-heart-btn');

    const applyPowerUi = () => {
      navPower?.classList.toggle('active', sequenceEnabled);
      navPower?.setAttribute('aria-pressed', sequenceEnabled ? 'true' : 'false');
      navPower?.setAttribute('aria-label', sequenceEnabled ? 'Auto sequence on' : 'Auto sequence off');
    };
    applyPowerUi();

    navSceneButtons.forEach((el) => {
      const id = el.dataset.sceneTarget;
      if (!id) return;
      el.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        stopSequence();
        goScene(id);
      };
    });

    const sceneJumpButtons = Array.from(document.querySelectorAll<HTMLElement>('[data-go-scene]'));
    sceneJumpButtons.forEach((el) => {
      const id = el.dataset.goScene;
      if (id) {
        el.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          stopSequence();
          goScene(id);
        };
      }
    });

    if (openHeartBtn) {
      openHeartBtn.onclick = () => {
        if (!sequenceEnabled) {
          goScene('scene-hub');
          return;
        }
        runExperienceSequence();
      };
    }

    if (navPower) {
      navPower.onclick = () => {
        sequenceEnabled = !sequenceEnabled;
        applyPowerUi();
        if (!sequenceEnabled && sequenceRunning) {
          stopSequence();
        }
      };
    }

    const sendBtn = document.querySelector<HTMLButtonElement>('.send-btn');
    if (sendBtn) {
      sendBtn.onclick = sendMsg;
    }

    // Fix #20: swipe gestures on the overlay
    let touchStartX = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches?.item(0)?.clientX ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = (e.changedTouches?.item(0)?.clientX ?? touchStartX) - touchStartX;
      if (Math.abs(dx) < 50) return;
      if (dx < 0) {
        experienceAdvanceFn?.();
      }
    };

    experienceRunner?.addEventListener('touchstart', onTouchStart, { passive: true });
    experienceRunner?.addEventListener('touchend', onTouchEnd, { passive: true });

    if (experienceRunnerSkip) {
      experienceRunnerSkip.onclick = () => {
        stopSequence();
        offerChatAfterExperienceSequence();
      };
    }

    if (experienceRunnerNext) {
      experienceRunnerNext.onclick = () => {
        experienceAdvanceFn?.();
      };
    }

    const onExperienceMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (!sequenceRunning || !sequenceEnabled) return;

      if (e.data?.type === 'yor:slide-complete' || e.data?.type === 'yor:experience-complete') {
        experienceAdvanceFn?.();
        return;
      }

      if (e.data?.type === 'yor:slide-error' || e.data?.type === 'yor:experience-error') {
        const retryFn = () => openExperiencePage(currentExperienceIndex, sequenceToken);
        const nextFn = () => experienceAdvanceFn?.();
        showExperienceError(currentExperienceIndex, retryFn, nextFn);
      }
    };
    window.addEventListener('message', onExperienceMessage);

    const hubCard = document.querySelector<HTMLElement>('[data-action="hearts"]');
    if (hubCard) {
      hubCard.onclick = spawnHearts;
    }

    return () => {
      navSceneButtons.forEach((el) => {
        el.onclick = null;
      });
      sceneJumpButtons.forEach((el) => {
        el.onclick = null;
      });
      if (openHeartBtn) openHeartBtn.onclick = null;
      if (navPower) navPower.onclick = null;
      if (sendBtn) sendBtn.onclick = null;
      if (experienceRunnerSkip) experienceRunnerSkip.onclick = null;
      if (experienceRunnerNext) experienceRunnerNext.onclick = null;
      if (experienceRunnerErrorRetry) experienceRunnerErrorRetry.onclick = null;
      if (experienceRunnerErrorNext) experienceRunnerErrorNext.onclick = null;
      if (hubCard) hubCard.onclick = null;
      window.removeEventListener('message', onExperienceMessage);
      experienceRunner?.removeEventListener('touchstart', onTouchStart);
      experienceRunner?.removeEventListener('touchend', onTouchEnd);

      stopSequence();
      if (cursorRafId) cancelAnimationFrame(cursorRafId);
      if (heartRafId) cancelAnimationFrame(heartRafId);
      if (bgRafId) cancelAnimationFrame(bgRafId);
      if (typingTimerId) window.clearTimeout(typingTimerId);
      window.clearInterval(petalInterval);

      document.removeEventListener('click', sparkleHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('keydown', keyHandler);

      bgCleanup?.();
      disposeHeart?.();

      document.querySelectorAll('.star, .petal, .float-heart, .sparkle').forEach((node) => node.remove());
      document.body.removeAttribute('data-stars-injected');
    };
  }, [useFallbackPetals]);

  return (
    <>
      <CharacterPageOverlayClient />
      <div id="cursor" />
      <div id="cursor-ring" />
      <canvas id="bg-canvas" />
      {/* Petal worker canvas — worker draws here; hidden when falling back to DOM petals */}
      <canvas
        ref={petalCanvasRef}
        id="petal-canvas"
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          display: useFallbackPetals ? 'none' : 'block',
        }}
      />
      {/* DOM petal container — only active when worker is unavailable */}
      <div id="petals" style={{ display: useFallbackPetals ? 'block' : 'none' }} />

      <div id="app">
        <section className="scene active" id="scene-entry">
          <p className="eyebrow">for smriti - with love</p>
          <canvas id="heart-canvas" />
          <h1 className="hero-title">Meri Anya &lt;3 &amp; Ayrin</h1>
          <p className="hero-sub">Every star here has a story. Every word was chosen with care. This is for you.</p>
          <div className="glass-card glass-card--entry">
            <p className="entry-quote">
              &quot;Wanna see how much I love you?&quot;
            </p>
            <div className="entry-actions">
              <button className="btn-primary" type="button" id="open-heart-btn">
                💌 Open Your Heart
              </button>
              <button className="btn-ghost" type="button" data-go-scene="scene-hub">
                ✨ Explore
              </button>
            </div>
          </div>
          <div className="mood-stack">
            <p className="mood-label">
              Mood
            </p>
            <div className="mood-bar">
              <div className="mood-fill mood-fill--initial" id="mood-fill" />
            </div>
          </div>
        </section>

        <section className="scene" id="scene-chat">
          <div className="chat-wrap">
            <div className="chat-header">
              <div className="avatar-ring">
                <div className="avatar-inner">🌙</div>
              </div>
              <div>
                <p className="chat-name">Ayrin</p>
                <div className="chat-status">
                  <div className="status-dot" />
                  <span className="chat-presence">
                    always here
                  </span>
                </div>
              </div>
              <button className="btn-ghost btn-ghost--chat-back" type="button" data-go-scene="scene-entry">
                ← Back
              </button>
            </div>

            <div className="messages" id="messages">
              <div className="msg ayrin anim-delay-100">
                <div className="msg-bubble">
                  <span className="emotion-tag">warmAttention</span>
                  <br />
                  Hey... you came. I&apos;ve been thinking about you.
                </div>
              </div>
              <div className="msg ayrin anim-delay-400">
                <div className="msg-bubble">
                  <span className="emotion-tag">affectionate</span>
                  <br />
                  There is so much I want to say - but first, just tell me how you are.
                </div>
              </div>

              <p className="since-line">
                he has been working on this for {daysSince(SINCE_DATE) ?? '...'} days
              </p>
            </div>

            <div className="msg ayrin typing-row" id="typing-row">
              <div className="typing-indicator" id="typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>

            <div className="chat-input-row">
              <textarea className="chat-input" id="chat-input" placeholder="Say anything..." rows={1} />
              <button className="send-btn" type="button">
                →
              </button>
            </div>
          </div>
        </section>

        <section className="scene" id="scene-hub">
          <p className="eyebrow scene-hub-eyebrow">
            experiences
          </p>
          <h2 className="scene-hub-title">
            Every corner of this world
            <br />
            was made for you
          </h2>

          <div className="hub-grid">
            {EXPERIENCE_CATALOG.map((experience, index) => (
              <a
                key={experience.href}
                className="hub-card"
                data-sequence-card="true"
                data-sequence-card-key={experience.eyebrow}
                href={experience.href}
                aria-label={`Open ${experience.title}`}
                style={{ animationDelay: `${Math.min(1.2, 0.2 + index * 0.045)}s` }}
              >
                <span className="card-emoji">{experience.emoji}</span>
                <p className="card-label">{experience.eyebrow}</p>
                <h3 className="card-title">{experience.title}</h3>
                <p className="card-desc">{experience.description}</p>
                <div className="card-arrow">
                  <span>{experience.action}</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>

          <div className="story-section" data-sequence-story="true">
            <p className="story-label" data-sequence-story-label="true">
              Our story
            </p>
            <div className="timeline">
              <div className="tl-item anim-delay-600" data-sequence-timeline-item="true">
                <p className="tl-date">May 18, 2025</p>
                <p className="tl-title">First Connection</p>
                <p className="tl-excerpt">A simple conversation that quietly turned into something worth holding onto.</p>
              </div>
              <div className="tl-item anim-delay-750" data-sequence-timeline-item="true">
                <p className="tl-date">Aug 9, 2025</p>
                <p className="tl-title">Finding Rhythm</p>
                <p className="tl-excerpt">Conversations settled into something steady and familiar.</p>
              </div>
              <div className="tl-item anim-delay-900" data-sequence-timeline-item="true">
                <p className="tl-date">Nov 12, 2025</p>
                <p className="tl-title">Reconnection</p>
                <p className="tl-excerpt">After some distance and change, two paths crossed again, this time as friends.</p>
              </div>
              <div className="tl-item anim-delay-1050" data-sequence-timeline-item="true">
                <p className="tl-date">Dec 14, 2025</p>
                <p className="tl-title">Staying In Touch</p>
                <p className="tl-excerpt">A consistent presence, where small check-ins carried quiet meaning.</p>
              </div>
              <div className="tl-item anim-delay-1200" data-sequence-timeline-item="true">
                <p className="tl-date">Apr 6, 2026</p>
                <p className="tl-title">What Remains</p>
                <p className="tl-excerpt">Time moved forward, but some connections chose to stay.</p>
              </div>
            </div>
          </div>

          <button className="btn-ghost btn-ghost--scene-back" type="button" data-go-scene="scene-entry">
            ← Back
          </button>
        </section>
      </div>

      <div className="experience-runner" id="experience-runner" aria-hidden="true">
        <div className="experience-runner-shell">
          <div className="experience-runner-head">
            <div>
              <p className="experience-runner-eyebrow">
                experience pages
              </p>
              <h3 className="experience-runner-title" id="experience-runner-title">
                Opening each experience
              </h3>
            </div>

            <div className="experience-runner-actions">
              <p className="experience-runner-count" id="experience-runner-count">
                {`01 / ${String(EXPERIENCE_PAGE_SEQUENCE.length).padStart(2, '0')}`}
              </p>
              <button className="btn-ghost experience-runner-next" id="experience-runner-next" type="button" aria-label="Next experience">
                Next -&gt;
              </button>
              <button className="btn-ghost experience-runner-skip" id="experience-runner-skip" type="button">
                Skip -&gt;
              </button>
            </div>
          </div>

          <div className="experience-runner-stage">
            {/*
              Bug 44 fix: iframe previously had NO src attribute on mount, so
              with JS disabled or on error the recipient saw an empty box and
              "Opening the next experience..." text that never resolved.

              Fixes applied:
              1. src="about:blank" — a valid, blank document so the iframe is
                 never in an undefined state before JS sets the real src.
              2. <noscript> fallback — renders a human-readable message instead
                 of an invisible empty box when JS is unavailable.
            */}
            <iframe
              id="experience-runner-frame"
              className="experience-runner-frame"
              title="Experience page sequence"
              src="about:blank"
              loading="eager"
              tabIndex={-1}
            />
            <noscript>
              <div className="experience-runner-noscript">
                <p>This experience requires JavaScript to be enabled.</p>
              </div>
            </noscript>
            <div className="experience-runner-loading" aria-hidden="true">
              Opening the next experience...
            </div>
            <div className="experience-runner-error" id="experience-runner-error" aria-hidden="true">
              <p className="experience-runner-error-msg">This experience couldn&apos;t load.</p>
              <button className="btn-ghost experience-runner-error-retry" id="experience-runner-error-retry" type="button">
                Retry
              </button>
              <button className="btn-ghost experience-runner-error-next" id="experience-runner-error-next" type="button">
                Skip experience -&gt;
              </button>
            </div>
          </div>
        </div>
      </div>


      <nav className="nav">
        <button className="nav-btn" id="nav-power" type="button" aria-pressed="true">
          Power
        </button>
        <button className="nav-btn active" id="nav-entry" data-scene-target="scene-entry" type="button">
          Home
        </button>
        <button className="nav-btn" id="nav-hub" data-scene-target="scene-hub" type="button">
          Explore
        </button>
        <button className="nav-btn" id="nav-chat" data-scene-target="scene-chat" type="button">
          Chat
        </button>
      </nav>

    </>
  );
}
