"use client";

import React from 'react';

export function CanvasModelPlaceholder() {
  // Simple low-poly placeholder to render inside a <Canvas> while the real model loads.
  // Keeps the canvas from going blank and feels minimal.
  return (
    <group>
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.9, 20, 16]} />
        <meshStandardMaterial color="#ff9ab8" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#0b0610" opacity={0.18} transparent />
      </mesh>
    </group>
  );
}

export default CanvasModelPlaceholder;
