/**
 * Merges password-reset (and optional app) URLs into Supabase Auth uri_allow_list + site_url
 * via the Supabase Management API.
 *
 * Required env:
 *   SUPABASE_ACCESS_TOKEN — Personal access token from https://supabase.com/dashboard/account/tokens
 *                           (must include permissions: auth_config_write, project_admin_write)
 *   SUPABASE_URL — project URL (used to derive project ref)
 *
 * Optional:
 *   PUBLIC_APP_URL — primary Site URL (default: first EXTRA_REDIRECT_ORIGIN or Vercel production URL below)
 *   EXTRA_REDIRECT_ORIGINS — comma-separated origins, e.g. "https://adclaw-ruddy.vercel.app,http://localhost:3000"
 *
 * If SUPABASE_ACCESS_TOKEN is missing, the script exits with instructions.
 */
import 'dotenv/config';

const DEFAULT_PRODUCTION_ORIGIN = 'https://adclaw-ruddy.vercel.app';
const DEFAULT_LOCAL_ORIGIN = 'http://localhost:3000';

function refFromSupabaseUrl(url) {
  if (!url) throw new Error('SUPABASE_URL is not set');
  const host = new URL(url).hostname;
  const sub = host.split('.')[0];
  if (!sub || host === 'supabase.co') throw new Error(`Could not parse project ref from SUPABASE_URL host: ${host}`);
  return sub;
}

function parseAllowList(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniq(arr) {
  return [...new Set(arr)];
}

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_MANAGEMENT_TOKEN;
  const supabaseUrl = process.env.SUPABASE_URL;
  const ref = refFromSupabaseUrl(supabaseUrl);

  const fromEnv = process.env.EXTRA_REDIRECT_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const extra =
    fromEnv && fromEnv.length > 0 ? fromEnv : [DEFAULT_PRODUCTION_ORIGIN, DEFAULT_LOCAL_ORIGIN];

  const resetPaths = extra.map((o) => `${o.replace(/\/$/, '')}/auth/reset-password`);
  const metaCallbackPaths = extra.map((o) => `${o.replace(/\/$/, '')}/auth/meta/callback`);

  const siteUrl =
    (process.env.PUBLIC_APP_URL || extra[0] || DEFAULT_PRODUCTION_ORIGIN).replace(/\/$/, '');

  if (!token) {
    console.error(`
Missing SUPABASE_ACCESS_TOKEN (or SUPABASE_MANAGEMENT_TOKEN).

Create a token: https://supabase.com/dashboard/account/tokens
  → New token → enable scopes that allow Auth config (e.g. full access for your account).

Then run:
  set SUPABASE_ACCESS_TOKEN=sbp_...
  node scripts/sync-supabase-auth-redirects.mjs

Or add SUPABASE_ACCESS_TOKEN to .env (never commit it).
`);
    process.exit(1);
  }

  const getRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!getRes.ok) {
    const t = await getRes.text();
    console.error(`GET auth config failed: ${getRes.status}`, t);
    process.exit(1);
  }

  const current = await getRes.json();
  const existing = parseAllowList(current.uri_allow_list);

  const merged = uniq([
    ...existing,
    ...resetPaths,
    ...metaCallbackPaths,
    siteUrl,
    `${siteUrl}/auth/reset-password`,
    `${siteUrl}/auth/meta/callback`,
  ]);

  const uri_allow_list = merged.join('\n');

  const patchBody = {
    site_url: siteUrl,
    uri_allow_list,
  };

  const patchRes = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchBody),
  });

  if (!patchRes.ok) {
    const t = await patchRes.text();
    console.error(`PATCH auth config failed: ${patchRes.status}`, t);
    process.exit(1);
  }

  console.log('Supabase Auth URL config updated.');
  console.log('site_url:', siteUrl);
  console.log('uri_allow_list entries:', merged.length);
  merged.forEach((u) => console.log(' -', u));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
