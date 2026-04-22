"use client";

export function CanvasModelPlaceholder() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '240px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '12% 24% auto',
          aspectRatio: '1 / 1',
          borderRadius: '999px',
          background: 'radial-gradient(circle at 35% 30%, #ffc1d6 0%, #ff9ab8 45%, rgba(255, 154, 184, 0.08) 100%)',
          filter: 'blur(0.5px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '12%',
          right: '12%',
          bottom: '14%',
          height: '22%',
          borderRadius: '999px',
          background: 'radial-gradient(circle, rgba(11,6,16,0.28) 0%, rgba(11,6,16,0.02) 72%)',
        }}
      />
    </div>
  );
}

export default CanvasModelPlaceholder;
