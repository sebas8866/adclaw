import { BaseAgent } from './base.js';
import { queryLocal } from '../core/intelligence.js';
import { generateImage } from '../integrations/nano-banana.js';
import { config } from '../config/defaults.js';

/**
 * Creative Swarm Agent — generates ad creatives (images + copy)
 * using Nano Banana Pro for image gen and local LLM for copy.
 */
export class CreativeAgent extends BaseAgent {
  constructor(swarm) {
    super(swarm, 'creative');
  }

  /**
   * Generate the initial set of ad creatives based on research insights.
   */
  async generateInitialSet(insights) {
    return this.run('generateInitialSet', async () => {
      const niche = insights?.niche || 'general product';
      const angles = insights?.suggestedAdAngles || ['benefit-driven', 'problem-solution', 'social-proof'];
      const audience = insights?.targetAudience || {};

      // Step 1: Generate ad copy variations via local LLM
      const copyPrompt = `Create ${config.creative.maxVariations} Facebook/Instagram ad copy variations for:
Niche: ${niche}
Target audience: ${JSON.stringify(audience)}
Ad angles to use: ${angles.join(', ')}

For each variation return JSON:
[{
  "headline": "max 40 chars",
  "primaryText": "max 125 chars",
  "description": "max 30 chars",
  "callToAction": "SHOP_NOW|LEARN_MORE|SIGN_UP|GET_OFFER",
  "angle": "which angle this uses",
  "hook": "the attention-grabbing first line"
}]`;

      const copyResult = await queryLocal(copyPrompt);
      let copies = [];

      if (copyResult) {
        try {
          copies = JSON.parse(
            copyResult.response.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
          );
        } catch {
          this.log.warn('Failed to parse copy variations — using defaults');
          copies = angles.map((angle) => ({
            headline: `Discover ${niche}`,
            primaryText: `The best ${niche} solution for ${audience.demographics || 'you'}`,
            description: 'Limited time offer',
            callToAction: 'LEARN_MORE',
            angle,
            hook: `Tired of ${audience.painPoints?.[0] || 'the same old thing'}?`,
          }));
        }
      }

      // Step 2: Generate images via Nano Banana Pro
      const creatives = [];
      for (const copy of copies) {
        const imagePrompt = `Professional ${niche} advertisement, ${copy.angle} style, clean modern design, product showcase, high quality marketing photo`;

        try {
          const image = await generateImage({
            prompt: imagePrompt,
            width: config.creative.defaultWidth,
            height: config.creative.defaultHeight,
          });

          creatives.push({
            id: `creative-${Date.now()}-${creatives.length}`,
            copy,
            image,
            format: 'square',
            status: 'pending_review',
            createdAt: new Date(),
          });
        } catch (err) {
          this.log.warn(`Image generation failed for angle "${copy.angle}": ${err.message}`);
          creatives.push({
            id: `creative-${Date.now()}-${creatives.length}`,
            copy,
            image: null,
            format: 'square',
            status: 'image_failed',
            createdAt: new Date(),
          });
        }
      }

      this.state.creatives = creatives;
      this.log.info(`Generated ${creatives.length} creatives (${creatives.filter(c => c.image).length} with images)`);
      return creatives;
    });
  }

  /**
   * Generate new creative variations for winning ads (scale phase).
   */
  async generateVariations(winningCreativeId) {
    return this.run('generateVariations', async () => {
      const winner = this.state.creatives.find((c) => c.id === winningCreativeId);
      if (!winner) throw new Error(`Creative ${winningCreativeId} not found`);

      const prompt = `This ad creative is performing well:
Headline: ${winner.copy.headline}
Primary text: ${winner.copy.primaryText}
Angle: ${winner.copy.angle}

Create 3 variations that keep the winning angle but test different:
1. A different hook/opening line
2. A different emotional trigger
3. A different CTA approach

Return as JSON array with same structure.`;

      const result = await queryLocal(prompt);
      return result;
    });
  }
}
