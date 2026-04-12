import { NextResponse } from 'next/server';
import { getPrometheusMetrics } from '@/lib/metrics';

export async function GET() {
  const body = getPrometheusMetrics();
  return new NextResponse(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' },
  });
}
