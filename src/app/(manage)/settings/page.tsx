import { SettingsView } from "@/components/settings/settings-view";
import { COMPANY_NAME } from "@/utils/constants";

export const metadata = {
  title: `Settings - ${COMPANY_NAME}`,
};

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SettingsPage({ searchParams }: Props) {
  return <SettingsView searchParams={searchParams} />;
}
