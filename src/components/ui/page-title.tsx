import { type ReactNode } from "react";
import { cn } from "@/utils/tailwind-helpers";

export function PageTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h1 className={cn("text-2xl font-semibold sm:text-3xl", className)}>
      {children}
    </h1>
  );
}
