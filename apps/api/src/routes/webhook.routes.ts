import { Router, Request, Response, NextFunction } from 'express';
import { db, users } from '@opensight/db';
import { eq } from 'drizzle-orm';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

const router = Router();

// Verify Stripe webhook signature
function verifyStripeSignature(req: Request): boolean {
  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    return false;
  }

  const timestampPair = signature.split(',').find((pair) => pair.startsWith('t='));
  const timestamp = timestampPair?.slice(2);
  const signatures = signature.split(',').filter((pair) => pair.startsWith('v1='));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const body = JSON.stringify(req.body);
  const computedSignature = crypto
    .createHmac('sha256', env.STRIPE_WEBHOOK_SECRET || '')
    .update(`${timestamp}.${body}`)
    .digest('hex');

  return signatures.some((sig) => sig === `v1=${computedSignature}`);
}

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
router.post('/stripe', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verify signature
    if (!verifyStripeSignature(req)) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const event = req.body as {
      type: string;
      data: {
        object: Record<string, any>;
      };
    };
    const { type, data } = event;

    logger.info({ type }, 'Received Stripe webhook event');

    switch (type) {
      case 'checkout.session.completed': {
        const session = data.object;
        const customerId = session.customer as string | undefined;

        if (!customerId) {
          logger.warn('No customer ID in checkout session');
          break;
        }

        // Find user by Stripe customer ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user[0]) {
          // Extract plan from metadata or session
          const planId = session.metadata?.plan || 'starter';
          const subscriptionId = session.subscription as string | undefined;

          // Update user with subscription
          await db
            .update(users)
            .set({
              planId,
              stripeSubscriptionId: subscriptionId || null,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user[0].id));

          logger.info({ userId: user[0].id, planId }, 'User plan upgraded via Stripe');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = data.object;
        const customerId = subscription.customer as string | undefined;

        if (!customerId) {
          logger.warn('No customer ID in subscription update');
          break;
        }

        // Find user by Stripe customer ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user[0]) {
          // Extract plan from subscription
          const items = subscription.items?.data as Array<{ price: { id: string } }> | undefined;
          let planId = 'free';

          if (items && items.length > 0 && items[0]?.price?.id) {
            const priceId = items[0].price.id;
            // Map price ID to plan ID (customize based on your Stripe setup)
            if (priceId.includes('growth')) {
              planId = 'growth';
            } else if (priceId.includes('starter')) {
              planId = 'starter';
            }
          }

          // Update user plan
          await db
            .update(users)
            .set({
              planId,
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user[0].id));

          logger.info({ userId: user[0].id, planId }, 'Subscription updated');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object;
        const customerId = subscription.customer as string | undefined;

        if (!customerId) {
          logger.warn('No customer ID in subscription deletion');
          break;
        }

        // Find user by Stripe customer ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user[0]) {
          // Downgrade to free plan
          await db
            .update(users)
            .set({
              planId: 'free',
              stripeSubscriptionId: null,
              updatedAt: new Date(),
            })
            .where(eq(users.id, user[0].id));

          logger.info({ userId: user[0].id }, 'Subscription cancelled, downgraded to free');
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = data.object;
        const customerId = invoice.customer as string | undefined;

        if (!customerId) {
          logger.warn('No customer ID in payment failed event');
          break;
        }

        // Find user by Stripe customer ID
        const user = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user[0]) {
          const invoiceId = invoice.id as string | undefined;
          logger.warn(
            { userId: user[0].id, invoiceId },
            'Invoice payment failed'
          );
          // In production, send email notification to user
        }
        break;
      }

      default:
        logger.debug({ type }, 'Unhandled Stripe event type');
    }

    // Return 200 OK to acknowledge receipt
    res.json({ received: true });
  } catch (error) {
    logger.error(error, 'Error processing Stripe webhook');
    // Still return 200 to prevent retries, but log the error
    res.status(200).json({ error: 'Webhook processing failed' });
  }
});

export default router;
