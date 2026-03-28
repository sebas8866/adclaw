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
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: center;
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
    .hero-video {
      border: 1px solid rgba(128, 170, 255, 0.24);
      border-radius: 20px;
      overflow: hidden;
      background: rgba(7, 11, 22, 0.92);
      width: 100%;
      max-width: min(100%, 780px);
      aspect-ratio: 16 / 10;
      justify-self: center;
      align-self: center;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 50px rgba(6, 10, 20, 0.4);
      cursor: pointer;
      user-select: none;
    }
    .hero-video video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      background: rgba(3, 6, 14, 0.92);
      cursor: pointer;
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

    .build-grid {
      margin-top: 42px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    .build-item .tag {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #b7d5ff;
    }
    .build-item h3 {
      margin-top: 12px;
      font-family: var(--font-display);
      font-size: 30px;
      line-height: 1.06;
      letter-spacing: -0.04em;
      font-weight: 900;
      color: #eef5ff;
    }
    .build-item p {
      margin-top: 10px;
      color: var(--text-secondary);
      font-size: 15px;
      line-height: 1.7;
      max-width: 560px;
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
      .hero-wrap { grid-template-columns: 1fr; align-items: start; gap: 28px; }
      .hero-metrics { grid-template-columns: 1fr; }
      .hero-video {
        max-width: 100%;
        justify-self: center;
        align-self: center;
        aspect-ratio: 16 / 9;
      }
      .build-grid { grid-template-columns: 1fr; }
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
            <a href="/contact" class="btn btn-primary btn-lg">Contact us</a>
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
        <div class="hero-video reveal reveal-d2" id="hero-video-wrap" title="Click to pause or play">
          <video id="hero-video" autoplay muted loop playsinline preload="metadata">
            <source src="/media/AdClawHomepage.mp4" type="video/mp4">
          </video>
        </div>

      </div>

      <div class="logo-strip reveal reveal-d3">
        <span>Framer-style hierarchy</span><span>Relume-style blocks</span><span>Vercel-grade minimal polish</span><span>Meta ads workflow</span><span>Autonomous execution</span>
      </div>
    </div>
  </section>

  <section class="section band" id="build-flow">
    <div class="container">
      <p class="label-tag reveal">From connect to scale</p>
      <h2 class="text-section reveal reveal-d1" style="margin-top:14px;max-width:760px;">Connect. Create. Optimize. Scale.</h2>
      <p class="text-body reveal reveal-d2" style="margin-top:14px;max-width:680px;">A straightforward 4-step workflow from setup to continuous performance execution.</p>

      <div class="build-grid">
        <article class="card build-item reveal reveal-d2">
          <div class="tag">Build 01</div>
          <h3>Connect your account.</h3>
          <p>Secure OAuth connection to Facebook and select the ad account you want us to run.</p>
        </article>
        <article class="card build-item reveal reveal-d3">
          <div class="tag">Build 02</div>
          <h3>Create strategy + creative.</h3>
          <p>The system drafts campaign direction, hooks, and creative variants based on your setup.</p>
        </article>
        <article class="card build-item reveal reveal-d4">
          <div class="tag">Build 03</div>
          <h3>Optimize continuously.</h3>
          <p>Campaigns are monitored and tuned as performance data updates across audiences, ads, and spend.</p>
        </article>
        <article class="card build-item reveal reveal-d5">
          <div class="tag">Build 04</div>
          <h3>Scale winners safely.</h3>
          <p>Top performers get more budget while weak ad sets are reduced or paused—without blowing up account health.</p>
        </article>
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
          <a href="/contact" class="btn btn-primary">Contact us</a>
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
          <a href="/contact" class="btn btn-primary btn-lg">Contact us</a>
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

    (function initHeroVideoToggle() {
      var wrap = document.getElementById('hero-video-wrap');
      var vid = document.getElementById('hero-video');
      if (!wrap || !vid) return;
      wrap.addEventListener('click', function() {
        if (vid.paused) vid.play();
        else vid.pause();
      });
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

  </script>
`
  });
}
