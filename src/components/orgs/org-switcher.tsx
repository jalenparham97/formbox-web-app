"use client";

import * as React from "react";
import { IconCheck, IconPlus, IconSelector } from "@tabler/icons-react";

import { cn } from "@/utils/tailwind-helpers";
import { Button, DefaultButton } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { type OrgCreateFields, type OrgsOutput } from "@/types/org.types";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOrgAddMutation } from "@/queries/org.queries";
import { Badge } from "../ui/badge";

type Org = OrgsOutput["data"][0];

function getOrg(orgId: string, orgs: Org[]) {
  return orgs.find((org) => org.id === orgId);
}

function getUrl(orgId: string, pathname: string) {
  const constructedRoute = pathname.split("/");
  constructedRoute[1] = orgId;
  // return constructedRoute.join("/");
  return `/dashboard/${orgId}/forms`;
}

const schema = z.object({
  name: z.string().min(1, "Organization name is a required field."),
});

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface OrgSwitcherProps extends PopoverTriggerProps {
  orgs: Org[];
}

export function OrgSwitcher({ className, orgs }: OrgSwitcherProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showNewOrgDialog, setShowNewOrgDialog] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schema),
  });

  const orgId = params.orgId as string;

  const [selectedOrg, setSelectedOrg] = React.useState<Org>();

  React.useEffect(() => {
    setSelectedOrg(getOrg(orgId, orgs) as Org);
  }, [orgId, orgs]);

  const orgCreateMutation = useOrgAddMutation();

  const closeModal = () => {
    reset();
    setShowNewOrgDialog(false);
  };

  const onSubmit = async (data: OrgCreateFields) => {
    await orgCreateMutation.mutateAsync({ name: data.name });
    closeModal();
  };

  return (
    <div>
      {orgs && (
        <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <DefaultButton
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                aria-label="Select an organization"
                className={cn(
                  "w-full justify-between px-2.5 text-base shadow-none",
                  className,
                )}
              >
                <div className="flex w-full items-center space-x-3">
                  <Avatar className="h-[26px] w-[26px]">
                    <AvatarFallback className="text-sm uppercase text-white">
                      {getInitials(selectedOrg?.name, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">
                    {selectedOrg?.name}
                  </span>
                  <Badge className="capitalize">
                    {selectedOrg?.stripePlan || "free"}
                  </Badge>
                </div>
                <IconSelector className="ml-3 h-4 w-4 shrink-0 opacity-50" />
              </DefaultButton>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 sm:w-[250px]">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search organization" />
                  <CommandEmpty>No organization found.</CommandEmpty>
                  <CommandGroup heading={"Organizations"}>
                    {orgs?.map((org) => (
                      <CommandItem
                        key={org.id}
                        onSelect={() => {
                          setSelectedOrg(org);
                          router.push(getUrl(org.id, pathname));
                          setOpen(false);
                        }}
                        className="truncate text-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <span>{org.name}</span>
                        </div>
                        <IconCheck
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedOrg?.name === org.name
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                  <CommandGroup>
                    <DialogTrigger asChild>
                      <CommandItem
                        onSelect={() => {
                          setOpen(false);
                          setShowNewOrgDialog(true);
                        }}
                      >
                        <IconPlus className="mr-2 h-4 w-4" />
                        Create organization
                      </CommandItem>
                    </DialogTrigger>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new organization</DialogTitle>
            </DialogHeader>

            <DialogDescription>
              Add a new organization to manage your team and forms.
            </DialogDescription>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input
                  label="Organization name"
                  {...register("name")}
                  error={errors.name !== undefined}
                  errorMessage={errors?.name?.message}
                  allowAutoComplete={false}
                />
              </div>

              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={closeModal} type="button">
                  Close
                </Button>
                <Button loading={orgCreateMutation.isPending} type="submit">
                  Create organization
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
