"use client";

import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";
import { useAuthUser } from "@/queries/user.queries";
import { useOrgMemberRole } from "@/queries/org.queries";
import { ViewAlert } from "../ui/viewer-alert";

interface Props {
  children: React.ReactNode;
  orgId: string;
}

export function SettingsLayout({ children, orgId }: Props) {
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);

  return (
    <MaxWidthWrapper className="py-10">
      {userRole?.role === "viewer" && (
        <div className="mb-6">
          <ViewAlert message="Your are viewing the organization settings as a viewer" />
        </div>
      )}
      <div>
        <PageTitle>Settings</PageTitle>
      </div>
      <div className="mt-6">
        <NavTabs className="">
          <NavTab href={`/dashboard/${orgId}/settings`} label="General" />
          <NavTab
            href={`/dashboard/${orgId}/settings/subscription`}
            label="Subscription"
          />
          <NavTab
            href={`/dashboard/${orgId}/settings/members`}
            label="Members"
          />
          <NavTab
            href={`/dashboard/${orgId}/settings/api-keys`}
            label="API Keys"
          />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
