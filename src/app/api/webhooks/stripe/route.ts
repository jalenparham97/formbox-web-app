import type Stripe from "stripe";

import { env } from "@/env";
import { db } from "@/server/db";
import { stripe } from "@/libs/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.error(`❌ Error message: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.update(subscriptionId, {
          metadata: { orgId: session.metadata?.orgId as string },
        });

        await db.org.update({
          where: {
            id: session?.metadata?.orgId,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionStatus: subscription.status,
            stripePlanNickname: subscription.items.data[0]?.plan.nickname,
            stripePlan:
              subscription.items.data[0]?.plan.nickname?.split("-")[0],
            stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        });
        break;
      case "customer.subscription.updated":
        const subscriptionUpdated = event.data.object as Stripe.Subscription;

        // Update the price id and set the new period end.
        await db.org.update({
          where: {
            id: subscriptionUpdated.metadata?.orgId as string,
          },
          data: {
            stripeSubscriptionStatus: subscriptionUpdated.status,
            stripePlanNickname:
              subscriptionUpdated.items.data[0]?.plan.nickname,
            stripePlan:
              subscriptionUpdated.items.data[0]?.plan.nickname?.split("-")[0],
            stripeCancelAtPeriodEnd: subscriptionUpdated.cancel_at_period_end,
            stripeCurrentPeriodEnd: new Date(
              subscriptionUpdated.current_period_end * 1000,
            ),
          },
        });
        break;
      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object as Stripe.Subscription;

        await stripe.customers.del(subscriptionDeleted.customer as string);

        await db.org.update({
          where: {
            id: subscriptionDeleted.metadata?.orgId as string,
          },
          data: {
            stripeSubscriptionStatus: subscriptionDeleted.status,
            stripePlanNickname: null,
            stripePlan: null,
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            stripeCancelAtPeriodEnd: subscriptionDeleted.cancel_at_period_end,
            stripeCurrentPeriodEnd: new Date(
              subscriptionDeleted.current_period_end * 1000,
            ),
          },
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error(error);
    return new Response(
      "Webhook handler failed. View your nextjs function logs.",
      {
        status: 400,
      },
    );
  }

  return new Response(JSON.stringify({ received: true }));
}
