import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';
import { getPrometheusMetrics } from '@/lib/metrics';
import { getReplyEntries } from '@/lib/db';
import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export const metadata: Metadata = {
  title: 'Analytics — Yor Smriti Admin',
  robots: { index: false },
};

function parseMetrics(raw: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const line of raw.split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue;
    const match = line.match(/^([a-z_]+)(?:\{[^}]*\})?\s+([\d.e+\-]+)/);
    if (match) {
      result[match[1]] = (result[match[1]] ?? 0) + parseFloat(match[2]);
    }
  }
  return result;
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? null;
  const session = token ? verifySession(token) : null;
  if (!session) redirect('/login?next=/admin');

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
