import { pageWrapper } from './shared.js';

export function homePage({ isLoggedIn = false } = {}) {
  return pageWrapper({
    title: 'Autonomous AI Ad Agency',
    activeNav: 'home',
    publicNav: !isLoggedIn,
    body: `
  <style>
    #mouse-particles {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
    }
    .hero {
      padding: 128px 0 44px;
      position: relative;
    }
    .hero-wrap {
      display: grid;
      grid-template-columns: 1fr;
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

    .build-flow {
      position: relative;
      padding: 112px 0;
    }
    .build-flow-inner {
      position: sticky;
      top: 92px;
      min-height: calc(100vh - 140px);
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 28px;
      align-items: center;
    }
    .build-flow-left { max-width: 780px; }
    .build-flow-kicker {
      font-family: var(--font-mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }
    .build-flow-headline {
      margin-top: 18px;
      font-family: var(--font-display);
      font-size: clamp(44px, 5.8vw, 88px);
      line-height: 0.96;
      letter-spacing: -0.06em;
      font-weight: 900;
    }
    .build-flow-sub {
      margin-top: 18px;
      max-width: 640px;
      color: var(--text-secondary);
      font-size: 16px;
      line-height: 1.7;
    }
    .build-flow-meta {
      margin-top: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      max-width: 520px;
      padding-top: 16px;
      border-top: 1px solid rgba(134, 173, 255, 0.16);
    }
    .build-flow-meta .pill {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #cfe4ff;
      border: 1px solid rgba(133, 178, 255, 0.28);
      background: rgba(108, 173, 255, 0.08);
      padding: 10px 12px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .build-flow-meta .pill .dot {
      width: 7px; height: 7px; border-radius: 999px;
      background: #78b6ff;
      box-shadow: 0 0 0 4px rgba(120, 182, 255, 0.14);
    }

    .build-flow-right {
      width: 100%;
      max-width: 520px;
      margin-left: auto;
    }
    .build-stage-rail {
      padding-left: 18px;
      border-left: 1px solid rgba(134, 173, 255, 0.18);
    }
    .build-stage {
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.28s ease, transform 0.28s ease;
    }
    .build-stage.active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    .build-step {
      font-family: var(--font-mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #b7d5ff;
    }
    .build-title {
      margin-top: 12px;
      font-family: var(--font-display);
      font-size: 34px;
      line-height: 1.02;
      letter-spacing: -0.03em;
      font-weight: 900;
      color: #eef5ff;
    }
    .build-copy {
      margin-top: 10px;
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 520px;
    }
    .build-progress {
      margin-top: 22px;
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: rgba(120, 155, 219, 0.26);
      overflow: hidden;
      border: 1px solid rgba(134, 171, 255, 0.2);
    }
    .build-progress-fill {
      width: 0%;
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #9fd0ff, #6daeff);
      transition: width 0.12s linear;
    }
    .build-markers {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-dim);
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
      max-width: 640px;
      margin-left: auto;
      margin-right: auto;
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
      .build-flow-inner {
        position: relative;
        top: auto;
        min-height: auto;
        grid-template-columns: 1fr;
        align-items: start;
      }
      .build-flow-right { margin-left: 0; max-width: 620px; }
      .build-flow-headline { font-size: clamp(38px, 9vw, 56px); }
      .process { grid-template-columns: 1fr; }
    }
  </style>

  <canvas id="mouse-particles"></canvas>

  <section class="hero">
    <div class="container">
      <div class="hero-wrap">
        <div class="hero-copy reveal">
          <div class="hero-subtle">Autonomous performance system</div>
          <h1 class="text-hero hero-title">Launch, optimize, and scale ads with a <span class="accent">live AI operating layer</span>.</h1>
          <p class="text-body" style="margin-top:20px;">AdClaw combines planning, creative, policy checks, and budget optimization into one continuous workflow. Connect your ad account once and let the swarm execute.</p>
          <div class="hero-cta">
            <a href="mailto:support@adclaw.ai?subject=AdClaw%20Enterprise%20inquiry" class="btn btn-primary btn-lg">Contact us</a>
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

      </div>

      <div class="logo-strip reveal reveal-d3">
        <span>Framer-style hierarchy</span><span>Relume-style blocks</span><span>Vercel-grade minimal polish</span><span>Meta ads workflow</span><span>Autonomous execution</span>
      </div>
    </div>
  </section>

  <section class="band build-flow" id="build-flow" data-build-flow>
    <div class="container">
      <div class="build-flow-inner">
        <div class="build-flow-left">
          <div class="build-flow-kicker reveal">From connect to scale</div>
          <h2 class="build-flow-headline reveal reveal-d1">Connect. Create. Optimize. Scale.</h2>
          <p class="build-flow-sub reveal reveal-d2">A single operating layer that moves from setup to live execution. Scroll to see each stage and what changes in the system.</p>
          <div class="build-flow-meta reveal reveal-d3">
            <span class="pill"><span class="dot"></span><span id="build-flow-stage-label">Build 01</span></span>
            <span class="pill">Meta OAuth • account controls</span>
          </div>
        </div>
        <div class="build-flow-right">
          <div class="build-stage-rail reveal reveal-d2">
            <div class="build-stage active" data-build-stage="0">
              <div class="build-step">Build 01</div>
              <h3 class="build-title">Connect your account.</h3>
              <p class="build-copy">Secure OAuth connection to Facebook and select the ad account you want us to run.</p>
            </div>
            <div class="build-stage" data-build-stage="1">
              <div class="build-step">Build 02</div>
              <h3 class="build-title">Create strategy + creative.</h3>
              <p class="build-copy">The system drafts campaign direction, hooks, and creative variants based on your setup.</p>
            </div>
            <div class="build-stage" data-build-stage="2">
              <div class="build-step">Build 03</div>
              <h3 class="build-title">Optimize continuously.</h3>
              <p class="build-copy">Campaigns are monitored and tuned as performance data updates across audiences, ads, and spend.</p>
            </div>
            <div class="build-stage" data-build-stage="3">
              <div class="build-step">Build 04</div>
              <h3 class="build-title">Scale winners safely.</h3>
              <p class="build-copy">Top performers get more budget while weak ad sets are reduced or paused—without blowing up account health.</p>
            </div>
            <div class="build-progress"><div id="build-progress-fill" class="build-progress-fill"></div></div>
            <div class="build-markers"><span>Connect</span><span>Create</span><span>Optimize</span><span>Scale</span></div>
          </div>
        </div>
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
      <h2 class="text-section reveal reveal-d1" style="margin-top:14px;max-width:620px;">Enterprise only — we onboard teams directly.</h2>
      <p class="text-body reveal reveal-d1" style="margin-top:12px;max-width:560px;">AdClaw is sold as a single enterprise subscription. There is no self-serve free tier or public price list. Tell us about your ad accounts and workflow; we’ll scope deployment and support.</p>
      <div class="pricing-grid">
        <article class="card price-card featured reveal reveal-d2">
          <div class="price-tier">Enterprise</div>
          <div class="price-amount">Custom <span>pricing</span></div>
          <p class="text-small" style="margin-top:6px;">Everything you need to run autonomous Meta ads at scale</p>
          <ul class="price-points">
            <li>Dedicated onboarding and account configuration</li>
            <li>Multi–ad-account coverage and governance</li>
            <li>Optimization, reporting, and priority support</li>
            <li>Optional integrations and rollout aligned to your team</li>
          </ul>
          <a href="mailto:support@adclaw.ai?subject=AdClaw%20Enterprise%20inquiry" class="btn btn-primary">Contact us</a>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="card cta-block reveal">
        <h2 class="text-section">Replace manual media buying with a system that runs itself.</h2>
        <p class="text-body" style="margin-top:16px;">Enterprise customers get hands-on onboarding: connect Facebook, scope accounts, and launch with our team. Reach out to get started.</p>
        <div style="margin-top:28px;">
          <a href="mailto:support@adclaw.ai?subject=AdClaw%20Enterprise%20inquiry" class="btn btn-primary btn-lg">Contact us</a>
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

    (function initMouseParticles() {
      var canvas = document.getElementById('mouse-particles');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var particles = [];

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      window.addEventListener('mousemove', function(e) {
        for (var i = 0; i < 2; i++) {
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 6,
            y: e.clientY + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            life: 1,
            r: Math.random() * 1.5 + 0.6
          });
        }
        if (particles.length > 110) particles.splice(0, particles.length - 110);
      });

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(148, 197, 255,' + (p.life * 0.42).toFixed(3) + ')';
          ctx.fill();
        }
        requestAnimationFrame(draw);
      }
      draw();
    })();

    (function initBuildFlowScroll() {
      var section = document.querySelector('[data-build-flow]');
      var stages = Array.prototype.slice.call(document.querySelectorAll('[data-build-stage]'));
      var fill = document.getElementById('build-progress-fill');
      var label = document.getElementById('build-flow-stage-label');
      if (!section || !stages.length) return;

      function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

      function setActive(idx) {
        stages.forEach(function(s, i) {
          if (i === idx) s.classList.add('active');
          else s.classList.remove('active');
        });
        if (label) label.textContent = 'Build 0' + (idx + 1);
      }

      function update() {
        var rect = section.getBoundingClientRect();
        var total = Math.max(1, section.offsetHeight - window.innerHeight);
        var progress = clamp((-rect.top) / total, 0, 1);
        var idx = Math.min(stages.length - 1, Math.floor(progress * stages.length));
        setActive(idx);
        if (fill) fill.style.width = (progress * 100).toFixed(2) + '%';
      }

      // Give it enough scroll length to feel like a takeover.
      // We do this via inline style so we don’t depend on global layout.
      if (!section.style.minHeight) section.style.minHeight = Math.max(window.innerHeight * 2.1, 1400) + 'px';

      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', function() {
        section.style.minHeight = Math.max(window.innerHeight * 2.1, 1400) + 'px';
        update();
      });
      update();
    })();

  </script>
`
  });
}
