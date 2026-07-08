import { notFound } from "next/navigation";
import { MissionWorkspacePage } from "@/components/mission-workspace/MissionWorkspacePage";
import { getMissionById } from "@/services/mission/missionService";

interface MissionPageProps {
  params: Promise<{ id: string }>;
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { id } = await params;
  const mission = await getMissionById(id);

  if (!mission) {
    notFound();
  }

  return <MissionWorkspacePage initialMission={mission} />;
}
