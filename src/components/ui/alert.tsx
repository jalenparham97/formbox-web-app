import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/utils/tailwind-helpers";

const alertVariants = cva("relative w-full rounded-lg border p-4", {
  variants: {
    variant: {
      default: "bg-background text-foreground border-gray-300",
      destructive:
        "text-destructive border-destructive/50 dark:border-destructive [&>svg]:text-destructive text-destructive",
      info: "bg-blue-50 text-blue-500 border border-blue-100",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
