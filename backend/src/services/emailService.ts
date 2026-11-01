import { env } from '../config/env.js';

export interface EmailMessage { to: string; subject: string; text: string }

/**
 * Sends a transactional email through Resend (https://resend.com) when RESEND_API_KEY is set.
 * Returns true if the provider accepted the message, false if email is not configured or failed.
 * Never throws: callers decide what to do when delivery is unavailable.
 */
export async function sendEmail(msg: EmailMessage): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [msg.to], subject: msg.subject, text: msg.text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error('[email] provider rejected message:', res.status);
    return res.ok;
  } catch (err) {
    console.error('[email] send failed:', err);
    return false;
  }
}
