import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getDashboardData } from "@/services/dashboard";

export default async function HomePage() {
  const data = await getDashboardData();

  return <DashboardShell data={data} />;
}
