import { pageWrapper } from './shared.js';

export function swarmsPage() {
  return pageWrapper({
    title: 'Agent Swarms',
    activeNav: 'swarms',
    body: `
  <style>
    .swarms-page { padding: 48px 0 80px; }
    .swarms-head {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 16px; margin-bottom: 8px;
    }
    .swarms-head h1 {
      font-family: var(--font-display);
      font-size: clamp(26px, 4vw, 32px);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--text);
    }
    .swarms-sub {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 6px;
      max-width: 420px;
      line-height: 1.5;
    }
    .swarm-card-title {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .swarm-card-id {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-dim);
      margin-top: 6px;
    }
    .swarm-card-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 12px;
    }
    .swarm-card-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .agent-pills {
      display: flex; flex-wrap: wrap; gap: 8px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .agent-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 10px;
      border-radius: var(--r-sm);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--text-secondary);
    }
    .agent-pill strong { font-weight: 600; color: var(--text); font-family: var(--font-body); }
    .stat-grid-label {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
    }
    .stat-grid-value {
      font-family: var(--font-mono);
      font-size: 20px;
      font-weight: 700;
      margin-top: 6px;
      color: var(--text);
    }
    .stat-grid-value.accent { color: var(--primary); }
    .stat-grid-value.ok { color: var(--green); }
    .swarm-card + .swarm-card { margin-top: 16px; }
  </style>

  <section class="swarms-page">
    <div class="container">
      <header class="swarms-head reveal">
        <div>
          <h1>Agent Swarms</h1>
          <p class="swarms-sub">Monitor running swarms, queue depth, and agent health.</p>
        </div>
        <div class="flex gap-2 items-center">
          <button type="button" onclick="loadSwarms()" class="btn btn-ghost btn-sm">Refresh</button>
          <a href="/app/launch" class="btn btn-primary btn-sm">New Swarm</a>
        </div>
      </header>

      <div id="swarms-area" class="mt-3">
        <div class="text-center" style="padding:48px 0;">
          <div class="spinner" style="margin:0 auto;"></div>
        </div>
      </div>
    </div>
  </section>
`,
    scripts: `
  <script>
    function observeReveals() {
      if (typeof IntersectionObserver === 'undefined') return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal').forEach(function(el) {
        obs.observe(el);
      });
    }

    async function loadSwarms() {
      var area = document.getElementById('swarms-area');
      try {
        var data = await api('/swarms');
        var list = data.swarms || [];

        if (list.length === 0) {
          area.innerHTML = '<div class="empty-state card reveal"><h3>No swarms</h3><p>Launch a swarm to start autonomous ad optimization.</p><a href="/app/launch" class="btn btn-primary btn-sm mt-2" style="margin-top:16px;display:inline-flex;">New Swarm</a></div>';
          observeReveals();
          return;
        }

        var html = '';
        list.forEach(function(s, idx) {
          var statusBadge = s.status === 'running'
            ? '<span class="badge badge-green"><span class="dot dot-green"></span>Running</span>'
            : s.status === 'initializing'
            ? '<span class="badge badge-orange"><span class="dot dot-orange"></span>Initializing</span>'
            : '<span class="badge badge-red"><span class="dot dot-red"></span>' + escapeHtml(String(s.status || 'unknown')) + '</span>';

          var upH = Math.floor((s.uptime || 0) / 3600000);
          var upM = Math.floor(((s.uptime || 0) % 3600000) / 60000);
          var uptimeStr = upH > 0 ? upH + 'h ' + upM + 'm' : upM + 'm';

          var q = s.queue || {};
          var queued = q.queued != null ? q.queued : 0;
          var running = q.running != null ? q.running : 0;
          var completed = q.completed != null ? q.completed : 0;

          var delayClass = ' reveal-d' + Math.min(idx + 1, 8);

          html += '<article class="card swarm-card reveal' + delayClass + '">';
          html += '<div class="swarm-card-top">';
          html += '<div>';
          html += '<div class="flex gap-2 items-center flex-wrap">';
          html += '<span class="swarm-card-title">' + escapeHtml(String(s.clientId || 'Unnamed')) + '</span>';
          html += statusBadge;
          html += '</div>';
          html += '<div class="swarm-card-id">' + escapeHtml(String(s.swarmId || '')) + '</div>';
          html += '</div>';
          html += '<div class="swarm-card-actions">';
          html += '<a href="/app/swarms/' + encodeURIComponent(s.swarmId) + '" class="btn btn-secondary btn-sm">Details</a>';
          html += '<button type="button" onclick="stopSwarm(' + JSON.stringify(s.swarmId) + ')" class="btn btn-danger btn-sm">Stop</button>';
          html += '</div></div>';

          html += '<div class="grid-4 mt-4">';
          html += '<div><div class="stat-grid-label">Campaigns</div><div class="stat-grid-value accent">' + (s.campaigns || 0) + '</div></div>';
          html += '<div><div class="stat-grid-label">Queue</div><div class="stat-grid-value">' + queued + ' <span style="color:var(--text-dim);font-weight:500;">/</span> ' + running + '</div></div>';
          html += '<div><div class="stat-grid-label">Completed</div><div class="stat-grid-value ok">' + completed + '</div></div>';
          html += '<div><div class="stat-grid-label">Uptime</div><div class="stat-grid-value">' + uptimeStr + '</div></div>';
          html += '</div>';

          if (s.agents && typeof s.agents === 'object') {
            html += '<div class="agent-pills">';
            Object.keys(s.agents).forEach(function(name) {
              var a = s.agents[name];
              var dotClass = a.status === 'running' ? 'dot-green' : a.status === 'error' ? 'dot-red' : '';
              var dotExtra = dotClass ? '' : ' style="background:var(--text-dim);"';
              html += '<span class="agent-pill"><span class="dot ' + dotClass + '"' + dotExtra + '></span><strong>' + escapeHtml(a.name || name) + '</strong> ' + escapeHtml(String(a.status || '')) + ' · ' + (a.runCount != null ? a.runCount : 0) + '</span>';
            });
            html += '</div>';
          }

          html += '</article>';
        });

        area.innerHTML = html;
        observeReveals();
      } catch (e) {
        area.innerHTML = '<div class="card reveal" style="border-color:rgba(239,68,68,0.25);color:var(--red);font-size:14px;padding:20px;">Failed to load swarms: ' + escapeHtml(e.message) + '</div>';
        observeReveals();
      }
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    async function stopSwarm(id) {
      if (!confirm('Stop this swarm? Active campaigns will continue on Meta/Google but won\\'t be optimized.')) return;
      try {
        await api('/swarms/' + encodeURIComponent(id) + '/stop', { method: 'POST' });
        showToast('Swarm stopped', 'success');
        loadSwarms();
      } catch (e) {
        showToast('Failed: ' + e.message, 'error');
      }
    }

    loadSwarms();
    setInterval(loadSwarms, 8000);
  </script>
`
  });
}

