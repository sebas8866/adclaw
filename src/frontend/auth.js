import { pageWrapper, SUPABASE_URL, SUPABASE_ANON_KEY } from './shared.js';

export function loginPage(error) {
  return pageWrapper({
    title: 'Sign in',
    noAuth: true,
    body: `
  <style>
    .auth-wrap {
      min-height: 100vh; display: flex;
    }
    .auth-left {
      flex: 1; display: flex; align-items: center; justify-content: center;
      padding: 40px;
    }
    .auth-right {
      flex: 1; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      background: #05070d;
      border-left: 1px solid var(--border);
    }
    @media (max-width: 900px) { .auth-right { display: none; } }

    .auth-right-content {
      position: relative; z-index: 1; padding: 60px;
      max-width: 440px;
    }
    .auth-right::before {
      content: '';
      position: absolute;
      inset: 0;
      border-left: 1px solid rgba(82, 150, 255, 0.12);
      pointer-events: none;
    }

    .auth-box { max-width: 380px; width: 100%; }
    .auth-logo {
      font-family: var(--font-display);
      font-size: 22px; font-weight: 700;
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 40px;
    }
    .auth-logo svg { width: 24px; height: 24px; }
    .auth-title {
      font-family: var(--font-display);
      font-size: 28px; font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .auth-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; }
    .auth-error {
      padding: 10px 14px; border-radius: var(--r-md);
      background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
      color: var(--red); font-size: 13px; margin-bottom: 20px;
    }
    .auth-form .form-input {
      background: var(--bg-surface); border-color: var(--border);
      padding: 12px 16px;
    }
    .auth-footer {
      margin-top: 24px; text-align: center;
      font-size: 13px; color: var(--text-muted);
    }
    .auth-footer a { color: var(--primary); font-weight: 500; }
    .auth-footer a:hover { color: var(--primary-hover); }

    .auth-quote {
      font-family: var(--font-display);
      font-size: 24px; font-weight: 600;
      letter-spacing: -0.02em; line-height: 1.4;
      color: var(--text);
    }
    .auth-quote-attr {
      margin-top: 20px; font-size: 13px; color: var(--text-muted);
    }
    .auth-feature {
      display: flex; align-items: flex-start; gap: 14px;
      margin-top: 28px; padding-top: 28px;
      border-top: 1px solid var(--border);
    }
    .auth-feature-icon {
      width: 36px; height: 36px; border-radius: var(--r-sm);
      background: rgba(82, 150, 255, 0.12);
      border: 1px solid rgba(82, 150, 255, 0.24);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .auth-feature h4 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
    .auth-feature p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
  </style>

  <div class="auth-wrap">
    <div class="auth-left">
      <div class="auth-box">
        <div class="auth-logo">
          <svg viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="var(--primary)" stroke="var(--primary)" stroke-width="1.5" stroke-linejoin="round"/></svg>
          AdClaw
        </div>
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-sub">Sign in to your account to continue.</p>
        ${error ? `<div class="auth-error">${error}</div>` : ''}
        <form class="auth-form" id="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="inp-email" class="form-input" placeholder="you@company.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="inp-pass" class="form-input" placeholder="Your password" required>
          </div>
          <button type="submit" id="btn-login" class="btn btn-primary" style="width:100%;justify-content:center;padding:12px;">Sign in</button>
        </form>
        <div class="auth-footer">
          Don't have an account? <a href="/auth/signup">Create one</a>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-right-content">
        <p class="auth-quote">Six AI agents running your ad campaigns 24/7. No human intervention needed.</p>
        <p class="auth-quote-attr">Autonomous advertising, finally.</p>
        <div class="auth-feature">
          <div class="auth-feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <h4>Launches in under 5 minutes</h4>
            <p>Connect your ad accounts, paste your business page, and your swarm takes over immediately.</p>
          </div>
        </div>
        <div class="auth-feature">
          <div class="auth-feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z" stroke="currentColor" stroke-width="1.7"/><path d="M19.4 15a7.9 7.9 0 0 0 .1-2l2-1.5-2-3.4-2.4.6a8.2 8.2 0 0 0-1.7-1l-.4-2.5h-4l-.4 2.5a8.2 8.2 0 0 0-1.7 1L6.5 8l-2 3.5 2 1.5a7.9 7.9 0 0 0 .1 2l-2 1.5 2 3.4 2.4-.6c.5.4 1.1.7 1.7 1l.4 2.5h4l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4.6 2-3.4-2-1.5z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <h4>Optimizes every 15 minutes</h4>
            <p>Three AI tiers work together — local Ollama, Kimi research, and Claude Opus for strategic decisions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
    scripts: `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script>
    var sb = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');

    async function handleLogin(e) {
      e.preventDefault();
      var btn = document.getElementById('btn-login');
      btn.disabled = true; btn.textContent = 'Signing in...';

      var email = document.getElementById('inp-email').value;
      var pass = document.getElementById('inp-pass').value;

      try {
        var result = await sb.auth.signInWithPassword({ email: email, password: pass });
        if (result.error) throw result.error;
        var s = result.data.session;
        document.cookie = 'sb_access_token=' + s.access_token + ';path=/;max-age=' + s.expires_in + ';SameSite=Lax';
        document.cookie = 'sb_refresh_token=' + s.refresh_token + ';path=/;max-age=2592000;SameSite=Lax';
        window.location.href = '/app';
      } catch(err) {
        btn.disabled = false; btn.textContent = 'Sign in';
        showToast(err.message || 'Login failed', 'error');
      }
    }
  </script>
`
  });
}

export function signupPage(error) {
  return pageWrapper({
    title: 'Create account',
    noAuth: true,
    body: `
  <style>
    .auth-wrap {
      min-height: 100vh; display: flex;
    }
    .auth-left {
      flex: 1; display: flex; align-items: center; justify-content: center;
      padding: 40px;
    }
    .auth-right {
      flex: 1; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      background: #05070d;
      border-left: 1px solid var(--border);
    }
    @media (max-width: 900px) { .auth-right { display: none; } }

    .auth-right-content {
      position: relative; z-index: 1; padding: 60px;
      max-width: 440px;
    }
    .auth-right::before {
      content: '';
      position: absolute;
      inset: 0;
      border-left: 1px solid rgba(82, 150, 255, 0.12);
      pointer-events: none;
    }

    .auth-box { max-width: 380px; width: 100%; }
    .auth-logo {
      font-family: var(--font-display);
      font-size: 22px; font-weight: 700;
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 40px;
    }
    .auth-logo svg { width: 24px; height: 24px; }
    .auth-title {
      font-family: var(--font-display);
      font-size: 28px; font-weight: 700;
      letter-spacing: -0.02em; margin-bottom: 6px;
    }
    .auth-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; }
    .auth-error {
      padding: 10px 14px; border-radius: var(--r-md);
      background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
      color: var(--red); font-size: 13px; margin-bottom: 20px;
    }
    .auth-form .form-input {
      background: var(--bg-surface); border-color: var(--border);
    }
    .auth-footer {
      margin-top: 24px; text-align: center;
      font-size: 13px; color: var(--text-muted);
    }
    .auth-footer a { color: var(--primary); font-weight: 500; }
    .auth-quote {
      font-family: var(--font-display);
      font-size: 24px; font-weight: 600;
      letter-spacing: -0.02em; line-height: 1.4;
    }
    .auth-stats {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
      margin-top: 32px;
    }
    .auth-stat {
      padding: 20px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
    }
    .auth-stat-val {
      font-family: var(--font-mono);
      font-size: 28px; font-weight: 700;
      color: var(--primary);
    }
    .auth-stat-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
  </style>

  <div class="auth-wrap">
    <div class="auth-left">
      <div class="auth-box">
        <div class="auth-logo">
          <svg viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="var(--primary)" stroke="var(--primary)" stroke-width="1.5" stroke-linejoin="round"/></svg>
          AdClaw
        </div>
        <h1 class="auth-title">Create your account</h1>
        <p class="auth-sub">Start running autonomous ad campaigns in minutes.</p>
        ${error ? `<div class="auth-error">${error}</div>` : ''}
        <form class="auth-form" onsubmit="handleSignup(event)">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="inp-email" class="form-input" placeholder="you@company.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="inp-pass" class="form-input" placeholder="Min. 6 characters" required minlength="6">
          </div>
          <button type="submit" id="btn-signup" class="btn btn-primary" style="width:100%;justify-content:center;padding:12px;">Create account</button>
        </form>
        <div class="auth-footer">
          Already have an account? <a href="/auth/login">Sign in</a>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-right-content">
        <p class="auth-quote">Join the future of advertising automation.</p>
        <div class="auth-stats">
          <div class="auth-stat">
            <div class="auth-stat-val">6</div>
            <div class="auth-stat-label">AI Agents</div>
          </div>
          <div class="auth-stat">
            <div class="auth-stat-val">24/7</div>
            <div class="auth-stat-label">Autonomous</div>
          </div>
          <div class="auth-stat">
            <div class="auth-stat-val">15m</div>
            <div class="auth-stat-label">Optimization Cycle</div>
          </div>
          <div class="auth-stat">
            <div class="auth-stat-val">$0</div>
            <div class="auth-stat-label">To Start</div>
          </div>
        </div>
      </div>
    </div>
  </div>
`,
    scripts: `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script>
    var sb = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');

    async function handleSignup(e) {
      e.preventDefault();
      var btn = document.getElementById('btn-signup');
      btn.disabled = true; btn.textContent = 'Creating account...';

      var email = document.getElementById('inp-email').value;
      var pass = document.getElementById('inp-pass').value;

      try {
        var result = await sb.auth.signUp({ email: email, password: pass });
        if (result.error) throw result.error;
        if (result.data.session) {
          var s = result.data.session;
          document.cookie = 'sb_access_token=' + s.access_token + ';path=/;max-age=' + s.expires_in + ';SameSite=Lax';
          document.cookie = 'sb_refresh_token=' + s.refresh_token + ';path=/;max-age=2592000;SameSite=Lax';
          window.location.href = '/app';
        } else {
          showToast('Account created! You can now sign in.', 'success');
          setTimeout(function() { window.location.href = '/auth/login'; }, 1500);
        }
      } catch(err) {
        btn.disabled = false; btn.textContent = 'Create account';
        showToast(err.message || 'Signup failed', 'error');
      }
    }
  </script>
`
  });
}
