"use client";

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei/core/useAnimations';
import * as THREE from 'three';
import type { CharacterSceneConfig } from '@/components/character/characterConfig';

interface CharacterModelProps {
  config: CharacterSceneConfig;
}

export function CharacterModel({ config }: CharacterModelProps) {
  const group = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<any | null>(null);
  const [clonedScene, setClonedScene] = useState<THREE.Object3D | null>(null);
  const [animations, setAnimations] = useState<any[]>([]);
  const { actions, names } = useAnimations(animations, group as any);

  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child: any) => {
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

  // Load GLTF via three's examples GLTFLoader dynamically and cache it.
  const gltfCache: Map<string, Promise<any>> = (globalThis as any).__yor_gltf_cache ||= new Map();

  useEffect(() => {
    let cancelled = false;

    if (!config.url) {
      setGltf(null);
      setAnimations([]);
      return;
    }

    let loadPromise = gltfCache.get(config.url);
    if (!loadPromise) {
      loadPromise = (async () => {
        // Dynamically load GLTFLoader from three examples
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
        const loader = new GLTFLoader();
        const gltfResult = await loader.loadAsync(config.url);
        return gltfResult;
      })();
      gltfCache.set(config.url, loadPromise);
    }

    loadPromise.then((gltfResult) => {
      if (cancelled) return;
      setGltf(gltfResult);
      setAnimations(gltfResult?.animations ?? []);
    }).catch(() => {
      if (cancelled) return;
      setGltf(null);
      setAnimations([]);
    });

    return () => { cancelled = true; };
  }, [config.url]);

  // Clone the loaded scene using three/examples SkeletonUtils at runtime to avoid
  // bundling the entire `three-stdlib` package.
  useEffect(() => {
    let cancelled = false;
    const scene = gltf?.scene ?? null;
    if (!scene) {
      setClonedScene(null);
      return;
    }

    (async () => {
      try {
        const skeletonUtilsModule = await import('three/examples/jsm/utils/SkeletonUtils');
        const SkeletonUtils = (skeletonUtilsModule as any).SkeletonUtils ?? (skeletonUtilsModule as any).default ?? skeletonUtilsModule;
        const cloned = SkeletonUtils.clone(scene as any);
        if (!cancelled) setClonedScene(cloned as any);
      } catch (e) {
        if (!cancelled) setClonedScene(scene as any);
      }
    })();

    return () => { cancelled = true; };
  }, [gltf]);

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

  return clonedScene ? <primitive ref={group} object={clonedScene} /> : null;
}

