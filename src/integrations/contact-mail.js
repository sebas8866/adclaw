import { logger } from '../utils/logger.js';

const DEFAULT_TO = 'support@adclaw.ai';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {{ name: string, email: string, company?: string, message: string }} payload
 * @returns {Promise<{ delivered: boolean, mode: 'resend' | 'log' }>}
 */
export async function deliverContactInquiry(payload) {
  const { name, email, company, message } = payload;
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL || 'AdClaw <onboarding@resend.dev>';
  const apiKey = process.env.RESEND_API_KEY;

  const text = [
    `Enterprise / contact inquiry`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    ``,
    `Message:`,
    message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <p><strong>Enterprise / contact inquiry</strong></p>
    <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
    <strong>Email:</strong> ${escapeHtml(email)}<br/>
    ${company ? `<strong>Company:</strong> ${escapeHtml(company)}<br/>` : ''}
    </p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `.trim();

  if (!apiKey) {
    logger.warn('contact: RESEND_API_KEY not set — inquiry logged only');
    logger.info(`contact inquiry: ${JSON.stringify({ name, email, company: company || null, message: message.slice(0, 500) })}`);
    return { delivered: false, mode: 'log' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `AdClaw inquiry from ${name}`,
      text,
      html,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    logger.error('contact: Resend error', { status: res.status, data });
    throw new Error(data.message || `Email delivery failed (${res.status})`);
  }

  return { delivered: true, mode: 'resend' };
}
