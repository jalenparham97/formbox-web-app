import { type RouterInputs, type RouterOutputs } from "@/trpc/react";

export type ApiKeyCreateData = RouterInputs["apiKey"]["create"];
// export type OrgUpdateData = RouterInputs["org"]["updateById"];

export type ApiKeysOutput = RouterOutputs["apiKey"]["getAll"];
// export type OrgOutput = RouterOutputs["org"]["getById"];

export type ApiKeyFindInput = RouterInputs["apiKey"]["getAll"];
