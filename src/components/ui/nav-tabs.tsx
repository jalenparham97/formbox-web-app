"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/tailwind-helpers";
import { Divider } from "./divider";

interface NavTabsProps {
  children: React.ReactNode;
  className?: string;
}

export function NavTabs({ children, className }: NavTabsProps) {
  return (
    <div className="overflow-x-auto">
      <div className={cn("flex space-x-3 pb-0", className)}>
        <>{children}</>
      </div>
      <Divider className={`-mt-[2px] w-full border-t-2 border-gray-200`} />
    </div>
  );
}

interface NavTabProps {
  href: string;
  label: string;
  [x: string]: unknown;
}

export function NavTab({ href, label, ...otherProps }: NavTabProps) {
  const pathname = usePathname();
  const isRouteMatch = pathname === href;

  return (
    <div>
      <div
        {...otherProps}
        className={cn(`py-3`, isRouteMatch && "border-b-2 border-gray-900")}
      >
        <Link
          href={href}
          className={cn(
            "rounded-lg px-2.5 py-2 text-[15px] font-medium text-gray-500 no-underline hover:bg-gray-100 hover:text-gray-900",
            isRouteMatch && "text-gray-900 hover:text-gray-900",
          )}
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
