import { DashboardView } from "@/components/dashboard/dashboard-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Forms - ${COMPANY_NAME}`,
};

interface Props {
  params: { orgId: string };
}

export default async function FormsPage({ params: { orgId } }: Props) {
  return <DashboardView orgId={orgId} />;
}
