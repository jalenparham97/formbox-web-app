import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { domainCreateSchema, filterSchema } from "@/utils/schemas";
import { resend } from "@/libs/mail";
import { type DomainStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { FILTER_TAKE } from "@/utils/constants";
import { type DomainRecord } from "@/types/domain.types";

export const domainsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(domainCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const resendDomain = await resend.domains.create({ name: input.name });

        if (resendDomain.error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: resendDomain.error.name,
            message: resendDomain.error.message,
          });
        }

        if (resendDomain.data) {
          const domain = await ctx.db.domain.create({
            data: {
              name: input.name,
              domainId: resendDomain.data?.id,
              orgId: input.orgId,
              records: JSON.stringify(resendDomain.data?.records),
              status: resendDomain.data?.status as DomainStatus,
            },
          });
          return domain;
        }
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new Error("Failed to create domain");
      }
    }),
  getAll: protectedProcedure
    .input(z.object({ orgId: z.string(), ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const orgQuery = { orgId: input.orgId };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.domain.findMany({
        where: {
          ...orgQuery,
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          status: true,
          domainId: true,
          orgId: true,
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
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const domain = await ctx.db.domain.findUnique({
        where: { id: input.id },
      });

      const resendDomain = await resend.domains.get(domain?.domainId as string);

      return {
        ...domain,
        status: resendDomain?.data?.status as DomainStatus,
        records: resendDomain?.data?.records as unknown as DomainRecord[],
      };
    }),
  verify: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const domain = await ctx.db.domain.findUnique({
          where: { id: input.id },
        });

        if (!domain) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Domain not found",
          });
        }

        if (domain.status === "not_started") {
          const verifyResult = await resend.domains.verify(domain.domainId);

          if (verifyResult.error) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              cause: verifyResult.error.name,
              message: verifyResult.error.message,
            });
          }

          const resendDomain = await resend.domains.get(domain.domainId);

          if (resendDomain.error) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              cause: resendDomain.error.name,
              message: resendDomain.error.message,
            });
          }

          if (resendDomain.data) {
            const domain = await ctx.db.domain.update({
              where: { id: input.id },
              data: {
                status: resendDomain.data?.status as DomainStatus,
                records: JSON.stringify(resendDomain.data?.records),
              },
            });

            return {
              ...domain,
              records: JSON.parse(domain?.records as string) as DomainRecord[],
            };
          }
        }

        const resendDomain = await resend.domains.get(domain.domainId);

        if (resendDomain.error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            cause: resendDomain.error.name,
            message: resendDomain.error.message,
          });
        }

        if (resendDomain.data) {
          const domain = await ctx.db.domain.update({
            where: { id: input.id },
            data: {
              status: resendDomain.data?.status as DomainStatus,
              records: JSON.stringify(resendDomain.data?.records),
            },
          });

          return {
            ...domain,
            records: JSON.parse(domain?.records as string) as DomainRecord[],
          };
        }
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        throw new Error("Failed to verify domain");
      }
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string(), domainId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await resend.domains.remove(input.domainId);
      return await ctx.db.domain.delete({ where: { id: input.id } });
    }),
});
