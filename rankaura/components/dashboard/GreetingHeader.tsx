import { Button } from "@/components/ui/Button";
import type { HeroSummary } from "@/types/dashboard";

interface GreetingHeaderProps {
  greeting: string;
  hero: HeroSummary;
}

export function GreetingHeader({ greeting, hero }: GreetingHeaderProps) {
  return (
    <header className="mb-10 animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
        {greeting}
      </h1>

      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
        {hero.headline}
      </p>

      <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
        Today your AI team completed{" "}
        <span className="font-medium text-[var(--color-text-primary)]">
          {hero.improvementsCount} improvements
        </span>{" "}
        and saved you approximately{" "}
        <span className="font-medium text-[var(--color-text-primary)]">
          {hero.hoursSaved} hours
        </span>
        .
      </p>

      <div className="mt-8">
        <Button className="min-w-[220px] px-8 py-4 text-base">
          🚀 Continue Growing
        </Button>
      </div>
    </header>
  );
}
