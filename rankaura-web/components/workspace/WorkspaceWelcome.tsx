import type { WorkspaceWelcome } from "@/types/workspace";

interface WorkspaceWelcomeProps {
  welcome: WorkspaceWelcome;
}

export function WorkspaceWelcomeSection({ welcome }: WorkspaceWelcomeProps) {
  return (
    <header className="space-y-3">
      <p className="text-sm font-medium text-[#8b95a5]">{welcome.businessName}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-[#080f1a] sm:text-4xl">
        {welcome.greeting}
      </h1>
      <p className="text-base text-[#080f1a] sm:text-lg">{welcome.support}</p>
      <p className="max-w-2xl text-sm leading-relaxed text-[#8b95a5]">
        {welcome.monitoringLine}
      </p>
      <p className="max-w-2xl text-base leading-relaxed text-[#8b95a5]">
        {welcome.activitySummary}
      </p>
    </header>
  );
}
