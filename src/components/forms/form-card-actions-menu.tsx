"use client";

import {
  IconBolt,
  IconCode,
  IconCopy,
  IconDots,
  IconInbox,
  IconPencil,
  IconSettings,
  IconShare,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import Link from "next/link";
import { type FormOutput } from "@/types/form.types";
import {
  useFormDuplicateMutation,
  useFormDeleteMutation,
} from "@/queries/form.queries";
import { FormDeleteDialog } from "./form-delete-dialog";

interface Props {
  form: FormOutput;
  disabled?: boolean;
}

export function FormCardActionsMenu({ form, disabled = false }: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDeleteForm = useFormDeleteMutation(form?.orgId as string);
  const handleDuplicateForm = useFormDuplicateMutation();

  const onDelete = async () => {
    await handleDeleteForm.mutateAsync({ id: form?.id as string });
    openDialogHandlers.close();
  };

  const onDuplicate = async () => {
    return await handleDuplicateForm.mutateAsync({
      id: form.id,
      orgId: form.orgId,
    });
  };

  return (
    <div>
      {form && (
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
              {form.type === "hosted" && (
                <Link
                  href={`/dashboard/${form.orgId}/forms/${form.id}/build?mode=builder`}
                >
                  <DropdownMenuItem>
                    <IconPencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                </Link>
              )}
              <Link href={`/dashboard/${form.orgId}/forms/${form.id}`}>
                <DropdownMenuItem>
                  <IconInbox className="mr-2 h-4 w-4" />
                  <span>Submissions</span>
                </DropdownMenuItem>
              </Link>
              {form.type === "hosted" && (
                <Link href={`/dashboard/${form.orgId}/forms/${form.id}/share`}>
                  <DropdownMenuItem>
                    <IconShare className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                </Link>
              )}
              {form.type === "endpoint" && (
                <Link href={`/dashboard/${form.orgId}/forms/${form.id}/setup`}>
                  <DropdownMenuItem>
                    <IconCode className="mr-2 h-4 w-4" />
                    <span>Setup instructions</span>
                  </DropdownMenuItem>
                </Link>
              )}
              <Link
                href={`/dashboard/${form.orgId}/forms/${form.id}/integrations`}
              >
                <DropdownMenuItem>
                  <IconBolt className="mr-2 h-4 w-4" />
                  <span>Integrations</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/dashboard/${form.orgId}/forms/${form.id}/settings`}>
                <DropdownMenuItem>
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={onDuplicate}
                disabled={handleDuplicateForm.isPending}
              >
                <IconCopy className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
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

          <FormDeleteDialog
            title={form?.name}
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={onDelete}
            loading={handleDeleteForm.isPending}
          />
        </div>
      )}
    </div>
  );
}
