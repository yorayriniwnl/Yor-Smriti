'use client';

import React from 'react';

type Props = {
  width: number;
  height: number;
  opacity?: number;
  style?: React.CSSProperties;
};

export const AyrinCanvas = React.forwardRef<HTMLCanvasElement, Props>(
  ({ width, height, opacity, style }, ref) => {
    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: opacity ?? 1,
          ...(style ?? {}),
        }}
      />
    );
  }
);

AyrinCanvas.displayName = 'AyrinCanvas';
