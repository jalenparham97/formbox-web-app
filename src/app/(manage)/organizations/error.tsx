"use client";

import { ErrorView } from "@/components/error/error-view";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorView reset={reset} className="h-[80vh]" />;
}
