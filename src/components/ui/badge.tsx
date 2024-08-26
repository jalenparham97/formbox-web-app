import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils/tailwind-helpers";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-primary ring-primary text-primary-foreground",
        secondary:
          "bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground ring-inset-",
        destructive:
          "bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground",
        outline: "text-foreground",
        gray: "text-gray-700 ring-gray-500/10 bg-gray-100",
        red: "text-red-700 ring-red-600/10 bg-red-50",
        yellow: "text-yellow-800 ring-yellow-600/20 bg-yellow-50",
        green: "text-green-700 ring-green-600/20 bg-green-50",
        blue: "text-blue-700 ring-blue-700/10 bg-blue-50",
      },
      size: {
        default: "px-2 py-1",
        lg: "px-2 py-1 text-sm",
        xl: "px-2.5 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "gray",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
