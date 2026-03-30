'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { StageId } from '@/types';

// ─── Particle Canvas ─────────────────────────────────────────────────────────

type ParticleMode = 'petals' | 'hearts' | 'mixed' | 'finale';
type ParticleKind = 'petal' | 'heart' | 'confetti';

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

function spawnConfetti(width: number): Particle {
  const isHeart = Math.random() < 0.35;
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
    kind: isHeart ? 'heart' : 'confetti',
    color: isHeart ? randomFrom(HEART_COLORS) : randomFrom([...PETAL_COLORS, ...HEART_COLORS]),
    rising: false,
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

export function PetalCanvas({ stage }: PetalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnRef = useRef<number>(0);

  const mode = useMemo(() => modeFromStage(stage), [stage]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  const spawnParticle = useCallback((width: number, height: number): Particle => {
    if (mode === 'petals') return spawnPetal(width);
    if (mode === 'hearts') return spawnHeart(width, height);
    if (mode === 'finale') return spawnConfetti(width);
    return Math.random() < 0.64 ? spawnPetal(width) : spawnHeart(width, height);
  }, [mode]);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    const lifeRatio = Math.max(0, particle.life / particle.maxLife);
    const alpha = particle.opacity * lifeRatio;

    if (particle.kind === 'heart') {
      drawHeart(ctx, particle.x, particle.y, particle.size, particle.color, alpha);
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

    const maxCount = mode === 'finale' ? 72 : 34;
    const baseRate = mode === 'finale' ? 90 : 330;

    const spawnLoop = () => {
      const activeCanvas = canvasRef.current;
      if (!activeCanvas) return;

      if (particlesRef.current.length < maxCount) {
        particlesRef.current.push(spawnParticle(activeCanvas.width, activeCanvas.height));
      }

      spawnRef.current = window.setTimeout(spawnLoop, baseRate + Math.random() * 220);
    };

    spawnLoop();
  }, [mode, spawnParticle]);

  useEffect(() => {
    particlesRef.current = [];
    clearTimeout(spawnRef.current);
    cancelAnimationFrame(frameRef.current);

    resize();
    window.addEventListener('resize', resize);

    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(tick);
    startSpawner();

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(spawnRef.current);
      cancelAnimationFrame(frameRef.current);
    };
  }, [mode, resize, startSpawner, tick]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ opacity: mode === 'finale' ? 0.95 : 0.78 }}
    />
  );
}
