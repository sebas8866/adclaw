import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

/**
 * In-memory priority queue for Mac Mini resource management.
 * Swap for BullMQ + Redis in production by setting REDIS_URL.
 *
 * Priorities:
 *   1 = critical (Opus decisions, compliance alerts)
 *   2 = high     (campaign launches, budget changes)
 *   3 = normal   (scheduled checks, reporting)
 *   4 = low      (creative pre-generation, analytics)
 */

export class TaskQueue extends EventEmitter {
  constructor({ concurrency = 4, name = 'default' } = {}) {
    super();
    this.name = name;
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];        // { id, priority, task, resolve, reject, addedAt }
    this.completed = 0;
    this.failed = 0;
  }

  /**
   * Add a task to the queue.
   * @param {Function} task - async function to execute
   * @param {object} opts
   * @param {number} opts.priority - 1 (critical) to 4 (low)
   * @param {string} opts.id - unique task identifier
   */
  add(task, { priority = 3, id = `task-${Date.now()}` } = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, priority, task, resolve, reject, addedAt: Date.now() });
      this.queue.sort((a, b) => a.priority - b.priority || a.addedAt - b.addedAt);
      this.emit('added', { id, priority, queueLength: this.queue.length });
      this._process();
    });
  }

  async _process() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const job = this.queue.shift();
      this.running++;
      this.emit('start', { id: job.id });

      try {
        const result = await job.task();
        this.completed++;
        this.emit('complete', { id: job.id, result });
        job.resolve(result);
      } catch (err) {
        this.failed++;
        this.emit('error', { id: job.id, error: err });
        logger.error(`Task ${job.id} failed: ${err.message}`);
        job.reject(err);
      } finally {
        this.running--;
        this._process();
      }
    }
  }

  stats() {
    return {
      name: this.name,
      queued: this.queue.length,
      running: this.running,
      completed: this.completed,
      failed: this.failed,
    };
  }

  drain() {
    return new Promise((resolve) => {
      if (this.running === 0 && this.queue.length === 0) return resolve();
      this.on('complete', () => {
        if (this.running === 0 && this.queue.length === 0) resolve();
      });
    });
  }
}
