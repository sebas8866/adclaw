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

    .meta-detail {
      margin-top: 14px;
      display: none;
    }
    .meta-detail.is-visible {
      display: block;
    }
    .meta-detail .meta-user {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .meta-detail .meta-user strong {
      color: var(--text);
      font-weight: 600;
    }
    .meta-detail .meta-user .disconnect-link {
      margin-left: auto;
      font-size: 12px;
      color: var(--text-dim);
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .meta-detail .meta-user .disconnect-link:hover {
      color: var(--red, #ef4444);
    }
    .account-select {
      width: 100%;
      padding: 12px 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--text);
      appearance: none;
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
      transition: border-color 0.2s;
    }
    .account-select:focus {
      outline: none;
      border-color: var(--primary);
    }
    .account-select option {
      background: var(--surface);
      color: var(--text);
    }
    .account-loading {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted);
      padding: 10px 0;
    }
    .account-loading .spin {
      width: 14px;
      height: 14px;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .account-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      padding: 6px 10px;
      border-radius: var(--r-sm);
      font-size: 12px;
      font-weight: 500;
      font-family: var(--font-mono);
    }
    .account-badge.badge-active {
      background: rgba(16, 185, 129, 0.08);
      color: var(--green);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .account-badge.badge-inactive {
      background: rgba(234, 179, 8, 0.08);
      color: var(--orange, #f59e0b);
      border: 1px solid rgba(234, 179, 8, 0.2);
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
        <p>Connect your Facebook account, pick an ad account, and deploy your agent swarm.</p>
      </div>

      <div id="launch-wizard">
        <div class="launch-progress reveal reveal-d1" id="launch-progress">
          <div id="step-ind-1" class="launch-progress-bar is-active"></div>
          <div id="step-ind-2" class="launch-progress-bar"></div>
          <div id="step-ind-3" class="launch-progress-bar"></div>
        </div>

        <!-- Step 1: Connect -->
        <div id="step-1" class="card launch-card reveal reveal-d2">
          <div class="step-title">Connect your Facebook</div>
          <div class="step-desc">Sign in with Facebook to grant AdClaw access to your ad accounts. We'll show you all available accounts to pick from.</div>
          <div class="connect-grid">
            <button type="button" id="btn-meta" class="connect-btn" onclick="connectMeta()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.14 6.84 9.45v-6.69H6.62v-2.76h2.26V9.92c0-2.23 1.33-3.47 3.37-3.47.97 0 1.99.18 1.99.18v2.19h-1.12c-1.11 0-1.45.69-1.45 1.39v1.67h2.47l-.39 2.76h-2.08v6.69c3.97-1.31 6.84-5.04 6.84-9.45 0-5.5-4.46-9.96-9.96-9.96z"/></svg>
              Connect with Facebook
            </button>
            <button type="button" id="btn-google" class="connect-btn" onclick="connectGoogle()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google Ads (coming soon)
            </button>
          </div>

          <!-- Ad account picker (shows after FB connect) -->
          <div id="meta-detail" class="meta-detail">
            <div class="meta-user">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>
              <span>Signed in as <strong id="meta-username"></strong></span>
              <span class="disconnect-link" onclick="disconnectMeta()">Disconnect</span>
            </div>
            <div id="account-loading" class="account-loading" style="display:none;">
              <div class="spin"></div>
              Loading your ad accounts\u2026
            </div>
            <select id="account-select" class="account-select" onchange="onAccountSelect()" style="display:none;">
              <option value="">Select an ad account</option>
            </select>
            <div id="account-badge-wrap"></div>
          </div>

          <div class="step-actions">
            <span></span>
            <button type="button" id="btn-continue-1" class="btn btn-primary" onclick="goToStep(2)" disabled>Select an ad account to continue</button>
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
            <div class="metric-row"><span class="metric-label">Facebook</span><span id="rev-fb">&mdash;</span></div>
            <div class="metric-row"><span class="metric-label">Ad account</span><span id="rev-account">&mdash;</span></div>
          </div>

          <div class="checklist-wrap review-panel">
            <div class="checklist-label">What the swarm will do</div>
            <ul class="checklist">
              <li><span class="check-ico"></span><span>Analyze your page and competitive landscape</span></li>
              <li><span class="check-ico"></span><span>Generate ad copy and creative directions</span></li>
              <li><span class="check-ico"></span><span>Run policy and compliance checks</span></li>
              <li><span class="check-ico"></span><span>Launch and manage campaigns on your ad account</span></li>
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
    var state = {
      metaConnected: false,
      metaName: '',
      adAccounts: [],
      selectedAccountId: '',
      selectedAccountName: '',
      googleConnected: false,
    };

    (function init() {
      var params = new URLSearchParams(window.location.search);

      if (params.get('meta') === 'success') {
        state.metaConnected = true;
        state.metaName = decodeURIComponent(params.get('name') || '');
        window.history.replaceState({}, '', '/app/launch');
        showMetaConnected();
        loadAdAccounts();
      } else if (params.get('meta') === 'error') {
        var reason = params.get('reason') || 'unknown';
        if (reason === 'not_configured') {
          showToast('Meta App not configured \\u2014 add META_APP_ID & META_APP_SECRET in settings', 'error');
        } else {
          showToast('Facebook connection failed: ' + reason, 'error');
        }
        window.history.replaceState({}, '', '/app/launch');
      } else {
        fetch('/api/meta/status').then(function(r) { return r.json(); }).then(function(d) {
          if (d.connected) {
            state.metaConnected = true;
            state.metaName = d.name || '';
            showMetaConnected();
            if (d.adAccountId) {
              state.selectedAccountId = d.adAccountId;
              state.selectedAccountName = d.adAccountName || d.adAccountId;
              showSelectedAccount(state.selectedAccountId, state.selectedAccountName, null);
              enableContinue();
            }
            loadAdAccounts();
          }
        }).catch(function() {});
      }
    })();

    function showMetaConnected() {
      var btn = document.getElementById('btn-meta');
      btn.classList.add('is-connected');
      btn.innerHTML = '<span style="color:var(--green);">&#10003;</span> Facebook connected';
      btn.onclick = null;

      document.getElementById('meta-username').textContent = state.metaName || 'your account';
      document.getElementById('meta-detail').classList.add('is-visible');
    }

    function resetMetaUI() {
      var btn = document.getElementById('btn-meta');
      btn.classList.remove('is-connected');
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.14 6.84 9.45v-6.69H6.62v-2.76h2.26V9.92c0-2.23 1.33-3.47 3.37-3.47.97 0 1.99.18 1.99.18v2.19h-1.12c-1.11 0-1.45.69-1.45 1.39v1.67h2.47l-.39 2.76h-2.08v6.69c3.97-1.31 6.84-5.04 6.84-9.45 0-5.5-4.46-9.96-9.96-9.96z"/></svg> Connect with Facebook';
      btn.onclick = connectMeta;

      document.getElementById('meta-detail').classList.remove('is-visible');
      document.getElementById('account-select').style.display = 'none';
      document.getElementById('account-loading').style.display = 'none';
      document.getElementById('account-badge-wrap').innerHTML = '';
      disableContinue();
    }

    async function loadAdAccounts() {
      var loading = document.getElementById('account-loading');
      var select = document.getElementById('account-select');
      loading.style.display = 'flex';
      select.style.display = 'none';

      try {
        var resp = await fetch('/api/meta/ad-accounts');
        if (!resp.ok) {
          var err = await resp.json();
          if (resp.status === 401) {
            showToast('Facebook session expired \\u2014 please reconnect', 'error');
            resetMetaState();
            resetMetaUI();
            return;
          }
          throw new Error(err.error || 'Failed to load');
        }

        state.adAccounts = await resp.json();
        loading.style.display = 'none';

        if (state.adAccounts.length === 0) {
          document.getElementById('account-badge-wrap').innerHTML =
            '<div style="font-size:13px;color:var(--text-muted);padding:8px 0;">No ad accounts found on this Facebook profile. Make sure you have an active Meta Ads account.</div>';
          return;
        }

        select.innerHTML = '<option value="">Select an ad account (' + state.adAccounts.length + ' found)</option>';
        state.adAccounts.forEach(function(a) {
          var opt = document.createElement('option');
          opt.value = a.id;
          var label = a.name + ' \\u2014 ' + a.currency + ' (' + a.status + ')';
          opt.textContent = label;
          if (a.statusCode !== 1) opt.style.opacity = '0.5';
          if (state.selectedAccountId && state.selectedAccountId === a.id) {
            opt.selected = true;
          }
          select.appendChild(opt);
        });
        select.style.display = 'block';

        if (state.adAccounts.length === 1) {
          select.value = state.adAccounts[0].id;
          onAccountSelect();
        } else if (state.selectedAccountId) {
          showSelectedAccount(state.selectedAccountId, state.selectedAccountName, findAccount(state.selectedAccountId));
        }
      } catch (e) {
        loading.style.display = 'none';
        showToast('Could not load ad accounts: ' + e.message, 'error');
      }
    }

    function findAccount(id) {
      return state.adAccounts.find(function(a) { return a.id === id; });
    }

    function onAccountSelect() {
      var select = document.getElementById('account-select');
      var id = select.value;
      if (!id) {
        state.selectedAccountId = '';
        state.selectedAccountName = '';
        document.getElementById('account-badge-wrap').innerHTML = '';
        disableContinue();
        return;
      }

      var account = findAccount(id);
      state.selectedAccountId = id;
      state.selectedAccountName = account ? account.name : id;

      fetch('/api/meta/select-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adAccountId: id, adAccountName: state.selectedAccountName }),
      });

      showSelectedAccount(id, state.selectedAccountName, account);
      enableContinue();
    }

    function showSelectedAccount(id, name, account) {
      var wrap = document.getElementById('account-badge-wrap');
      var isActive = !account || account.statusCode === 1;
      wrap.innerHTML =
        '<div class="account-badge ' + (isActive ? 'badge-active' : 'badge-inactive') + '">' +
        '<span style="width:6px;height:6px;border-radius:50%;background:currentColor;"></span> ' +
        escapeHtml(name) + ' &middot; act_' + escapeHtml(id) +
        (account ? ' &middot; ' + account.currency : '') +
        '</div>';
    }

    function enableContinue() {
      var btn = document.getElementById('btn-continue-1');
      btn.disabled = false;
      btn.textContent = 'Continue';
    }

    function disableContinue() {
      var btn = document.getElementById('btn-continue-1');
      btn.disabled = true;
      btn.textContent = 'Select an ad account to continue';
    }

    function connectMeta() {
      window.location.href = '/auth/meta';
    }

    function disconnectMeta() {
      if (!confirm('Disconnect your Facebook account?')) return;
      fetch('/api/meta/disconnect', { method: 'POST' }).then(function() {
        resetMetaState();
        resetMetaUI();
        showToast('Facebook disconnected', 'success');
      });
    }

    function resetMetaState() {
      state.metaConnected = false;
      state.metaName = '';
      state.adAccounts = [];
      state.selectedAccountId = '';
      state.selectedAccountName = '';
    }

    function connectGoogle() {
      showToast('Google Ads integration coming soon', 'info');
    }

    function goToStep(n) {
      var wizard = document.getElementById('launch-wizard');
      if (wizard) wizard.classList.remove('is-hidden');

      for (var i = 1; i <= 3; i++) {
        var stepEl = document.getElementById('step-' + i);
        if (stepEl) stepEl.style.display = i === n ? 'block' : 'none';
        var bar = document.getElementById('step-ind-' + i);
        if (bar) bar.className = 'launch-progress-bar' + (i === n ? ' is-active' : '');
      }

      var doneEl = document.getElementById('step-done');
      if (doneEl) doneEl.classList.remove('is-visible');
      if (n === 3) populateReview();
    }

    function populateReview() {
      document.getElementById('rev-client').textContent = (document.getElementById('inp-client')?.value?.trim()) || 'Not set';
      document.getElementById('rev-page').textContent = (document.getElementById('inp-page')?.value?.trim()) || 'Not set';
      var b = document.getElementById('inp-budget')?.value || '50';
      document.getElementById('rev-budget').textContent = '$' + b + '/day';
      document.getElementById('rev-notes').textContent = (document.getElementById('inp-notes')?.value?.trim()) || '\\u2014';

      document.getElementById('rev-fb').innerHTML = state.metaConnected
        ? '<span class="badge badge-green"><span class="dot dot-green"></span>' + escapeHtml(state.metaName) + '</span>'
        : '<span class="badge badge-orange"><span class="dot dot-orange"></span>Not connected</span>';

      document.getElementById('rev-account').innerHTML = state.selectedAccountId
        ? '<span class="badge badge-green"><span class="dot dot-green"></span>' + escapeHtml(state.selectedAccountName) + ' (act_' + escapeHtml(state.selectedAccountId) + ')</span>'
        : '<span class="badge badge-orange"><span class="dot dot-orange"></span>None selected</span>';
    }

    async function launchSwarm() {
      var btn = document.getElementById('btn-launch');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Launching\\u2026';
      }

      var clientId = (document.getElementById('inp-client')?.value?.trim()) || 'demo-client';
      var pageUrl = (document.getElementById('inp-page')?.value?.trim()) || 'https://facebook.com/demo';

      try {
        var result = await api('/swarms/launch', {
          method: 'POST',
          body: {
            clientId: clientId,
            businessPageUrl: pageUrl,
            metaAccessToken: state.metaConnected ? '__cookie__' : null,
            metaAdAccountId: state.selectedAccountId || null,
            googleAccessToken: null,
          }
        });

        document.getElementById('launch-wizard').classList.add('is-hidden');
        document.getElementById('step-done').classList.add('is-visible');

        var out = document.getElementById('launch-result');
        if (out) {
          out.innerHTML =
            '<div><strong>Swarm ID</strong> &nbsp; ' + escapeHtml(String(result.swarmId || '')) + '</div>' +
            (result.status ? '<div style="margin-top:8px;"><strong>Status</strong> &nbsp; <span style="color:var(--green);">' + escapeHtml(String(result.status)) + '</span></div>' : '') +
            (state.selectedAccountName ? '<div style="margin-top:8px;"><strong>Ad account</strong> &nbsp; ' + escapeHtml(state.selectedAccountName) + '</div>' : '') +
            (result.message ? '<div style="margin-top:8px;">' + escapeHtml(String(result.message)) + '</div>' : '');
        }
        showToast('Swarm launched successfully', 'success');
      } catch (e) {
        if (btn) { btn.disabled = false; btn.textContent = 'Launch swarm'; }
        showToast('Launch failed: ' + (e?.message || 'Unknown error'), 'error');
      }
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }
  </script>
`
  });
}
