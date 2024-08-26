import { type RouterInputs, type RouterOutputs } from "@/trpc/react";
import type { InfiniteData } from "@tanstack/react-query";

// export type SubmissionCreateFields = z.infer<typeof formCreateSchema>;
// export type SubmissionUpdateFields = z.infer<typeof formUpdateSchema>;

export type SubmissionsOutput = RouterOutputs["submission"]["getAll"];
export type SubmissionOutput = RouterOutputs["submission"]["getAll"]["data"][0];

export type SubmissionsFindInput = RouterInputs["submission"]["getAll"];

export type InfiniteSubmissionsData =
  | InfiniteData<SubmissionsOutput>
  | undefined;
