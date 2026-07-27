import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { getDashboardData } from "@/services/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardHome data={data} />;
}
