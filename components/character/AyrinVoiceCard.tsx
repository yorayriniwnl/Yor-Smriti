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
  // Called when the user explicitly dismisses the error card. This resets phase
  // to 'idle' so the component is not permanently stuck when recognition is
  // unsupported or fetch errors repeat.
  onDismissError: () => void;
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
  onDismissError,
  voiceButtonLabel,
  voiceButtonDisabled,
  voiceCardTone,
}: Props) {
  const isError = voicePhase === 'error';

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
        role={isError ? 'alert' : undefined}
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

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {/* Dismiss button — only shown in error phase so the user is never stuck.
            Covers two cases: (1) recognition unsupported (clicking Talk just re-fires
            the error), and (2) repeated fetch failures with no recovery path. */}
        {isError && (
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error"
            style={{
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(244, 237, 231, 0.78)',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.16)',
              cursor: 'pointer',
            }}
          >
            Dismiss
          </button>
        )}

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
    </div>
  );
}
