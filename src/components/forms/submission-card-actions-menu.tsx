"use client";

import {
  IconBolt,
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
import { type SubmissionOutput } from "@/types/submission.types";
import { useSubmissionDeleteMutation } from "@/queries/submissions.queries";
import { DeleteDialog } from "../ui/delete-dialog";

interface Props {
  submission: SubmissionOutput;
  disabled?: boolean;
}

export function SubmissionCardActionsMenu({
  submission,
  disabled = false,
}: Props) {
  const [openDialog, openDialogHandlers] = useDialog();

  const handleDeleteForm = useSubmissionDeleteMutation(
    submission?.formId as string,
  );

  const onDelete = async () => {
    await handleDeleteForm.mutateAsync({
      id: submission?.id as string,
      fileKey: submission?.files[0]?.key ?? "",
    });
    openDialogHandlers.close();
  };

  return (
    <div>
      {submission && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-1.5 text-gray-400 data-[state=open]:bg-accent data-[state=open]:text-gray-900"
                disabled={disabled}
              >
                <IconDots size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[170px]">
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={(e) => {
                  e.stopPropagation();
                  openDialogHandlers.open();
                }}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="submission"
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
