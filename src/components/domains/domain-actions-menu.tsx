"use client";

import { IconDots, IconTrash } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { type DomainOutput } from "@/types/domain.types";
import { DeleteDialog } from "../ui/delete-dialog";
import { useDomainDeleteMutation } from "@/queries/domain.queries";
import { useRouter } from "next/navigation";

interface Props {
  domain: DomainOutput;
  disabled?: boolean;
}

export function DomainActionsMenu({ domain, disabled = false }: Props) {
  const router = useRouter();
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDelete = useDomainDeleteMutation(domain?.orgId as string);

  const onDelete = async () => {
    await handleDelete.mutateAsync({
      id: domain?.id as string,
      domainId: domain?.domainId as string,
    });
    openDialogHandlers.close();
    router.push(`/dashboard/${domain.orgId}/domains`);
  };

  return (
    <div>
      {domain && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 data-[state=open]:bg-accent data-[state=open]:text-gray-900"
              >
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
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
