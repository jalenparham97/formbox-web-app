import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
import type { OrgCreateSchema, OrgUpdateSchema } from "@/utils/schemas";
import type { InfiniteData } from "@tanstack/react-query";
import type { z } from "zod";

// export type UserWithAccounts = RouterOutputs["user"]["getUser"];

export type OrgCreateFields = z.infer<typeof OrgCreateSchema>;
export type OrgUpdateFields = z.infer<typeof OrgUpdateSchema>;

export type OrgCreateData = RouterInputs["org"]["create"];
export type OrgUpdateData = RouterInputs["org"]["updateById"];

export type OrgsOutput = RouterOutputs["org"]["getAll"];
export type OrgOutput = RouterOutputs["org"]["getById"];

export type OrgFindInput = RouterInputs["org"]["getAll"];

export type OrgMember = RouterOutputs["org"]["getMembers"][0];

export type InfiniteOrgsData = InfiniteData<OrgsOutput> | undefined;
