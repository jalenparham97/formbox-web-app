import { DomainsView } from "@/components/domains/domains-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Domains - ${COMPANY_NAME}`,
};

interface Props {
  params: { orgId: string };
}

export default function DomainsPage({ params: { orgId } }: Props) {
  return <DomainsView orgId={orgId} />;
}
