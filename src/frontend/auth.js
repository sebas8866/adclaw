import { pageWrapper, SUPABASE_URL, SUPABASE_ANON_KEY } from './shared.js';

function authShell({
  title,
  subtitle,
  ctaText,
  ctaHref,
  ctaLinkText,
  submitId,
  submitText,
  formHtml,
  rightTitle,
  rightCopy,
  statsHtml,
  error,
  submitHandler,
  kicker = '',
  footNoteHtml = '',
}) {
  return `
  <style>
    .auth-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background:
        radial-gradient(ellipse 80% 50% at 0% 0%, rgba(98, 157, 255, 0.14), transparent 50%),
        radial-gradient(ellipse 60% 40% at 100% 100%, rgba(121, 95, 255, 0.08), transparent 45%),
        var(--bg);
    }
    .auth-left {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 28px 64px;
    }
    .auth-right {
      position: relative;
      border-left: 1px solid rgba(124, 162, 255, 0.14);
      background: linear-gradient(165deg, rgba(14, 22, 42, 0.98) 0%, rgba(6, 10, 20, 0.99) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 40px;
      overflow: hidden;
    }
    .auth-right-glow {
      position: absolute;
      width: 420px;
      height: 420px;
      right: -120px;
      top: 10%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(108, 173, 255, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }
    .auth-panel {
      width: 100%;
      max-width: 420px;
    }
    .auth-brand {
      font-family: var(--font-display);
      font-weight: 800;
      letter-spacing: -0.02em;
      display: inline-flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 10px;
      color: #dce9ff;
    }
    .auth-brand svg { width: 20px; height: 20px; }
    .auth-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-dim);
      margin-bottom: 22px;
      transition: color 0.2s;
    }
    .auth-back:hover { color: var(--text-secondary); }
    .auth-card {
      border: 1px solid rgba(127, 166, 255, 0.22);
      background: rgba(10, 16, 30, 0.92);
      border-radius: 22px;
      padding: 28px 28px 26px;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255,255,255,0.03) inset;
    }
    .auth-kicker {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 10px;
    }
    .auth-title {
      font-family: var(--font-display);
      font-size: clamp(26px, 4vw, 32px);
      font-weight: 800;
      letter-spacing: -0.035em;
      line-height: 1.15;
    }
    .auth-sub { margin-top: 10px; font-size: 14px; line-height: 1.55; color: var(--text-secondary); }
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
    .auth-form .form-input {
      background: rgba(6, 10, 20, 0.85);
      border-color: rgba(124, 162, 255, 0.2);
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .auth-form .form-input:focus {
      outline: none;
      border-color: rgba(108, 173, 255, 0.55);
      box-shadow: 0 0 0 3px rgba(108, 173, 255, 0.12);
    }
    .auth-form label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--text-secondary);
    }
    .auth-field-wrap {
      position: relative;
    }
    .auth-field-wrap .form-input { padding-right: 88px; }
    .auth-pass-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: rgba(108, 173, 255, 0.1);
      color: #b8d4ff;
      font-size: 11px;
      font-weight: 600;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .auth-pass-toggle:hover {
      background: rgba(108, 173, 255, 0.18);
      color: #fff;
    }
    .auth-helper {
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-dim);
      line-height: 1.45;
    }
    .auth-trust {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid rgba(124, 162, 255, 0.12);
      font-size: 12px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .auth-trust svg { flex-shrink: 0; opacity: 0.85; }
    .auth-legal {
      margin-top: 14px;
      font-size: 12px;
      line-height: 1.5;
      color: var(--text-dim);
      text-align: center;
    }
    .auth-legal a { color: #cbe0ff; font-weight: 600; }
    .auth-legal a:hover { color: #fff; }
    .auth-foot {
      margin-top: 18px;
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
    }
    .auth-foot a { color: #cbe0ff; font-weight: 600; }
    .auth-foot a:hover { color: #fff; }
    .auth-forgot-row {
      text-align: right;
      margin-top: -6px;
      margin-bottom: 14px;
      font-size: 13px;
    }
    .auth-forgot-row a { color: #cbe0ff; font-weight: 600; }
    .auth-forgot-row a:hover { color: #fff; }
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
      font-size: clamp(26px, 3.5vw, 34px);
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.035em;
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
      border: 1px solid rgba(132, 173, 255, 0.2);
      border-radius: 14px;
      background: rgba(107, 170, 255, 0.06);
      padding: 14px;
      transition: border-color 0.2s, background 0.2s;
    }
    .auth-stat:hover {
      border-color: rgba(152, 188, 255, 0.35);
      background: rgba(107, 170, 255, 0.1);
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
      .auth-shell { grid-template-columns: 1fr; min-height: auto; }
      .auth-left { padding-top: 32px; }
      .auth-right {
        border-left: none;
        border-top: 1px solid rgba(124,162,255,0.14);
        padding: 40px 28px 56px;
      }
    }
  </style>

  <div class="auth-shell">
    <div class="auth-left">
      <div class="auth-panel">
        <a href="/" class="auth-brand">
          <svg viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="#8ec0ff" stroke="#8ec0ff" stroke-width="1.5" stroke-linejoin="round"/></svg>
          AdClaw
        </a>
        <a href="/" class="auth-back">← Back to home</a>
        <div class="auth-card">
          ${kicker ? `<div class="auth-kicker">${kicker}</div>` : ''}
          <h1 class="auth-title">${title}</h1>
          <p class="auth-sub">${subtitle}</p>
          ${error ? `<div class="auth-error">${error}</div>` : ''}
          <form class="auth-form" onsubmit="${submitHandler}(event)">
            ${formHtml}
            <button type="submit" id="${submitId}" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:4px;">${submitText}</button>
          </form>
          <div class="auth-trust" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
            <span>Session secured with Supabase Auth (encrypted in transit).</span>
          </div>
          <div class="auth-foot">${ctaText} <a href="${ctaHref}">${ctaLinkText != null ? ctaLinkText : (ctaHref.includes('signup') ? 'Create one' : 'Sign in')}</a></div>
          ${footNoteHtml}
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-right-glow" aria-hidden="true"></div>
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
      kicker: 'Sign in',
      title: 'Welcome back',
      subtitle: 'Use your work email and password. Connect Meta from the dashboard after you sign in.',
      ctaText: 'New here?',
      ctaHref: '/auth/signup',
      ctaLinkText: 'Create an account',
      footNoteHtml: '<p class="auth-legal" style="margin-top:12px;padding-top:0;border-top:0">Need enterprise onboarding? <a href="/contact">Contact our team</a></p>',
      submitId: 'btn-login',
      submitText: 'Sign in',
      submitHandler: 'handleLogin',
      error,
      formHtml: `
        <div class="form-group">
          <label for="inp-email">Work email</label>
          <input type="email" id="inp-email" name="email" class="form-input" placeholder="you@company.com" required autocomplete="username" inputmode="email">
        </div>
        <div class="form-group">
          <label for="inp-pass">Password</label>
          <div class="auth-field-wrap">
            <input type="password" id="inp-pass" name="password" class="form-input" placeholder="••••••••" required autocomplete="current-password">
            <button type="button" class="auth-pass-toggle" data-target="inp-pass" aria-label="Show password">Show</button>
          </div>
        </div>
        <div class="auth-forgot-row"><a href="/auth/forgot-password">Forgot password?</a></div>
      `,
      rightTitle: 'Your ad accounts, run by a focused AI control layer.',
      rightCopy: 'Connect Facebook, select account access, and let the swarm monitor performance and adjust strategy continuously.',
      statsHtml: `
        <div class="auth-stat"><div class="v">6</div><div class="k">Live modules</div></div>
        <div class="auth-stat"><div class="v">1h</div><div class="k">Optimization loop</div></div>
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
    (function initPassToggle() {
      document.querySelectorAll('.auth-pass-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var id = btn.getAttribute('data-target');
          var inp = document.getElementById(id);
          if (!inp) return;
          var show = inp.type === 'password';
          inp.type = show ? 'text' : 'password';
          btn.textContent = show ? 'Hide' : 'Show';
          btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        });
      });
    })();
  </script>
