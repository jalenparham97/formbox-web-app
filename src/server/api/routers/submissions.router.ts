import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { filterSchema } from "@/utils/schemas";
import { FILTER_TAKE } from "@/utils/constants";
import { deleteFile } from "@/libs/s3";

export const submissionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        formId: z.string(),
        ...filterSchema,
        isSpam: z.boolean().default(false).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const formQuery = { formId: input.formId };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.submission.findMany({
        where: {
          ...formQuery,
          isSpam: input.isSpam,
          answers: {
            some: {
              value: {
                contains: input.searchString,
                mode: "insensitive",
              },
            },
          },
        },
        include: {
          answers: true,
          files: true,
        },
        ...(input.cursor && {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }),
        take,
        orderBy: { createdAt: "desc" },
      });

      const total = await ctx.db.submission.count({
        where: formQuery,
      });

      const result = { total, data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string(), fileKey: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (input.fileKey) {
        await deleteFile(input.fileKey);
      }
      return await ctx.db.submission.delete({ where: { id: input.id } });
    }),
});
