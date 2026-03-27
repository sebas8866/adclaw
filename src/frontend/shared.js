const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export function pageWrapper({ title, body, activeNav = '', scripts = '', noAuth = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — AdClaw</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #09090B;
      --bg-surface: #141416;
      --bg-elevated: #1C1C1F;
      --bg-hover: #242428;
      --border: rgba(255,255,255,0.06);
      --border-hover: rgba(255,255,255,0.1);
      --border-active: rgba(255,107,44,0.25);
      --text: #FAFAF9;
      --text-secondary: #B0B0B5;
      --text-muted: #6E6E76;
      --text-dim: #3E3E45;
      --primary: #FF6B2C;
      --primary-hover: #FF8A4C;
      --primary-soft: rgba(255,107,44,0.1);
      --green: #10B981;
      --red: #EF4444;
      --amber: #F59E0B;
      --blue: #3B82F6;
      --font-display: 'Bricolage Grotesque', serif;
      --font-body: 'DM Sans', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --r-sm: 8px;
      --r-md: 12px;
      --r-lg: 16px;
      --r-xl: 20px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; }

    /* ── SCROLL REVEAL ──────────────────── */
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .reveal-d1 { transition-delay: 0.07s; }
    .reveal-d2 { transition-delay: 0.14s; }
    .reveal-d3 { transition-delay: 0.21s; }
    .reveal-d4 { transition-delay: 0.28s; }
    .reveal-d5 { transition-delay: 0.35s; }
    .reveal-d6 { transition-delay: 0.42s; }
    .reveal-d7 { transition-delay: 0.49s; }
    .reveal-d8 { transition-delay: 0.56s; }

    /* ── NAV ────────────────────────────── */
    .nav {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 32px; height: 56px;
      background: rgba(9,9,11,0.8);
      backdrop-filter: blur(16px) saturate(1.6);
      border-bottom: 1px solid var(--border);
    }
    .nav-brand {
      font-family: var(--font-display);
      font-size: 18px; font-weight: 700;
      display: flex; align-items: center; gap: 8px;
    }
    .nav-brand svg { width: 22px; height: 22px; }
    .nav-links { display: flex; gap: 2px; }
    .nav-links a {
      padding: 6px 14px; border-radius: var(--r-sm);
      font-size: 13px; font-weight: 500;
      color: var(--text-muted);
      transition: color 0.2s, background 0.2s;
    }
    .nav-links a:hover { color: var(--text-secondary); }
    .nav-links a.active { color: var(--text); background: var(--bg-surface); }
    .nav-user {
      display: flex; align-items: center; gap: 12px;
      font-size: 13px; color: var(--text-muted);
    }
    .nav-user a { color: var(--primary); font-weight: 500; }
    .nav-user a:hover { color: var(--primary-hover); }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav { padding: 0 16px; }
    }

    /* ── BUTTONS ────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 22px; border-radius: var(--r-md);
      font-size: 13px; font-weight: 600; font-family: var(--font-body);
      border: none; cursor: pointer;
      transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
      text-decoration: none; line-height: 1;
    }
    .btn-primary {
      background: var(--primary); color: #fff;
    }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-secondary {
      background: var(--bg-surface); color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover { border-color: var(--border-hover); background: var(--bg-elevated); }
    .btn-ghost {
      background: transparent; color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover { border-color: var(--border-hover); color: var(--text); }
    .btn-danger { background: var(--red); color: #fff; }
    .btn-danger:hover { opacity: 0.9; }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 14px 32px; font-size: 14px; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

    /* ── LAYOUT ─────────────────────────── */
    .container { max-width: 1100px; margin: 0 auto; padding: 0 32px; }
    .section { padding: 100px 0; }
    @media (max-width: 768px) { .section { padding: 64px 0; } .container { padding: 0 20px; } }

    /* ── GRID ───────────────────────────── */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 900px) { .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }

    /* ── CARD ───────────────────────────── */
    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 24px;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: var(--border-hover); }

    /* ── TYPOGRAPHY ─────────────────────── */
    .text-hero {
      font-family: var(--font-display);
      font-size: clamp(44px, 6vw, 72px);
      font-weight: 700; letter-spacing: -0.03em; line-height: 1.05;
    }
    .text-section {
      font-family: var(--font-display);
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 700; letter-spacing: -0.02em; line-height: 1.1;
    }
    .text-headline {
      font-family: var(--font-display);
      font-size: 18px; font-weight: 600;
    }
    .text-body { font-size: 15px; color: var(--text-secondary); line-height: 1.7; }
    .text-small { font-size: 12px; color: var(--text-muted); }
    .text-mono { font-family: var(--font-mono); }

    .label-tag {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: var(--font-mono);
      font-size: 11px; font-weight: 500;
      color: var(--primary);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* ── FORMS ──────────────────────────── */
    .form-group { margin-bottom: 20px; }
    .form-group label {
      display: block;
      font-size: 13px; font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .form-input {
      width: 100%; padding: 12px 16px;
      background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--r-md); color: var(--text);
      font-size: 14px; font-family: var(--font-body);
      transition: border-color 0.2s;
    }
    .form-input:focus { outline: none; border-color: var(--primary); }
    .form-input::placeholder { color: var(--text-dim); }
    textarea.form-input { resize: vertical; }

    /* ── STATUS ─────────────────────────── */
    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 999px;
      font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    }
    .badge-green { background: rgba(16,185,129,0.1); color: var(--green); }
    .badge-orange { background: rgba(245,158,11,0.1); color: var(--amber); }
    .badge-red { background: rgba(239,68,68,0.1); color: var(--red); }
    .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .dot-green { background: var(--green); }
    .dot-red { background: var(--red); }
    .dot-orange { background: var(--amber); }

    /* ── TABLE ──────────────────────────── */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left; font-size: 11px; font-weight: 600;
      color: var(--text-muted); text-transform: uppercase;
      letter-spacing: 0.05em; padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }
    td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13px; }
    tr:hover td { background: var(--bg-elevated); }

    /* ── METRIC ─────────────────────────── */
    .metric-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 0; border-bottom: 1px solid var(--border);
    }
    .metric-row:last-child { border-bottom: none; }
    .metric-label { font-size: 13px; color: var(--text-muted); }
    .metric-value { font-size: 13px; font-weight: 600; font-family: var(--font-mono); }

    /* ── PROGRESS ───────────────────────── */
    .progress { height: 3px; background: var(--bg-elevated); border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

    /* ── TOAST ──────────────────────────── */
    .toast-container { position: fixed; top: 72px; right: 20px; z-index: 999; display: flex; flex-direction: column; gap: 8px; }
    .toast {
      padding: 12px 18px; border-radius: var(--r-md);
      background: var(--bg-elevated); border: 1px solid var(--border-hover);
      font-size: 13px; max-width: 340px;
      animation: toastSlide 0.3s cubic-bezier(0.22,1,0.36,1);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    @keyframes toastSlide {
      from { transform: translateX(30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    /* ── SPINNER ────────────────────────── */
    .spinner {
      width: 18px; height: 18px; border: 2px solid var(--border-hover);
      border-top-color: var(--primary); border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── EMPTY STATE ────────────────────── */
    .empty-state { text-align: center; padding: 64px 20px; }
    .empty-state h3 { font-family: var(--font-display); font-size: 18px; font-weight: 600; margin-bottom: 6px; }
    .empty-state p { color: var(--text-muted); font-size: 13px; }

    /* ── FOOTER ─────────────────────────── */
    .footer {
      border-top: 1px solid var(--border);
      padding: 32px;
      font-size: 12px; color: var(--text-dim);
    }
    .footer-inner {
      max-width: 1100px; margin: 0 auto;
      display: flex; justify-content: space-between; align-items: center;
    }
    .footer a { color: var(--text-dim); }
    .footer a:hover { color: var(--text-muted); }

    /* ── UTILITY ────────────────────────── */
    .mt-1 { margin-top: 8px; }
    .mt-2 { margin-top: 16px; }
    .mt-3 { margin-top: 24px; }
    .mt-4 { margin-top: 32px; }
    .mt-6 { margin-top: 48px; }
    .mt-8 { margin-top: 64px; }
    .mb-2 { margin-bottom: 16px; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-2 { gap: 12px; }
    .gap-3 { gap: 20px; }
    .text-center { text-align: center; }
  </style>
</head>
<body>
  ${noAuth ? '' : `<nav class="nav">
    <a href="/" class="nav-brand">
      <svg viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="var(--primary)" stroke="var(--primary)" stroke-width="1.5" stroke-linejoin="round"/></svg>
      AdClaw
    </a>
    <div class="nav-links">
      <a href="/"${activeNav === 'home' ? ' class="active"' : ''}>Home</a>
      <a href="/app"${activeNav === 'app' ? ' class="active"' : ''}>Dashboard</a>
      <a href="/app/launch"${activeNav === 'launch' ? ' class="active"' : ''}>Launch</a>
      <a href="/app/swarms"${activeNav === 'swarms' ? ' class="active"' : ''}>Swarms</a>
    </div>
    <div class="nav-user">
      <a href="/auth/logout">Sign out</a>
    </div>
  </nav>`}

  <div id="toast-container" class="toast-container"></div>

  ${body}

  ${noAuth ? '' : `<footer class="footer">
    <div class="footer-inner">
      <span style="font-family:var(--font-mono);">ADCLAW v0.1</span>
      <div style="display:flex;gap:20px;">
        <a href="/api/health">API</a>
        <a href="/app">Dashboard</a>
      </div>
    </div>
  </footer>`}

  <script>
    function showToast(msg, type) {
      var c = document.getElementById('toast-container');
      var t = document.createElement('div');
      t.className = 'toast';
      if (type === 'success') t.style.borderColor = 'rgba(16,185,129,0.3)';
      if (type === 'error') t.style.borderColor = 'rgba(239,68,68,0.3)';
      t.textContent = msg;
      c.appendChild(t);
      setTimeout(function() { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(function() { t.remove(); }, 300); }, 3000);
    }

    async function api(path, opts) {
      opts = opts || {};
      var fetchOpts = { method: opts.method || 'GET', headers: { 'Content-Type': 'application/json' } };
      if (opts.body) fetchOpts.body = JSON.stringify(opts.body);
      var res = await fetch('/api' + path, fetchOpts);
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
  </script>
  ${scripts}
</body>
</html>`;
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
