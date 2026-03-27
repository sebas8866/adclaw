import { pageWrapper } from './shared.js';

export function appDashboardPage() {
  return pageWrapper({
    title: 'Dashboard',
    activeNav: 'app',
    body: `
  <style>
    .dash-page {
      position: relative;
      padding: 48px 0 80px;
    }
    .dash-page::before {
      content: '';
      position: absolute;
      inset: 0 0 auto 0;
      height: 320px;
      background: radial-gradient(ellipse 70% 55% at 20% 0%, rgba(255, 107, 44, 0.06), transparent 55%),
                  radial-gradient(ellipse 50% 40% at 85% 10%, rgba(59, 130, 246, 0.04), transparent 50%);
      pointer-events: none;
    }
    .dash-inner { position: relative; z-index: 1; }
    .dash-stat-label {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-dim);
    }
    .dash-stat-value {
      font-family: var(--font-mono);
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 700;
      letter-spacing: -0.06em;
      line-height: 1.15;
      margin-top: 12px;
    }
    .dash-stat-sub {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 6px;
    }
    .dash-card-split {
      border-bottom: 1px solid var(--border);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .dash-card-body-pad { padding: 0 24px 24px; }
    .card.dash-card-flush { padding: 0; overflow: hidden; }
  </style>

  <section class="dash-page">
    <div class="container dash-inner">
      <div class="flex justify-between items-center" style="flex-wrap:wrap;gap:20px;margin-bottom:40px;">
        <div>
          <h1 class="text-section" style="margin-bottom:10px;">Dashboard</h1>
          <p class="text-body" style="font-size:14px;max-width:420px;">Live view of swarms, capacity, and platform health.</p>
        </div>
        <a href="/app/launch" class="btn btn-primary">Launch New Swarm</a>
      </div>

      <div class="grid-4" id="stat-cards">
        <div class="card reveal reveal-d1">
          <div class="dash-stat-label">Active Swarms</div>
          <div class="dash-stat-value text-mono" style="color:var(--primary);" id="s-swarms">—</div>
          <div class="dash-stat-sub">of <span id="s-max" class="text-mono">4</span> max</div>
        </div>
        <div class="card reveal reveal-d2">
          <div class="dash-stat-label">Total Campaigns</div>
          <div class="dash-stat-value text-mono" style="color:var(--green);" id="s-campaigns">—</div>
        </div>
        <div class="card reveal reveal-d3">
          <div class="dash-stat-label">System CPU</div>
          <div class="dash-stat-value text-mono" id="s-cpu">—</div>
          <div class="progress mt-1"><div id="s-cpu-bar" class="progress-fill" style="width:0%;background:var(--green);"></div></div>
        </div>
        <div class="card reveal reveal-d4">
          <div class="dash-stat-label">Memory</div>
          <div class="dash-stat-value text-mono" id="s-mem">—</div>
          <div class="progress mt-1"><div id="s-mem-bar" class="progress-fill" style="width:0%;background:var(--blue);"></div></div>
        </div>
      </div>

      <div class="card dash-card-flush reveal reveal-d5 mt-4">
        <div class="dash-card-split">
          <h2 class="text-headline">Active Swarms</h2>
          <button type="button" onclick="refreshDashboard()" class="btn btn-secondary btn-sm">Refresh</button>
        </div>
        <div id="swarm-table-area" class="dash-card-body-pad">
          <div class="empty-state">
            <div class="text-mono" style="font-size:32px;font-weight:700;color:var(--text-dim);margin-bottom:12px;">—</div>
            <h3>No swarms running</h3>
            <p>Launch a swarm to orchestrate campaigns across your stack.</p>
            <a href="/app/launch" class="btn btn-primary btn-sm mt-3">Launch Swarm</a>
          </div>
        </div>
      </div>

      <div class="grid-2 mt-4" style="align-items:stretch;">
        <div class="card reveal reveal-d6">
          <h2 class="text-headline" style="margin-bottom:8px;">Intelligence Tiers</h2>
          <p class="text-small" style="margin-bottom:20px;">Routing cadence by model tier.</p>
          <div class="metric-row">
            <span class="metric-label"><span class="dot dot-green"></span> Tier 1 — Ollama</span>
            <span class="metric-value" id="t1">every 15 min</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><span class="dot" style="background:var(--blue);box-shadow:0 0 8px rgba(59,130,246,0.45);"></span> Tier 2 — Kimi</span>
            <span class="metric-value" id="t2">hourly</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><span class="dot dot-orange"></span> Tier 3 — Opus</span>
            <span class="metric-value" id="t3">daily</span>
          </div>
        </div>
        <div class="card reveal reveal-d7">
          <h2 class="text-headline" style="margin-bottom:8px;">System Info</h2>
          <p class="text-small" style="margin-bottom:20px;">Host and runtime snapshot.</p>
          <div class="metric-row"><span class="metric-label">Hostname</span><span class="metric-value" id="sys-host">—</span></div>
          <div class="metric-row"><span class="metric-label">Platform</span><span class="metric-value" id="sys-platform">—</span></div>
          <div class="metric-row"><span class="metric-label">Node.js</span><span class="metric-value" id="sys-node">—</span></div>
          <div class="metric-row"><span class="metric-label">CPU Cores</span><span class="metric-value" id="sys-cores">—</span></div>
          <div class="metric-row"><span class="metric-label">Uptime</span><span class="metric-value" id="sys-uptime">—</span></div>
        </div>
      </div>
    </div>
  </section>
`,
    scripts: `
  <script>
    async function refreshDashboard() {
      try {
        var swarms = await api('/swarms');
        var sys = await api('/system');
        var health = await api('/health');

        document.getElementById('s-swarms').textContent = swarms.activeSwarms != null ? swarms.activeSwarms : 0;
        document.getElementById('s-max').textContent = swarms.maxSwarms != null ? swarms.maxSwarms : 4;

        var totalCampaigns = 0;
        (swarms.swarms || []).forEach(function(s) {
          totalCampaigns += s.campaigns || 0;
        });
        document.getElementById('s-campaigns').textContent = totalCampaigns;

        var cpuPct = parseFloat(sys.cpuUsagePercent);
        var cpuColor = cpuPct > 85 ? 'var(--red)' : cpuPct > 60 ? 'var(--amber)' : 'var(--green)';
        document.getElementById('s-cpu').textContent = (sys.cpuUsagePercent != null ? sys.cpuUsagePercent : '0') + '%';
        document.getElementById('s-cpu').style.color = cpuColor;
        document.getElementById('s-cpu-bar').style.width = (sys.cpuUsagePercent != null ? sys.cpuUsagePercent : 0) + '%';
        document.getElementById('s-cpu-bar').style.background = cpuColor;

        var memPct = parseFloat(sys.memoryUsagePercent);
        var memColor = memPct > 85 ? 'var(--red)' : memPct > 60 ? 'var(--amber)' : 'var(--blue)';
        document.getElementById('s-mem').textContent = (sys.memoryUsagePercent != null ? sys.memoryUsagePercent : '0') + '%';
        document.getElementById('s-mem').style.color = memColor;
        document.getElementById('s-mem-bar').style.width = (sys.memoryUsagePercent != null ? sys.memoryUsagePercent : 0) + '%';
        document.getElementById('s-mem-bar').style.background = memColor;

        document.getElementById('sys-host').textContent = sys.hostname != null ? sys.hostname : '—';
        document.getElementById('sys-platform').textContent =
          (sys.platform != null ? sys.platform : '') + (sys.arch != null ? ' ' + sys.arch : '');
        document.getElementById('sys-node').textContent = sys.nodeVersion != null ? sys.nodeVersion : '—';
        document.getElementById('sys-cores').textContent = sys.cpuCores != null ? String(sys.cpuCores) : '—';

        var uptimeSec = health.uptime != null ? health.uptime : 0;
        var mins = Math.floor(uptimeSec / 60);
        var hrs = Math.floor(mins / 60);
        document.getElementById('sys-uptime').textContent =
          hrs > 0 ? hrs + 'h ' + (mins % 60) + 'm' : mins + 'm';

        var list = swarms.swarms || [];
        var area = document.getElementById('swarm-table-area');
        if (list.length === 0) {
          area.innerHTML =
            '<div class="empty-state">' +
            '<div class="text-mono" style="font-size:32px;font-weight:700;color:var(--text-dim);margin-bottom:12px;">—</div>' +
            '<h3>No swarms running</h3>' +
            '<p>Launch a swarm to orchestrate campaigns across your stack.</p>' +
            '<a href="/app/launch" class="btn btn-primary btn-sm mt-3">Launch Swarm</a>' +
            '</div>';
        } else {
          var html =
            '<div class="table-wrap"><table><thead><tr>' +
            '<th>Client</th><th>Status</th><th>Campaigns</th><th>Queue</th><th>Agents</th><th>Actions</th>' +
            '</tr></thead><tbody>';
          list.forEach(function(s) {
            var statusBadge =
              s.status === 'running'
                ? '<span class="badge badge-green"><span class="dot dot-green"></span>Running</span>'
                : '<span class="badge badge-orange"><span class="dot dot-orange"></span>' + (s.status || '') + '</span>';
            var agentCount = s.agents ? Object.keys(s.agents).length : 6;
            var q = s.queue || { queued: 0, running: 0 };
            html += '<tr>';
            html +=
              '<td><a href="/app/swarms/' +
              s.swarmId +
              '" style="font-weight:600;color:var(--primary);">' +
              (s.clientId || s.swarmId) +
              '</a></td>';
            html += '<td>' + statusBadge + '</td>';
            html += '<td class="text-mono">' + (s.campaigns || 0) + '</td>';
            html += '<td class="text-mono">' + q.queued + ' / ' + q.running + '</td>';
            html += '<td>' + agentCount + ' active</td>';
            html +=
              '<td><button type="button" onclick="stopSwarm(\\'' +
              s.swarmId +
              '\\')" class="btn btn-danger btn-sm">Stop</button></td>';
            html += '</tr>';
          });
          html += '</tbody></table></div>';
          area.innerHTML = html;
        }
      } catch (e) {
        console.error('Dashboard refresh error:', e);
      }
    }

    async function stopSwarm(id) {
      try {
        await api('/swarms/' + id + '/stop', { method: 'POST' });
        showToast('Swarm stopped', 'success');
        refreshDashboard();
      } catch (e) {
        showToast('Failed to stop swarm: ' + e.message, 'error');
      }
    }

    refreshDashboard();
    setInterval(refreshDashboard, 5000);
  </script>
`
  });
}
