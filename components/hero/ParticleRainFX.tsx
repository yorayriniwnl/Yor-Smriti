"use client";

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  enabled?: boolean;
  particleCount?: number;
  rainCount?: number;
  areaWidth?: number;
  areaDepth?: number;
  areaHeight?: number;
}

export default function ParticleRainFX({
  enabled = true,
  particleCount = 420,
  rainCount = 120,
  areaWidth = 8,
  areaDepth = 6,
  areaHeight = 5,
}: Props) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const rainRef = useRef<THREE.InstancedMesh | null>(null);

  // particle positions + vertical speeds
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3 + 0] = (Math.random() * 2 - 1) * areaWidth;
      arr[i * 3 + 1] = Math.random() * areaHeight - areaHeight / 2;
      arr[i * 3 + 2] = (Math.random() * 2 - 1) * areaDepth;
    }
    return arr;
  }, [particleCount, areaWidth, areaDepth, areaHeight]);

  const speeds = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) s[i] = 0.2 + Math.random() * 0.9;
    return s;
  }, [particleCount]);

  // rain instance data
  const rainData = useMemo(() => {
    const arr: { x: number; y: number; z: number; speed: number; len: number; tilt: number }[] = [];
    for (let i = 0; i < rainCount; i++) {
      arr.push({
        x: (Math.random() * 2 - 1) * areaWidth,
        y: Math.random() * areaHeight - areaHeight / 2,
        z: (Math.random() * 2 - 1) * areaDepth,
        speed: 1.2 + Math.random() * 1.6,
        len: 0.6 + Math.random() * 0.9,
        tilt: -0.2 + Math.random() * 0.4,
      });
    }
    return arr;
  }, [rainCount, areaWidth, areaDepth, areaHeight]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!enabled) return;

    // update ambient particles
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry as THREE.BufferGeometry;
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        let y = arr[i * 3 + 1];
        y -= speeds[i] * delta * 1.6;
        if (y < -areaHeight / 2) y += areaHeight + Math.random() * 0.4;
        arr[i * 3 + 1] = y;
      }
      posAttr.needsUpdate = true;
    }

    // update rain instances
    if (rainRef.current) {
      for (let i = 0; i < rainData.length; i++) {
        const d = rainData[i];
        d.y -= d.speed * delta * 3.8;
        if (d.y < -areaHeight / 2) d.y = areaHeight / 2 + Math.random() * 0.4;
        dummy.position.set(d.x, d.y, d.z);
        dummy.rotation.set(d.tilt, 0, 0);
        dummy.scale.set(0.02, d.len, 0.02);
        dummy.updateMatrix();
        rainRef.current.setMatrixAt(i, dummy.matrix);
      }
      rainRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* subtle ambient particles */}
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={new THREE.Color('#ffffff')}
          size={1.4}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.06}
          depthWrite={false}
        />
      </points>

      {/* thin instanced rain streaks */}
      <instancedMesh ref={rainRef} args={[undefined, undefined, rainData.length]} frustumCulled={false}>
        <boxGeometry args={[0.02, 1, 0.02]} />
        <meshStandardMaterial color={'#eec8d6'} transparent opacity={0.08} roughness={0.7} metalness={0.0} />
      </instancedMesh>
    </group>
  );
}
