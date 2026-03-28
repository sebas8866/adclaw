/**
 * Send a one-off test email using RESEND_API_KEY.
 * Set RESEND_TEST_EMAIL (defaults to the address Resend allows for onboarding@resend.dev).
 */
import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'node_modules', 'resend-cli', 'dist', 'cli.cjs');

const to = process.env.RESEND_TEST_EMAIL;
if (!to) {
  console.error('Set RESEND_TEST_EMAIL in .env (your Resend account email for testing).');
  process.exit(1);
}

const from = process.env.CONTACT_FROM_EMAIL || 'AdClaw <onboarding@resend.dev>';
const args = [
  cli,
  'emails',
  'send',
  '--from',
  from,
  '--to',
  to,
  '--subject',
  'AdClaw — Resend test',
  '--text',
  'Resend CLI test from AdClaw. After you add a custom domain in Vercel and verify it in Resend, set CONTACT_FROM_EMAIL on Vercel.',
];

const r = spawnSync(process.execPath, args, {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
});
process.exit(r.status ?? 1);
