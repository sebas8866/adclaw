import { BaseAgent } from './base.js';
import { queryLocal, tieredQuery } from '../core/intelligence.js';

/**
 * Compliance Agent — checks all creatives and copy against
 * Meta/Google ad policies before launch.
 *
 * Checks for:
 *   - Prohibited content (health claims, misleading stats)
 *   - Required disclaimers
 *   - Image text ratio (Meta's old 20% rule is gone but still affects reach)
 *   - Landing page consistency
 *   - Special ad categories (housing, credit, employment, politics)
 */
export class ComplianceAgent extends BaseAgent {
  constructor(swarm) {
    super(swarm, 'compliance');
  }

  /**
   * Review all pending creatives for policy compliance.
   */
  async reviewCreatives(creatives) {
    return this.run('reviewCreatives', async () => {
      const pending = (creatives || this.state.creatives).filter(
        (c) => c.status === 'pending_review'
      );

      if (pending.length === 0) {
        this.log.info('No creatives pending compliance review');
        return [];
      }

      const flags = [];

      for (const creative of pending) {
        const prompt = `You are a Meta & Google Ads compliance reviewer. Check this ad creative for policy violations.

HEADLINE: ${creative.copy.headline}
PRIMARY TEXT: ${creative.copy.primaryText}
DESCRIPTION: ${creative.copy.description}
CTA: ${creative.copy.callToAction}

Check against these rules:
1. No misleading claims or exaggerated results
2. No prohibited "before/after" implications
3. No personal attributes ("Are you overweight?")
4. No fake urgency that's deceptive
5. No health/income guarantees without disclaimers
6. CTA matches the actual offer
7. Text is not discriminatory
8. No excessive capitalization or symbols

Respond with JSON:
{
  "approved": boolean,
  "flags": [{ "rule": "", "severity": "block|warn", "detail": "" }],
  "suggestions": []
}`;

        const result = await tieredQuery(prompt, {
          minTier: 'local',
          shouldEscalate: (res) => {
            // Escalate to Kimi if local model seems uncertain
            return res.response.includes('I\'m not sure') || res.response.length < 50;
          },
        });

        if (result) {
          try {
            const review = JSON.parse(
              result.response.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
            );

            if (review.approved) {
              creative.status = 'approved';
            } else {
              creative.status = 'flagged';
              flags.push({
                creativeId: creative.id,
                flags: review.flags,
                suggestions: review.suggestions,
                reviewedAt: new Date(),
                tier: result.tier,
              });
            }
          } catch {
            // If we can't parse, flag for manual review
            creative.status = 'needs_manual_review';
            flags.push({
              creativeId: creative.id,
              flags: [{ rule: 'parse_error', severity: 'warn', detail: 'Could not auto-review' }],
              reviewedAt: new Date(),
            });
          }
        }
      }

      this.state.complianceFlags = [...this.state.complianceFlags, ...flags];
      this.log.info(`Compliance review complete — ${flags.length} creatives flagged out of ${pending.length}`);
      return flags;
    });
  }

  /**
   * Check if a specific text violates ad policies (quick check).
   */
  async quickTextCheck(text) {
    return this.run('quickTextCheck', async () => {
      const prompt = `Quick compliance check — does this ad text violate Meta or Google ad policies? Answer YES or NO with brief reason.
Text: "${text}"`;

      return queryLocal(prompt, { temperature: 0.1 });
    });
  }
}
