"use client";

import { useEffect, useState } from "react";
import {
  useOrgById,
  useOrgDeleteMutation,
  useOrgMemberRole,
  useOrgUpdateMutation,
} from "@/queries/org.queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialog } from "@/hooks/use-dialog";
import { OrgDeleteDialog } from "./org-delete-dialog";
import { useRouter } from "next/navigation";
import { useAuthUser } from "@/queries/user.queries";

interface Props {
  orgId: string;
}

export function OrgSettingsView({ orgId }: Props) {
  const router = useRouter();
  const [deleteModal, deleteModalHandler] = useDialog();
  const [orgName, setOrgName] = useState<string | null | undefined>("");

  const org = useOrgById(orgId);
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  useEffect(() => {
    setOrgName(org?.data?.name);
  }, [org.data]);

  const orgUpdateMutation = useOrgUpdateMutation(orgId);
  const orgDeleteMutation = useOrgDeleteMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orgName) return;
    try {
      const name = orgName || (org?.data?.name as string);
      return await orgUpdateMutation.mutateAsync({ id: orgId, name });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await orgDeleteMutation.mutateAsync({
        id: orgId,
        stripeCustomerId: org?.data?.stripeCustomerId || "",
      });
      router.push(`/organizations`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="space-y-6 lg:space-y-10">
        <Card>
          <form onSubmit={onSubmit}>
            <div className="p-6">
              <div>
                <h2 className="text-lg font-semibold">Organization name</h2>
                <p className="mt-2 text-gray-600">
                  This is the name of your organization on Formbox.
                </p>
              </div>
              <div className="mt-5">
                {org.isLoading && (
                  <Skeleton className="h-[36px] rounded-lg md:w-[420px]" />
                )}
                {!org.isLoading && (
                  <Input
                    className="md:w-[420px]"
                    defaultValue={orgName || ""}
                    onChange={(e) => setOrgName(e.currentTarget.value)}
                    disabled={userRole?.role === "viewer"}
                  />
                )}
              </div>
            </div>
            <Divider />
            <div className="p-6">
              <Button
                type="submit"
                loading={orgUpdateMutation.isPending}
                disabled={
                  orgName === "" ||
                  orgName === org?.data?.name ||
                  userRole?.role === "viewer"
                }
              >
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="p-6">
            <div>
              <h2 className="text-lg font-semibold">Delete organization</h2>
              <p className="mt-4 max-w-[600px] text-gray-600">
                Permanently delete your organization, and all associated members
                and forms plus thier submissions. We will also cancel your
                subscription. This action cannot be undone - please proceed with
                caution.
              </p>
            </div>
          </div>
          <Divider />
          <div className="p-6">
            <Button
              variant="destructive"
              onClick={deleteModalHandler.open}
              disabled={userRole?.role === "viewer"}
            >
              Delete organization
            </Button>
          </div>
        </Card>
      </div>

      <OrgDeleteDialog
        title={org?.data?.name}
        open={deleteModal}
        onClose={deleteModalHandler.close}
        onDelete={handleDelete}
        loading={orgDeleteMutation.isPending}
      />
    </div>
  );
}
