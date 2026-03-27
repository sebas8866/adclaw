import { pageWrapper } from './shared.js';

export function homePage({ isLoggedIn = false } = {}) {
  return pageWrapper({
    title: 'Autonomous AI Ad Agency',
    activeNav: 'home',
    publicNav: !isLoggedIn,
    body: `
  <style>
    .hero {
      padding: 128px 0 44px;
      position: relative;
    }
    .hero-wrap {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 26px;
      align-items: stretch;
    }
    .hero-copy p { max-width: 620px; }
    .hero-subtle {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 18px;
    }
    .hero-title { max-width: 700px; }
    .hero-title .accent { color: #a5ceff; }
    .hero-cta { margin-top: 30px; display: flex; gap: 12px; flex-wrap: wrap; }
    .hero-proof {
      margin-top: 22px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: var(--text-muted);
    }
    .hero-proof .dot-mini {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: #78b6ff;
    }
    .hero-metrics {
      padding: 18px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 26px;
    }
    .hero-metric {
      background: rgba(108, 173, 255, 0.08);
      border: 1px solid rgba(130, 172, 255, 0.24);
      border-radius: 14px;
      padding: 16px 14px;
    }
    .hero-metric .val {
      font-family: var(--font-mono);
      font-size: 24px;
      font-weight: 600;
      color: #dbe8ff;
    }
    .hero-metric .lab {
      margin-top: 6px;
      color: var(--text-muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      font-family: var(--font-mono);
    }
    .hero-panel {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 100%;
    }
    .hero-row {
      border: 1px solid rgba(126, 170, 255, 0.22);
      background: rgba(118, 164, 255, 0.08);
      border-radius: 14px;
      padding: 14px;
    }
    .hero-row .k {
      color: var(--text-muted);
      font-size: 11px;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .hero-row .v { margin-top: 8px; font-weight: 700; font-size: 16px; }
    .hero-row .s { margin-top: 4px; color: var(--text-secondary); font-size: 13px; }
    .hero-code {
      margin-top: auto;
      border-radius: 14px;
      border: 1px solid rgba(129, 171, 255, 0.24);
      background: rgba(7, 11, 20, 0.86);
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.8;
      color: #d5e5ff;
    }
    .hero-code .note { color: #87a6dd; }

    .logo-strip {
      margin-top: 24px;
      border-top: 1px solid rgba(134, 173, 255, 0.16);
      border-bottom: 1px solid rgba(134, 173, 255, 0.16);
      padding: 12px 0;
      display: flex;
      gap: 26px;
      overflow: hidden;
      white-space: nowrap;
    }
    .logo-strip span {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .band {
      background: rgba(11, 17, 32, 0.66);
      border-top: 1px solid rgba(130, 171, 255, 0.18);
      border-bottom: 1px solid rgba(130, 171, 255, 0.18);
    }
    .process {
      margin-top: 42px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .process .num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: #a6c8ff;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
    }

    .feature-grid { margin-top: 42px; }
    .feature-card .mini {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 10px;
    }

    .pricing-grid {
      margin-top: 42px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .price-card { display: flex; flex-direction: column; min-height: 100%; }
    .price-card.featured {
      border-color: rgba(143, 182, 255, 0.44);
      background: linear-gradient(180deg, rgba(18, 30, 58, 0.92), rgba(14, 22, 43, 0.92));
    }
    .price-tier {
      color: #bdd8ff;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 11px;
      font-family: var(--font-mono);
    }
    .price-amount {
      margin-top: 8px;
      font-family: var(--font-display);
      font-size: 44px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .price-amount span {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .price-points {
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid rgba(134, 175, 255, 0.18);
      flex: 1;
    }
    .price-points li {
      list-style: none;
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 12px;
      display: flex;
      gap: 8px;
    }
    .price-points li::before {
      content: '•';
      color: #9fc9ff;
    }
    .price-card .btn { margin-top: 12px; width: 100%; justify-content: center; }

    .cta-block {
      max-width: 760px;
      margin: 0 auto;
      text-align: center;
    }

    @media (max-width: 980px) {
      .hero-wrap { grid-template-columns: 1fr; }
      .hero-metrics { grid-template-columns: 1fr; }
      .process, .pricing-grid { grid-template-columns: 1fr; }
    }
  </style>

  <section class="hero">
    <div class="container">
      <div class="hero-wrap">
        <div class="hero-copy reveal">
          <div class="hero-subtle">Autonomous performance system</div>
          <h1 class="text-hero hero-title">Launch, optimize, and scale ads with a <span class="accent">live AI operating layer</span>.</h1>
          <p class="text-body" style="margin-top:20px;">AdClaw combines planning, creative, policy checks, and budget optimization into one continuous workflow. Connect your ad account once and let the swarm execute.</p>
          <div class="hero-cta">
            <a href="/auth/signup" class="btn btn-primary btn-lg">Start free</a>
            <a href="#how" class="btn btn-secondary btn-lg">See workflow</a>
          </div>
          <div class="hero-proof">
            <span class="dot-mini"></span>
            Built for Meta Ads automation with account-level controls
          </div>

          <div class="card hero-metrics reveal reveal-d1">
            <div class="hero-metric">
              <div class="val" id="hero-swarms">0</div>
              <div class="lab">Active swarms</div>
            </div>
            <div class="hero-metric">
              <div class="val" id="hero-campaigns">0</div>
              <div class="lab">Campaigns tracked</div>
            </div>
            <div class="hero-metric">
              <div class="val" id="hero-uptime">--</div>
              <div class="lab">System uptime</div>
            </div>
          </div>
        </div>

        <div class="card hero-panel reveal reveal-d2">
          <div class="hero-row">
            <div class="k">Now monitoring</div>
            <div class="v">Meta account + campaign performance</div>
            <div class="s">Realtime read + optimization loop every 15 minutes</div>
          </div>
          <div class="hero-row">
            <div class="k">Execution model</div>
            <div class="v">Research → Creative → Compliance → Launch</div>
            <div class="s">With automatic budget updates based on ROAS signals</div>
          </div>
          <div class="hero-code">
            <div class="note">// swarm optimization cycle</div>
            <div>if (roas &lt; 2.5) pause(adSet)</div>
            <div>if (roas &gt;= 4.0) increaseBudget(30)</div>
            <div class="note">// daily strategy review</div>
            <div>opus.review(account, spend, creativeFatigue)</div>
          </div>
        </div>
      </div>

      <div class="logo-strip reveal reveal-d3">
        <span>Framer-style hierarchy</span><span>Relume-style blocks</span><span>Vercel-grade minimal polish</span><span>Meta ads workflow</span><span>Autonomous execution</span>
      </div>
    </div>
  </section>

  <section class="section band" id="how">
    <div class="container">
      <p class="label-tag reveal">How It Works</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top:14px;max-width:670px;">A three-stage flow that moves from setup to full autonomous execution.</h2>
      <div class="process">
        <article class="card reveal reveal-d2">
          <div class="num">Step 01</div>
          <h3 class="text-headline">Connect Accounts</h3>
          <p class="text-body" style="margin-top:10px;">Sign in, connect Facebook, and select the exact ad account the swarm is allowed to touch.</p>
        </article>
        <article class="card reveal reveal-d3">
          <div class="num">Step 02</div>
          <h3 class="text-headline">Generate Strategy</h3>
          <p class="text-body" style="margin-top:10px;">Research + creative agents map competitor angles and produce campaign-ready concepts.</p>
        </article>
        <article class="card reveal reveal-d4">
          <div class="num">Step 03</div>
          <h3 class="text-headline">Operate Continuously</h3>
          <p class="text-body" style="margin-top:10px;">The system checks health, optimizes spend, and reports outcomes without manual intervention.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="label-tag reveal">System Modules</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top:14px;max-width:700px;">Modular agents that behave like a focused growth team.</h2>
      <div class="grid-3 feature-grid">
        <article class="card feature-card reveal reveal-d2">
          <div class="mini">Module 01</div>
          <h3 class="text-headline">Research Engine</h3>
          <p class="text-body" style="margin-top:10px;">Finds market angles, ad hooks, and segment opportunities on an hourly cadence.</p>
        </article>
        <article class="card feature-card reveal reveal-d3">
          <div class="mini">Module 02</div>
          <h3 class="text-headline">Creative Generator</h3>
          <p class="text-body" style="margin-top:10px;">Builds copy direction and test variants based on campaign objective and account history.</p>
        </article>
        <article class="card feature-card reveal reveal-d4">
          <div class="mini">Module 03</div>
          <h3 class="text-headline">Compliance Guard</h3>
          <p class="text-body" style="margin-top:10px;">Checks risky claims and policy-sensitive language before ads go live.</p>
        </article>
        <article class="card feature-card reveal reveal-d5">
          <div class="mini">Module 04</div>
          <h3 class="text-headline">Launch Controller</h3>
          <p class="text-body" style="margin-top:10px;">Handles publishing, pacing, and account-safe rollout logic.</p>
        </article>
        <article class="card feature-card reveal reveal-d6">
          <div class="mini">Module 05</div>
          <h3 class="text-headline">Optimization Loop</h3>
          <p class="text-body" style="margin-top:10px;">Adjusts budget and pausing decisions based on ROAS and spend velocity.</p>
        </article>
        <article class="card feature-card reveal reveal-d7">
          <div class="mini">Module 06</div>
          <h3 class="text-headline">Reporting Layer</h3>
          <p class="text-body" style="margin-top:10px;">Summarizes what changed, why it changed, and what to do next.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section band" id="pricing">
    <div class="container">
      <p class="label-tag reveal">Pricing</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top:14px;max-width:620px;">Start free, then move to operating plans when you scale.</h2>
      <div class="pricing-grid">
        <article class="card price-card reveal reveal-d2">
          <div class="price-tier">Starter</div>
          <div class="price-amount">$0</div>
          <p class="text-small" style="margin-top:6px;">Beta access</p>
          <ul class="price-points">
            <li>One connected ad account</li>
            <li>Full launch wizard</li>
            <li>Core reporting</li>
            <li>Email support</li>
          </ul>
          <a href="/auth/signup" class="btn btn-secondary">Get started</a>
        </article>
        <article class="card price-card featured reveal reveal-d3">
          <div class="price-tier">Growth</div>
          <div class="price-amount">$97 <span>/ month</span></div>
          <p class="text-small" style="margin-top:6px;">Most popular</p>
          <ul class="price-points">
            <li>Up to 5 accounts</li>
            <li>Advanced optimization cadence</li>
            <li>Priority support + faster iterations</li>
            <li>Strategy summaries</li>
          </ul>
          <a href="/auth/signup" class="btn btn-primary">Start free trial</a>
        </article>
        <article class="card price-card reveal reveal-d4">
          <div class="price-tier">Agency</div>
          <div class="price-amount">$497 <span>/ month</span></div>
          <p class="text-small" style="margin-top:6px;">For multi-brand teams</p>
          <ul class="price-points">
            <li>High account limits</li>
            <li>API integrations</li>
            <li>White-label reporting</li>
            <li>Dedicated onboarding</li>
          </ul>
          <a href="/auth/signup" class="btn btn-secondary">Contact sales</a>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="card cta-block reveal">
        <h2 class="text-section">Replace manual media buying with a system that runs itself.</h2>
        <p class="text-body" style="margin-top:16px;">Create your account, connect Facebook, choose your ad account, and launch your first swarm in minutes.</p>
        <div style="margin-top:28px;">
          <a href="/auth/signup" class="btn btn-primary btn-lg">Create account</a>
        </div>
      </div>
    </div>
  </section>

  <footer style="border-top:1px solid var(--border);padding:32px 0;margin-top:0;">
    <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
      <span style="font-size:13px;color:var(--text-dim);">&copy; 2026 AdClaw. All rights reserved.</span>
      <div style="display:flex;gap:20px;font-size:13px;">
        <a href="/privacy" style="color:var(--text-dim);text-decoration:none;">Privacy Policy</a>
        <a href="/terms" style="color:var(--text-dim);text-decoration:none;">Terms of Service</a>
        <a href="/data-deletion" style="color:var(--text-dim);text-decoration:none;">Data Deletion</a>
      </div>
    </div>
  </footer>
`,
    scripts: `
  <script>
    (async function() {
      try {
        var data = await api('/swarms');
        document.getElementById('hero-swarms').textContent = data.activeSwarms || 0;
        var tc = 0;
        (data.swarms || []).forEach(function(s) { tc += s.campaigns || 0; });
        document.getElementById('hero-campaigns').textContent = tc;
        var health = await api('/health');
        var mins = Math.floor(health.uptime / 60);
        var hrs = Math.floor(mins / 60);
        document.getElementById('hero-uptime').textContent = hrs > 0 ? hrs + 'h' : mins + 'm';
      } catch(e) {}
    })();
  </script>
`
  });
}
