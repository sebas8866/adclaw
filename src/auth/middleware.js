import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const PUBLIC_PATHS = ['/auth/login', '/auth/signup', '/auth/callback', '/auth/meta', '/api/health'];

export function requireAuth(req, res, next) {
  if (PUBLIC_PATHS.some(p => req.path.startsWith(p))) {
    return next();
  }

  if (req.path.startsWith('/api/')) {
    return next();
  }

  const token = req.cookies?.sb_access_token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  if (!supabase) {
    return next();
  }

  supabase.auth.getUser(token).then(({ data, error }) => {
    if (error || !data?.user) {
      res.clearCookie('sb_access_token');
      return res.redirect('/auth/login');
    }
    req.user = data.user;
    next();
  }).catch(() => {
    res.redirect('/auth/login');
  });
}
