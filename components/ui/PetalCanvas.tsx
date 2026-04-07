'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { StageId } from '@/types';

// ─── Particle Canvas ─────────────────────────────────────────────────────────

type ParticleMode = 'petals' | 'hearts' | 'mixed' | 'finale';
type ParticleKind = 'petal' | 'heart' | 'confetti' | 'bubble';

interface PetalCanvasProps {
  stage: StageId;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  swayOffset: number;
  swaySpeed: number;
  life: number;
  maxLife: number;
  kind: ParticleKind;
  color: string;
  rising: boolean;
}

const PETAL_COLORS = ['#ffd6e7', '#ffb3cf', '#ffcce0', '#f9c0d0', '#ff85b3'];
const HEART_COLORS = ['#f75590', '#ff85b3', '#e03070', '#ff6b9d', '#ffb3cf'];
const BUBBLE_COLORS = ['#ffe6f0', '#ffd6e7', '#ffdbe8', '#fff4fa'];
const QUANTITY_MULTIPLIER = 10;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function modeFromStage(stage: StageId): ParticleMode {
  if (stage === 'ending') return 'finale';
  if (stage === 'hold') return 'hearts';
  if (stage === 'opening' || stage === 'chat' || stage === 'transition') return 'petals';
  return 'mixed';
}

function spawnPetal(width: number): Particle {
  return {
    x: randomBetween(-20, width + 20),
    y: randomBetween(-60, -20),
    vx: randomBetween(-0.45, 0.45),
    vy: randomBetween(0.9, 2.1),
    size: randomBetween(8, 18),
    opacity: randomBetween(0.4, 0.78),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-1.5, 1.5),
    swayOffset: randomBetween(0, Math.PI * 2),
    swaySpeed: randomBetween(0.35, 0.95),
    life: randomBetween(7000, 14000),
    maxLife: 14000,
    kind: 'petal',
    color: randomFrom(PETAL_COLORS),
    rising: false,
  };
}

function spawnHeart(width: number, height: number): Particle {
  return {
    x: randomBetween(40, width - 40),
    y: height + 24,
    vx: randomBetween(-0.25, 0.25),
    vy: randomBetween(-1.35, -0.6),
    size: randomBetween(10, 22),
    opacity: randomBetween(0.35, 0.75),
    rotation: randomBetween(-8, 8),
    rotationSpeed: randomBetween(-0.5, 0.5),
    swayOffset: randomBetween(0, Math.PI * 2),
    swaySpeed: randomBetween(0.3, 0.7),
    life: randomBetween(4200, 9000),
    maxLife: 9000,
    kind: 'heart',
    color: randomFrom(HEART_COLORS),
    rising: true,
  };
}

function spawnBubble(width: number, height: number): Particle {
  return {
    x: randomBetween(20, width - 20),
    y: height + randomBetween(10, 50),
    vx: randomBetween(-0.15, 0.15),
    vy: randomBetween(-1.0, -0.45),
    size: randomBetween(8, 20),
    opacity: randomBetween(0.22, 0.48),
    rotation: 0,
    rotationSpeed: randomBetween(-0.3, 0.3),
    swayOffset: randomBetween(0, Math.PI * 2),
    swaySpeed: randomBetween(0.18, 0.5),
    life: randomBetween(5000, 11000),
    maxLife: 11000,
    kind: 'bubble',
    color: randomFrom(BUBBLE_COLORS),
    rising: true,
  };
}

