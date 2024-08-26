import { FILTER_TAKE } from "@/utils/constants";
import { omit } from "radash";
import { z } from "zod";
import {
  formCreateSchema,
  formUpdateSchema,
  filterSchema,
  formDuplicateSchema,
} from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { FormField } from "@/types/form.types";
import type { Prisma } from "@prisma/client";

function getSubmissionDuration(plan: string) {
  switch (plan) {
    case "free":
      return "60";
    case "professional":
      return "365";
    case "business":
      return "forever";
    default:
      return "60";
  }
}

export const formsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(formCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.org.findUnique({ where: { id: input.orgId } });
      const duration = getSubmissionDuration(org?.stripePlan ?? "free");
      return ctx.db.form.create({
        data: {
          ...input,
          emailsToNotify: [ctx.user.email as string],
          submissionStorageDuration: duration,
        },
      });
    }),
  duplicate: protectedProcedure
    .input(formDuplicateSchema)
    .mutation(async ({ ctx, input }) => {
      const form = await ctx.db.form.findUnique({
        where: { id: input.id },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      const duplicatedForm = omit(form, ["id", "createdAt", "updatedAt"]);

      return ctx.db.form.create({
        data: {
          ...duplicatedForm,
          orgId: duplicatedForm.orgId,
          name: `${duplicatedForm.name} (copy)`,
          fields: duplicatedForm.fields as Prisma.InputJsonValue,
        },
      });
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        type: z.string().optional(),
        ...filterSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const orgQuery = { orgId: input.orgId };

      const take = input?.take ?? FILTER_TAKE;

      const type = input.type === "all" ? "" : input.type;

      const data = await ctx.db.form.findMany({
        where: {
          ...orgQuery,
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
          ...(type && { type }),
        },
        select: {
          id: true,
          orgId: true,
          name: true,
          isClosed: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { submissions: true },
          },
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

      const result = { data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string(), orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.form.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (form?.orgId !== input.orgId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (form?.type === "hosted") {
        return {
          ...form,
          fields: form?.fields as FormField[],
        };
      }

      return {
        ...form,
        fields: [] as FormField[],
      };
    }),
  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const form = await ctx.db.form.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      });

      if (!form) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (form?.type !== "hosted") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      return {
        ...form,
        fields: form?.fields as FormField[],
      };
    }),
  getCustomTYPageSettings: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const settings = await ctx.db.form.findUnique({
        where: { id: input.id },
        select: {
          tpHeader: true,
          tpMessage: true,
          tpButtonText: true,
          tpButtonUrl: true,
          tpBackgroundColor: true,
          tpTextColor: true,
          tpButtonColor: true,
          tpButtonBackgroundColor: true,
        },
      });

      if (!settings) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form settings not found",
        });
      }

      return settings;
    }),
  updateById: protectedProcedure
    .input(formUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.form.update({
        where: { id: input.id },
        data: {
          ...omit(input, ["id"]),
          fields: input.fields as unknown as Prisma.JsonObject,
        },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.form.delete({ where: { id: input.id } });
    }),
});
