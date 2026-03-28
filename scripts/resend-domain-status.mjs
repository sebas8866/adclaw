/**
 * Print DNS records and verification status for RESEND_DOMAIN_ID (reads .env).
 * Usage: npm run resend:domain-status
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
  console.error('Set RESEND_DOMAIN_ID in .env (from `resend domains list` after create).');
  process.exit(1);
}

const r = spawnSync(process.execPath, [cli, 'domains', 'get', id], {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
});
process.exit(r.status ?? 1);