`
  });
}

export function signupPage(error) {
  return pageWrapper({
    title: 'Create account',
    noAuth: true,
    body: authShell({
      kicker: 'Register',
      title: 'Create your workspace',
      subtitle: 'Enterprise onboarding. Use a strong password—you’ll connect Meta from the dashboard after you sign in.',
      ctaText: 'Already have an account?',
      ctaHref: '/auth/login',
      submitId: 'btn-signup',
      submitText: 'Create account',
      submitHandler: 'handleSignup',
      error,
      footNoteHtml: '<div class="auth-legal">By creating an account, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</div>',
      formHtml: `
        <div class="form-group">
          <label for="inp-email">Work email</label>
          <input type="email" id="inp-email" name="email" class="form-input" placeholder="you@company.com" required autocomplete="email" inputmode="email">
        </div>
        <div class="form-group">
          <label for="inp-pass">Password</label>
          <div class="auth-field-wrap">
            <input type="password" id="inp-pass" name="password" class="form-input" placeholder="At least 6 characters" required minlength="6" autocomplete="new-password">
            <button type="button" class="auth-pass-toggle" data-target="inp-pass" aria-label="Show password">Show</button>
          </div>
          <p class="auth-helper">Minimum 6 characters. Same email signs you in across devices.</p>
        </div>
        <div class="form-group">
          <label for="inp-pass2">Confirm password</label>
          <input type="password" id="inp-pass2" name="password2" class="form-input" placeholder="Repeat password" required minlength="6" autocomplete="new-password">
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
      var pass = document.getElementById('inp-pass').value;
      var pass2 = document.getElementById('inp-pass2').value;
      if (pass !== pass2) {
        showToast('Passwords do not match', 'error');
        return;
      }
      btn.disabled = true; btn.textContent = 'Creating account...';

      var email = document.getElementById('inp-email').value;

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
    (function initPassToggle() {
      document.querySelectorAll('.auth-pass-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var id = btn.getAttribute('data-target');
          var inp = document.getElementById(id);
          if (!inp) return;
          var show = inp.type === 'password';
          inp.type = show ? 'text' : 'password';
          btn.textContent = show ? 'Hide' : 'Show';
          btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        });
      });
    })();
  </script>
