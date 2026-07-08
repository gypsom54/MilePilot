import { MissionControl } from "@/components/dashboard/MissionControl";
import { getMissionControlData } from "@/services/dashboard/dashboard.service";

export default async function HomePage() {
  const data = await getMissionControlData();

  return <MissionControl data={data} />;
}
