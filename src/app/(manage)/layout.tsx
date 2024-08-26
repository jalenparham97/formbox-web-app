"use client";

import {
  IconLogout,
  IconMenu2,
  IconSparkles,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { Disclosure } from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { getInitials } from "@/utils/get-initials";
import { useAuthUser } from "@/queries/user.queries";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { NavButton } from "@/components/ui/nav-button";
import { env } from "@/env";
import { Divider } from "@/components/ui/divider";
import { cn } from "@/utils/tailwind-helpers";

interface Props {
  children: React.ReactNode;
}

export default function ManageLayout({ children }: Props) {
  const user = useAuthUser();

  async function logout() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <>
      <div className="h-full">
        <Disclosure
          as="nav"
          className="sticky top-0 z-50 border-b border-gray-200 bg-white"
        >
          {({ open }) => (
            <>
              <div className="mx-auto px-4">
                <div className="flex h-16 justify-between">
                  <div className="flex items-center space-x-3 md:space-x-12">
                    <div className="flex flex-shrink-0 items-center">
                      <Logo icon />
                    </div>
                    <div className="space-x-2">
                      <NavButton href={"/organizations"}>
                        Organizations
                      </NavButton>
                      <NavButton href={"/settings"}>Settings</NavButton>
                    </div>
                  </div>
                  <div className="hidden gap-x-4 sm:flex sm:items-center">
                    <div>
                      <Link
                        href={env.NEXT_PUBLIC_FEEDBACK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost">Feedback</Button>
                      </Link>
                      <Link
                        href={env.NEXT_PUBLIC_DOCS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost">Docs</Button>
                      </Link>
                    </div>

                    {/* Profile dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        <span className="sr-only">Open user menu</span>
                        <Avatar>
                          <AvatarImage src={user?.image || ""} />
                          <AvatarFallback className="uppercase text-white">
                            {getInitials(user?.email, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[250px]"
                      >
                        <DropdownMenuLabel>
                          <p className="text-xs font-normal text-gray-400">
                            Signed in as
                          </p>
                          <p>{user?.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/settings">
                          <DropdownMenuItem>
                            <IconUserCircle className="mr-2 h-4 w-4" />
                            <span>Manage account</span>
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                          <IconLogout className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <IconX className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <IconMenu2
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  <div className="px-4 pb-2">
                    <p className="text-xs font-medium text-gray-400">
                      Signed in as
                    </p>
                    <p className="font-medium">{user?.email}</p>
                  </div>

                  <Divider />

                  <Disclosure.Button
                    as={Link}
                    href={`/settings`}
                    className={cn(
                      "block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                    )}
                  >
                    Manage account
                  </Disclosure.Button>

                  <Divider />

                  <Disclosure.Button
                    onClick={logout}
                    className={cn(
                      "block w-full border-l-4 border-transparent py-2 pl-3 pr-4 text-left text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                    )}
                  >
                    Logout
                  </Disclosure.Button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main className="h-full">{children}</main>
      </div>
    </>
  );
}
