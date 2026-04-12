'use client';

import React from 'react';

export function CinematicPanel({
  children,
  topDecoration,
}: {
  children: React.ReactNode;
  topDecoration?: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[2.2rem] border pb-6 pt-7"
      style={{
        borderColor: 'rgba(244, 173, 210, 0.28)',
        background:
          'linear-gradient(180deg, rgba(35, 11, 28, 0.9) 0%, rgba(20, 8, 19, 0.94) 100%)',
        boxShadow: '0 36px 74px rgba(0, 0, 0, 0.46), 0 16px 34px rgba(247, 85, 144, 0.16)',
      }}
    >
      {topDecoration}
      {children}
    </div>
  );
}
