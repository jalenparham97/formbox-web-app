import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
import type {
  integrationCreateSchema,
  integrationUpdateSchema,
} from "@/utils/schemas";
import type { InfiniteData } from "@tanstack/react-query";
import type { z } from "zod";

export type IntegrationCreateFields = z.infer<typeof integrationCreateSchema>;
export type IntegrationUpdateFields = z.infer<typeof integrationUpdateSchema>;

export type IntegrationCreateData = RouterInputs["integration"]["create"];
export type IntegrationUpdateData = RouterInputs["integration"]["updateById"];

export type IntegrationsOutput = RouterOutputs["integration"]["getAll"];
export type IntegrationOutput = RouterOutputs["integration"]["getById"];

export type IntegrationFindInput = RouterInputs["integration"]["getAll"];

export type InfiniteIntegrationsData =
  | InfiniteData<IntegrationsOutput>
  | undefined;

export type IntegrationType =
  | "google-sheets"
  | "excel"
  | "slack"
  | "airtable"
  | "notion"
  | "mailchimp"
  | "github"
  | "zapier"
  | "webhook";
