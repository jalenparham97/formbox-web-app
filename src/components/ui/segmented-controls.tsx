import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/utils/tailwind-helpers";

const SegmentedControls = TabsPrimitive.Root;

const SegmentedControlsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1",
      className,
    )}
    {...props}
  />
));
SegmentedControlsList.displayName = TabsPrimitive.List.displayName;

const SegmentedControlsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow",
      className,
    )}
    {...props}
  />
));
SegmentedControlsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const SegmentedControlsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
SegmentedControlsContent.displayName = TabsPrimitive.Content.displayName;

export {
  SegmentedControls,
  SegmentedControlsList,
  SegmentedControlsTrigger,
  SegmentedControlsContent,
};