function spawnConfetti(width: number): Particle {
  const roll = Math.random();
  const kind: ParticleKind = roll < 0.24 ? 'heart' : roll < 0.34 ? 'bubble' : 'confetti';
  return {
    x: randomBetween(0, width),
    y: randomBetween(-60, -10),
    vx: randomBetween(-1.8, 1.8),
    vy: randomBetween(2.1, 4.2),
    size: randomBetween(6, 12),
    opacity: randomBetween(0.62, 1),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-5, 5),
    swayOffset: randomBetween(0, Math.PI * 2),
    swaySpeed: randomBetween(0.15, 0.55),
    life: randomBetween(2500, 6200),
    maxLife: 6200,
    kind,
    color:
      kind === 'heart'
        ? randomFrom(HEART_COLORS)
        : kind === 'bubble'
        ? randomFrom(BUBBLE_COLORS)
        : randomFrom([...PETAL_COLORS, ...HEART_COLORS]),
    rising: kind === 'bubble',
  };
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number
) {
  const s = size * 0.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.4);
  ctx.bezierCurveTo(x, y - s * 0.1, x - s, y - s * 0.1, x - s, y + s * 0.4);
  ctx.bezierCurveTo(x - s, y + s * 0.9, x, y + s * 1.4, x, y + s * 1.4);
  ctx.bezierCurveTo(x, y + s * 1.4, x + s, y + s * 0.9, x + s, y + s * 0.4);
  ctx.bezierCurveTo(x + s, y - s * 0.1, x, y - s * 0.1, x, y + s * 0.4);
  ctx.fill();
  ctx.restore();
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number,
  color: string,
  alpha: number
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number
) {
  const radius = size * 0.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.lineWidth = 1.2;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tiny highlight for a glassy bubble look
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.arc(x - radius * 0.25, y - radius * 0.3, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function PetalCanvas({ stage }: PetalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnRef = useRef<number | null>(null);

  const mode = useMemo(() => modeFromStage(stage), [stage]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const spawnParticle = useCallback((width: number, height: number): Particle => {
    if (mode === 'petals') {
      const roll = Math.random();
      if (roll < 0.72) return spawnPetal(width);
      if (roll < 0.9) return spawnBubble(width, height);
      return spawnHeart(width, height);
    }

    if (mode === 'hearts') {
      return Math.random() < 0.66 ? spawnHeart(width, height) : spawnBubble(width, height);
    }

    if (mode === 'finale') return spawnConfetti(width);

    const mixedRoll = Math.random();
    if (mixedRoll < 0.46) return spawnPetal(width);
    if (mixedRoll < 0.76) return spawnHeart(width, height);
    return spawnBubble(width, height);
  }, [mode]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    const lifeRatio = Math.max(0, particle.life / particle.maxLife);
    const alpha = particle.opacity * lifeRatio;

    if (particle.kind === 'heart') {
      drawHeart(ctx, particle.x, particle.y, particle.size, particle.color, alpha);
      return;
    }

    if (particle.kind === 'bubble') {
      drawBubble(ctx, particle.x, particle.y, particle.size, particle.color, alpha);
      return;
    }

    if (particle.kind === 'confetti') {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size / 1.8);
      ctx.restore();
      return;
    }

    drawPetal(
      ctx,
      particle.x,
      particle.y,
      particle.size,
      particle.size * 0.62,
      particle.rotation,
      particle.color,
      alpha
    );
  }, []);

  const tick = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((particle) => {
      const sway = Math.sin(timestamp * 0.001 * particle.swaySpeed + particle.swayOffset) * 0.45;
      particle.x += (particle.vx + sway) * dt * 60;
      particle.y += particle.vy * dt * 60;
      particle.rotation += particle.rotationSpeed * dt * 60;
      particle.life -= dt * 1000;

      if (particle.x < -40) particle.x = canvas.width + 40;
      if (particle.x > canvas.width + 40) particle.x = -40;

      const alive = particle.life > 0 && (particle.rising ? particle.y > -70 : particle.y < canvas.height + 70);

      if (alive) drawParticle(ctx, particle);
      return alive;
    });

    frameRef.current = requestAnimationFrame(tick);
  }, [drawParticle]);

  const startSpawner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const maxCount = (mode === 'finale' ? 110 : 56) * QUANTITY_MULTIPLIER;
    const baseRate = mode === 'finale' ? 70 : 190;
    const spawnBatch = QUANTITY_MULTIPLIER;

    const spawnLoop = () => {
      const activeCanvas = canvasRef.current;
      if (!activeCanvas) return;

      let created = 0;
      while (particlesRef.current.length < maxCount && created < spawnBatch) {
        particlesRef.current.push(spawnParticle(activeCanvas.width, activeCanvas.height));
        created += 1;
      }

      spawnRef.current = window.setTimeout(spawnLoop, baseRate + Math.random() * 220) as unknown as number;
    };

    spawnLoop();
  }, [mode, spawnParticle]);

  useEffect(() => {
    particlesRef.current = [];
    if (spawnRef.current) {
      clearTimeout(spawnRef.current);
      spawnRef.current = null;
    }
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    resize();
    window.addEventListener('resize', resize);

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(tick);
    startSpawner();

    return () => {
      window.removeEventListener('resize', resize);
      if (spawnRef.current) {
        clearTimeout(spawnRef.current);
        spawnRef.current = null;
      }
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [mode, resize, startSpawner, tick]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ opacity: mode === 'finale' ? 0.98 : 0.88 }}
    />
  );
}
