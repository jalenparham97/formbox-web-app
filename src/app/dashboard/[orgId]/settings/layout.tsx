import { SettingsLayout } from "@/components/settings/settings-layout";

interface Props {
  children: React.ReactNode;
  params: { orgId: string };
}

export default function SettingsPageLayout({
  children,
  params: { orgId },
}: Props) {
  return (
    <SettingsLayout orgId={orgId}>
      <div>{children}</div>
    </SettingsLayout>
  );
}
