import { Badge } from "@/components/ui/Badge";
import { ButtonGhost } from "@/components/ui/ButtonGhost";
import { ButtonPrimary } from "@/components/ui/ButtonPrimary";
import { ButtonSecondary } from "@/components/ui/ButtonSecondary";
import { Input } from "@/components/ui/Input";
import { QuestionChip } from "@/components/ui/QuestionChip";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

/**
 * Internal visual reference for design-system screenshots.
 * Not a product navigation destination.
 */
export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-ra-canvas px-4 py-10 text-ra-ink sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header>
          <h1 className="text-2xl font-semibold">RankAura design system</h1>
          <p className="mt-2 text-sm text-ra-muted">
            Shared controls for visual consistency review.
          </p>
        </header>

        <SurfaceCard data-testid="ds-actions">
          <h2 className="text-base font-semibold">Actions</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <ButtonPrimary type="button">Review & Fix</ButtonPrimary>
            <ButtonPrimary type="button" disabled>
              Ask
            </ButtonPrimary>
            <ButtonSecondary type="button">View Progress</ButtonSecondary>
            <ButtonGhost type="button">View full Growth Plan</ButtonGhost>
          </div>
        </SurfaceCard>

        <SurfaceCard data-testid="ds-badges">
          <h2 className="text-base font-semibold">Badge variants</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="approval">Ready for approval</Badge>
            <Badge variant="prepared">Recommendations prepared</Badge>
            <Badge variant="completed">Research completed</Badge>
            <Badge variant="monitoring">Monitoring</Badge>
            <Badge variant="connected">Connected</Badge>
            <Badge variant="waiting">Waiting for approval</Badge>
            <Badge variant="planned">Planned</Badge>
            <Badge variant="info">Complete</Badge>
          </div>
        </SurfaceCard>

        <SurfaceCard data-testid="ds-inputs">
          <h2 className="text-base font-semibold">Inputs</h2>
          <div className="mt-4 space-y-3">
            <Input
              defaultValue=""
              placeholder="Ask about your business…"
              aria-label="Default input"
            />
            <Input
              defaultValue="What is my biggest opportunity today?"
              aria-label="Filled input"
              autoFocus
            />
            <Input
              defaultValue=""
              placeholder="Disabled input"
              disabled
              aria-label="Disabled input"
            />
          </div>
        </SurfaceCard>

        <SurfaceCard data-testid="ds-questions">
          <h2 className="text-base font-semibold">Question controls</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            <li>
              <QuestionChip type="button">
                What is my biggest opportunity today?
              </QuestionChip>
            </li>
            <li>
              <QuestionChip type="button">
                What has RankAura completed since my last visit?
              </QuestionChip>
            </li>
          </ul>
        </SurfaceCard>
      </div>
    </div>
  );
}
