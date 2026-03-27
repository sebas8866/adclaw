import { pageWrapper, SUPABASE_URL, SUPABASE_ANON_KEY } from './shared.js';

function authShell({ title, subtitle, ctaText, ctaHref, ctaLinkText, submitId, submitText, formHtml, rightTitle, rightCopy, statsHtml, error, submitHandler }) {
  return `
  <style>
    .auth-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: radial-gradient(900px 500px at 8% -10%, rgba(108,173,255,0.16), transparent 55%), var(--bg);
    }
    .auth-left {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 46px 28px;
    }
    .auth-right {
      border-left: 1px solid rgba(124, 162, 255, 0.2);
      background: linear-gradient(180deg, rgba(12, 18, 36, 0.95), rgba(8, 12, 23, 0.95));
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
    }
    .auth-panel {
      width: 100%;
      max-width: 430px;
    }
    .auth-brand {
      font-family: var(--font-display);
      font-weight: 800;
      letter-spacing: -0.02em;
      display: inline-flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 24px;
      color: #dce9ff;
    }
    .auth-brand svg { width: 18px; height: 18px; }
    .auth-card {
      border: 1px solid rgba(127, 166, 255, 0.24);
      background: rgba(12, 19, 36, 0.9);
      border-radius: 20px;
      padding: 26px;
    }
    .auth-title {
      font-family: var(--font-display);
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .auth-sub { margin-top: 8px; font-size: 14px; color: var(--text-muted); }
    .auth-error {
      margin-top: 16px;
      border-radius: 12px;
      border: 1px solid rgba(239,68,68,0.3);
      background: rgba(239,68,68,0.08);
      color: var(--red);
      font-size: 13px;
      padding: 10px 12px;
    }
    .auth-form { margin-top: 22px; }
    .auth-form .form-input { background: rgba(8, 13, 24, 0.9); }
    .auth-foot {
      margin-top: 18px;
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
    }
    .auth-foot a { color: #cbe0ff; font-weight: 600; }
    .auth-foot a:hover { color: #fff; }
    .auth-right-inner {
      width: 100%;
      max-width: 430px;
    }
    .auth-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #b7d6ff;
    }
    .auth-right-title {
      margin-top: 16px;
      font-family: var(--font-display);
      font-size: 34px;
      font-weight: 800;
      line-height: 1.06;
      letter-spacing: -0.03em;
      color: #e8f2ff;
    }
    .auth-right-copy {
      margin-top: 14px;
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.7;
    }
    .auth-stats {
      margin-top: 22px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .auth-stat {
      border: 1px solid rgba(132, 173, 255, 0.24);
      border-radius: 14px;
      background: rgba(107, 170, 255, 0.08);
      padding: 14px;
    }
    .auth-stat .v {
      font-family: var(--font-mono);
      font-size: 20px;
      color: #d8e8ff;
      font-weight: 600;
    }
    .auth-stat .k {
      margin-top: 6px;
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: var(--font-mono);
    }
    @media (max-width: 980px) {
      .auth-shell { grid-template-columns: 1fr; }
      .auth-right { border-left: none; border-top: 1px solid rgba(124,162,255,0.2); }
    }
  </style>

  <div class="auth-shell">
    <div class="auth-left">
      <div class="auth-panel">
        <a href="/" class="auth-brand">
          <svg viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="#8ec0ff" stroke="#8ec0ff" stroke-width="1.5" stroke-linejoin="round"/></svg>
          AdClaw
        </a>
        <div class="auth-card">
          <h1 class="auth-title">${title}</h1>
          <p class="auth-sub">${subtitle}</p>
          ${error ? `<div class="auth-error">${error}</div>` : ''}
          <form class="auth-form" onsubmit="${submitHandler}(event)">
            ${formHtml}
            <button type="submit" id="${submitId}" class="btn btn-primary" style="width:100%;justify-content:center;">${submitText}</button>
          </form>
          <div class="auth-foot">${ctaText} <a href="${ctaHref}">${ctaLinkText != null ? ctaLinkText : (ctaHref.includes('signup') ? 'Create one' : 'Sign in')}</a></div>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-right-inner">
        <div class="auth-tag">Autonomous Ad Operations</div>
        <h2 class="auth-right-title">${rightTitle}</h2>
        <p class="auth-right-copy">${rightCopy}</p>
        <div class="auth-stats">${statsHtml}</div>
      </div>
    </div>
  </div>
`;
}

export function loginPage(error) {
  return pageWrapper({
    title: 'Sign in',
    noAuth: true,
    body: authShell({
      title: 'Welcome back',
      subtitle: 'Sign in to resume your autonomous campaign workflows.',
      ctaText: 'Need enterprise access?',
      ctaHref: 'mailto:support@adclaw.ai?subject=AdClaw%20Enterprise%20inquiry',
      ctaLinkText: 'Contact us',
      submitId: 'btn-login',
      submitText: 'Sign in',
      submitHandler: 'handleLogin',
      error,
      formHtml: `
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="inp-email" class="form-input" placeholder="you@company.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="inp-pass" class="form-input" placeholder="Your password" required>
        </div>
      `,
      rightTitle: 'Your ad accounts, run by a focused AI control layer.',
      rightCopy: 'Connect Facebook, select account access, and let the swarm monitor performance and adjust strategy continuously.',
      statsHtml: `
        <div class="auth-stat"><div class="v">6</div><div class="k">Live modules</div></div>
        <div class="auth-stat"><div class="v">15m</div><div class="k">Optimization loop</div></div>
        <div class="auth-stat"><div class="v">24/7</div><div class="k">Runtime</div></div>
        <div class="auth-stat"><div class="v">ROAS</div><div class="k">Driven workflow</div></div>
      `,
    }),
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
    body: authShell({
      title: 'Create account',
      subtitle: 'Enterprise onboarding. After we approve access, you can sign in here.',
      ctaText: 'Already have an account?',
      ctaHref: '/auth/login',
      submitId: 'btn-signup',
      submitText: 'Create account',
      submitHandler: 'handleSignup',
      error,
      formHtml: `
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="inp-email" class="form-input" placeholder="you@company.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="inp-pass" class="form-input" placeholder="Min. 6 characters" required minlength="6">
        </div>
      `,
      rightTitle: 'Set up once. Let the system execute daily.',
      rightCopy: 'From research and creative generation to account-safe launch and optimization, AdClaw provides a complete operating workflow.',
      statsHtml: `
        <div class="auth-stat"><div class="v">1</div><div class="k">Enterprise plan</div></div>
        <div class="auth-stat"><div class="v">Meta</div><div class="k">Native OAuth</div></div>
        <div class="auth-stat"><div class="v">6</div><div class="k">Live modules</div></div>
        <div class="auth-stat"><div class="v">1</div><div class="k">Unified dashboard</div></div>
      `,
    }),
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
