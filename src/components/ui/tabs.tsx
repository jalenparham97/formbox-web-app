"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Divider } from "./divider";

import { cn } from "@/utils/tailwind-helpers";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <>
    <TabsPrimitive.List
      ref={ref}
      className={cn("flex w-full space-x-3 pb-0", className)}
      {...props}
    />
    <Divider className={`-mt-[2px] w-full border-t-2 border-[#dee2e6]`} />
  </>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "border-b-2 py-3 data-[state=active]:border-gray-900 [&>*]:data-[state=active]:text-gray-900",
      className,
    )}
    {...props}
  >
    <span className="w-full rounded-lg px-2.5 py-2 text-[15px] font-medium text-gray-500 no-underline hover:bg-gray-100 hover:text-gray-900">
      {children}
    </span>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
