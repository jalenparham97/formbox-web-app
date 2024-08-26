import { FILTER_TAKE } from "@/utils/constants";
import { omit } from "radash";
import { z } from "zod";
import {
  filterSchema,
  integrationCreateSchema,
  integrationUpdateSchema,
} from "@/utils/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { nango } from "@/libs/nango/server";
import { createGoogleSheet } from "@/libs/nango/integrations/google-sheets";
import {
  fetchSlackChannels,
  getSlackConnection,
} from "@/libs/nango/integrations/slack";
import { TRPCError } from "@trpc/server";
import { getBases, getTables } from "@/libs/nango/integrations/airtable";
import { getLists, getMailchimpDC } from "@/libs/nango/integrations/mailchimp";
import { getExcelWorkbooks } from "@/libs/nango/integrations/excel";
import { AxiosError } from "axios";

export const integrationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(integrationCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        let googleSheetResult;

        const form = await ctx.db.form.findUnique({
          where: { id: input.formId },
          select: { name: true },
        });

        if (input.type === "google-sheets") {
          googleSheetResult = await createGoogleSheet(
            input.connectionId,
            form?.name,
          );

          return ctx.db.integration.create({
            data: {
              ...input,
              spreadsheetId: googleSheetResult?.data.spreadsheetId,
            },
          });
        }

        if (input.type === "slack") {
          const connection = await getSlackConnection(input.connectionId);

          return ctx.db.integration.create({
            data: {
              ...input,
              slackTeamId: connection.team.id,
              slackTeamName: connection.team.name,
            },
          });
        }

        if (input.type === "mailchimp") {
          const mailchimpDC = await getMailchimpDC(input.connectionId);

          return ctx.db.integration.create({
            data: {
              ...input,
              mailchimpDC,
            },
          });
        }

        return ctx.db.integration.create({ data: input });
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          console.error("******ERROR******", error?.response?.data);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect integration.",
        });
      }
    }),
  getAll: protectedProcedure
    .input(z.object({ formId: z.string(), ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const formQuery = { formId: input.formId };

      const take = input?.take ?? FILTER_TAKE;

      const data = await ctx.db.integration.findMany({
        where: {
          ...formQuery,
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

      const total = await ctx.db.integration.count({
        where: formQuery,
      });

      const result = { total, data, cursor: "" };

      if (data.length < take) return result;

      return { ...result, cursor: data.at(-1)?.id };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.integration.findUnique({
        where: { id: input.id },
      });
    }),
  updateById: protectedProcedure
    .input(integrationUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.integration.update({
        where: { id: input.id },
        data: omit(input, ["id"]),
      });
    }),
  deleteById: protectedProcedure
    .input(
      z.object({ id: z.string(), connectionId: z.string(), type: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.connectionId) {
        await nango.deleteConnection(input.type, input.connectionId);
      }
      return await ctx.db.integration.delete({ where: { id: input.id } });
    }),

  // Airtable
  getAirtableBases: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const bases = await getBases(input.connectionId);
        return bases || [];
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Airtable bases.",
        });
      }
    }),
  getAirtableTables: protectedProcedure
    .input(z.object({ connectionId: z.string(), baseId: z.string() }))
    .query(async ({ input }) => {
      try {
        const tables = await getTables(input.connectionId, input.baseId);
        return tables || [];
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Airtable tables.",
        });
      }
    }),

  // Mailchimp
  getMailchimpLists: protectedProcedure
    .input(z.object({ connectionId: z.string(), mailchimpDC: z.string() }))
    .query(async ({ input }) => {
      try {
        const lists = await getLists(input.connectionId, input.mailchimpDC);
        return lists || [];
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to fetch Mailchimp lists.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Mailchimp lists.",
        });
      }
    }),

  // Slack
  getSlackChannels: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const channels = await fetchSlackChannels(input.connectionId);
        return channels || [];
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to fetch Slack channels.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Slack channels.",
        });
      }
    }),
  // Excel
  getExcelWorkbooks: protectedProcedure
    .input(z.object({ connectionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const workbooks = await getExcelWorkbooks(input.connectionId);
        console.log("workbooks: ", workbooks);
        return workbooks || [];
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          console.error("******ERROR******", error?.response?.data);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to fetch Excel workbooks.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch Excel workbooks.",
        });
      }
    }),
});
