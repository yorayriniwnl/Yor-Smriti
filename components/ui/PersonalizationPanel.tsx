"use client";

import React from 'react';
import RippleButton from '@/components/ui/RippleButton';
import { usePersonalization } from './PersonalizationProvider';

const TONES = ['calm', 'affectionate', 'serious', 'energetic', 'thoughtful'] as const;

export default function PersonalizationPanel() {
  const { name, setName, tone, setTone } = usePersonalization();

  return (
    <div className="personalization-panel mb-8 w-full max-w-2xl mx-auto p-4 rounded-lg border" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))', borderColor: 'rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-4">
        <label className="flex-1">
          <div className="text-xs font-mono text-pink-200 uppercase">Your name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name to personalize"
            className="mt-2 w-full rounded-md p-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] text-white"
          />
        </label>

        <label style={{ minWidth: 140 }}>
          <div className="text-xs font-mono text-pink-200 uppercase">Tone</div>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="mt-2 rounded-md p-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] text-white w-full"
          >
            {TONES.map((t) => (
              <option key={t} value={t} className="text-black">
                {t}
              </option>
            ))}
          </select>
        </label>

        <div>
          <RippleButton onClick={() => alert(`Personalization saved: ${name || '(anonymous)'} — ${tone}`)} className="px-3 py-2">
            Save
          </RippleButton>
        </div>
      </div>

      <div className="mt-2 text-xs text-[rgba(255,255,255,0.6)]">Personalization affects greetings and voice tone across the app.</div>
    </div>
  );
}
