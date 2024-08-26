import { DashboardLayout } from "@/components/dashboard/dashboard-layout-v2";

interface Props {
  children: React.ReactNode;
}

export default function DashboardPageLayout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
