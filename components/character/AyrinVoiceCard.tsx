'use client';

import React from 'react';
import RippleButton from '@/components/ui/RippleButton';

interface Props {
  voicePhase: string;
  voiceCaption?: string | null;
  voiceTranscript?: string | null;
  voiceReply?: string | null;
  voiceErrorMessage?: string | null;
  recognitionSupported?: boolean;
  speechOutputSupported?: boolean;
  onVoiceButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  voiceButtonLabel: string;
  voiceButtonDisabled: boolean;
  voiceCardTone: string;
}

export function AyrinVoiceCard({
  voicePhase,
  voiceCaption,
  voiceTranscript,
  voiceReply,
  voiceErrorMessage,
  recognitionSupported = true,
  speechOutputSupported = true,
  onVoiceButtonClick,
  voiceButtonLabel,
  voiceButtonDisabled,
  voiceCardTone,
}: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        right: '12px',
        bottom: '14px',
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
        maxWidth: 'min(240px, 82%)',
        pointerEvents: 'auto',
      }}
    >
      <div
        aria-live="polite"
        style={{
          padding: '10px 12px',
          borderRadius: '16px',
          background: voiceCardTone,
          color: '#F4EDE7',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
          backdropFilter: 'blur(12px)',
          fontSize: '11px',
          lineHeight: 1.45,
          textAlign: 'right',
        }}
      >
        <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.72 }}>
          {voicePhase === 'idle' ? 'Voice Fusion' : voicePhase}
        </div>
        <div style={{ marginTop: '4px' }}>{voiceErrorMessage || voiceCaption}</div>
        {(voiceTranscript || voiceReply) && !voiceErrorMessage ? (
          <div style={{ marginTop: '5px', opacity: 0.72 }}>
            {voicePhase === 'speaking' && voiceReply ? `Reply: ${voiceReply}` : voiceTranscript ? `Heard: ${voiceTranscript}` : null}
          </div>
        ) : null}
        {!recognitionSupported || !speechOutputSupported ? (
          <div style={{ marginTop: '5px', opacity: 0.66 }}>
            {!recognitionSupported ? 'Mic input unavailable.' : 'Voice output unavailable.'}
          </div>
        ) : null}
      </div>

      <RippleButton
        type="button"
        onClick={onVoiceButtonClick}
        disabled={voiceButtonDisabled}
        aria-pressed={voicePhase === 'listening' || voicePhase === 'speaking'}
        className={
          `px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] ${
            voicePhase === 'listening'
              ? 'bg-[linear-gradient(135deg,#2563eb,#38bdf8)]'
              : voicePhase === 'speaking'
              ? 'bg-[linear-gradient(135deg,#7c3aed,#ec4899)]'
              : 'bg-[linear-gradient(135deg,#1f1630,#4b2f60)]'
          }`
        }
      >
        {voiceButtonLabel}
      </RippleButton>
    </div>
  );
}
