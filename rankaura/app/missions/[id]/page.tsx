import { notFound } from "next/navigation";
import { MissionWorkspace } from "@/components/mission-workspace/MissionWorkspace";
import { getMission } from "@/services/mission/missionService";

interface MissionPageProps {
  params: Promise<{ id: string }>;
}

export default async function MissionPage({ params }: MissionPageProps) {
  const { id } = await params;
  const mission = await getMission(id);

  if (!mission) {
    notFound();
  }

  return <MissionWorkspace initialMission={mission} />;
}
