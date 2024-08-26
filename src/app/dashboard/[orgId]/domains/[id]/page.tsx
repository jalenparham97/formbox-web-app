import { DomainView } from "@/components/domains/domain-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Domains - ${COMPANY_NAME}`,
};

interface Props {
  params: { id: string; orgId: string };
}

export default function DomainPage({ params: { id, orgId } }: Props) {
  return <DomainView id={id} orgId={orgId} />;
}