`
  });
}

export function forgotPasswordPage(error) {
  return pageWrapper({
    title: 'Reset password',
    noAuth: true,
    body: authShell({
      kicker: 'Account',
      title: 'Forgot password',
      subtitle: 'Enter your work email and we will send a secure link to set a new password.',
      ctaText: 'Remember your password?',
      ctaHref: '/auth/login',
      ctaLinkText: 'Sign in',
      submitId: 'btn-forgot',
      submitText: 'Send reset link',
      submitHandler: 'handleForgot',
      error,
      formHtml: `
        <div class="form-group">
          <label for="inp-email">Work email</label>
          <input type="email" id="inp-email" name="email" class="form-input" placeholder="you@company.com" required autocomplete="email" inputmode="email">
        </div>
      `,
      rightTitle: 'Account recovery, without the runaround.',
      rightCopy: 'Links expire after a short time. If you do not see the email, check spam or request another link.',
      statsHtml: `
        <div class="auth-stat"><div class="v">SSL</div><div class="k">Email links</div></div>
        <div class="auth-stat"><div class="v">1</div><div class="k">Enterprise plan</div></div>
        <div class="auth-stat"><div class="v">Meta</div><div class="k">OAuth ready</div></div>
        <div class="auth-stat"><div class="v">24/7</div><div class="k">Runtime</div></div>
      `,
    }),
    scripts: `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script>
    var sb = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');

    async function handleForgot(e) {
      e.preventDefault();
      var btn = document.getElementById('btn-forgot');
      btn.disabled = true; btn.textContent = 'Sending…';

      var email = document.getElementById('inp-email').value.trim();
      try {
        var redirectTo = window.location.origin + '/auth/reset-password';
        var result = await sb.auth.resetPasswordForEmail(email, { redirectTo: redirectTo });
        if (result.error) throw result.error;
        showToast('If that email is on file, we sent a reset link. Check your inbox.', 'success');
        btn.disabled = false; btn.textContent = 'Send reset link';
      } catch(err) {
        btn.disabled = false; btn.textContent = 'Send reset link';
        showToast(err.message || 'Request failed', 'error');
      }
    }
  </script>