export function swarmDetailPage(swarmId) {
  return pageWrapper({
    title: 'Swarm',
    activeNav: 'swarms',
    body: `
  <style>
    .detail-page { padding: 40px 0 80px; }
    .detail-back {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 20px;
      transition: color 0.2s;
    }
    .detail-back:hover { color: var(--primary); }
    .detail-hero {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 16px;
      margin-bottom: 28px;
    }
    .detail-hero h1 {
      font-family: var(--font-display);
      font-size: clamp(24px, 3.5vw, 30px);
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    .detail-hero-id {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-dim);
      margin-top: 8px;
      word-break: break-all;
    }
    .detail-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
    .stat-card-label {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-dim);
    }
    .stat-card-value {
      font-family: var(--font-mono);
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.04em;
      margin-top: 10px;
      color: var(--text);
    }
    .stat-card-value.accent { color: var(--primary); }
    .stat-card-value.ok { color: var(--green); }
    .section-title {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0;
    }
    .report-box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--r-md);
      padding: 16px 18px;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.65;
      white-space: pre-wrap;
      font-family: var(--font-body);
    }
  </style>

  <section class="detail-page">
    <div class="container">
      <a href="/app/swarms" class="detail-back reveal">&larr; Back to swarms</a>

      <div id="detail-area">
        <div class="text-center" style="padding:48px 0;">
          <div class="spinner" style="margin:0 auto;"></div>
        </div>
      </div>
    </div>
  </section>
`,
    scripts: `
  <script>
    var SWARM_ID = ${JSON.stringify(swarmId)};

    function observeReveals() {
      if (typeof IntersectionObserver === 'undefined') return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal').forEach(function(el) {
        obs.observe(el);
      });
    }

    function escapeHtml(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    async function loadDetail() {
      var area = document.getElementById('detail-area');
      try {
        var s = await api('/swarms/' + encodeURIComponent(SWARM_ID));

        var statusBadge = s.status === 'running'
          ? '<span class="badge badge-green"><span class="dot dot-green"></span>Running</span>'
          : s.status === 'initializing'
          ? '<span class="badge badge-orange"><span class="dot dot-orange"></span>Initializing</span>'
          : '<span class="badge badge-red"><span class="dot dot-red"></span>' + escapeHtml(String(s.status || 'unknown')) + '</span>';

        var upH = Math.floor((s.uptime || 0) / 3600000);
        var upM = Math.floor(((s.uptime || 0) % 3600000) / 60000);
        var uptimeStr = upH > 0 ? upH + 'h ' + upM + 'm' : upM + 'm';

        var q = s.queue || {};
        var queued = q.queued != null ? q.queued : 0;
        var running = q.running != null ? q.running : 0;
        var completed = q.completed != null ? q.completed : 0;

        var html = '';

        html += '<header class="detail-hero reveal">';
        html += '<div>';
        html += '<h1>' + escapeHtml(String(s.clientId || 'Unnamed')) + '</h1>';
        html += '<div class="detail-hero-id">' + escapeHtml(String(s.swarmId || SWARM_ID)) + '</div>';
        html += '</div>';
        html += '<div class="detail-hero-actions">' + statusBadge;
        html += '<button type="button" onclick="stopSwarmDetail()" class="btn btn-danger btn-sm">Stop</button>';
        html += '</div></header>';

        html += '<div class="grid-4 reveal reveal-d2">';
        html += '<div class="card"><div class="stat-card-label">Campaigns</div><div class="stat-card-value accent">' + (s.campaigns || 0) + '</div></div>';
        html += '<div class="card"><div class="stat-card-label">Queue</div><div class="stat-card-value">' + queued + ' <span style="color:var(--text-dim);font-weight:500;font-size:22px;">/</span> ' + running + '</div></div>';
        html += '<div class="card"><div class="stat-card-label">Tasks completed</div><div class="stat-card-value ok">' + completed + '</div></div>';
        html += '<div class="card"><div class="stat-card-label">Uptime</div><div class="stat-card-value">' + uptimeStr + '</div></div>';
        html += '</div>';

        html += '<div class="card mt-4 reveal reveal-d3">';
        html += '<h2 class="section-title" style="margin-bottom:16px;">Agent status</h2>';
        html += '<div class="table-wrap"><table><thead><tr><th>Agent</th><th>Status</th><th>Runs</th><th>Last run</th><th>Errors</th></tr></thead><tbody>';

        if (s.agents && typeof s.agents === 'object') {
          Object.keys(s.agents).forEach(function(name) {
            var a = s.agents[name];
            var statusDot = a.status === 'running' ? 'dot-green' : a.status === 'error' ? 'dot-red' : '';
            var lastRunStr = a.lastRun
              ? escapeHtml(String(a.lastRun.taskName || '')) + ' (' + (a.lastRun.durationMs != null ? a.lastRun.durationMs : 0) + 'ms)'
              : '—';
            var errCount = a.recentErrors && a.recentErrors.length ? a.recentErrors.length : 0;
            html += '<tr>';
            html += '<td style="font-weight:600;"><span class="dot ' + statusDot + '"' + (statusDot ? '' : ' style="background:var(--text-dim);"') + '></span> <span style="margin-left:6px;">' + escapeHtml(a.name || name) + '</span></td>';
            html += '<td style="font-family:var(--font-mono);font-size:12px;">' + escapeHtml(String(a.status || '')) + '</td>';
            html += '<td style="font-family:var(--font-mono);">' + (a.runCount != null ? a.runCount : 0) + '</td>';
            html += '<td style="font-size:12px;color:var(--text-secondary);max-width:240px;">' + lastRunStr + '</td>';
            html += '<td style="font-family:var(--font-mono);color:' + (errCount > 0 ? 'var(--red)' : 'var(--text-dim)') + ';">' + errCount + '</td>';
            html += '</tr>';
          });
        }

        html += '</tbody></table></div></div>';

        html += '<div class="card mt-4 reveal reveal-d4">';
        html += '<h2 class="section-title" style="margin-bottom:16px;">Latest report</h2>';
        html += '<div id="report-area"><div class="text-small" style="color:var(--text-muted);font-family:var(--font-mono);">Loading report…</div></div>';
        html += '</div>';

        area.innerHTML = html;
        observeReveals();
        loadReport();
      } catch (e) {
        area.innerHTML = '<div class="card reveal" style="border-color:rgba(239,68,68,0.25);color:var(--red);font-size:14px;padding:20px;">Swarm unavailable: ' + escapeHtml(e.message) + '</div>';
        observeReveals();
      }
    }

    async function loadReport() {
      var el = document.getElementById('report-area');
      if (!el) return;
      try {
        var report = await api('/swarms/' + encodeURIComponent(SWARM_ID) + '/report');
        if (report.message) {
          el.innerHTML = '<div class="text-small" style="color:var(--text-muted);">' + escapeHtml(String(report.message)) + '</div>';
          return;
        }
        var m = report.metrics || {};
        var roas = m.overallRoas != null && m.overallRoas !== '' ? m.overallRoas : '—';
        var spend = m.totalSpend != null ? Number(m.totalSpend) : 0;
        var revenue = m.totalRevenue != null ? Number(m.totalRevenue) : 0;

        var h = '<div class="grid-3" style="margin-bottom:20px;">';
        h += '<div class="metric-row"><span class="metric-label">ROAS</span><span class="metric-value" style="color:var(--primary);">' + escapeHtml(String(roas)) + (roas === '—' ? '' : '×') + '</span></div>';
        h += '<div class="metric-row"><span class="metric-label">Spend</span><span class="metric-value">$' + spend.toFixed(2) + '</span></div>';
        h += '<div class="metric-row"><span class="metric-label">Revenue</span><span class="metric-value" style="color:var(--green);">$' + revenue.toFixed(2) + '</span></div>';
        h += '</div>';
        if (report.summary) {
          h += '<div class="report-box reveal">' + escapeHtml(String(report.summary)) + '</div>';
        }
        el.innerHTML = h;
        observeReveals();
      } catch (e) {
        el.innerHTML = '<div class="text-small" style="color:var(--text-dim);font-family:var(--font-mono);">No report yet.</div>';
      }
    }

    async function stopSwarmDetail() {
      if (!confirm('Stop this swarm?')) return;
      try {
        await api('/swarms/' + encodeURIComponent(SWARM_ID) + '/stop', { method: 'POST' });
        showToast('Swarm stopped', 'success');
        window.location.href = '/app/swarms';
      } catch (e) {
        showToast('Failed: ' + e.message, 'error');
      }
    }

    loadDetail();
    setInterval(loadDetail, 5000);
  </script>
`
  });
}
