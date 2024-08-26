"use client";

import { usePathname, useSelectedLayoutSegments } from "next/navigation";
import { Button, type ButtonProps } from "./button";
import Link from "next/link";
import { cn } from "@/utils/tailwind-helpers";

interface Props extends ButtonProps {
  href: string;
}

export function NavButton({ href, children, ...props }: Props) {
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();
  const isActive =
    pathname === href || (segments.length > 1 && href.includes(segments[1]!));

  // console.log("segments: ", segments);
  // console.log("href: ", href);
  // console.log("pathname: ", pathname);
  // console.log("segments[1]: ", segments[1]);

  return (
    <Link href={href}>
      <Button
        variant={"ghost"}
        className={cn(isActive && "bg-accent")}
        {...props}
      >
        {children}
      </Button>
    </Link>
  );
}
