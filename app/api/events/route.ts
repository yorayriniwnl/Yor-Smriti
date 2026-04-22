import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifySession } from '@/lib/auth';
import { incMetric } from '@/lib/metrics';
import { sanitizeString } from '@/lib/sanitize';
import { getClientIp, verifyCsrfHeader } from '@/lib/request';
import { logger } from '@/lib/logger';

// Valid event types — strict allowlist
const VALID_EVENTS = new Set([
  'experience_opened',      // User opened the experience
  'screen_viewed',          // A screen was displayed
  'screen_completed',       // User tapped/swiped past a screen
  'letter_read',            // Letter screen fully scrolled
  'promise_accepted',       // A promise card was tapped
  'all_promises_accepted',  // All promises accepted
  'experience_completed',   // Final screen reached
  'chat_sent',              // User sent a chat message
  'song_played',            // A song was selected
  'apology_opened',         // Panda/apology journey started
  'timeline_viewed',        // Timeline page opened
  'stars_viewed',           // Stars page opened
  'promise_viewed',         // Promise page opened
]);

interface EventBody {
  event: string;
  screen?: string | number;
  meta?: Record<string, string | number | boolean>;
}

export async function POST(request: Request): Promise<NextResponse> {
  // CSRF
  if (!verifyCsrfHeader(request)) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 });
  }

  // Auth
  const token = getTokenFromRequest(request);
  if (!token || !verifySession(token)) {
    return NextResponse.json({ ok: false, error: 'Authentication required.' }, { status: 401 });
  }

  let body: EventBody;
  try {
    body = (await request.json()) as EventBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid body.' }, { status: 400 });
  }

  const eventName = sanitizeString(body.event ?? '', { maxLength: 64, allowNewlines: false });

  if (!VALID_EVENTS.has(eventName)) {
    return NextResponse.json({ ok: false, error: 'Unknown event type.' }, { status: 400 });
  }

  // Sanitize optional screen identifier
  const screen = body.screen !== undefined
    ? sanitizeString(String(body.screen), { maxLength: 32, allowNewlines: false })
    : undefined;

  const labels: Record<string, string> = { event: eventName };
  if (screen) labels['screen'] = screen;

  incMetric('experience_event_total', labels);
  
  // Log for persistence (pipe to external service in prod)
  const ip = getClientIp(request);
  logger.info(`[event] ${eventName}${screen ? ` screen=${screen}` : ''} ip=${ip}`);

  if (body.event === 'experience_opened') {
    // Fire-and-forget first-visit notification
    import('@/lib/email').then(({ notifyFirstVisit }) => {
      notifyFirstVisit({ ip, timestamp: new Date().toISOString() }).catch((e: unknown) =>
        logger.error('[events] first-visit email error:', e)
      );
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
