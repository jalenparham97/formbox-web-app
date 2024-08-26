import { cn } from "@/utils/tailwind-helpers";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  allowAutoComplete?: boolean;
  classNames?: {
    label?: string;
    description?: string;
  };
  styles?: {
    label?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      classNames,
      styles,
      type = "text",
      icon,
      label,
      description,
      error,
      errorMessage,
      allowAutoComplete = true,
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
        <div className={cn("relative", label && "mt-[5px]")}>
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400">{icon}</span>
            </div>
          )}
          {allowAutoComplete ? (
            <input
              type={type}
              className={cn(
                "block w-full rounded-lg border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:ring-primary disabled:opacity-60 sm:text-sm sm:leading-6",
                error && "ring-red-500 focus:!ring-red-500",
                icon && "pl-9",
                className,
              )}
              ref={ref}
              {...props}
            />
          ) : (
            <input
              type={type}
              className={cn(
                "block w-full rounded-lg border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary focus-visible:ring-primary disabled:opacity-60 sm:text-sm sm:leading-6",
                error && "ring-red-500 focus:!ring-red-500",
                icon && "pl-9",
                className,
              )}
              ref={ref}
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              {...props}
            />
          )}

          {error && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
