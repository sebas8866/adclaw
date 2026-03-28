const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export function pageWrapper({ title, body, activeNav = '', scripts = '', noAuth = false, publicNav = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — AdClaw</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #05070f;
      --bg-surface: #0c1121;
      --bg-elevated: #111933;
      --bg-hover: #13203f;
      --border: rgba(124, 162, 255, 0.18);
      --border-hover: rgba(144, 176, 255, 0.32);
      --border-active: rgba(110, 173, 255, 0.55);
      --text: #eef3ff;
      --text-secondary: #b6c4ea;
      --text-muted: #8093c3;
      --text-dim: #6478ab;
      --primary: #6cadff;
      --primary-hover: #9cc7ff;
      --primary-soft: rgba(108, 173, 255, 0.16);
      --green: #10b981;
      --red: #ef4444;
      --amber: #f59e0b;
      --blue: #6cadff;
      --font-display: 'Manrope', sans-serif;
      --font-body: 'Manrope', sans-serif;
      --font-mono: 'IBM Plex Mono', monospace;
      --r-sm: 8px;
      --r-md: 14px;
      --r-lg: 20px;
      --r-xl: 28px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: radial-gradient(1200px 600px at 20% -10%, rgba(98, 157, 255, 0.18), transparent 50%),
                  radial-gradient(800px 500px at 100% -10%, rgba(121, 95, 255, 0.14), transparent 46%),
                  var(--bg);
      color: var(--text);
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
    }

    a { color: inherit; text-decoration: none; }

    .reveal {
      opacity: 0;
      transform: translateY(14px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-d1 { transition-delay: 0.04s; }
    .reveal-d2 { transition-delay: 0.08s; }
    .reveal-d3 { transition-delay: 0.12s; }
    .reveal-d4 { transition-delay: 0.16s; }
    .reveal-d5 { transition-delay: 0.2s; }
    .reveal-d6 { transition-delay: 0.24s; }
    .reveal-d7 { transition-delay: 0.28s; }
    .reveal-d8 { transition-delay: 0.32s; }

    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 26px;
      height: 70px;
      background: rgba(5, 7, 15, 0.78);
      backdrop-filter: blur(14px) saturate(1.2);
      border-bottom: 1px solid rgba(124, 162, 255, 0.16);
    }
    .nav-brand {
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-brand svg { width: 18px; height: 18px; }
    .nav-links { display: flex; gap: 8px; }
    .nav-links a {
      padding: 8px 11px;
      border-radius: var(--r-sm);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      transition: color 0.2s, background 0.2s;
    }
    .nav-links a:hover {
      color: #fff;
      background: rgba(123, 166, 255, 0.1);
    }
    .nav-links a.active {
      color: var(--text);
      background: linear-gradient(180deg, rgba(122, 170, 255, 0.2), rgba(122, 170, 255, 0.08));
      border: 1px solid rgba(122, 170, 255, 0.34);
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--text-muted);
    }
    .nav-user a { color: var(--text-secondary); font-weight: 600; }
    .nav-user a:hover { color: var(--text); }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .nav { padding: 0 16px; }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: var(--r-md);
      font-size: 13px;
      font-weight: 600;
      font-family: var(--font-body);
      border: none;
      cursor: pointer;
      transition: all 0.22s ease;
      text-decoration: none;
      line-height: 1;
    }
    .btn-primary {
      background: linear-gradient(180deg, #7db8ff, #6cadff);
      color: #031028;
      border: 1px solid rgba(156, 199, 255, 0.6);
      box-shadow: 0 12px 30px rgba(88, 143, 255, 0.28);
    }
    .btn-primary:hover {
      background: linear-gradient(180deg, #a8ceff, #82bcff);
      border-color: rgba(192, 219, 255, 0.75);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: var(--bg-surface);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      border-color: rgba(139, 177, 255, 0.45);
      background: var(--bg-elevated);
      color: #eaf1ff;
    }
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid rgba(122, 162, 250, 0.22);
    }
    .btn-ghost:hover {
      border-color: var(--border-hover);
      color: var(--text);
      background: var(--bg-surface);
    }
    .btn-danger { background: var(--red); color: #fff; border: 1px solid var(--red); }
    .btn-danger:hover { opacity: 0.92; }
    .btn-sm { padding: 7px 14px; font-size: 12px; }
    .btn-lg { padding: 14px 30px; font-size: 14px; }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

    .container { max-width: 1180px; margin: 0 auto; padding: 0 30px; }
    .section { padding: 112px 0; }
    @media (max-width: 900px) {
      .section { padding: 88px 0; }
      .container { padding: 0 20px; }
    }

    .grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
    @media (max-width: 980px) { .grid-3, .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 640px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }

    .card {
      background: linear-gradient(180deg, rgba(15, 23, 45, 0.92), rgba(12, 17, 33, 0.92));
      border: 1px solid rgba(128, 166, 255, 0.18);
      border-radius: var(--r-lg);
      padding: 24px;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .card:hover { border-color: rgba(154, 188, 255, 0.34); background: linear-gradient(180deg, rgba(17, 26, 49, 0.95), rgba(13, 20, 37, 0.95)); }

    .text-hero {
      font-family: var(--font-display);
      font-size: clamp(48px, 7vw, 92px);
      font-weight: 800;
      letter-spacing: -0.038em;
      line-height: 0.98;
    }
    .text-section {
      font-family: var(--font-display);
      font-size: clamp(30px, 4.1vw, 54px);
      font-weight: 800;
      letter-spacing: -0.028em;
      line-height: 1.05;
    }
    .text-headline { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
    .text-body {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.72;
    }
    .text-small { font-size: 12px; color: var(--text-muted); }
    .text-mono { font-family: var(--font-mono); }

    .label-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      color: #cde1ff;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }
    .label-tag::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: linear-gradient(180deg, #9bc8ff, #6cadff);
    }

    .form-group { margin-bottom: 20px; }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 7px;
    }
    .form-input {
      width: 100%;
      padding: 12px 14px;
      background: rgba(11, 16, 29, 0.9);
      border: 1px solid rgba(124, 162, 255, 0.2);
      border-radius: var(--r-md);
      color: var(--text);
      font-size: 14px;
      font-family: var(--font-body);
      transition: border-color 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(108, 173, 255, 0.12);
    }
    .form-input::placeholder { color: var(--text-dim); }
    textarea.form-input { resize: vertical; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 500;
    }
    .badge-green { background: rgba(16, 185, 129, 0.12); color: var(--green); border: 1px solid rgba(16, 185, 129, 0.26); }
    .badge-orange { background: rgba(245, 158, 11, 0.12); color: var(--amber); border: 1px solid rgba(245, 158, 11, 0.26); }
    .badge-red { background: rgba(239, 68, 68, 0.12); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.26); }
    .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .dot-green { background: var(--green); }
    .dot-red { background: var(--red); }
    .dot-orange { background: var(--amber); }

    .table-wrap { overflow-x: auto; border: 1px solid rgba(127, 165, 255, 0.18); border-radius: 14px; }
    table { width: 100%; border-collapse: collapse; }
    th {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(127, 165, 255, 0.16);
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(127, 165, 255, 0.16);
      font-size: 13px;
      color: var(--text-secondary);
    }
    tr:hover td { background: rgba(111, 160, 255, 0.08); color: var(--text); }

    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(127, 165, 255, 0.16);
    }
    .metric-row:last-child { border-bottom: none; }
    .metric-label { font-size: 13px; color: var(--text-muted); }
    .metric-value { font-size: 13px; font-weight: 600; font-family: var(--font-mono); }

    .progress {
      height: 4px;
      background: rgba(119, 151, 220, 0.2);
      border-radius: 999px;
      overflow: hidden;
    }
    .progress-fill { height: 100%; border-radius: 999px; transition: width 0.5s ease; }

    .toast-container {
      position: fixed;
      top: 86px;
      right: 20px;
      z-index: 999;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toast {
      padding: 12px 16px;
      border-radius: var(--r-md);
      background: rgba(11, 16, 29, 0.96);
      border: 1px solid rgba(128, 165, 248, 0.3);
      font-size: 13px;
      color: var(--text-secondary);
      max-width: 340px;
      animation: toastSlide 0.2s ease;
    }
    @keyframes toastSlide {
      from { transform: translateX(24px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(153, 185, 247, 0.28);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state { text-align: center; padding: 72px 20px; }
    .empty-state h3 {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .empty-state p { color: var(--text-muted); font-size: 13px; }

    .footer {
      border-top: 1px solid rgba(127, 165, 255, 0.18);
      padding: 26px 32px 40px;
      font-size: 12px;
      color: var(--text-dim);
    }
    .footer-inner {
      max-width: 1160px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .footer a { color: var(--text-dim); }
    .footer a:hover { color: #d9e7ff; }

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
      <svg viewBox="0 0 24 24" fill="none"><path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" fill="#8ec0ff" stroke="#8ec0ff" stroke-width="1.5" stroke-linejoin="round"/></svg>
      AdClaw
    </a>
    <div class="nav-links">
      ${publicNav ? `
      <a href="/"${activeNav === 'home' ? ' class="active"' : ''}>Home</a>
      <a href="/#how">How it works</a>
      <a href="/#pricing">Pricing</a>
      <a href="/contact"${activeNav === 'contact' ? ' class="active"' : ''}>Contact</a>
      ` : `
      <a href="/"${activeNav === 'home' ? ' class="active"' : ''}>Home</a>
      <a href="/app"${activeNav === 'app' ? ' class="active"' : ''}>Dashboard</a>
      <a href="/app/launch"${activeNav === 'launch' ? ' class="active"' : ''}>Launch</a>
      <a href="/app/swarms"${activeNav === 'swarms' ? ' class="active"' : ''}>Swarms</a>
      <a href="/contact"${activeNav === 'contact' ? ' class="active"' : ''}>Contact</a>
      `}
    </div>
    <div class="nav-user">
      ${publicNav ? `
      <a href="/auth/login">Log in</a>
      <a href="/contact" class="btn btn-primary btn-sm">Contact us</a>
      ` : `
      <a href="/auth/logout">Sign out</a>
      `}
    </div>
  </nav>`}

  <div id="toast-container" class="toast-container"></div>

  ${body}

  ${noAuth ? '' : `<footer class="footer">
    <div class="footer-inner">
      <span style="font-family:var(--font-mono);">ADCLAW v0.1</span>
      <div style="display:flex;gap:18px;">
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
      if (type === 'success') t.style.borderColor = 'rgba(16,185,129,0.36)';
      if (type === 'error') t.style.borderColor = 'rgba(239,68,68,0.36)';
      t.textContent = msg;
      c.appendChild(t);
      setTimeout(function() {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.2s';
        setTimeout(function() { t.remove(); }, 220);
      }, 3000);
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
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
  </script>
  ${scripts}
</body>
</html>`;
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
