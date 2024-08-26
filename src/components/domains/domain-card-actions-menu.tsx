"use client";

import { IconDots, IconEye, IconTrash, IconWorld } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import Link from "next/link";
import { type DomainsOutput } from "@/types/domain.types";
import { DeleteDialog } from "../ui/delete-dialog";
import { useDomainDeleteMutation } from "@/queries/domain.queries";

interface Props {
  domain: DomainsOutput["data"][0];
  disabled?: boolean;
}

export function DomainCardActionsMenu({ domain, disabled = false }: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDelete = useDomainDeleteMutation(domain?.orgId as string);

  const onDelete = async () => {
    await handleDelete.mutateAsync({
      id: domain?.id as string,
      domainId: domain?.domainId as string,
    });
    openDialogHandlers.close();
  };

  return (
    <div>
      {domain && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1.5 text-gray-400 data-[state=open]:bg-accent data-[state=open]:text-gray-900"
              >
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <Link href={`/dashboard/${domain.orgId}/domains/${domain.id}`}>
                <DropdownMenuItem>
                  <IconWorld className="mr-2 h-4 w-4" />
                  <span>View DNS Records</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={openDialogHandlers.open}
                disabled={disabled}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="Domain"
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDelete}
            loading={handleDelete.isPending}
          />
        </div>
      )}
    </div>
  );
}
