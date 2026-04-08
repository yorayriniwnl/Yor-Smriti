"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import ParticleRainFX from '@/components/hero/ParticleRainFX';

function Scene({ fxEnabled = true }: { fxEnabled?: boolean }) {
  const meshRef = useRef<any>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // simple camera fly-in over ~2.6s
    const duration = 2.6;
    const progress = Math.min(1, t / duration);
    const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // easeInOut

    const startZ = 8;
    const endZ = 4.2;
    state.camera.position.z = startZ - (startZ - endZ) * eased;
    state.camera.position.y = 1.25 - 0.25 * eased;
    state.camera.lookAt(0, 1, 0);

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.24 * delta;
      meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
      meshRef.current.position.y = 0.8 + Math.sin(t * 0.8) * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.92} />
      <directionalLight position={[3, 5, 2]} intensity={0.78} />
      <directionalLight position={[-4, -2, -3]} intensity={0.28} />

      {fxEnabled && <ParticleRainFX enabled={fxEnabled} />}

      <mesh ref={meshRef} position={[0, 0.8, 0]}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#ff7fb0"
          metalness={0.25}
          roughness={0.42}
          emissive="#2b0710"
          emissiveIntensity={0.12}
        />
      </mesh>

      <Html position={[0, 2.1, 0]} center>
        <div
          className="pointer-events-none select-none"
          style={{
            color: 'rgba(255,236,246,0.98)',
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1.02rem',
            textAlign: 'center',
            textShadow: '0 12px 34px rgba(6,0,8,0.6)',
          }}
        >
          Private cinematic apology experiences
        </div>
      </Html>
    </>
  );
}

export function CinematicHero() {
  const [fxEnabled, setFxEnabled] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem('fx.rain.enabled');
      if (v !== null) setFxEnabled(v === '1');
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('fx.rain.enabled', fxEnabled ? '1' : '0');
    } catch (e) {
      /* ignore */
    }
  }, [fxEnabled]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }} camera={{ position: [0, 1.25, 8], fov: 40 }} style={{ width: '100%', height: '100%' }}>
        <Scene fxEnabled={fxEnabled} />
      </Canvas>

      <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 6 }}>
        <button
          type="button"
          onClick={() => setFxEnabled((s) => !s)}
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.08)',
            background: fxEnabled ? 'linear-gradient(90deg,#ff9ecb,#f65a8d)' : 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: fxEnabled ? '0 10px 26px rgba(246,90,141,0.14)' : 'none',
          }}
        >
          {fxEnabled ? 'FX: On' : 'FX: Off'}
        </button>
      </div>
    </div>
  );
}
