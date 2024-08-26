import { cn } from "@/utils/tailwind-helpers";
import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  id?: string;
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
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      description,
      classNames,
      styles,
      id,
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
            htmlFor={id}
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
        <div className={cn(label && "mt-[4px]")}>
          <textarea
            className={cn(
              "block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary disabled:opacity-60 sm:text-sm sm:leading-6",
              error && "ring-red-500 focus:!ring-red-500",
              className,
            )}
            ref={ref}
            {...props}
          />

          {error && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
        </div>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
