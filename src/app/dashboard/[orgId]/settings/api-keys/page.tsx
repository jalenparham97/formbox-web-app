import { OrgAPIKeysView } from "@/components/orgs/org-api-keys-view";
import { api } from "@/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { orgId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const org = await api.org.getById({ id: params.orgId });
  return {
    title: `API Keys - ${org?.name}`,
  };
}

export default function APIKeysPage({ params: { orgId } }: Props) {
  return <OrgAPIKeysView orgId={orgId} />;
}
