import { cn } from "@/utils/tailwind-helpers";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Affix({ children, className }: Props) {
  return (
    <div
      className={cn(
        "fixed z-10 rounded-lg border border-gray-300 bg-white p-4 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
