"use client";

import { Button } from "@/components/ui/button";
import { useOrgById, useOrgMemberRole } from "@/queries/org.queries";
import { useAuthUser } from "@/queries/user.queries";
import { api } from "@/trpc/react";
import { IconExternalLink } from "@tabler/icons-react";

const disabledRoles = ["viewer", "member"];

interface Props {
  orgId: string;
}

export default function ManageSubscriptionButton({ orgId }: Props) {
  const { data: org } = useOrgById(orgId);
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  const portalMutation = api.payment.getBillingPortalSession.useMutation();

  const handleGetBillingPortal = async () => {
    const returnUrl = `${window.location.origin}/dashboard/${orgId}/settings/subscription`;
    const { url } = await portalMutation.mutateAsync({
      stripeCustomerId: org?.stripeCustomerId || "",
      returnUrl,
    });
    window?.location.assign(url);
  };

  return (
    <div>
      <Button
        onClick={handleGetBillingPortal}
        leftIcon={<IconExternalLink size={16} />}
        loading={portalMutation.isPending}
        disabled={
          !org?.stripePlan || disabledRoles.includes(userRole?.role as string)
        }
      >
        Billing portal
      </Button>
    </div>
  );
}
