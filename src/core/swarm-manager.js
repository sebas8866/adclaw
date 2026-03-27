import { Swarm } from './swarm.js';
import { config } from '../config/defaults.js';
import { logger } from '../utils/logger.js';

/**
 * Manages all active swarms across the Mac Mini.
 * Enforces resource limits and provides fleet-level APIs.
 */
export class SwarmManager {
  constructor() {
    this.swarms = new Map();
  }

  async launch({ clientId, businessPageUrl, metaAccessToken, googleAccessToken }) {
    if (this.swarms.size >= config.resources.maxConcurrentSwarms) {
      throw new Error(
        `Max concurrent swarms reached (${config.resources.maxConcurrentSwarms}). Stop a swarm first.`
      );
    }

    const swarm = new Swarm({ clientId, businessPageUrl, metaAccessToken, googleAccessToken });
    this.swarms.set(swarm.id, swarm);

    swarm.on('stopped', () => {
      logger.info(`Swarm ${swarm.id} removed from manager`);
    });

    await swarm.start();
    return swarm;
  }

  async stop(swarmId) {
    const swarm = this.swarms.get(swarmId);
    if (!swarm) throw new Error(`Swarm ${swarmId} not found`);
    await swarm.stop();
    this.swarms.delete(swarmId);
  }

  get(swarmId) {
    return this.swarms.get(swarmId);
  }

  getAll() {
    return Array.from(this.swarms.values());
  }

  getStats() {
    return {
      activeSwarms: this.swarms.size,
      maxSwarms: config.resources.maxConcurrentSwarms,
      swarms: this.getAll().map((s) => s.getStatus()),
    };
  }
}
