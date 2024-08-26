import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { generateKey } from "@/libs/nanoid";

export const apiKeysRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), orgId: z.string(), scope: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const key = `fbsk_${generateKey(24)}`;
      const partialKey = `${key.slice(0, 4)}*********************${key.slice(-4)}`;
      return await ctx.db.apiKey.create({
        data: {
          name: input.name,
          key,
          partialKey,
          scopes: [input.scope],
          orgId: input.orgId,
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.apiKey.findMany({
        where: { orgId: input.orgId },
        orderBy: { createdAt: "desc" },
      });
    }),
  updateById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        scope: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.apiKey.update({
        where: { id: input.id },
        data: { name: input.name, scopes: [input.scope || ""] },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.apiKey.delete({ where: { id: input.id } });
    }),
});
