import { type RouterOutputs } from "@/trpc/react";
import type { UserSchema } from "@/utils/schemas";
import type { z } from "zod";

export type UserWithAccounts = RouterOutputs["user"]["getUser"];

export type UserNameFields = z.infer<typeof UserSchema>;
