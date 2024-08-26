"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "@/utils/tailwind-helpers";

type RadioGroupProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  label?: string;
  description?: string;
  classNames?: {
    label?: string;
    description?: string;
  };
  styles?: {
    label?: React.CSSProperties;
    description?: React.CSSProperties;
  };
  error?: boolean;
  errorMessage?: string;
};

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      label,
      description,
      classNames,
      styles,
      error,
      errorMessage,
      ...props
    },
    ref,
  ) => {
    return (
      <div>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium leading-6",
              classNames?.label,
            )}
            style={styles?.label}
          >
            {label}
          </label>
        )}
        {description && (
          <p
            className={cn(
              "mb-1 block text-sm text-gray-500",
              classNames?.description,
            )}
            style={styles?.description}
          >
            {description}
          </p>
        )}
        <RadioGroupPrimitive.Root
          className={cn("grid gap-2", label && "mt-[8px]", className)}
          {...props}
          ref={ref}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{errorMessage}</p>}
      </div>
    );
  },
);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-[18px] w-[18px] rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
