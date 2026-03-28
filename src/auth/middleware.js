import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/meta',
  '/api/health',
];

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL,
  sameSite: 'lax',
  path: '/',
};

export function requireAuth(req, res, next) {
  if (PUBLIC_PATHS.some(p => req.path.startsWith(p))) {
    return next();
  }

  if (req.path.startsWith('/api/')) {
    return next();
  }

  const accessToken = req.cookies?.sb_access_token;
  const refreshToken = req.cookies?.sb_refresh_token;

  if (!accessToken && !refreshToken) {
    return res.redirect('/auth/login');
  }

  if (!supabaseAdmin) {
    return next();
  }

  supabaseAdmin.auth.getUser(accessToken).then(({ data, error }) => {
    if (!error && data?.user) {
      req.user = data.user;
      return next();
    }

    if (!refreshToken || !supabaseAnonKey) {
      clearAuthCookies(res);
      return res.redirect('/auth/login');
    }

    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    anonClient.auth.setSession({ access_token: accessToken || '', refresh_token: refreshToken })
      .then(({ data: sessionData, error: refreshError }) => {
        if (refreshError || !sessionData?.session) {
          clearAuthCookies(res);
          return res.redirect('/auth/login');
        }

        const s = sessionData.session;
        res.cookie('sb_access_token', s.access_token, { ...COOKIE_OPTS, maxAge: s.expires_in * 1000 });
        res.cookie('sb_refresh_token', s.refresh_token, { ...COOKIE_OPTS, maxAge: 30 * 24 * 60 * 60 * 1000 });

        req.user = s.user;
        next();
      })
      .catch(() => {
        clearAuthCookies(res);
        res.redirect('/auth/login');
      });
  }).catch(() => {
    clearAuthCookies(res);
    res.redirect('/auth/login');
  });
}

function clearAuthCookies(res) {
  res.clearCookie('sb_access_token');
  res.clearCookie('sb_refresh_token');
}
