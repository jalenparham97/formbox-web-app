import { OrgMembersView } from "@/components/orgs/org-members-view";
import { api } from "@/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { orgId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const org = await api.org.getById({ id: params.orgId });
  return {
    title: `Members - ${org?.name}`,
  };
}

export default function OrgMembersPage({ params: { orgId } }: Props) {
  return <OrgMembersView orgId={orgId} />;
}
