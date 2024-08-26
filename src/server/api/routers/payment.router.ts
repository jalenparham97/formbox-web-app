import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { stripe } from "@/libs/stripe";

export const paymentRouter = createTRPCRouter({
  getBillingPortalSession: protectedProcedure
    .input(
      z.object({
        stripeCustomerId: z.string(),
        returnUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      return await stripe.billingPortal.sessions.create({
        customer: input.stripeCustomerId,
        return_url: `${input.returnUrl}`,
      });
    }),
  getCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string().optional(),
        stripeCustomerId: z.string().optional(),
        returnUrl: z.string().url(),
        orgId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await stripe.checkout.sessions.create({
        customer: input.stripeCustomerId,
        mode: "subscription",
        line_items: [
          {
            price: input.priceId,
            quantity: 1,
          },
        ],
        allow_promotion_codes: true,
        success_url: `${input.returnUrl}`,
        cancel_url: `${input.returnUrl}`,
        metadata: { orgId: input.orgId },
      });
    }),
  getProducts: protectedProcedure.query(async () => {
    const { data: pricesList } = await stripe.prices.list({ active: true });
    const { data: productsList } = await stripe.products.list({ active: true });

    return productsList
      .map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        prices: {
          month: {
            id: pricesList.find(
              (price) =>
                price.nickname === `${product.name.toLocaleLowerCase()}-month`,
            )?.id,
            price:
              pricesList.find(
                (price) =>
                  price.nickname ===
                  `${product.name.toLocaleLowerCase()}-month`,
              )?.unit_amount || 0,
          },
          year: {
            id: pricesList.find(
              (price) =>
                price.nickname === `${product.name.toLocaleLowerCase()}-year`,
            )?.id,
            price:
              pricesList.find(
                (price) =>
                  price.nickname === `${product.name.toLocaleLowerCase()}-year`,
              )?.unit_amount || 0,
          },
        },
        createdAt: product.created,
      }))
      .sort((a, b) => a.createdAt - b.createdAt);
  }),
});
