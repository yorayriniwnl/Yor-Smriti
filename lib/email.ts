/**
 * Email sending via Resend (https://resend.com)
 *
 * Setup:
 * 1. Sign up at resend.com (free tier: 3,000 emails/month)
 * 2. Add your domain or use Resend's sandbox
 * 3. Set RESEND_API_KEY in environment variables
 * 4. Set SENDER_EMAIL (e.g. "Yor Smriti <noreply@yourDomain.com>")
 * 5. Set NOTIFICATION_EMAIL (where you want to receive alerts)
 *
 * Falls back to logging if RESEND_API_KEY is not set.
 */

import { logger } from './logger';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

function getSenderEmail(): string {
  return process.env.SENDER_EMAIL ?? 'Yor Smriti <noreply@yor-smriti.vercel.app>';
}

function getNotificationEmail(): string {
  return process.env.NOTIFICATION_EMAIL ?? '';
}

export async function sendEmail(opts: SendEmailOptions): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    logger.info(`[email] (no RESEND_API_KEY) Would send to ${JSON.stringify(opts.to)}: ${opts.subject}`);
    logger.debug(`[email] body preview: ${opts.text?.slice(0, 200) ?? opts.html.slice(0, 200)}`);
    return { ok: true, id: 'dev-noop' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: getSenderEmail(),
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: opts.replyTo,
      }),
    });

    const data = (await res.json()) as { id?: string; name?: string; message?: string };

    if (!res.ok) {
      logger.error(`[email] Resend error: ${data.message ?? data.name ?? res.status}`);
      return { ok: false, error: data.message ?? `HTTP ${res.status}` };
    }

    logger.info(`[email] Sent "${opts.subject}" -> ${JSON.stringify(opts.to)} (id: ${data.id})`);
    return { ok: true, id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Email send failed';
    logger.error('[email] Exception:', msg);
    return { ok: false, error: msg };
  }
}

export async function notifyReplyReceived(entry: {
  mood: string;
  message: string;
  ip: string;
}): Promise<void> {
  const notifyTo = getNotificationEmail();
  if (!notifyTo) return;

  const moodEmoji: Record<string, string> = {
    yes: '💗',
    maybe: '🌙',
    needTime: '🕯️',
    no: '🌧️',
  };

  await sendEmail({
    to: notifyTo,
    subject: `💌 She replied - ${moodEmoji[entry.mood] ?? ''} ${entry.mood}`,
    text: `Keyrin replied!\n\nMood: ${entry.mood}\n\n${entry.message}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;background:#05030a;color:#ffe8f4;border-radius:16px">
        <h2 style="font-weight:400;color:#f75590;margin-bottom:8px">She replied ${moodEmoji[entry.mood] ?? ''}</h2>
        <p style="color:#c07090;margin-bottom:20px;font-size:14px">Mood: <strong style="color:#f75590">${entry.mood}</strong></p>
        ${entry.message ? `<blockquote style="border-left:3px solid #f75590;margin:0;padding:12px 16px;color:#ffd4ea;font-style:italic">"${entry.message}"</blockquote>` : '<p style="color:#7a3050;font-style:italic">No message added.</p>'}
      </div>`,
  });
}

export async function notifyFirstVisit({ ip, timestamp }: { ip: string; timestamp: string }): Promise<void> {
  const notifyTo = getNotificationEmail();
  if (!notifyTo) {
    logger.info('[email] No NOTIFICATION_EMAIL set — skipping first-visit notification');
    return;
  }

  const recipientName = process.env.RECIPIENT_NAME ?? 'Smriti';

  await sendEmail({
    to: notifyTo,
    subject: `${recipientName} just opened the experience 💌`,
    text: `${recipientName} just visited Yor Smriti for the first time.\n\nTime: ${timestamp}\nIP: ${ip}\n\nCheck your admin dashboard for live analytics.`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;background:#05030a;color:#ffe8f4;border-radius:16px">
        <h2 style="font-weight:400;color:#f75590;margin-bottom:8px">${recipientName} just opened the experience 💌</h2>
        <p style="font-family:sans-serif;font-size:16px;color:#ffe8f4;">
          <strong>${recipientName}</strong> just visited Yor Smriti for the first time.
        </p>
        <p style="font-family:monospace;font-size:12px;color:#c07090;">
          Time: ${timestamp}<br/>
          IP: ${ip}
        </p>
        <p style="font-family:sans-serif;font-size:14px;color:#a06080;">
          Check your admin dashboard for live analytics.
        </p>
      </div>`,
  });
}
