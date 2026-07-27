import { ButtonPrimary } from "@/components/ui/ButtonPrimary";

interface ContinueToWorkspaceProps {
  href?: string;
}

/**
 * Continue to Workspace.
 */
export function ContinueToWorkspace({ href = "/workspace" }: ContinueToWorkspaceProps) {
  return (
    <section
      aria-labelledby="continue-workspace-heading"
      className="rounded-ra-xl border border-dashed border-ra-border bg-ra-surface/80 p-6 sm:p-7"
    >
      <h2
        id="continue-workspace-heading"
        className="text-lg font-semibold text-ra-ink"
      >
        Continue to your Workspace
      </h2>
      <p className="mt-2 max-w-xl text-sm font-normal leading-relaxed text-ra-muted">
        Ongoing progress lives in your Workspace — a calm view of what RankAura
        is doing for your business.
      </p>
      <div className="mt-5">
        <ButtonPrimary href={href}>Continue to Workspace</ButtonPrimary>
      </div>
    </section>
  );
}
