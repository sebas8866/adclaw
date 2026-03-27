import { pageWrapper } from './shared.js';

export function launchPage() {
  return pageWrapper({
    title: 'Launch Swarm',
    activeNav: 'launch',
    body: `
  <style>
    .launch-wrap {
      padding: 56px 0 96px;
    }
    .launch-hero {
      max-width: 720px;
      margin: 0 auto 40px;
    }
    .launch-hero h1 {
      font-family: var(--font-display);
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: var(--text);
    }
    .launch-hero p {
      margin-top: 12px;
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.65;
      max-width: 520px;
    }

    .launch-progress {
      display: flex;
      gap: 8px;
      margin: 0 auto 40px;
      max-width: 720px;
    }
    .launch-progress-bar {
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: var(--border);
      transition: background 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .launch-progress-bar.is-active {
      background: var(--primary);
    }

    .launch-card {
      border-radius: var(--r-xl);
      padding: 36px 40px;
    }
    @media (max-width: 640px) {
      .launch-card { padding: 28px 24px; }
    }

    .step-title {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
      margin-bottom: 6px;
    }
    .step-desc {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 28px;
      line-height: 1.55;
    }

    .connect-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    @media (max-width: 600px) {
      .connect-grid { grid-template-columns: 1fr; }
    }

    .connect-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 18px 20px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s, color 0.2s;
    }
    .connect-btn:hover {
      border-color: var(--border-hover);
      color: var(--text);
      background: var(--bg-elevated);
    }
    .connect-btn.is-connected {
      border-color: rgba(16, 185, 129, 0.35);
      color: var(--green);
      background: rgba(16, 185, 129, 0.06);
    }

    .review-panel {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 20px 22px;
    }

    .checklist-wrap {
      margin-top: 24px;
      padding-top: 4px;
    }
    .checklist-label {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-dim);
      margin-bottom: 14px;
    }
    .checklist {
      list-style: none;
    }
    .checklist li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.65;
      padding: 8px 0;
    }
    .checklist li .check-ico {
      flex-shrink: 0;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 6px;
      background: var(--green);
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 32px;
    }
    .step-actions-end {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .done-wrap {
      display: none;
      max-width: 560px;
      margin: 0 auto;
    }
    .done-wrap.is-visible {
      display: block;
    }
    .done-card {
      border-radius: var(--r-xl);
      padding: 48px 40px;
      text-align: center;
      border-color: rgba(16, 185, 129, 0.22);
    }
    .done-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 22px;
      border-radius: 50%;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.28);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      color: var(--green);
    }
    .done-card h2 {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 700;
      color: var(--green);
      letter-spacing: -0.02em;
    }
    .done-card .done-copy {
      margin-top: 12px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.65;
      max-width: 420px;
      margin-left: auto;
      margin-right: auto;
    }
    .done-result {
      margin-top: 28px;
      text-align: left;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.7;
    }
    .done-result strong {
      color: var(--primary);
      font-weight: 600;
    }
    .done-actions {
      margin-top: 28px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    #launch-wizard.is-hidden {
      display: none;
    }
  </style>

  <section class="launch-wrap">
    <div class="container" style="max-width: 800px;">
      <div class="launch-hero reveal">
        <h1>Launch your swarm</h1>
        <p>Connect ad accounts, share business details, and deploy your agent swarm in three steps.</p>
      </div>

      <div id="launch-wizard">
        <div class="launch-progress reveal reveal-d1" id="launch-progress">
          <div id="step-ind-1" class="launch-progress-bar is-active"></div>
          <div id="step-ind-2" class="launch-progress-bar"></div>
          <div id="step-ind-3" class="launch-progress-bar"></div>
        </div>

        <!-- Step 1 -->
        <div id="step-1" class="card launch-card reveal reveal-d2">
          <div class="step-title">Connect ad accounts</div>
          <div class="step-desc">Link Meta Ads and Google Ads. You can connect one or both.</div>
          <div class="connect-grid">
            <button type="button" id="btn-meta" class="connect-btn" onclick="connectMeta()">
              <span aria-hidden="true" style="font-size:18px;">&#xf09a;</span>
              Meta Ads
            </button>
            <button type="button" id="btn-google" class="connect-btn" onclick="connectGoogle()">
              <span aria-hidden="true" style="font-size:18px;">&#127760;</span>
              Google Ads
            </button>
          </div>
          <div class="step-actions">
            <span></span>
            <button type="button" class="btn btn-primary" onclick="goToStep(2)">Continue</button>
          </div>
        </div>

        <!-- Step 2 -->
        <div id="step-2" class="card launch-card" style="display:none;">
          <div class="step-title">Business details</div>
          <div class="step-desc">We use this to research your niche and configure campaigns.</div>
          <div class="form-group">
            <label for="inp-client">Client name</label>
            <input type="text" id="inp-client" class="form-input" placeholder="e.g. Northwind Coffee" autocomplete="organization">
          </div>
          <div class="form-group">
            <label for="inp-page">Page URL</label>
            <input type="url" id="inp-page" class="form-input" placeholder="https://facebook.com/yourpage" inputmode="url">
          </div>
          <div class="form-group">
            <label for="inp-budget">Daily budget (USD)</label>
            <input type="number" id="inp-budget" class="form-input" placeholder="50" value="50" min="1" step="1">
          </div>
          <div class="form-group">
            <label for="inp-notes">Notes</label>
            <textarea id="inp-notes" class="form-input" rows="3" placeholder="Goals, audiences, or constraints (optional)"></textarea>
          </div>
          <div class="step-actions">
            <button type="button" class="btn btn-ghost" onclick="goToStep(1)">Back</button>
            <div class="step-actions-end">
              <button type="button" class="btn btn-primary" onclick="goToStep(3)">Review</button>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div id="step-3" class="card launch-card" style="display:none;">
          <div class="step-title">Review &amp; launch</div>
          <div class="step-desc">Confirm details and start your swarm.</div>

          <div class="review-panel">
            <div class="metric-row"><span class="metric-label">Client</span><span class="metric-value" id="rev-client">&mdash;</span></div>
            <div class="metric-row"><span class="metric-label">Page URL</span><span class="metric-value" id="rev-page" style="max-width:min(360px,55vw);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">&mdash;</span></div>
            <div class="metric-row"><span class="metric-label">Daily budget</span><span class="metric-value" id="rev-budget">&mdash;</span></div>
            <div class="metric-row"><span class="metric-label">Notes</span><span class="metric-value" id="rev-notes" style="white-space:pre-wrap;font-weight:500;">&mdash;</span></div>
            <div class="metric-row"><span class="metric-label">Meta Ads</span><span id="rev-meta">&mdash;</span></div>
            <div class="metric-row"><span class="metric-label">Google Ads</span><span id="rev-google">&mdash;</span></div>
          </div>

          <div class="checklist-wrap review-panel">
            <div class="checklist-label">What the swarm will do</div>
            <ul class="checklist">
              <li><span class="check-ico"></span><span>Analyze your page and competitive landscape</span></li>
              <li><span class="check-ico"></span><span>Generate ad copy and creative directions</span></li>
              <li><span class="check-ico"></span><span>Run policy and compliance checks</span></li>
              <li><span class="check-ico"></span><span>Launch and manage campaigns on connected platforms</span></li>
              <li><span class="check-ico"></span><span>Optimize on a schedule and report performance</span></li>
            </ul>
          </div>

          <div class="step-actions">
            <button type="button" class="btn btn-ghost" onclick="goToStep(2)">Back</button>
            <button type="button" id="btn-launch" class="btn btn-primary btn-lg" onclick="launchSwarm()">Launch swarm</button>
          </div>
        </div>
      </div>

      <!-- Done -->
      <div id="step-done" class="done-wrap">
        <div class="card done-card">
          <div class="done-icon" aria-hidden="true">&#10003;</div>
          <h2>Swarm launched</h2>
          <p class="done-copy">Your swarm is starting. You can monitor progress from the dashboard or swarms list.</p>
          <div id="launch-result" class="done-result review-panel"></div>
          <div class="done-actions">
            <a href="/app" class="btn btn-primary">Dashboard</a>
            <a href="/app/swarms" class="btn btn-secondary">Swarms</a>
          </div>
        </div>
      </div>
    </div>
  </section>
`,
    scripts: `
  <script>
    var state = { metaConnected: false, googleConnected: false };

    function goToStep(n) {
      var wizard = document.getElementById('launch-wizard');
      if (wizard) wizard.classList.remove('is-hidden');

      for (var i = 1; i <= 3; i++) {
        var stepEl = document.getElementById('step-' + i);
        if (stepEl) stepEl.style.display = i === n ? 'block' : 'none';
        var bar = document.getElementById('step-ind-' + i);
        if (bar) {
          bar.className = 'launch-progress-bar' + (i === n ? ' is-active' : '');
        }
      }

      var doneEl = document.getElementById('step-done');
      if (doneEl) {
        doneEl.classList.remove('is-visible');
      }

      if (n === 3) populateReview();
    }

    function setConnectButton(id, connected, labelConnected, labelDisconnected) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.classList.toggle('is-connected', connected);
      btn.innerHTML =
        (connected
          ? '<span style="color:var(--green);" aria-hidden="true">&#10003;</span> '
          : '<span aria-hidden="true" style="opacity:0.85;">' + (id === 'btn-meta' ? '&#xf09a;' : '&#127760;') + '</span> ') +
        (connected ? labelConnected : labelDisconnected);
    }

    function connectMeta() {
      state.metaConnected = !state.metaConnected;
      setConnectButton('btn-meta', state.metaConnected, 'Meta Ads connected', 'Meta Ads');
      showToast(state.metaConnected ? 'Meta Ads connected' : 'Meta Ads disconnected', 'success');
    }

    function connectGoogle() {
      state.googleConnected = !state.googleConnected;
      setConnectButton('btn-google', state.googleConnected, 'Google Ads connected', 'Google Ads');
      showToast(state.googleConnected ? 'Google Ads connected' : 'Google Ads disconnected', 'success');
    }

    function populateReview() {
      var client = document.getElementById('inp-client');
      var page = document.getElementById('inp-page');
      var budget = document.getElementById('inp-budget');
      var notes = document.getElementById('inp-notes');

      document.getElementById('rev-client').textContent = (client && client.value.trim()) || 'Not set';
      document.getElementById('rev-page').textContent = (page && page.value.trim()) || 'Not set';
      var b = budget && budget.value ? budget.value : '50';
      document.getElementById('rev-budget').textContent = '$' + b + '/day';

      var notesText = notes && notes.value.trim();
      document.getElementById('rev-notes').textContent = notesText || '—';

      var metaHtml = state.metaConnected
        ? '<span class="badge badge-green"><span class="dot dot-green"></span>Connected</span>'
        : '<span class="badge badge-orange"><span class="dot dot-orange"></span>Not connected</span>';
      var googleHtml = state.googleConnected
        ? '<span class="badge badge-green"><span class="dot dot-green"></span>Connected</span>'
        : '<span class="badge badge-orange"><span class="dot dot-orange"></span>Not connected</span>';
      document.getElementById('rev-meta').innerHTML = metaHtml;
      document.getElementById('rev-google').innerHTML = googleHtml;
    }

    async function launchSwarm() {
      var btn = document.getElementById('btn-launch');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Launching&hellip;';
      }

      var clientEl = document.getElementById('inp-client');
      var pageEl = document.getElementById('inp-page');

      var clientId = (clientEl && clientEl.value.trim()) || 'demo-client';
      var pageUrl = (pageEl && pageEl.value.trim()) || 'https://facebook.com/demo';

      try {
        var result = await api('/swarms/launch', {
          method: 'POST',
          body: {
            clientId: clientId,
            businessPageUrl: pageUrl,
            metaAccessToken: state.metaConnected ? 'demo-token' : null,
            googleAccessToken: state.googleConnected ? 'demo-token' : null
          }
        });

        var wizard = document.getElementById('launch-wizard');
        if (wizard) wizard.classList.add('is-hidden');

        var done = document.getElementById('step-done');
        if (done) done.classList.add('is-visible');

        var out = document.getElementById('launch-result');
        if (out) {
          out.innerHTML =
            '<div><strong>Swarm ID</strong> &nbsp; ' + escapeHtml(String(result.swarmId != null ? result.swarmId : '')) + '</div>' +
            (result.status ? '<div style="margin-top:8px;"><strong>Status</strong> &nbsp; <span style="color:var(--green);">' + escapeHtml(String(result.status)) + '</span></div>' : '') +
            (result.message ? '<div style="margin-top:8px;">' + escapeHtml(String(result.message)) + '</div>' : '');
        }

        showToast('Swarm launched successfully', 'success');
      } catch (e) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Launch swarm';
        }
        showToast('Launch failed: ' + (e && e.message ? e.message : 'Unknown error'), 'error');
      }
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  </script>
`
  });
}
