import { cn } from "@/utils/tailwind-helpers";

export function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl px-4", className)}>{children}</div>
  );
}
