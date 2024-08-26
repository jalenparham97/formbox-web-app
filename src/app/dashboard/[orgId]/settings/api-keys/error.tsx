"use client";

import { ErrorView } from "@/components/error/error-view";
import { type TRPCClientError } from "@trpc/client";

export default function Error({
  reset,
  error,
}: {
  reset: () => void;
  error: TRPCClientError<any>; // Provide the missing type argument
}) {
  return <ErrorView reset={reset} message={error.message} />;
}
