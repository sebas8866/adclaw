import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import { TaskQueue } from './queue.js';
import { config } from '../config/defaults.js';
import { agentLogger } from '../utils/logger.js';
import { ResearchAgent } from '../agents/research.js';
import { CreativeAgent } from '../agents/creative.js';
import { LaunchOptimizeAgent } from '../agents/launch-optimize.js';
import { ReportingAgent } from '../agents/reporting.js';
import { ComplianceAgent } from '../agents/compliance.js';
import { CoachAgent } from '../agents/coach.js';

/**
 * A Swarm is a dedicated agent cluster for one client/business.
 * Each swarm runs its own task queue and agent instances.
 */
export class Swarm extends EventEmitter {
  constructor({ clientId, businessPageUrl, metaAccessToken, metaAdAccountId, googleAccessToken, creativeBrief }) {
    super();
    this.id = uuid();
    this.clientId = clientId;
    this.businessPageUrl = businessPageUrl;
    this.metaAccessToken = metaAccessToken;
    this.metaAdAccountId = metaAdAccountId || null;
    this.googleAccessToken = googleAccessToken;
    this.status = 'initializing';
    this.createdAt = new Date();

    this.log = agentLogger('swarm', this.id);
    this.queue = new TaskQueue({
      concurrency: config.resources.maxConcurrentSwarms,
      name: `swarm-${this.id}`,
    });

    // Initialize all agents
    this.agents = {
      research: new ResearchAgent(this),
      creative: new CreativeAgent(this),
      launchOptimize: new LaunchOptimizeAgent(this),
      reporting: new ReportingAgent(this),
      compliance: new ComplianceAgent(this),
      coach: new CoachAgent(this),
    };

    // Shared state across agents
    this.state = {
      campaigns: [],
      insights: {},
      creatives: [],
      complianceFlags: [],
      dailyReport: null,
      creativeBrief: creativeBrief || {},
    };

    this._intervals = [];
  }

  async start() {
    this.log.info(`Starting swarm for client ${this.clientId}`);
    this.status = 'running';

    // ── Phase 1: Initial Research ──────────────────────────────────
    await this.queue.add(
      () => this.agents.research.analyzeBusinessPage(this.businessPageUrl),
      { priority: 1, id: `${this.id}-init-research` }
    );

    // ── Phase 2: Generate Initial Creatives ───────────────────────
    await this.queue.add(
      () => this.agents.creative.generateInitialSet(this.state.insights),
      { priority: 2, id: `${this.id}-init-creatives` }
    );

    // ── Phase 3: Compliance Check ─────────────────────────────────
    await this.queue.add(
      () => this.agents.compliance.reviewCreatives(this.state.creatives),
      { priority: 1, id: `${this.id}-init-compliance` }
    );

    // ── Phase 4: Launch Campaign ──────────────────────────────────
    await this.queue.add(
      () => this.agents.launchOptimize.launchCampaign(),
      { priority: 2, id: `${this.id}-launch` }
    );

    // ── Schedule Recurring Loops ──────────────────────────────────
    this._scheduleLoops();

    this.log.info('Swarm fully operational — recurring loops active');
    this.emit('ready', { swarmId: this.id });
  }

  _scheduleLoops() {
    // Tier 1: Local check every 15 minutes
    this._intervals.push(
      setInterval(() => {
        this.queue.add(
          () => this.agents.launchOptimize.localCheck(),
          { priority: 3, id: `${this.id}-local-${Date.now()}` }
        );
      }, config.intelligence.local.intervalMs)
    );

    // Tier 2: Kimi deep research every hour
    this._intervals.push(
      setInterval(() => {
        this.queue.add(
          () => this.agents.research.deepResearch(),
          { priority: 3, id: `${this.id}-kimi-${Date.now()}` }
        );
      }, config.intelligence.kimi.intervalMs)
    );

    // Tier 3: Daily Opus strategy review
    this._intervals.push(
      setInterval(() => {
        this.queue.add(
          () => this.agents.launchOptimize.dailyOpusReview(),
          { priority: 1, id: `${this.id}-opus-${Date.now()}` }
        );
      }, config.intelligence.opus.intervalMs)
    );

    // Reporting: daily summary
    this._intervals.push(
      setInterval(() => {
        this.queue.add(
          () => this.agents.reporting.generateDailyReport(),
          { priority: 4, id: `${this.id}-report-${Date.now()}` }
        );
      }, config.intelligence.opus.intervalMs)
    );
  }

  async stop() {
    this.log.info('Stopping swarm');
    this._intervals.forEach(clearInterval);
    this._intervals = [];
    await this.queue.drain();
    this.status = 'stopped';
    this.emit('stopped', { swarmId: this.id });
  }

  getStatus() {
    return {
      swarmId: this.id,
      clientId: this.clientId,
      status: this.status,
      uptime: Date.now() - this.createdAt.getTime(),
      queue: this.queue.stats(),
      agents: Object.fromEntries(
        Object.entries(this.agents).map(([name, agent]) => [name, agent.getStatus()])
      ),
      campaigns: this.state.campaigns.length,
    };
  }
}
