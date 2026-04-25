'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { LogoutButton } from '@/components/ui/LogoutButton';
import Link from 'next/link';

interface RepliesKV {
  total: number;
  byMood: { yes: number; maybe: number; needTime: number; no: number };
}

interface Props {
  metrics: Record<string, number>;
  user: string;
  repliesKV?: RepliesKV;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function Stat({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="rounded-2xl border p-5"
      style={{
        borderColor: 'rgba(244,173,210,0.2)',
        background: 'linear-gradient(135deg, rgba(35,11,28,0.85), rgba(20,8,19,0.9))',
      }}
    >
      <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(255,180,215,0.55)', textTransform: 'uppercase' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'rgba(255,236,246,0.96)', lineHeight: 1.1, fontWeight: 500 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.78rem', color: 'rgba(255,180,210,0.5)', marginTop: '2px' }}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function pct(a: number, b: number) {
  if (!b) return '—';
  return `${Math.round((a / b) * 100)}%`;
}

export default function AdminDashboard({ metrics, user, repliesKV }: Props) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    router.refresh();
    // Give the server a beat to re-render
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, [router]);

  const loginSuccess  = metrics['login_success_total']         ?? 0;
  const loginFailed   = metrics['login_failed_total']          ?? 0;
  const logoutTotal   = metrics['logout_total']                ?? 0;
  const chatOpenAI    = metrics['chat_replies_openai_total']   ?? 0;
  const chatFallback  = metrics['chat_replies_fallback_total'] ?? 0;
  const rateLimited   = metrics['rate_limit_blocked_total']    ?? 0;
  const rateAllowed   = metrics['rate_limit_allowed_total']    ?? 0;
  const openAIReqs    = metrics['openai_requests_total']       ?? 0;
  const openAIFailed  = metrics['openai_request_failed_total'] ?? 0;
  const replyTotal    = metrics['reply_received_total']        ?? 0;
  const eventTotal    = metrics['experience_event_total']      ?? 0;

  const totalChats   = chatOpenAI + chatFallback;
  const totalLogins  = loginSuccess + loginFailed;

  const stats = [
    { label: 'Successful Logins',    value: loginSuccess,  sub: `${loginFailed} failed (${pct(loginFailed, totalLogins)} failure rate)` },
    { label: 'Active Sessions',      value: loginSuccess - logoutTotal > 0 ? loginSuccess - logoutTotal : 0,  sub: `${logoutTotal} logged out` },
    { label: 'Chat Messages',        value: totalChats,    sub: `${chatOpenAI} AI · ${chatFallback} fallback` },
    { label: 'AI Reply Rate',        value: pct(chatOpenAI, totalChats), sub: `${openAIReqs} OpenAI requests` },
    { label: 'OpenAI Error Rate',    value: pct(openAIFailed, openAIReqs), sub: `${openAIFailed} failed requests` },
    { label: 'Rate Limit Blocks',    value: rateLimited,   sub: `${rateAllowed} requests allowed through` },
    {
      label: 'Replies Received',
      value: repliesKV?.total ?? replyTotal,
      sub: repliesKV
        ? `Yes: ${repliesKV.byMood.yes} · Maybe: ${repliesKV.byMood.maybe} · Need time: ${repliesKV.byMood.needTime} · No: ${repliesKV.byMood.no}`
        : 'From Meri Anya <3',
    },
    { label: 'Experience Events',     value: eventTotal,    sub: 'Screen views + interactions' },
  ];

  return (
    <main
      id="main-content"
      className="min-h-dvh w-dvw overflow-auto px-4 py-10"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,200,220,0.3) 0%, rgba(80,20,60,0.4) 30%, #05030a 65%)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', letterSpacing: '0.16em', color: 'rgba(255,170,210,0.55)', textTransform: 'uppercase' }}>
              Analytics · Yor Smriti
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'rgba(255,236,246,0.97)', fontWeight: 400, lineHeight: 1.1 }}>
              Dashboard
            </h1>
            <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.85rem', color: 'rgba(255,190,220,0.5)', marginTop: '4px' }}>
              Logged in as <span style={{ color: 'rgba(255,210,235,0.75)' }}>{user}</span>
              {' · '}
              <span style={{ color: 'rgba(255,150,185,0.5)', fontSize: '0.75rem' }}>
                Note: counts reset on server restart. Use Redis + persistent storage for production analytics.
              </span>
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-full border px-4 py-2"
              style={{
                borderColor: 'rgba(244,173,210,0.2)',
                color: refreshing ? 'rgba(255,190,215,0.4)' : 'rgba(255,190,215,0.65)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.06em',
                background: 'transparent',
                cursor: refreshing ? 'wait' : 'pointer',
              }}
            >
              {refreshing ? '↻ Refreshing…' : '↻ Refresh'}
            </button>
            <Link
              href="/message"
              className="rounded-full border px-5 py-2"
              style={{
                borderColor: 'rgba(244,173,210,0.28)',
                color: 'rgba(255,210,235,0.8)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
              }}
            >
              ← Experience
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            >
              <Stat label={s.label} value={s.value} sub={s.sub} />
            </motion.div>
          ))}
        </div>

        {/* Raw metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          {[
            { href: '/api/reply/entries',    label: 'Replies',          color: 'rgba(247,85,144,0.65)', border: 'rgba(247,85,144,0.25)' },
            { href: '/api/admin/stats',      label: 'Full stats JSON',  color: 'rgba(100,200,255,0.55)', border: 'rgba(100,200,255,0.2)' },
            { href: '/api/metrics',          label: 'Prometheus',       color: 'rgba(150,150,150,0.45)', border: 'rgba(150,150,150,0.15)' },
          ].map(({ href, label, color, border }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color,
                border: `1px solid ${border}`,
                borderRadius: '999px',
                padding: '0.45rem 1.1rem',
                textDecoration: 'none',
              }}
            >
              {label} →
            </a>
          ))}
        </motion.div>

        <motion.details
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 rounded-2xl border p-5"
          style={{ borderColor: 'rgba(244,173,210,0.15)', background: 'rgba(20,8,19,0.6)' }}
        >
          <summary
            className="cursor-pointer select-none"
            style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,170,210,0.5)', textTransform: 'uppercase' }}
          >
            Raw Prometheus metrics
          </summary>
          <div className="mt-4 overflow-auto">
            {Object.entries(metrics).length === 0 ? (
              <p style={{ fontFamily: 'var(--font-crimson)', color: 'rgba(255,170,200,0.4)', fontSize: '0.85rem' }}>
                No metrics recorded yet. Interact with the experience first.
              </p>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', color: 'rgba(255,160,200,0.45)', letterSpacing: '0.1em', padding: '4px 8px', textTransform: 'uppercase' }}>Metric</th>
                    <th style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.6rem', color: 'rgba(255,160,200,0.45)', letterSpacing: '0.1em', padding: '4px 8px', textTransform: 'uppercase', textAlign: 'right' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => (
                    <tr key={k} style={{ borderTop: '1px solid rgba(244,173,210,0.08)' }}>
                      <td style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.7rem', color: 'rgba(255,200,225,0.65)', padding: '6px 8px' }}>{k}</td>
                      <td style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.7rem', color: 'rgba(255,210,235,0.8)', padding: '6px 8px', textAlign: 'right' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.details>

        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.55rem', color: 'rgba(255,160,200,0.25)', textAlign: 'center', marginTop: '2.5rem', letterSpacing: '0.1em' }}>
          YOR SMRITI · PRIVATE ANALYTICS · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
