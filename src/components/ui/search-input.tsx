import { IconSearch } from "@tabler/icons-react";
import { Input, type InputProps } from "./input";
import { cn } from "@/utils/tailwind-helpers";

export function SearchInput({ className, ...rest }: InputProps) {
  return (
    <Input
      icon={<IconSearch size={16} />}
      className={cn("w-72", className)}
      {...rest}
    />
  );
}
