'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,150,185,0.5)',
        background: 'transparent',
        border: 'none',
        cursor: loading ? 'wait' : 'pointer',
        padding: '6px 0',
        opacity: loading ? 0.5 : 1,
        transition: 'opacity 150ms ease, color 150ms ease',
      }}
      onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.color = 'rgba(255,150,185,0.85)'; }}
      onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.color = 'rgba(255,150,185,0.5)'; }}
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
