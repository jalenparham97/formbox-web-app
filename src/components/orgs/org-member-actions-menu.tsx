"use client";

import { IconDots, IconTrash, IconUser } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/hooks/use-dialog";
import { type OrgMember } from "@/types/org.types";
import {
  useOrgMemberDeleteMutation,
  useOrgUpdateMemberRoleMutation,
} from "@/queries/org.queries";
import { DeleteDialog } from "../ui/delete-dialog";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/queries/user.queries";
import {
  type DialogProps,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";

interface Props {
  member: OrgMember;
}

export function OrgMemberActionsMenu({ member }: Props) {
  const user = useAuthUser();
  const router = useRouter();
  const [openDialog, openDialogHandlers] = useDialog();
  const [roleDialog, roleDialogHandlers] = useDialog();

  const deleteMutation = useOrgMemberDeleteMutation(member?.org?.id);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ memberId: member.id });
    if (member.user.id === user?.id) {
      router.push("/organizations");
    }
  };

  return (
    <div>
      {member && (
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
              {member.role !== "owner" && (
                <DropdownMenuItem onClick={roleDialogHandlers.open}>
                  <IconUser className="mr-2 h-4 w-4" />
                  <span>Change role</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="!text-red-500 hover:!bg-red-500/5"
                onClick={openDialogHandlers.open}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteDialog
            title="member"
            open={openDialog}
            onClose={openDialogHandlers.close}
            onDelete={handleDelete}
            loading={deleteMutation.isPending}
          />

          <ChangeRoleDialog
            open={roleDialog}
            onClose={roleDialogHandlers.close}
            member={member}
          />
        </div>
      )}
    </div>
  );
}

interface ChangeRoleDialogProps extends DialogProps {
  member: OrgMember;
  onClose: () => void;
}

type MemberRole = "admin" | "member" | "viewer";

const memberRoleSchema = z.object({
  role: z.enum(["admin", "member", "viewer"]),
});

function ChangeRoleDialog({ open, member, onClose }: ChangeRoleDialogProps) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<z.infer<typeof memberRoleSchema>>({
    resolver: zodResolver(memberRoleSchema),
    defaultValues: {
      role: member.role as MemberRole,
    },
  });

  const updateMemberMutation = useOrgUpdateMemberRoleMutation(member.org.id);

  const closeModal = () => {
    onClose();
  };

  const onSubmit = async (data: z.infer<typeof memberRoleSchema>) => {
    await updateMemberMutation.mutateAsync({
      memberId: member.id,
      role: data.role,
    });
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change user role</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
          <div>
            <Label>Role</Label>
            <div className="mt-2">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={member.role}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="mt-4 hidden w-full justify-between md:flex">
            <div className="">
              <Label className="text-base">{"Admin"}</Label>
              <div className="mt-1">
                <ul className="text-gray-600">
                  <li> - Manage org settings</li>
                  <li> - Manage members</li>
                  <li> - Manage billing</li>
                  <li> - View forms</li>
                  <li> - Create forms</li>
                  <li> - Edit forms</li>
                  <li> - Delete forms</li>
                </ul>
              </div>
            </div>
            <div className="">
              <Label className="text-base">{"Member"}</Label>
              <div className="mt-1">
                <ul className="text-gray-600">
                  <li> - View forms</li>
                  <li> - Create forms</li>
                  <li> - Edit forms</li>
                  <li> - Delete forms</li>
                </ul>
              </div>
            </div>
            <div className="">
              <Label className="text-base">{"Viewer"}</Label>
              <div className="mt-1">
                <ul className="text-gray-600">
                  <li> - View forms</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="mt-2 sm:mt-0"
              onClick={closeModal}
              type="button"
            >
              Close
            </Button>
            <Button loading={isSubmitting} type="submit">
              Change role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
