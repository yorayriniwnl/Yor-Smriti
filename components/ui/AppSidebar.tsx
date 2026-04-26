'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { EXPERIENCE_CATALOG } from '@/lib/experienceCatalog';

const EASE = [0.16, 1, 0.3, 1] as const;

interface NavItem {
  href: string;
  label: string;
  icon: string;
  description: string;
  accent?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/message',   label: 'Experience',    icon: '💌', description: 'The full cinematic message' },
  { href: '/hub',       label: 'Explore',       icon: '✦',  description: 'All experiences' },
  ...EXPERIENCE_CATALOG.map((experience) => ({
    href: experience.href,
    label: experience.navLabel ?? experience.title,
    icon: experience.emoji,
    description: experience.description,
  })),
  { href: '/reply',     label: 'Your Reply',    icon: '💌', description: 'Send a response' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { href: '/admin',     label: 'Analytics',     icon: '📊', description: 'Admin dashboard' },
];

function NavLink({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick?: () => void }) {
  const accent = item.accent ?? 'rgba(247,85,144,0.85)';
  const accentFaint = item.accent ? `${item.accent}22` : 'rgba(247,85,144,0.12)';

  return (
    <Link
      href={item.href}
      onClick={onClick}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <motion.div
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.55rem 0.85rem',
          borderRadius: '0.75rem',
          background: isActive ? accentFaint : 'transparent',
          border: `1px solid ${isActive ? (item.accent ? `${item.accent}33` : 'rgba(247,85,144,0.2)') : 'transparent'}`,
          transition: 'background 200ms, border-color 200ms',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            style={{
              position: 'absolute',
              left: 0, top: '20%', bottom: '20%',
              width: 2,
              borderRadius: 1,
              background: accent,
            }}
          />
        )}

        <span style={{ fontSize: '1rem', flexShrink: 0, lineHeight: 1 }} aria-hidden>
          {item.icon}
        </span>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: isActive
              ? (item.accent ? item.accent : 'rgba(255,193,219,0.97)')
              : 'rgba(255,170,205,0.65)',
            lineHeight: 1.2,
            margin: 0,
            transition: 'color 200ms',
          }}>
            {item.label}
          </p>
          <p style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.72rem',
            color: 'rgba(255,150,190,0.38)',
            lineHeight: 1.3,
            margin: '1px 0 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {item.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Keyboard: Escape closes sidebar, trap focus when open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Don't show sidebar on pages that have their own nav or are standalone
  const HIDDEN_PATHS = ['/login'];
  const isHidden = HIDDEN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (!mounted || isHidden) return null;

  const isActive = (href: string) =>
    href === pathname || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* ── Toggle button — visible on all screen sizes ── */}
      <motion.button
        type="button"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed',
          top: '1.1rem',
          left: '1.1rem',
          zIndex: 200,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(244,173,210,0.28)',
          background: open
            ? 'rgba(247,85,144,0.18)'
            : 'rgba(10,4,9,0.72)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: open ? 0 : '5px',
          cursor: 'pointer',
          transition: 'background 250ms, border-color 250ms',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Hamburger → X animation */}
        <motion.span
          animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(255,193,219,0.8)', borderRadius: 1 }}
        />
        <motion.span
          animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(255,193,219,0.8)', borderRadius: 1 }}
        />
        <motion.span
          animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(255,193,219,0.8)', borderRadius: 1 }}
        />
      </motion.button>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 150,
              background: 'rgba(4,3,9,0.6)',
              backdropFilter: 'blur(4px)',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar panel ── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ x: '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 'min(280px, 82vw)',
              zIndex: 160,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, rgba(8,3,9,0.97) 0%, rgba(14,5,12,0.99) 100%)',
              borderRight: '1px solid rgba(244,173,210,0.1)',
              boxShadow: '16px 0 60px rgba(0,0,0,0.7)',
            }}
            aria-label="Navigation sidebar"
          >
            {/* Header */}
            <div style={{
              padding: '1.4rem 1.2rem 1rem',
              borderBottom: '1px solid rgba(244,173,210,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.2rem',
                  color: 'rgba(255,236,246,0.94)',
                  fontWeight: 400,
                  margin: 0,
                  lineHeight: 1.1,
                }}>
                  Yor Smriti
                </p>
                <p style={{
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.14em',
                  color: 'rgba(247,85,144,0.45)',
                  textTransform: 'uppercase',
                  margin: '2px 0 0',
                }}>
                  Navigate
                </p>
              </div>

              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '1px solid rgba(244,173,210,0.2)',
                  background: 'transparent',
                  color: 'rgba(255,171,210,0.5)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Main nav */}
            <nav style={{ flex: 1, overflow: 'auto', padding: '0.75rem 0.75rem 0' }}>
              {/* Section: Experience */}
              <p style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.52rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,150,185,0.3)',
                padding: '0 0.5rem 0.4rem',
                margin: '0 0 0.25rem',
              }}>
                Experience
              </p>
              {NAV_ITEMS.slice(0, 14).map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={() => setOpen(false)}
                />
              ))}

              {/* Section: Personal
                  Fix #20: was "Future Plans" — incorrect for this slice.
                  NAV_ITEMS[14..] contains the-good, for-her-alone, words-she-said,
                  her, questions, small-things, before-after, gratitude, reply —
                  all personal/reflective pages, none of which are future plans. */}
              <p style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.52rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(245,166,35,0.35)',
                padding: '0 0.5rem 0.4rem',
                margin: '1rem 0 0.25rem',
              }}>
                Personal
              </p>
              {NAV_ITEMS.slice(14).map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>

            {/* Bottom — admin + logout */}
            <div style={{
              padding: '0.75rem',
              borderTop: '1px solid rgba(244,173,210,0.08)',
            }}>
              {BOTTOM_ITEMS.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={() => setOpen(false)}
                />
              ))}

              <div style={{ padding: '0.5rem 0.85rem 0.25rem' }}>
                <LogoutButton />
              </div>

              <p style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,150,185,0.2)',
                textAlign: 'center',
                marginTop: '0.75rem',
                padding: '0 0.5rem',
              }}>
                Yor Smriti · 2025
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
