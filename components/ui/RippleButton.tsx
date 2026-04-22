"use client";

import React, { useRef } from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function RippleButton({ children, className = '', loading = false, onPointerDown, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (e) => {
    try {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
      const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

      const span = document.createElement('span');
      span.className = 'ripple-effect';
      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      el.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    } catch {
      // ignore
    }

    onPointerDown?.(e);
  };

  return (
    <button
      ref={ref}
      onPointerDown={handlePointerDown}
      className={`ripple inline-flex items-center justify-center gap-2 ${className} ${loading ? 'btn-loading' : ''}`}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden /> : null}
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>{children}</span>
    </button>
  );
}
