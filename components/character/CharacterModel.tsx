'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import type { CharacterSceneConfig } from '@/components/character/characterConfig';

interface CharacterModelProps {
  config: CharacterSceneConfig;
}

export function CharacterModel({ config }: CharacterModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(config.url);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    clonedScene.traverse((child) => {
      child.frustumCulled = false;
    });
  }, [clonedScene]);

  useEffect(() => {
    const idleAction = actions?.idle ?? (names[0] ? actions?.[names[0]] : undefined);
    if (!idleAction) {
      return;
    }

    idleAction.reset().fadeIn(0.25).play();

    return () => {
      idleAction.fadeOut(0.18);
    };
  }, [actions, names]);

  useFrame((state) => {
    if (!group.current) {
      return;
    }

    const bobOffset = Math.sin(state.clock.elapsedTime * config.bobSpeed) * config.bobAmplitude;
    const swayOffset = Math.sin(state.clock.elapsedTime * config.swaySpeed) * config.swayAmplitude;

    group.current.position.set(
      config.position[0],
      config.position[1] + bobOffset,
      config.position[2],
    );
    group.current.scale.setScalar(config.scale);
    group.current.rotation.y = config.rotationY + swayOffset;
  });

  return <primitive ref={group} object={clonedScene} />;
}

