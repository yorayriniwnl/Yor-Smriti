/**
 * Private content page — SERVER COMPONENT (no 'use client').
 *
 * The letter text below is rendered on the server and sent as HTML.
 * It is NEVER included in any JavaScript bundle — a visitor inspecting
 * DevTools → Sources will find no trace of it before the password is entered.
 *
 * Gate layers (defence-in-depth):
 *   1. proxy.ts — redirects to /for-her-alone if her_unlocked cookie absent
 *   2. This file — double-checks the cookie before rendering (server-side)
 *   3. /api/her-unlock — the only way to SET the cookie (password + rate-limit)
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AmbientSound } from '@/components/ui/AmbientSound';
import { ScrollReset } from '@/components/ui/ScrollReset';
import { ContentShell } from './ContentShell';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';
import { HER_UNLOCK_COOKIE, verifyHerUnlockToken } from '@/lib/unlock';

export const metadata = {
  title: 'For Her Alone',
  description: 'This one is just for you.',
  robots: { index: false, follow: false },
};

export default async function ContentPage() {
  // Authoritative server-side gate.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  const unlockToken = cookieStore.get(HER_UNLOCK_COOKIE)?.value;
  if (!sessionToken || !verifySession(sessionToken) || !verifyHerUnlockToken(unlockToken)) {
    redirect('/for-her-alone');
  }

  return (
    <main
      id="main-content"
      className="relative min-h-dvh w-full"
      style={{
        background:
          'radial-gradient(ellipse 86% 56% at 50% 4%, rgba(255, 213, 233, 0.66) 0%, rgba(95, 45, 82, 0.54) 32%, rgba(22, 8, 20, 0.96) 64%, #05030a 100%)',
      }}
    >
      <ScrollReset />
      <AmbientSound />

      <div
        className="pointer-events-none fixed"
        aria-hidden="true"
        style={{
          top: '20%', left: '15%',
          width: 280, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247,85,144,0.18), transparent 70%)',
          filter: 'blur(55px)',
          opacity: 0.5,
        }}
      />

      {/*
        ContentShell is 'use client' for Framer Motion only.
        Its children (the paragraphs below) are passed as server-rendered HTML —
        they do NOT appear in ContentShell's JS bundle. This is what keeps the
        letter text out of the bundle entirely.
      */}
      <ContentShell>
        <p
          className="mb-12 uppercase tracking-[0.22em]"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            color: 'rgba(255, 193, 223, 0.65)',
            fontSize: '0.58rem',
          }}
        >
          for her alone
        </p>

        <div
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 2.6vw, 1.35rem)',
            lineHeight: 1.9,
            color: 'rgba(255, 220, 240, 0.88)',
            fontWeight: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.8rem',
          }}
        >
          <p>Meri Anya —</p>
          <p>
            This page is just for you. No one else knows the password. No one else will read this.
            This is the part that does not need to be part of anything — not a sequence, not a journey,
            not an experience. Just one person saying something to another person, privately, without an audience.
          </p>
          <p>
            I think about you often. Not in a way that bleeds into everything — in a way that is specific
            and quiet. A Tuesday afternoon. Something I hear. The way a conversation starts that reminds
            me of how ours used to. You are not a constant weight. You are a specific one.
          </p>
          <p>
            The thing I want you to know — the thing this page is for — is that I am not writing any of
            this to get you back. I know that is what it looks like from the outside. Someone builds a
            whole thing, fills it with words, sends you a link. What does that mean if not: come back?
          </p>
          <p>
            But this is not that. This is closer to: I want you to be okay. I want you to know, somewhere,
            that someone spent real time thinking carefully about who you are and what they did and what they
            should have done differently. Not because it changes anything. Because you deserve to be thought
            about that carefully.
          </p>
          <p>
            You called me Ayrin, and it sounded like mine, and I did not tell you that enough. I did not
            tell you a lot of things enough. This is me telling you some of them, finally, even if it is late.
          </p>
          <p>
            I hope you are warm and certain. I hope you are laughing — the real one, the one that takes over.
            I hope someone is paying attention to you the way you always deserved.
          </p>
          <p>And if no one is — I see you. I always did.</p>
        </div>

        <p
          className="mt-16"
          style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.14em',
            color: 'rgba(247, 110, 160, 0.42)',
          }}
        >
          — Ayrin
        </p>

        <div className="mt-14">
          <Link
            href="/hub"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              color: 'rgba(255, 171, 210, 0.3)',
              textTransform: 'uppercase',
            }}
          >
            ← back
          </Link>
        </div>
      </ContentShell>
    </main>
  );
}
