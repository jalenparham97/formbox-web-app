import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
import type {
  formCreateBodySchema,
  formCreateSchema,
  formUpdateBodySchema,
  formUpdateSchema,
} from "@/utils/schemas";
import type { InfiniteData } from "@tanstack/react-query";
import type { z } from "zod";

export type FormCreateBody = z.infer<typeof formCreateBodySchema>;
export type FormUpdateBody = z.infer<typeof formUpdateBodySchema>;

export type FormCreateFields = z.infer<typeof formCreateSchema>;
export type FormUpdateFields = z.infer<typeof formUpdateSchema>;

export type FormCreateData = RouterInputs["form"]["create"];
export type FormUpdateData = RouterInputs["form"]["updateById"];

export type FormsOutput = RouterOutputs["form"]["getAll"];
export type FormOutput = RouterOutputs["form"]["getById"];

export type FormFindInput = RouterInputs["form"]["getAll"];

export type InfiniteFormsData = InfiniteData<FormsOutput> | undefined;

export type FormBorderStyle = "rounded" | "flat" | "full";

export type FormPageMode = "compact" | "full";

export type FormType = "endpoint" | "hosted";

export type FormElementSubType =
  | "email"
  | "phone"
  | "short_answer"
  | "long_answer"
  | "heading"
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "number"
  | "date"
  | "rating"
  | "file_upload"
  | "page"
  | "name"
  | "address"
  | "website";

export type FormField = {
  id: string;
  label: string;
  description?: string;
  type: string;
  subtype: string;
  required: boolean;
  ratingCount?: number;
  options?: FormOption[];
  showDescription: boolean;
};

export type FormOption = {
  id: string;
  value: string;
};

export type FormFile = {
  name: string;
  type: string;
  url: string;
  size: number;
  formFieldName?: string;
};
