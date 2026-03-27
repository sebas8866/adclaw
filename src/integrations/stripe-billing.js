import Stripe from 'stripe';
import { logger } from '../utils/logger.js';

let stripe;

function getStripe() {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

/**
 * Billing plans for AdClaw.
 */
export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: null, // Set after creating in Stripe
    maxSwarms: 1,
    maxDailyBudget: 100,
    features: ['1 business', 'basic reporting', 'email support'],
  },
  growth: {
    name: 'Growth',
    priceId: null,
    maxSwarms: 5,
    maxDailyBudget: 1000,
    features: ['5 businesses', 'advanced reporting', 'priority support', 'custom creatives'],
  },
  agency: {
    name: 'Agency',
    priceId: null,
    maxSwarms: 25,
    maxDailyBudget: 10000,
    features: ['25 businesses', 'white-label', 'API access', 'dedicated support'],
  },
};

export async function createCheckoutSession({ plan, customerId, successUrl, cancelUrl }) {
  const s = getStripe();
  const session = await s.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return session;
}

export async function handleWebhook(rawBody, signature) {
  const s = getStripe();
  const event = s.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed':
      logger.info(`New subscription: ${event.data.object.customer}`);
      // TODO: Activate swarm for customer
      break;
    case 'customer.subscription.deleted':
      logger.info(`Subscription cancelled: ${event.data.object.customer}`);
      // TODO: Stop swarm for customer
      break;
    case 'invoice.payment_failed':
      logger.warn(`Payment failed: ${event.data.object.customer}`);
      break;
  }

  return event;
}
