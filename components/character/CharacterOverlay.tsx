 'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';

const CharacterModel = dynamic(
  () => import('@/components/character/CharacterModel').then((m) => m.CharacterModel),
  { ssr: false, loading: () => null },
);
import {
  type CharacterAnchor,
  type CharacterVariant,
} from '@/components/character/characterConfig';
import { useCharacterState } from '@/components/character/useCharacterState';
import { useGLTF } from '@react-three/drei/core/Gltf';

interface CharacterOverlayProps {
  screenId?: number | null;
}

type ModelAvailability = Partial<Record<CharacterVariant, boolean>>;

async function checkModelAvailability(url: string): Promise<boolean> {
  try {
    const headResponse = await fetch(url, { method: 'HEAD' });
    if (headResponse.ok) {
      return true;
    }

    if (headResponse.status !== 405) {
      return false;
    }

    const getResponse = await fetch(url, { cache: 'force-cache' });
    return getResponse.ok;
  } catch {
    return false;
  }
}

function resolveOverlaySideStyle(anchor: CharacterAnchor) {
  return anchor === 'right'
    ? { right: 'max(1rem, 4vw)' }
    : { left: 'max(1rem, 4vw)' };
}

function CharacterAura({
  anchor,
  glow,
  rim,
  shadow,
}: {
  anchor: CharacterAnchor;
  glow: string;
  rim: string;
  shadow: string;
}) {
  const sideStyle = resolveOverlaySideStyle(anchor);

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden" aria-hidden="true">
      <div
        className="absolute bottom-[-6vh] h-[48vh] w-[min(38vw,24rem)] rounded-full blur-3xl"
        style={{
          ...sideStyle,
          background: glow,
          opacity: 0.72,
        }}
      />
      <div
        className="absolute bottom-[3vh] h-[34vh] w-[min(22vw,14rem)] rounded-full border blur-[1px]"
        style={{
          ...sideStyle,
          transform: anchor === 'right' ? 'translateX(-18%)' : 'translateX(18%)',
          borderColor: rim,
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01))',
          boxShadow: `0 32px 80px ${shadow}`,
          opacity: 0.46,
        }}
      />
    </div>
  );
}

export function CharacterOverlay({ screenId }: CharacterOverlayProps) {
  const config = useCharacterState(screenId);
  const [availability, setAvailability] = useState<ModelAvailability>({});

  useEffect(() => {
    if (!config || availability[config.variant] !== undefined) {
      return;
    }

    let cancelled = false;

    void checkModelAvailability(config.url).then(async (isAvailable) => {
      if (cancelled) {
        return;
      }

      setAvailability((current) => ({
        ...current,
        [config.variant]: isAvailable,
      }));

        if (isAvailable) {
          // Prefetch the GLTF asset into the browser cache without importing drei's Gltf module.
          try {
            await fetch(config.url, { cache: 'force-cache' });
          } catch (e) {
            // ignore prefetch failures
          }
        }
    });

    return () => {
      cancelled = true;
    };
  }, [availability, config]);

  if (!config) {
    return null;
  }

  const hasModel = availability[config.variant] === true;

  if (!hasModel) {
    return (
      <CharacterAura
        anchor={config.anchor}
        glow={config.glow}
        rim={config.rim}
        shadow={config.shadow}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[6]" aria-hidden="true">
      <CharacterAura
        anchor={config.anchor}
        glow={config.glow}
        rim={config.rim}
        shadow={config.shadow}
      />
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1.45, 3.2], fov: 28 }}
      >
        <ambientLight intensity={1.18} />
        <directionalLight position={[2.6, 4.4, 5.2]} intensity={2.1} />
        <directionalLight position={[-2.4, 1.8, 2.6]} intensity={0.85} />
        <hemisphereLight intensity={0.48} color="#fff2eb" groundColor="#160d12" />
        <Suspense fallback={null}>
          <CharacterModel config={config} />
        </Suspense>
      </Canvas>
    </div>
  );
}
