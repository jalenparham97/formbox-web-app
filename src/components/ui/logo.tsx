import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/tailwind-helpers";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/constants";

interface Props {
  noLink?: boolean;
  href?: string;
  className?: string;
  icon?: boolean;
}

const logoIcon = "/logo.svg";
const logoFull = "/logo-full.svg";

export function Logo({
  noLink = false,
  icon = false,
  href = DEFAULT_LOGIN_REDIRECT,
  className,
}: Props) {
  if (noLink) {
    return (
      <div>
        <Image
          className={cn("", icon ? "w-6" : "w-32", className)}
          src={icon ? logoIcon : logoFull}
          alt=""
          width={80}
          height={70}
        />
      </div>
    );
  }

  return (
    <div>
      <Link href={href}>
        <Image
          className={cn("", icon ? "w-6" : "w-32", className)}
          src={icon ? logoIcon : logoFull}
          alt=""
          width={80}
          height={70}
        />
      </Link>
    </div>
  );
}
