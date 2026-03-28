import { pageWrapper } from './shared.js';

export function appDashboardPage() {
  return pageWrapper({
    title: 'Dashboard',
    activeNav: 'app',
    body: `
  <style>
    .dash-page {
      position: relative;
      padding: 92px 0 120px;
      border-top: 1px solid rgba(126, 166, 255, 0.18);
    }
    .dash-inner { position: relative; z-index: 1; }
    .dash-top {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 18px;
      align-items: stretch;
      margin-bottom: 26px;
    }
    .dash-hero {
      padding: 26px;
      border: 1px solid rgba(127, 166, 255, 0.22);
      background: linear-gradient(180deg, rgba(12, 18, 36, 0.92), rgba(8, 12, 23, 0.92));
      border-radius: 22px;
      overflow: hidden;
      position: relative;
      min-height: 190px;
    }
    .dash-hero::before {
      content: '';
      position: absolute;
      inset: -140px -160px auto auto;
      width: 420px;
      height: 420px;
      background: radial-gradient(circle at 30% 30%, rgba(121, 177, 255, 0.22), transparent 62%);
      transform: rotate(18deg);
      pointer-events: none;
    }
    .dash-hero-inner { position: relative; z-index: 1; }
    .dash-hero-title { margin-top: 10px; }
    .dash-hero-actions { margin-top: 22px; display:flex; gap: 10px; flex-wrap: wrap; }

    .dash-side {
      padding: 22px 22px;
      border: 1px solid rgba(127, 166, 255, 0.22);
      border-radius: 22px;
      background: rgba(10, 16, 30, 0.76);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
    }
    .dash-side-top { display:flex; align-items:flex-start; justify-content: space-between; gap: 14px; }
    .dash-pulse {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      white-space: nowrap;
    }
    .dash-pulse .dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
    }
    .dash-side-kpis { display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .dash-mini-kpi {
      border: 1px solid rgba(127, 166, 255, 0.18);
      background: rgba(6, 10, 20, 0.45);
      border-radius: 16px;
      padding: 12px 12px;
      min-height: 76px;
    }
    .dash-mini-kpi .k { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
    .dash-mini-kpi .v { margin-top: 10px; font-family: var(--font-mono); font-weight: 700; font-size: 18px; color: #e7f1ff; }
    .dash-spark {
      width: 100%;
      height: 42px;
      margin-top: 10px;
      border-radius: 12px;
      background: rgba(120, 155, 219, 0.14);
      border: 1px solid rgba(134, 171, 255, 0.16);
      overflow: hidden;
    }
    .dash-spark canvas { width: 100%; height: 100%; display:block; }
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
    .kpi-grid {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .kpi-tile {
      border: 1px solid rgba(127, 166, 255, 0.18);
      background: rgba(8, 13, 24, 0.62);
      border-radius: 16px;
      padding: 14px;
    }
    .kpi-tile .k {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .kpi-tile .v {
      margin-top: 10px;
      font-family: var(--font-mono);
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: #e7f1ff;
    }
    .kpi-tile .s {
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-dim);
    }
    .insight-list {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .insight-item {
      border: 1px solid rgba(127, 166, 255, 0.18);
      background: rgba(8, 13, 24, 0.58);
      border-radius: 14px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }
    .insight-item .left {
      font-size: 13px;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .insight-item .left .title {
      color: #deecff;
      font-weight: 600;
    }
    .insight-item .metric {
      font-family: var(--font-mono);
      color: #cde1ff;
      font-size: 12px;
      white-space: nowrap;
    }
    .dash-card-split {
      border-bottom: 1px solid rgba(126, 166, 255, 0.18);
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .dash-card-body-pad { padding: 0 24px 24px; }
    .card.dash-card-flush { padding: 0; overflow: hidden; }
    .dash-table-note {
      font-size: 12px;
      color: var(--text-muted);
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dash-table-note code {
      font-family: var(--font-mono);
      font-size: 11px;
      color: #cfe4ff;
      background: rgba(108, 173, 255, 0.08);
      border: 1px solid rgba(133, 178, 255, 0.2);
      padding: 4px 8px;
      border-radius: 999px;
    }
    @media (max-width: 980px) {
      .dash-top { grid-template-columns: 1fr; }
      .dash-side-kpis { grid-template-columns: 1fr; }
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>

  <section class="dash-page">
    <div class="container dash-inner">
      <div class="dash-top">
        <div class="dash-hero">
          <div class="dash-hero-inner">
            <div class="dash-stat-label">Dashboard</div>
            <h1 class="text-section dash-hero-title">Mission Control</h1>
            <p class="text-body" style="font-size:14px;max-width:560px;margin-top:14px;">Live swarm operations + system telemetry, in one continuous surface.</p>
            <div class="dash-hero-actions">
              <a href="/app/launch" class="btn btn-primary">Launch Swarm</a>
              <a href="/app/swarms" class="btn btn-secondary">View swarms</a>
              <button type="button" onclick="toggleAutoRefresh()" class="btn btn-secondary" id="btn-auto">Auto: on</button>
            </div>
          </div>
        </div>

        <div class="dash-side">
          <div class="dash-side-top">
            <div>
              <div class="dash-stat-label">System status</div>
              <div class="text-mono" style="margin-top:10px;font-size:18px;font-weight:700;" id="sys-status">—</div>
              <div class="dash-pulse" style="margin-top:10px;">
                <span class="dot" id="pulse-dot"></span>
                <span id="last-updated">Last updated —</span>
              </div>
            </div>
            <button type="button" onclick="refreshDashboard(true)" class="btn btn-secondary btn-sm">Refresh</button>
          </div>

          <div class="dash-side-kpis">
            <div class="dash-mini-kpi">
              <div class="k">CPU</div>
              <div class="v" id="mini-cpu">—</div>
              <div class="dash-spark"><canvas id="spark-cpu"></canvas></div>
            </div>
            <div class="dash-mini-kpi">
              <div class="k">Memory</div>
              <div class="v" id="mini-mem">—</div>
              <div class="dash-spark"><canvas id="spark-mem"></canvas></div>
            </div>
          </div>
        </div>
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

      <div class="kpi-grid">
        <div class="kpi-tile reveal reveal-d4">
          <div class="k">Total Spend</div>
          <div class="v" id="k-spend">$0</div>
          <div class="s" id="k-spend-sub">Across all active reports</div>
        </div>
        <div class="kpi-tile reveal reveal-d5">
          <div class="k">ROAS</div>
          <div class="v" id="k-roas">0.00x</div>
          <div class="s" id="k-roas-sub">Revenue / spend</div>
        </div>
        <div class="kpi-tile reveal reveal-d6">
          <div class="k">CTR</div>
          <div class="v" id="k-ctr">0.00%</div>
          <div class="s" id="k-ctr-sub">Clicks / impressions</div>
        </div>
        <div class="kpi-tile reveal reveal-d7">
          <div class="k">Conversions</div>
          <div class="v" id="k-conv">0</div>
          <div class="s" id="k-conv-sub">From latest daily reports</div>
        </div>
      </div>

      <div class="grid-2 mt-4" style="align-items:stretch;">
        <div class="card reveal reveal-d6">
          <h2 class="text-headline" style="margin-bottom:8px;">Campaign Health</h2>
          <p class="text-small">Actionable rollout signals from active swarm reports.</p>
          <div class="insight-list" id="campaign-health-list">
            <div class="insight-item">
              <div class="left">
                <span class="title">No campaign report data yet</span>
                <span>Launch swarms and let reporting run to populate this section.</span>
              </div>
              <span class="metric">—</span>
            </div>
          </div>
        </div>
        <div class="card reveal reveal-d7">
          <h2 class="text-headline" style="margin-bottom:8px;">Execution Risks</h2>
          <p class="text-small">Queue pressure and recent agent failures to triage fast.</p>
          <div class="insight-list" id="risk-list">
            <div class="insight-item">
              <div class="left">
                <span class="title">No immediate risks detected</span>
                <span>System will flag bottlenecks and error spikes here.</span>
              </div>
              <span class="metric">Healthy</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card dash-card-flush reveal reveal-d5 mt-4">
        <div class="dash-card-split">
          <h2 class="text-headline">Active Swarms</h2>
          <div class="dash-table-note"><span>Updated</span><code id="table-updated">—</code></div>
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
            <span class="metric-value" id="t1">hourly</span>
          </div>
          <div class="metric-row">
            <span class="metric-label"><span class="dot" style="background:var(--blue);"></span> Tier 2 — Kimi</span>
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
    var autoRefresh = true;
    var autoTimer = null;
    var cpuHistory = [];
    var memHistory = [];

    function formatTime(ts) {
      try {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) { return '—'; }
    }

    function pushHistory(arr, v, max) {
      if (!isFinite(v)) return arr;
      arr.push(v);
      if (arr.length > max) arr.splice(0, arr.length - max);
      return arr;
    }

    function drawSparkline(canvasId, values, color) {
      var canvas = document.getElementById(canvasId);
      if (!canvas) return;
      var w = canvas.clientWidth || 240;
      var h = canvas.clientHeight || 42;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      var ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (!values || values.length < 2) return;
      var min = Math.min.apply(null, values);
      var max = Math.max.apply(null, values);
      var pad = 6;
      var range = Math.max(1, max - min);

      ctx.beginPath();
      values.forEach(function(v, i) {
        var x = pad + (i * (w - pad * 2)) / (values.length - 1);
        var y = pad + (1 - (v - min) / range) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function setStatus(cpuPct, memPct) {
      var statusEl = document.getElementById('sys-status');
      var dot = document.getElementById('pulse-dot');
      if (!statusEl || !dot) return;

      var score = Math.max(cpuPct || 0, memPct || 0);
      var label = score > 85 ? 'Degraded' : score > 60 ? 'Elevated' : 'Healthy';
      var color = score > 85 ? 'var(--red)' : score > 60 ? 'var(--amber)' : 'var(--green)';
      statusEl.textContent = label;
      statusEl.style.color = color;
      dot.style.background = color;
      dot.style.boxShadow =
        score > 85 ? '0 0 0 4px rgba(239, 68, 68, 0.16)' :
        score > 60 ? '0 0 0 4px rgba(245, 158, 11, 0.16)' :
        '0 0 0 4px rgba(34, 197, 94, 0.12)';
    }

    function setLastUpdated(ts) {
      var t = formatTime(ts);
      var el = document.getElementById('last-updated');
      var table = document.getElementById('table-updated');
      if (el) el.textContent = 'Last updated ' + t;
      if (table) table.textContent = t;
    }

    function toggleAutoRefresh() {
      autoRefresh = !autoRefresh;
      var btn = document.getElementById('btn-auto');
      if (btn) btn.textContent = 'Auto: ' + (autoRefresh ? 'on' : 'off');
      if (autoRefresh) scheduleAuto();
      else stopAuto();
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    function scheduleAuto() {
      stopAuto();
      autoTimer = setInterval(function() {
        if (autoRefresh) refreshDashboard(false);
      }, 6000);
    }

    function formatCurrency(n) {
      var v = isFinite(n) ? n : 0;
      return '$' + v.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    function formatCompact(n) {
      var v = isFinite(n) ? n : 0;
      return v.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    function formatPct(n) {
      var v = isFinite(n) ? n : 0;
      return v.toFixed(2) + '%';
    }

    async function refreshDashboard(userTriggered) {
      try {
        var now = Date.now();
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
        var miniCpu = document.getElementById('mini-cpu');
        if (miniCpu) { miniCpu.textContent = (sys.cpuUsagePercent != null ? sys.cpuUsagePercent : '0') + '%'; miniCpu.style.color = cpuColor; }
        cpuHistory = pushHistory(cpuHistory, cpuPct, 28);

        var memPct = parseFloat(sys.memoryUsagePercent);
        var memColor = memPct > 85 ? 'var(--red)' : memPct > 60 ? 'var(--amber)' : 'var(--blue)';
        document.getElementById('s-mem').textContent = (sys.memoryUsagePercent != null ? sys.memoryUsagePercent : '0') + '%';
        document.getElementById('s-mem').style.color = memColor;
        document.getElementById('s-mem-bar').style.width = (sys.memoryUsagePercent != null ? sys.memoryUsagePercent : 0) + '%';
        document.getElementById('s-mem-bar').style.background = memColor;
        var miniMem = document.getElementById('mini-mem');
        if (miniMem) { miniMem.textContent = (sys.memoryUsagePercent != null ? sys.memoryUsagePercent : '0') + '%'; miniMem.style.color = memColor; }
        memHistory = pushHistory(memHistory, memPct, 28);

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

        setStatus(cpuPct, memPct);
        setLastUpdated(now);
        drawSparkline('spark-cpu', cpuHistory, cpuColor);
        drawSparkline('spark-mem', memHistory, memColor);

        var list = swarms.swarms || [];
        var reportResults = await Promise.all(
          list.map(async function(s) {
            try {
              var report = await api('/swarms/' + s.swarmId + '/report');
              if (report && report.metrics) return { swarmId: s.swarmId, clientId: s.clientId, report: report };
            } catch (e) {}
            return null;
          })
        );
        var reports = reportResults.filter(Boolean);

        var reportAgg = {
          spend: 0, revenue: 0, impressions: 0, clicks: 0, conversions: 0, activeCampaigns: 0, pausedAdSets: 0,
        };
        reports.forEach(function(r) {
          var m = r.report.metrics || {};
          reportAgg.spend += Number(m.totalSpend || 0);
          reportAgg.revenue += Number(m.totalRevenue || 0);
          reportAgg.impressions += Number(m.totalImpressions || 0);
          reportAgg.clicks += Number(m.totalClicks || 0);
          reportAgg.conversions += Number(m.totalConversions || 0);
          reportAgg.activeCampaigns += Number(m.activeCampaigns || 0);
          reportAgg.pausedAdSets += Number(m.pausedAdSets || 0);
        });
        var aggRoas = reportAgg.spend > 0 ? (reportAgg.revenue / reportAgg.spend) : 0;
        var aggCtr = reportAgg.impressions > 0 ? ((reportAgg.clicks / reportAgg.impressions) * 100) : 0;

        document.getElementById('k-spend').textContent = formatCurrency(reportAgg.spend);
        document.getElementById('k-roas').textContent = aggRoas.toFixed(2) + 'x';
        document.getElementById('k-ctr').textContent = formatPct(aggCtr);
        document.getElementById('k-conv').textContent = formatCompact(reportAgg.conversions);
        document.getElementById('k-spend-sub').textContent = reports.length > 0 ? ('From ' + reports.length + ' active report(s)') : 'No reports available yet';
        document.getElementById('k-roas-sub').textContent = reportAgg.revenue > 0 ? ('Revenue ' + formatCurrency(reportAgg.revenue)) : 'Revenue / spend';
        document.getElementById('k-ctr-sub').textContent = reportAgg.impressions > 0 ? (formatCompact(reportAgg.clicks) + ' clicks / ' + formatCompact(reportAgg.impressions) + ' impressions') : 'Clicks / impressions';
        document.getElementById('k-conv-sub').textContent = reports.length > 0 ? (formatCompact(reportAgg.activeCampaigns) + ' active campaigns') : 'From latest daily reports';

        var healthList = document.getElementById('campaign-health-list');
        if (healthList) {
          if (!reports.length) {
            healthList.innerHTML =
              '<div class="insight-item"><div class="left"><span class="title">No campaign report data yet</span><span>Launch swarms and let reporting run to populate this section.</span></div><span class="metric">—</span></div>';
          } else {
            var topRoas = reports.slice().sort(function(a, b) {
              var ar = Number((a.report.metrics || {}).overallRoas || 0);
              var br = Number((b.report.metrics || {}).overallRoas || 0);
              return br - ar;
            }).slice(0, 3);
            var htmlHealth = '';
            topRoas.forEach(function(entry) {
              var m = entry.report.metrics || {};
              htmlHealth +=
                '<div class="insight-item">' +
                '<div class="left"><span class="title">' + (entry.clientId || entry.swarmId) + '</span>' +
                '<span>' + formatCompact(Number(m.activeCampaigns || 0)) + ' active campaigns, ' + formatCompact(Number(m.pausedAdSets || 0)) + ' paused ad sets</span></div>' +
                '<span class="metric">ROAS ' + Number(m.overallRoas || 0).toFixed(2) + 'x</span>' +
                '</div>';
            });
            healthList.innerHTML = htmlHealth;
          }
        }

        var riskList = document.getElementById('risk-list');
        if (riskList) {
          var risks = [];
          list.forEach(function(s) {
            var q = s.queue || {};
            var queued = Number(q.queued || 0);
            var running = Number(q.running || 0);
            if (queued > 6) {
              risks.push({
                title: (s.clientId || s.swarmId) + ' queue backlog',
                detail: queued + ' queued, ' + running + ' running',
                metric: 'Queue high'
              });
            }
            if (s.agents) {
              Object.keys(s.agents).forEach(function(name) {
                var a = s.agents[name];
                var errCount = (a.recentErrors || []).length;
                if (a.status === 'error' || errCount > 0) {
                  risks.push({
                    title: (s.clientId || s.swarmId) + ' · ' + name + ' agent',
                    detail: errCount + ' recent error(s)',
                    metric: a.status === 'error' ? 'Error' : 'Warn'
                  });
                }
              });
            }
          });
          if (!risks.length) {
            riskList.innerHTML =
              '<div class="insight-item"><div class="left"><span class="title">No immediate risks detected</span><span>Queue and agent status are stable across active swarms.</span></div><span class="metric">Healthy</span></div>';
          } else {
            riskList.innerHTML = risks.slice(0, 4).map(function(r) {
              return '<div class="insight-item"><div class="left"><span class="title">' + r.title + '</span><span>' + r.detail + '</span></div><span class="metric">' + r.metric + '</span></div>';
            }).join('');
          }
        }

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
        if (userTriggered) showToast('Refresh failed: ' + (e.message || 'Unknown error'), 'error');
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

    refreshDashboard(false);
    scheduleAuto();
  </script>
`
  });
}
