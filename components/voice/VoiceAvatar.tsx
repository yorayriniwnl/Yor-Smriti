"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function VoiceAvatar({ defaultText }: { defaultText?: string }) {
  const [text, setText] = useState(defaultText ?? "Hello, I'm Ayrin. I'm here to help.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const rafRef = useRef<number | null>(null);
  const pulseRef = useRef(0);
  const phaseRef = useRef(Math.random() * 1000);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      // decay pulse
      pulseRef.current *= Math.pow(0.6, dt * 30);
      const base = isSpeaking ? 0.18 : 0.02;
      const jitter = Math.abs(Math.sin(t * 0.008 + phaseRef.current)) * 0.18;
      const open = Math.min(1, Math.max(0, base + jitter * 0.9 + pulseRef.current));
      setMouthOpen(open);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isSpeaking]);

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('SpeechSynthesis not supported in this browser.');
      return;
    }

    const utter = new SpeechSynthesisUtterance(text.trim() || '...');
    utter.rate = 0.95;
    utter.pitch = 1.0;
    utter.volume = 1;

    utter.onstart = () => {
      setIsSpeaking(true);
      pulseRef.current = 0.6;
    };

    utter.onboundary = () => {
      pulseRef.current = Math.max(pulseRef.current, 0.9);
    };

    utter.onerror = () => {
      setIsSpeaking(false);
      pulseRef.current = 0;
    };

    utter.onend = () => {
      setIsSpeaking(false);
      pulseRef.current = 0;
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    pulseRef.current = 0;
  };

  return (
    <div className="voice-avatar flex items-center gap-4 justify-center mt-6 pointer-events-auto">
      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-300 to-pink-500 flex items-center justify-center shadow-lg" aria-hidden>
        <svg viewBox="0 0 120 120" width="80" height="80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar">
          <defs>
            <clipPath id="face-clip"><circle cx="60" cy="60" r="56" /></clipPath>
          </defs>
          <g clipPath="url(#face-clip)">
            <rect x="0" y="0" width="120" height="120" fill="rgba(255,245,250,0.12)" />
            <circle cx="60" cy="46" r="22" fill="#fff7f9" />
            <circle cx="44" cy="42" r="4" fill="#1f1f1f" />
            <circle cx="76" cy="42" r="4" fill="#1f1f1f" />
            {/* mouth */}
            <ellipse cx="60" cy="68" rx="18" ry={6 + mouthOpen * 12} fill="#2b0f1a" opacity={0.98} />
            <ellipse cx="60" cy={70 + mouthOpen * 2} rx="10" ry={2 + mouthOpen * 6} fill="#ffe2ec" opacity={isSpeaking?0.9:0.6} />
          </g>
        </svg>
      </div>

      <div className="flex-1 min-w-[220px] max-w-xl">
        <textarea
          aria-label="Text to speak"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md p-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-sm text-white"
          rows={2}
        />

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={speak}
            disabled={isSpeaking}
            className="px-3 py-1 rounded-md bg-gradient-to-r from-pink-500 to-pink-400 text-white text-xs"
          >
            Speak
          </button>
          <button
            type="button"
            onClick={stop}
            disabled={!isSpeaking}
            className="px-3 py-1 rounded-md bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-white text-xs"
          >
            Stop
          </button>
          <div className="ml-auto text-xs text-[rgba(255,255,255,0.66)]">{isSpeaking ? 'Speaking…' : 'Ready'}</div>
        </div>
      </div>
    </div>
  );
}
