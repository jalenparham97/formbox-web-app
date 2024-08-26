"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  orgId: string;
  email: string;
}

export function OrgInviteAcceptButton({ orgId, email }: Props) {
  const router = useRouter();
  const apiUtils = api.useUtils();

  const acceptInviteMutation = api.org.acceptInvite.useMutation();

  const onSubmit = async () => {
    await acceptInviteMutation.mutateAsync({ orgId, email });
    await apiUtils.org.getById.invalidate({ id: orgId });
    await apiUtils.org.getAll.invalidate();
    router.push(`/dashboard/${orgId}/forms`);
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={onSubmit}
        loading={acceptInviteMutation.isPending}
      >
        Accept invitation
      </Button>
    </div>
  );
}
