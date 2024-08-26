import { cn } from "@/utils/tailwind-helpers";
import React from "react";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export function Paper({ children, className }: Props) {
  return (
    <div
      className={cn(
        "h-full rounded-xl border border-gray-300 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
