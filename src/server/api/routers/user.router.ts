import { dayjs } from "@/libs/dayjs";
// import { mailer } from "@/libs/mailer";
import { nanoid } from "@/libs/nanoid";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "@/env";
import { sendVerifyEmail } from "@/libs/mail";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  image: z.string().url().optional(),
  accounts: z.array(
    z.object({
      id: z.string(),
      provider: z.string(),
      providerAccountId: z.string(),
    }),
  ),
});

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        accounts: {
          select: {
            id: true,
            provider: true,
            providerAccountId: true,
          },
        },
      },
    });

    if (user) {
      return user;
    }

    return null;
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string().optional().nullish(),
        firstName: z.string().optional().nullish(),
        lastName: z.string().optional().nullish(),
        image: z.string().url().optional().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: input,
        include: {
          accounts: {
            select: {
              id: true,
              provider: true,
              providerAccountId: true,
            },
          },
        },
      });
    }),
  sendEmailVerificationToken: protectedProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = await ctx.db.verificationToken.create({
        data: {
          identifier: input.email,
          token: nanoid(32),
          expires: dayjs().add(1, "hour").toISOString(),
        },
      });

      const link = `${env.APP_URL}/api/verify-token?token=${token}&email=${input.email}`;
      await sendVerifyEmail(input.email, link);

      return { message: "sent" };
    }),
});
