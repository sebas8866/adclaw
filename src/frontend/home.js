import { pageWrapper } from './shared.js';

export function homePage({ isLoggedIn = false } = {}) {
  return pageWrapper({
    title: 'Autonomous AI Ad Agency',
    activeNav: 'home',
    publicNav: !isLoggedIn,
    body: `
  <style>
    .home-hero {
      padding-top: 148px;
      padding-bottom: 24px;
    }
    .home-hero-inner { max-width: 720px; }
    .home-hero-accent { color: var(--primary); }

    .home-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      margin-top: 72px;
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      overflow: hidden;
      background: var(--bg-surface);
    }
    .home-stat {
      padding: 32px 28px;
      border-right: 1px solid var(--border);
    }
    .home-stat:last-child { border-right: none; }
    .home-stat-value {
      font-family: var(--font-mono);
      font-size: clamp(32px, 4vw, 44px);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text);
    }
    .home-stat-label {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 8px;
    }
    @media (max-width: 768px) {
      .home-stats { grid-template-columns: 1fr; }
      .home-stat { border-right: none; border-bottom: 1px solid var(--border); }
      .home-stat:last-child { border-bottom: none; }
    }

    .home-section--surface {
      background: #05070d;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }

    .home-steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 56px;
    }
    @media (max-width: 900px) { .home-steps { grid-template-columns: 1fr; } }

    .home-step-num {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.02em;
      margin-bottom: 16px;
    }

    .home-agent-feature {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 48px;
      border-radius: var(--r-xl);
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--bg-surface);
    }
    .home-agent-feature-info { padding: 40px 36px; }
    .home-agent-feature-code {
      background: var(--bg);
      padding: 36px 32px;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.9;
      color: var(--text-secondary);
      border-left: 1px solid var(--border);
      display: flex;
      align-items: center;
    }
    @media (max-width: 768px) {
      .home-agent-feature { grid-template-columns: 1fr; }
      .home-agent-feature-code { border-left: none; border-top: 1px solid var(--border); }
    }

    .home-agent-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 16px;
    }
    @media (max-width: 900px) { .home-agent-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .home-agent-grid { grid-template-columns: 1fr; } }

    .home-agent-card-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 10px;
    }

    .home-intel-card {
      position: relative;
      padding-top: 4px;
    }
    .home-intel-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      border-radius: var(--r-lg) var(--r-lg) 0 0;
    }
    .home-intel-local::before { background: var(--green); }
    .home-intel-kimi::before { background: var(--blue); }
    .home-intel-opus::before { background: var(--primary); }

    .home-intel-freq {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 12px;
    }
    .home-intel-local .home-intel-freq { color: var(--green); }
    .home-intel-kimi .home-intel-freq { color: var(--blue); }
    .home-intel-opus .home-intel-freq { color: var(--primary); }

    .home-intel-model {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    .home-pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 48px;
      align-items: stretch;
    }
    @media (max-width: 900px) { .home-pricing-grid { grid-template-columns: 1fr; } }

    .home-price-card { display: flex; flex-direction: column; height: 100%; }
    .home-price-card--featured {
      border-color: rgba(82, 150, 255, 0.3);
      background: #0c1019;
    }
    .home-price-tier {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }
    .home-price-card--featured .home-price-tier { color: var(--primary); }
    .home-price-amount {
      font-family: var(--font-display);
      font-size: clamp(40px, 5vw, 52px);
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-top: 8px;
      line-height: 1;
    }
    .home-price-amount span {
      font-size: 15px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 0;
      font-family: var(--font-body);
    }
    .home-price-desc { font-size: 13px; color: var(--text-muted); margin-top: 6px; }
    .home-price-features {
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 2.2;
      flex: 1;
    }
    .home-price-features li {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .home-price-features li::before {
      content: '';
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--primary);
      flex-shrink: 0;
    }
    .home-price-actions { margin-top: 28px; }
    .home-price-actions .btn { width: 100%; justify-content: center; }

    .home-cta-inner {
      max-width: 560px;
      margin: 0 auto;
      text-align: center;
    }
  </style>

  <section class="section home-hero">
    <div class="container">
      <div class="home-hero-inner">
        <p class="label-tag reveal reveal-d1">Autonomous ad management</p>
        <h1 class="text-hero reveal reveal-d2" style="margin-top: 20px;">
          Your ads<br>run <span class="home-hero-accent">themselves.</span>
        </h1>
        <p class="text-body reveal reveal-d3" style="margin-top: 28px;">
          Connect Meta &amp; Google Ads. Paste your business page. A dedicated AI agent swarm handles research, creatives, optimization, and reporting around the clock.
        </p>
        <div class="flex gap-2 reveal reveal-d4" style="margin-top: 36px; flex-wrap: wrap;">
          <a href="/auth/signup" class="btn btn-primary btn-lg">Get started free</a>
          <a href="#how" class="btn btn-secondary btn-lg">How it works</a>
        </div>
      </div>

      <div class="home-stats reveal reveal-d5">
        <div class="home-stat">
          <div class="home-stat-value" id="hero-swarms">0</div>
          <div class="home-stat-label">Active swarms</div>
        </div>
        <div class="home-stat">
          <div class="home-stat-value" id="hero-campaigns">0</div>
          <div class="home-stat-label">Campaigns</div>
        </div>
        <div class="home-stat">
          <div class="home-stat-value" id="hero-uptime">--</div>
          <div class="home-stat-label">Uptime</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section home-section--surface" id="how">
    <div class="container">
      <p class="label-tag reveal">Process</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top: 16px; max-width: 520px;">
        Three steps to autonomous ads.
      </h2>

      <div class="home-steps">
        <article class="card reveal reveal-d2">
          <div class="home-step-num">01</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Connect</h3>
          <p class="text-body" style="margin-top: 12px;">One-click OAuth for Meta Ads and Google Ads. Secure API access, nothing more.</p>
        </article>
        <article class="card reveal reveal-d3">
          <div class="home-step-num">02</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Launch</h3>
          <p class="text-body" style="margin-top: 12px;">Paste your business page URL. The Research Agent analyzes your niche, audience, and competitors instantly.</p>
        </article>
        <article class="card reveal reveal-d4">
          <div class="home-step-num">03</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Scale</h3>
          <p class="text-body" style="margin-top: 12px;">Six AI agents take over. Creatives, campaigns, optimization, reporting. Every day, automatically.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="label-tag reveal">Architecture</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top: 16px; max-width: 560px;">
        Six agents working around the clock.
      </h2>

      <div class="home-agent-feature reveal reveal-d2">
        <div class="home-agent-feature-info">
          <div class="home-agent-card-tag">Core engine</div>
          <h3 class="text-headline" style="font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-top: 4px;">
            Launch &amp; Optimize
          </h3>
          <p class="text-body" style="margin-top: 18px;">
            Every 15 minutes, this agent checks your campaigns. Ads below 2.5x ROAS get paused. Winners get a 30% budget increase. No human intervention needed.
          </p>
        </div>
        <div class="home-agent-feature-code">
          <div>
            <div style="color:var(--text-muted);">// every 15 minutes</div>
            <div><span style="color:var(--primary);">if</span> (roas &lt; 2.5) <span style="color:var(--red);">pause</span>(adSet)</div>
            <div><span style="color:var(--primary);">if</span> (roas &gt; 4.0) <span style="color:var(--text);">scale</span>(budget, +30%)</div>
            <div style="color:var(--text-muted); margin-top:12px;">// daily</div>
            <div><span style="color:var(--primary);">opus</span>.review(strategy)</div>
          </div>
        </div>
      </div>

      <div class="home-agent-grid">
        <article class="card reveal reveal-d1">
          <div class="home-agent-card-tag">Agent 01</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Research</h3>
          <p class="text-body" style="margin-top: 10px;">Business analysis, competitor tracking, trending hooks. Hourly deep research via Kimi.</p>
        </article>
        <article class="card reveal reveal-d2">
          <div class="home-agent-card-tag">Agent 02</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Creative</h3>
          <p class="text-body" style="margin-top: 10px;">AI-generated ad copy and images. Multiple angles tested automatically per campaign.</p>
        </article>
        <article class="card reveal reveal-d3">
          <div class="home-agent-card-tag">Agent 03</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Compliance</h3>
          <p class="text-body" style="margin-top: 10px;">Every ad reviewed against Meta and Google policies before launch. Zero violations.</p>
        </article>
        <article class="card reveal reveal-d4">
          <div class="home-agent-card-tag">Agent 04</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Reporting</h3>
          <p class="text-body" style="margin-top: 10px;">Daily performance summaries. Key metrics, actions taken, strategic recommendations.</p>
        </article>
        <article class="card reveal reveal-d5">
          <div class="home-agent-card-tag">Agent 05</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">AI Coach</h3>
          <p class="text-body" style="margin-top: 10px;">Coming in v2. Your personal strategist for questions, recommendations, and insights.</p>
        </article>
        <article class="card reveal reveal-d6">
          <div class="home-agent-card-tag">Infrastructure</div>
          <h3 class="text-headline" style="letter-spacing: -0.02em;">Mac Mini Fleet</h3>
          <p class="text-body" style="margin-top: 10px;">Runs 24/7 on local hardware. Ollama for fast checks, Kimi for research, Opus for decisions.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section home-section--surface">
    <div class="container">
      <p class="label-tag reveal">Intelligence</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top: 16px; max-width: 520px;">
        Three tiers. Right tool, right cadence.
      </h2>

      <div class="grid-3" style="margin-top: 48px;">
        <article class="card home-intel-card home-intel-local reveal reveal-d2">
          <div class="home-intel-freq">Every 15 min</div>
          <h3 class="text-headline" style="font-size: 22px; letter-spacing: -0.02em;">Local Ollama</h3>
          <p class="text-body" style="margin-top: 12px;">Fast metric parsing and anomaly detection. Runs on your Mac Mini. Zero API cost.</p>
          <div class="home-intel-model">llama3.2:3b</div>
        </article>
        <article class="card home-intel-card home-intel-kimi reveal reveal-d3">
          <div class="home-intel-freq">Hourly</div>
          <h3 class="text-headline" style="font-size: 22px; letter-spacing: -0.02em;">Kimi Deep Research</h3>
          <p class="text-body" style="margin-top: 12px;">Competitor analysis, trending hooks, seasonal opportunities. Web-enabled deep research.</p>
          <div class="home-intel-model">moonshot-v1-128k</div>
        </article>
        <article class="card home-intel-card home-intel-opus reveal reveal-d4">
          <div class="home-intel-freq">Daily</div>
          <h3 class="text-headline" style="font-size: 22px; letter-spacing: -0.02em;">Claude Opus</h3>
          <p class="text-body" style="margin-top: 12px;">Critical budget allocation and strategy decisions. The strategic brain of your ad agency.</p>
          <div class="home-intel-model">claude-opus-4-6</div>
        </article>
      </div>
    </div>
  </section>

  <section class="section" id="pricing">
    <div class="container">
      <p class="label-tag reveal">Pricing</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top: 16px; max-width: 480px;">
        Start free. Scale when ready.
      </h2>

      <div class="home-pricing-grid">
        <article class="card home-price-card reveal reveal-d2">
          <div class="home-price-tier">Starter</div>
          <div class="home-price-amount">$0</div>
          <div class="home-price-desc">Free during beta</div>
          <ul class="home-price-features">
            <li>1 business</li>
            <li>All 6 agents</li>
            <li>Basic reporting</li>
            <li>Email support</li>
          </ul>
          <div class="home-price-actions">
            <a href="/auth/signup" class="btn btn-ghost">Get started</a>
          </div>
        </article>

        <article class="card home-price-card home-price-card--featured reveal reveal-d3">
          <div class="home-price-tier">Growth</div>
          <div class="home-price-amount">$97<span>/mo</span></div>
          <div class="home-price-desc">Per business managed</div>
          <ul class="home-price-features">
            <li>Up to 5 businesses</li>
            <li>Advanced reporting</li>
            <li>Priority support</li>
            <li>Custom creatives</li>
            <li>Daily Opus reviews</li>
          </ul>
          <div class="home-price-actions">
            <a href="/auth/signup" class="btn btn-primary">Start free trial</a>
          </div>
        </article>

        <article class="card home-price-card reveal reveal-d4">
          <div class="home-price-tier">Agency</div>
          <div class="home-price-amount">$497<span>/mo</span></div>
          <div class="home-price-desc">Unlimited scale</div>
          <ul class="home-price-features">
            <li>Up to 25 businesses</li>
            <li>White-label dashboard</li>
            <li>API access</li>
            <li>Dedicated support</li>
            <li>Custom agent tuning</li>
          </ul>
          <div class="home-price-actions">
            <a href="/auth/signup" class="btn btn-ghost">Contact sales</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section home-section--surface">
    <div class="container home-cta-inner">
      <h2 class="text-section reveal">Ready to automate?</h2>
      <p class="text-body reveal reveal-d1" style="margin-top: 20px; font-weight: 400;">
        Set up takes under five minutes. Your swarm starts optimizing immediately.
      </p>
      <div class="reveal reveal-d2" style="margin-top: 36px;">
        <a href="/auth/signup" class="btn btn-primary btn-lg">Get started free</a>
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
