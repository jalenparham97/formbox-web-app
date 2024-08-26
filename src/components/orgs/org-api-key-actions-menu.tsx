"use client";

import { IconCopy, IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { type ApiKeysOutput } from "@/types/api-key.types";
import { useApiKeyDeleteMutation } from "@/queries/api-keys.queries";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "../ui/dialog";
import { toast } from "sonner";
import { useClipboard } from "@/hooks/use-clipboard";
import { OrgApiKeyEditDialog } from "./org-api-key-edit-dialog";

interface Props {
  apiKey: ApiKeysOutput[0];
  disabled?: boolean;
}

export function ApiKeyActionsMenu({ apiKey, disabled = false }: Props) {
  const [openDialog, openDialogHandlers] = useDialog();
  const [editDialog, editDialogHandlers] = useDialog();
  const { copy } = useClipboard();

  const handleDeleteForm = useApiKeyDeleteMutation(apiKey.orgId);

  const onDelete = async () => {
    await handleDeleteForm.mutateAsync({ id: apiKey.id });
    openDialogHandlers.close();
  };

  const handleCopyKey = () => {
    copy(apiKey.key);
    toast.success("API key copied to clipboard");
  };

  return (
    <div>
      {apiKey && (
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
              <DropdownMenuItem onClick={handleCopyKey}>
                <IconCopy className="mr-2 h-4 w-4" />
                <span>Copy API key</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={editDialogHandlers.open}
                disabled={disabled}
              >
                <IconPencil className="mr-2 h-4 w-4" />
                <span>Edit API key</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={openDialogHandlers.open}
                disabled={disabled}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete API key</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <OrgApiKeyEditDialog
            apiKey={apiKey}
            open={editDialog}
            onClose={editDialogHandlers.close}
            orgId={apiKey.orgId}
          />

          <ApiKeyDeleteDialog
            title={apiKey.name}
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

interface ApiKeyProps extends DialogProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  title?: string | null | undefined;
  loading?: boolean;
}

export function ApiKeyDeleteDialog({
  onClose,
  open,
  title,
  onDelete,
  loading,
}: ApiKeyProps) {
  function closeModal() {
    onClose();
  }

  async function handleDelete() {
    try {
      await onDelete();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Delete form</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete API key{" "}
          <span className="font-semibold">{title}</span>? You’ll lose all the
          access to the API with this key. This action cannot be undone.
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeModal}
            className="mt-2 w-full sm:mt-0"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
