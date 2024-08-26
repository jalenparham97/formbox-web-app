import { OrgSettingsView } from "@/components/orgs/org-settings-view";
import { api } from "@/trpc/server";
import { type Metadata } from "next";

interface Props {
  params: { orgId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const org = await api.org.getById({ id: params.orgId });
  return {
    title: `Settings - ${org?.name}`,
  };
}

export default async function SettingsProfilePage({
  params: { orgId },
}: Props) {
  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold leading-7 text-gray-900">
          Organization settings
        </h2>
        <p className="mt-1 leading-6 text-gray-600">
          Manage your organization details.
        </p>
      </div>

      <div className="mt-6">
        <OrgSettingsView orgId={orgId} />
      </div>
    </div>
  );
}
