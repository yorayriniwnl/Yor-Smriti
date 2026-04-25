import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { getPrometheusMetrics } from '@/lib/metrics';
import { getReplyEntries } from '@/lib/db';
import { parseMetrics } from '@/lib/parseMetrics';
import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Analytics — Yor Smriti Admin',
  robots: { index: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? null;
  const session = token ? verifySession(token) : null;

  // Must be authenticated
  if (!session) redirect('/login?next=/admin');

  // Role guard: guest sessions (open-access visitors) cannot reach admin.
  // Only the configured APP_USERNAME — or the sole user when no credentials
  // are set — may access this page.
  if (session.sub === 'guest') redirect('/');

  const configuredUsername = process.env.APP_USERNAME ?? '';
  if (configuredUsername && session.sub !== configuredUsername) redirect('/');

  const [raw, replyEntries] = await Promise.all([
    Promise.resolve(getPrometheusMetrics()),
    getReplyEntries(50).catch(() => []),
  ]);

  const metrics = parseMetrics(raw);

  const repliesKV = {
    total: replyEntries.length,
    byMood: replyEntries.reduce(
      (acc, e) => {
        const m = e.mood as keyof typeof acc;
        if (m in acc) acc[m]++;
        return acc;
      },
      { yes: 0, maybe: 0, needTime: 0, no: 0 }
    ),
  };

  return (
    <AdminDashboard
      metrics={metrics}
      user={session.sub}
      repliesKV={repliesKV}
    />
  );
}
