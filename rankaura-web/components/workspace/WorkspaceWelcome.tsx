import type { WorkspaceWelcome } from "@/types/workspace";

interface WorkspaceWelcomeProps {
  welcome: WorkspaceWelcome;
}

export function WorkspaceWelcomeSection({ welcome }: WorkspaceWelcomeProps) {
  return (
    <header className="space-y-3">
      <p className="text-sm font-medium text-ra-muted">{welcome.businessName}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ra-ink sm:text-4xl">
        {welcome.greeting}
      </h1>
      <p className="text-base font-normal text-ra-ink sm:text-lg">
        {welcome.support}
      </p>
      <p className="max-w-2xl text-sm font-normal leading-relaxed text-ra-muted">
        {welcome.monitoringLine}
      </p>
      <p className="max-w-2xl text-base font-normal leading-relaxed text-ra-muted">
        {welcome.activitySummary}
      </p>
    </header>
  );
}
