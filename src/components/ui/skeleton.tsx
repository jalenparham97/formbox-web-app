import { cn } from "@/utils/tailwind-helpers";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  animatePulse?: boolean;
}

export function Skeleton({ className, animatePulse = true, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-md bg-primary/10",
        animatePulse && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}
