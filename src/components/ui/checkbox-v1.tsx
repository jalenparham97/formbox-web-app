import React, { useEffect, useRef } from "react";

import { cn } from "@/utils/tailwind-helpers";

// export interface CheckboxProps
//   extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
//   indeterminate?: boolean;
// }

function Checkbox({
  indeterminate,
  className,
  ...rest
}: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "accent-color h-[18px] w-[18px] cursor-pointer rounded border-gray-300 text-primary outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400/20",
        // !rest.checked && indeterminate && "!bg-gray-400/80",
        className,
      )}
      {...rest}
    />
  );
}

export { Checkbox };
