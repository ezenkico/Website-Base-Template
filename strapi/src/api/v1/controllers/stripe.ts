import { generateWebhookEvent, CheckoutSession } from '../../../utils/stripe';

// Stripe webhook functionality
async function stripeWebhook(ctx: any){
    const sig = ctx.request.headers['stripe-signature'];
    if (!sig) return ctx.badRequest('Missing Stripe signature');

    const UNPARSED_BODY = Symbol.for('unparsedBody');

    const rawBody = ctx.request.body[UNPARSED_BODY];

    let event;
    try {
      event = generateWebhookEvent(rawBody, sig);
    } catch (err: any) {
      return ctx.unauthorized(`Webhook Error: ${err.message}`);
    }

    const session = event.data.object as CheckoutSession;

    switch (event.type){
        default:
            return ctx.badRequest('Unhandled event type');
    }
}

export default {
  stripeWebhook
}