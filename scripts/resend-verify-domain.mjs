/**
 * Trigger Resend DNS verification for RESEND_DOMAIN_ID.
 * Add DNS records at your registrar first, then run: npm run resend:verify-domain
 */
import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const cli = path.join(root, 'node_modules', 'resend-cli', 'dist', 'cli.cjs');
const id = process.env.RESEND_DOMAIN_ID;

if (!id) {
  console.error('Set RESEND_DOMAIN_ID in .env.');
  process.exit(1);
}

const r = spawnSync(process.execPath, [cli, 'domains', 'verify', id], {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
});
process.exit(r.status ?? 1);
