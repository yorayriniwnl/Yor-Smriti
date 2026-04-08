"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  title?: string;
  subtitle?: string;
  author?: string;
  imageUrl?: string;
  accent?: string;
  width?: number;
  height?: number;
};

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;

function getCssVar(name: string, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
  } catch (e) {
    return fallback;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line.trim(), x, curY);
  return curY;
}

export default function ShareCard({
  title = "I'm Sorry — A private experience",
  subtitle = 'A gentle, guided apology template',
  author = '',
  imageUrl,
  accent,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const draw = useCallback(async () => {
    setLoading(true);
    const w = width;
    const h = height;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accentColor = (accent || getCssVar('--accent', '#f75590')).trim();

    ctx.clearRect(0, 0, w, h);

    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#fff8fb');
    bgGrad.addColorStop(1, '#fdf8f0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const overlay = ctx.createLinearGradient(0, 0, w, h);
    overlay.addColorStop(0, accentColor);
    overlay.addColorStop(1, 'rgba(255,255,255,0.02)');
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;

    const padding = Math.round(w * 0.06);
    const textMax = w - padding * 2 - 220;

    ctx.fillStyle = '#2d1520';
    ctx.textAlign = 'left';

    ctx.font = `700 ${Math.round(w / 18)}px Cormorant Garamond, serif`;
    ctx.lineWidth = 1.2;
    const titleYStart = Math.round(h * 0.36);
    const lastY = wrapText(ctx, title, padding, titleYStart, textMax, Math.round(w / 22));

    ctx.font = `400 ${Math.round(w / 36)}px Crimson Pro, serif`;
    ctx.fillStyle = 'rgba(45,21,32,0.9)';
    ctx.fillText(subtitle, padding, lastY + Math.round(w / 40));

    ctx.font = `400 ${Math.round(w / 54)}px ${getCssVar('--font-dm-mono', 'DM Mono')}`;
    ctx.fillStyle = 'rgba(45,21,32,0.6)';
    const footerY = h - padding - 20;
    const siteLabel = author || "I'm Sorry";
    ctx.fillText(siteLabel, padding, footerY);

    if (imageUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = imageUrl as string;
        });
        const avatarSize = 160;
        const ax = w - padding - avatarSize;
        const ay = padding;
        ctx.save();
        ctx.beginPath();
        ctx.arc(ax + avatarSize / 2, ay + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, ax, ay, avatarSize, avatarSize);
        ctx.restore();
      } catch (e) {
      }
    }

    const dataUrl = canvas.toDataURL('image/png');
    setPreviewUrl(dataUrl);
    setLoading(false);
  }, [title, subtitle, author, imageUrl, accent, width, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  const onDownload = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = 'im-sorry-share.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [previewUrl]);

  const onCopyImage = useCallback(async () => {
    if (!previewUrl || !navigator.clipboard) return;
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      // @ts-ignore - ClipboardItem may not be in lib
      await (navigator.clipboard as any).write([new ClipboardItem({ [blob.type]: blob })]);
    } catch (e) {
      console.warn('copy failed', e);
    }
  }, [previewUrl]);

  const onCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (e) {}
  }, []);

  return (
    <div className="share-card p-6 max-w-4xl mx-auto">
      <div className="share-card-preview mb-4">
        {previewUrl ? (
          <img
            alt="Share preview"
            src={previewUrl}
            width={Math.round(DEFAULT_WIDTH / 2)}
            height={Math.round(DEFAULT_HEIGHT / 2)}
            className="rounded-md shadow-lg"
          />
        ) : (
          <div className="w-[600px] h-[315px] bg-[#fff8fb] rounded-md animate-pulse" />
        )}
      </div>

      <div className="share-card-controls flex gap-3">
        <button className="btn-ghost" onClick={draw} aria-disabled={loading}>
          Regenerate
        </button>
        <button className="btn-ghost" onClick={onDownload} disabled={!previewUrl}>
          Download PNG
        </button>
        <button className="btn-ghost" onClick={onCopyImage} disabled={!previewUrl}>
          Copy Image
        </button>
        <button className="btn-ghost" onClick={onCopyLink}>
          Copy Link
        </button>
        <a
          className="btn-ghost"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`}
          target="_blank"
          rel="noreferrer"
        >
          Share to Twitter
        </a>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
