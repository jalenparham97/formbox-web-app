import { OrgsView } from "@/components/orgs/orgs-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Organizations - ${COMPANY_NAME}`,
};

export default function OrgsPage() {
  return <OrgsView />;
}
