import { type z } from "zod";
import { type domainCreateSchema } from "@/utils/schemas";
import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
import { type InfiniteData } from "@tanstack/react-query";
import { type DomainStatus } from "@prisma/client";

export type DomainAddFields = z.infer<typeof domainCreateSchema>;

export type DomainsOutput = RouterOutputs["domain"]["getAll"];
export type DomainOutput = RouterOutputs["domain"]["getById"];

export type DomainFindInput = RouterInputs["domain"]["getAll"];

export type InfiniteDomainsData = InfiniteData<DomainsOutput> | undefined;

export type DomainRecord = {
  type: string;
  name: string;
  record: string;
  value: string;
  ttl: number;
  priority: number;
  status: DomainStatus;
};
