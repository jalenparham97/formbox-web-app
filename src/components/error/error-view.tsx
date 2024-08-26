"use client";

import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { cn } from "@/utils/tailwind-helpers";
import { IconExclamationCircle } from "@tabler/icons-react";

export function ErrorView({
  reset,
  className,
  message = "Something went wrong!",
}: {
  reset: () => void;
  className?: string;
  message?: string;
}) {
  return (
    <MaxWidthWrapper
      className={cn("flex flex-col items-center justify-center", className)}
    >
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <IconExclamationCircle size={48} stroke={2} className="text-red-500" />
        <h2 className="text-xl font-semibold">{message}</h2>
        <Button onClick={() => reset()} size="lg">
          Try again
        </Button>
      </div>
    </MaxWidthWrapper>
  );
}
