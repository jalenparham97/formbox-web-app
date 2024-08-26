import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Roles } from "@/types/utility.types";
import { OrgUpdateSchema, filterSchema } from "@/utils/schemas";
import { FILTER_TAKE } from "@/utils/constants";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { hashToken } from "@/utils/hash-token";
import { env } from "@/env";
import { sendOrgInviteEmail } from "@/libs/mail";
import { stripe } from "@/libs/stripe";

export const orgRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Organization name is a required field"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      return await ctx.db.org.create({
        data: {
          ...input,
          userId,
          members: {
            create: { userId, role: Roles.OWNER },
          },
        },
      });
    }),
  getAll: protectedProcedure
    .input(z.object({ ...filterSchema }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const take = input?.take || FILTER_TAKE;

      const data = await ctx.db.org.findMany({
        where: {
          name: {
            contains: input?.searchString,
            mode: "insensitive",
          },
          members: {
            some: {
              userId,
            },
          },
        },
        include: {
          _count: {
            select: {
              members: true,
              forms: true,
            },
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

      return { ...result, cursor: data.at(-1)?.id || "" };
    }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const org = await ctx.db.org.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
      });

      if (org) {
        // project exists but user is not part of it
        if (org._count.members === 0) {
          const pendingInvites = await ctx.db.orgInvite.findUnique({
            where: {
              email_orgId: {
                email: ctx.user.email as string,
                orgId: org.id,
              },
            },
            select: {
              expires: true,
            },
          });
          if (!pendingInvites) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Organization not found",
            });
          } else if (pendingInvites.expires < new Date()) {
            throw new TRPCError({
              code: "CLIENT_CLOSED_REQUEST",
              message: "Organization invite expired",
            });
          } else {
            throw new TRPCError({
              code: "CONFLICT",
              message: `${org.name}`,
            });
          }
        }
      } else {
        // Org doesn't exist
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      return { ...org };
      // return { ...org, workspaceOwnerPlan };
    }),
  updateById: protectedProcedure
    .input(OrgUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.org.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  deleteById: protectedProcedure
    .input(
      z.object({ id: z.string(), stripeCustomerId: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.stripeCustomerId) {
        await stripe.customers.del(input.stripeCustomerId);
      }

      return await ctx.db.org.delete({
        where: { id: input.id },
      });
    }),
  getMembers: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.orgMember.findMany({
        where: { orgId: input.id },
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          org: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
        },
      });
    }),
  getMemberRole: protectedProcedure
    .input(z.object({ id: z.string(), orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.orgMember.findUnique({
        where: { userId_orgId: { userId: input.id, orgId: input.orgId } },
        select: {
          role: true,
        },
      });
    }),
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        memberId: z.string(),
        role: z.enum(["admin", "member", "viewer"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.orgMember.update({
        where: { id: input.memberId },
        data: { role: input.role },
      });
    }),
  deleteMember: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.orgMember.delete({
        where: { id: input.memberId },
      });
    }),
  getInvites: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.orgInvite.findMany({
        where: { orgId: input.id },
      });
    }),
  createInvite: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        orgId: z.string(),
        orgName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, orgId, orgName } = input;

      const alreadyInTeam = await ctx.db.orgMember.findFirst({
        where: {
          orgId,
          user: {
            email,
          },
        },
      });

      if (alreadyInTeam) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists in this organization",
        });
      }

      // same method of generating a token as next-auth
      const token = randomBytes(32).toString("hex");
      const ONE_WEEK_IN_SECONDS = 604800;
      const expires = new Date(Date.now() + ONE_WEEK_IN_SECONDS * 1000);

      // create a org invite record and a verification request token that lasts for a week
      // here we use a try catch to account for the case where the user has already been invited
      // for which `prisma.orgInvite.create()` will throw a unique constraint error
      try {
        const invite = await ctx.db.orgInvite.create({
          data: {
            email,
            expires,
            orgId,
          },
        });

        await ctx.db.verificationToken.create({
          data: {
            identifier: email,
            token: hashToken(token),
            expires,
          },
        });

        const params = new URLSearchParams({
          callbackUrl: `${env.APP_URL}/invite?orgId=${invite.orgId}&email=${invite.email}`,
          token,
          email,
        });

        const link = `${env.APP_URL}/api/auth/callback/resend?${params}`;

        const mail = await sendOrgInviteEmail(email, orgName, link);

        if (mail.error) {
          throw new TRPCError({
            code: "PARSE_ERROR",
            message: mail.error.message,
            cause: mail.error.name,
          });
        }

        return { sent: true };
      } catch (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already invited",
          cause: error,
        });
      }
    }),
  getInvite: protectedProcedure
    .input(z.object({ orgId: z.string(), email: z.string() }))
    .query(async ({ ctx, input }) => {
      const invite = await ctx.db.orgInvite.findFirst({
        where: {
          email: input?.email as string,
          orgId: input.orgId,
        },
        select: {
          expires: true,
          orgId: true,
          org: {
            select: {
              name: true,
              user: true,
            },
          },
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invitation",
        });
      }

      if (invite.expires < new Date()) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invitation expired",
        });
      }

      return invite;
    }),
  acceptInvite: protectedProcedure
    .input(z.object({ orgId: z.string(), email: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.orgInvite.findFirst({
        where: {
          email: input?.email as string,
          orgId: input.orgId,
        },
        select: {
          expires: true,
          orgId: true,
        },
      });

      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid invitation",
        });
      } else if (invite.expires < new Date()) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invitation expired",
        });
      } else {
        const response = await Promise.all([
          ctx.db.orgMember.create({
            data: {
              userId: ctx.user.id,
              role: Roles.MEMBER,
              orgId: invite.orgId,
            },
          }),
          ctx.db.orgInvite.delete({
            where: {
              email_orgId: {
                email: ctx.user.email as string,
                orgId: invite.orgId,
              },
            },
          }),
        ]);
        return response;
      }
    }),
  deleteInvite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.orgInvite.delete({
        where: { id: input.id },
      });
    }),
});
