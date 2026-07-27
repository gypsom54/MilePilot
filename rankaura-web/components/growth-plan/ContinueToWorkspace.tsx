import Link from "next/link";

interface ContinueToWorkspaceProps {
  /** Temporary handoff target until Workspace rebuild */
  href?: string;
}

/**
 * Continue to Workspace.
 * Points to current `/` temporarily — future Workspace handoff.
 */
export function ContinueToWorkspace({ href = "/" }: ContinueToWorkspaceProps) {
  return (
    <section
      aria-labelledby="continue-workspace-heading"
      className="rounded-2xl border border-dashed border-[#d7dde5] bg-white/80 p-6 sm:p-7"
    >
      <h2
        id="continue-workspace-heading"
        className="text-lg font-semibold text-[#080f1a]"
      >
        Continue to your Workspace
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8b95a5]">
        Ongoing progress will live here — calm updates as RankAura keeps working for you.{" "}
        <span className="text-[#6b7280]">
          (Temporary handoff to the current home screen until the Workspace rebuild
          is approved.)
        </span>
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#080f1a] px-6 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b8def]"
      >
        Continue to Workspace
      </Link>
    </section>
  );
}