`,
  });
}

export function resetPasswordPage(error) {
  return pageWrapper({
    title: 'New password',
    noAuth: true,
    body: authShell({
      kicker: 'Security',
      title: 'Set new password',
      subtitle: 'Choose a strong password for your AdClaw account.',
      ctaText: 'Need another link?',
      ctaHref: '/auth/forgot-password',
      ctaLinkText: 'Request again',
      submitId: 'btn-reset',
      submitText: 'Update password',
      submitHandler: 'handleResetPassword',
      error,
      formHtml: `
        <p id="reset-wait" class="auth-sub" style="margin-top:0;">Verifying your reset link…</p>
        <div id="reset-fields" style="display:none;">
          <div class="form-group">
            <label>New password</label>
            <input type="password" id="inp-pass" class="form-input" placeholder="Min. 6 characters" required minlength="6" autocomplete="new-password">
          </div>
          <div class="form-group">
            <label>Confirm password</label>
            <input type="password" id="inp-pass2" class="form-input" placeholder="Repeat password" required minlength="6" autocomplete="new-password">
          </div>
        </div>
      `,
      rightTitle: 'You are almost back in.',
      rightCopy: 'After updating your password, we will sign you in and drop you on the dashboard.',
      statsHtml: `
        <div class="auth-stat"><div class="v">AES</div><div class="k">Hashed storage</div></div>
        <div class="auth-stat"><div class="v">6</div><div class="k">Live modules</div></div>
        <div class="auth-stat"><div class="v">1h</div><div class="k">Optimization loop</div></div>
        <div class="auth-stat"><div class="v">ROAS</div><div class="k">Focused workflow</div></div>
      `,
    }),
    scripts: `
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
  <script>
    var sb = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');
    var recoveryReady = false;

    function showResetForm() {
      if (recoveryReady) return;
      recoveryReady = true;
      var waitEl = document.getElementById('reset-wait');
      var fieldsEl = document.getElementById('reset-fields');
      var btn = document.getElementById('btn-reset');
      if (waitEl) waitEl.style.display = 'none';
      if (fieldsEl) fieldsEl.style.display = 'block';
      if (btn) btn.disabled = false;
    }

    function showResetError(msg) {
      var waitEl = document.getElementById('reset-wait');
      var btn = document.getElementById('btn-reset');
      if (waitEl) {
        waitEl.style.display = 'block';
        waitEl.textContent = msg;
      }
      if (btn) btn.style.display = 'none';
    }

    (async function initReset() {
      var btn = document.getElementById('btn-reset');
      if (btn) btn.disabled = true;

      try {
        var u = new URL(window.location.href);
        if (u.searchParams.get('code')) {
          var ex = await sb.auth.exchangeCodeForSession(window.location.href);
          if (ex.error) throw ex.error;
        }
      } catch (e) {
        showResetError('This reset link is invalid or expired. Request a new one below.');
        return;
      }

      sb.auth.onAuthStateChange(function(event, session) {
        if (event === 'PASSWORD_RECOVERY' && session) showResetForm();
      });

      async function haveSession() {
        var r = await sb.auth.getSession();
        return !!(r.data && r.data.session);
      }

      if (await haveSession()) {
        showResetForm();
        return;
      }

      var tries = 0;
      var t = setInterval(async function() {
        tries += 1;
        if (await haveSession()) {
          clearInterval(t);
          showResetForm();
          return;
        }
        if (tries >= 20) {
          clearInterval(t);
          if (!recoveryReady) {
            showResetError('This reset link is invalid or expired. Request a new reset email.');
          }
        }
      }, 350);
    })();

    async function handleResetPassword(e) {
      e.preventDefault();
      var p1 = document.getElementById('inp-pass').value;
      var p2 = document.getElementById('inp-pass2').value;
      if (p1 !== p2) {
        showToast('Passwords do not match', 'error');
        return;
      }
      var btn = document.getElementById('btn-reset');
      btn.disabled = true; btn.textContent = 'Saving…';

      try {
        var result = await sb.auth.updateUser({ password: p1 });
        if (result.error) throw result.error;
        var sess = await sb.auth.getSession();
        if (sess.data && sess.data.session) {
          var s = sess.data.session;
          document.cookie = 'sb_access_token=' + s.access_token + ';path=/;max-age=' + s.expires_in + ';SameSite=Lax';
          document.cookie = 'sb_refresh_token=' + s.refresh_token + ';path=/;max-age=2592000;SameSite=Lax';
        }
        showToast('Password updated. Redirecting…', 'success');
        setTimeout(function() { window.location.href = '/app'; }, 600);
      } catch(err) {
        btn.disabled = false; btn.textContent = 'Update password';
        showToast(err.message || 'Update failed', 'error');
      }
    }
  </script>
`,
  });
}
