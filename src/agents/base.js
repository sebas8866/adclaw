/**
 * Base class for all AdClaw agents.
 * Provides shared lifecycle, logging, and state access.
 */
export class BaseAgent {
  constructor(swarm, name) {
    this.swarm = swarm;
    this.name = name;
    this.status = 'idle';
    this.lastRun = null;
    this.runCount = 0;
    this.errors = [];
  }

  get state() {
    return this.swarm.state;
  }

  get log() {
    return this.swarm.log;
  }

  async run(taskName, fn) {
    this.status = 'running';
    this.log.info(`[${this.name}] Starting: ${taskName}`);
    const start = Date.now();

    try {
      const result = await fn();
      this.runCount++;
      this.lastRun = { taskName, at: new Date(), durationMs: Date.now() - start, success: true };
      this.status = 'idle';
      return result;
    } catch (err) {
      this.errors.push({ taskName, at: new Date(), message: err.message });
      this.lastRun = { taskName, at: new Date(), durationMs: Date.now() - start, success: false };
      this.status = 'error';
      this.log.error(`[${this.name}] Failed ${taskName}: ${err.message}`);
      throw err;
    }
  }

  getStatus() {
    return {
      name: this.name,
      status: this.status,
      runCount: this.runCount,
      lastRun: this.lastRun,
      recentErrors: this.errors.slice(-3),
    };
  }
}
